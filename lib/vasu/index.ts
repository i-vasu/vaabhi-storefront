
import {
    Cart,
    CartItem,
    Collection,
    Menu,
    Page,
    Product
} from 'lib/shopify/types';
import { cookies } from 'next/headers';
export * from 'lib/shopify/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/backend';

// --- DTO Definitions (Mirroring Backend) ---

interface ProductDTO {
    productId: number;
    productName: string;
    itemCode: string;
    image: string;
    description: string;
    quantity: number;
    price: number;
    discount: number;
    specialPrice: number;
}

interface CartDTO {
    cartId: number;
    totalPrice: number;
    products: ProductDTO[]; // Backend uses ProductDTO as CartItem
}

// --- Fetch Wrapper ---

async function vasuFetch<T>(path: string, options?: RequestInit): Promise<T> {
    const res = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers
        }
    });

    if (!res.ok) {
        throw new Error(`API Error: ${res.status} ${res.statusText}`);
    }

    // Handle empty responses
    const text = await res.text();
    return text ? JSON.parse(text) : {} as T;
}

// --- Mappers ---

function mapProductToShopify(dto: ProductDTO): Product {
    const price = (dto.specialPrice > 0 ? dto.specialPrice : dto.price).toString();

    return {
        id: dto.productId.toString(),
        handle: dto.productId.toString(), // Using ID as handle
        availableForSale: dto.quantity > 0,
        title: dto.productName,
        description: dto.description || '',
        descriptionHtml: dto.description || '',
        options: [],
        priceRange: {
            maxVariantPrice: { amount: price, currencyCode: 'USD' },
            minVariantPrice: { amount: price, currencyCode: 'USD' }
        },
        variants: [
            {
                id: dto.productId.toString(),
                title: 'Default',
                availableForSale: dto.quantity > 0,
                selectedOptions: [],
                price: { amount: price, currencyCode: 'USD' }
            }
        ],
        featuredImage: {
            url: dto.image || 'https://placehold.co/600x400',
            altText: dto.productName,
            width: 600,
            height: 400
        },
        images: [
            {
                url: dto.image || 'https://placehold.co/600x400',
                altText: dto.productName,
                width: 600,
                height: 400
            }
        ],
        seo: {
            title: dto.productName,
            description: dto.description || ''
        },
        tags: [],
        updatedAt: new Date().toISOString()
    };
}

function mapCartToShopify(dto: CartDTO): Cart {
    if (!dto) return undefined as any;

    const lines: CartItem[] = (dto.products || []).map(item => {
        const price = (item.specialPrice > 0 ? item.specialPrice : item.price).toString();
        const total = (Number(price) * (item.quantity || 1)).toString();

        return {
            id: item.productId.toString(), // Line ID
            quantity: item.quantity || 1,
            cost: {
                totalAmount: { amount: total, currencyCode: 'USD' }
            },
            merchandise: {
                id: item.productId.toString(),
                title: item.productName,
                selectedOptions: [],
                product: {
                    id: item.productId.toString(),
                    handle: item.productId.toString(),
                    title: item.productName,
                    featuredImage: {
                        url: item.image || 'https://placehold.co/100',
                        altText: item.productName,
                        width: 100,
                        height: 100
                    }
                }
            }
        };
    });

    return {
        id: dto.cartId.toString(),
        checkoutUrl: '/checkout',
        cost: {
            subtotalAmount: { amount: dto.totalPrice.toString(), currencyCode: 'USD' },
            totalAmount: { amount: dto.totalPrice.toString(), currencyCode: 'USD' },
            totalTaxAmount: { amount: '0.0', currencyCode: 'USD' }
        },
        lines: lines,
        totalQuantity: lines.reduce((acc, item) => acc + item.quantity, 0)
    };
}

// --- API Functions ---

export async function getProducts({ query, reverse, sortKey }: { query?: string; reverse?: boolean; sortKey?: string }): Promise<Product[]> {
    try {
        let endpoint = '/products';
        if (query) {
            // Using our new ParadeDB search
            endpoint = `/products/search?keyword=${encodeURIComponent(query)}`;
        }

        const dtos = await vasuFetch<ProductDTO[]>(endpoint);
        return dtos.map(mapProductToShopify);
    } catch (error) {
        console.error('getProducts error:', error);
        return [];
    }
}

export async function getProduct(handle: string): Promise<Product | undefined> {
    try {
        // Assuming handle is ID
        const dto = await vasuFetch<ProductDTO>(`/products/${handle}`);
        return mapProductToShopify(dto);
    } catch (error) {
        return undefined;
    }
}

export async function createCart(): Promise<Cart> {
    // Our backend doesn't explicitly "create" empty carts via API usually, 
    // but let's assume POST /cart creates one. 
    // If not, we might need to handle this lazily.
    // For now, let's assume we create a cart when adding items.
    // Returning an empty structure with a temp ID or null.
    // Wait, backend likely needs a user or session. 
    // Let's try to just return an empty object and let addToCart handle creation if needed.
    // Actually, standard flow: 
    const res = await vasuFetch<CartDTO>('/cart', { method: 'POST' });
    return mapCartToShopify(res);
}

export async function getCart(): Promise<Cart | undefined> {
    const cartId = (await cookies()).get('cartId')?.value;
    if (!cartId) return undefined;

    try {
        const dto = await vasuFetch<CartDTO>(`/cart/${cartId}`);
        return mapCartToShopify(dto);
    } catch (error) {
        return undefined;
    }
}

export async function addToCart(lines: { merchandiseId: string; quantity: number }[]): Promise<Cart> {
    let cartId = (await cookies()).get('cartId')?.value;

    if (!cartId) {
        const newCart = await createCart();
        cartId = newCart.id!;
        // Set cookie on response? No, this is server action context usually.
        // Next.js actions handle cookies.
    }

    // Our backend API expected: POST /cart/{id}/items (ProductDTO)
    // Mapping first item only for now as Modulith might not support batch add yet (checking needed)
    // Assuming loop for simplicity if batch not supported.

    for (const line of lines) {
        await vasuFetch<CartDTO>(`/cart/${cartId}/items`, {
            method: 'POST',
            body: JSON.stringify({
                productId: Number(line.merchandiseId),
                quantity: line.quantity
            })
        });
    }

    return getCart() as Promise<Cart>;
}

export async function removeFromCart(lineIds: string[]): Promise<Cart> {
    const cartId = (await cookies()).get('cartId')?.value;
    if (!cartId) throw new Error('No Cart ID');

    // Backend: DELETE /cart/{id}/items/{productId}
    for (const lineId of lineIds) {
        await vasuFetch(`/cart/${cartId}/items/${lineId}`, { method: 'DELETE' });
    }

    return getCart() as Promise<Cart>;
}

export async function updateCart(lines: { id: string; merchandiseId: string; quantity: number }[]): Promise<Cart> {
    const cartId = (await cookies()).get('cartId')?.value;
    if (!cartId) throw new Error('No Cart ID');

    // Backend likely needs UPDATE setup. 
    // Assuming adding with negative quantity or explicit update endpoint?
    // Let's assume re-adding updates it? Or maybe DELETE + ADD.
    // Ideally backend has PUT /cart/{id}/items/{productId}

    // Fallback: DELETE then ADD
    for (const line of lines) {
        await vasuFetch(`/cart/${cartId}/items/${line.merchandiseId}`, { method: 'DELETE' });
        await vasuFetch(`/cart/${cartId}/items`, {
            method: 'POST',
            body: JSON.stringify({
                productId: Number(line.merchandiseId), // merchandiseId is productId
                quantity: line.quantity
            })
        });
    }

    return getCart() as Promise<Cart>;
}


export async function applyCoupon(code: string): Promise<Cart> {
    const cartId = (await cookies()).get('cartId')?.value;
    if (!cartId) throw new Error('No Cart ID');

    // Backend: POST /cart/{id}/coupon
    await vasuFetch(`/cart/${cartId}/coupon`, {
        method: 'POST',
        body: JSON.stringify({ code })
    });

    return getCart() as Promise<Cart>;
}

export async function removeCoupon(code: string): Promise<Cart> {
    const cartId = (await cookies()).get('cartId')?.value;
    if (!cartId) throw new Error('No Cart ID');

    // Backend: DELETE /cart/{id}/coupon
    await vasuFetch(`/cart/${cartId}/coupon`, {
        method: 'DELETE'
    });

    return getCart() as Promise<Cart>;
}



export async function submitCheckout(checkoutData: any): Promise<void> {
    const cartId = (await cookies()).get('cartId')?.value;
    if (!cartId) throw new Error('No Cart ID');

    // Backend: POST /checkout
    // This endpoint would coordinate:
    // 1. Save Address
    // 2. Set Shipping
    // 3. Confirm Order
    await vasuFetch(`/checkout`, {
        method: 'POST',
        body: JSON.stringify({
            cartId,
            ...checkoutData
        })
    });
}



export async function login(credentials: any): Promise<any> {
    // Backend: POST /api/v1/login
    return vasuFetch('/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    });
}

export async function register(user: any): Promise<any> {
    // Backend: POST /api/v1/register
    return vasuFetch('/register', {
        method: 'POST',
        body: JSON.stringify(user)
    });
}

export async function getCollections(): Promise<Collection[]> {
    // Mocking Collections for now as we haven't verified CategoryController extensively
    return [
        {
            handle: 'all',
            title: 'All Products',
            description: 'Everything',
            seo: { title: 'All', description: 'All' },
            updatedAt: new Date().toISOString(),
            path: '/search'
        }
    ];
}

export async function getCollection(handle: string): Promise<Collection | undefined> {
    return {
        handle: handle,
        title: 'Collection',
        description: '',
        seo: { title: 'Collection', description: '' },
        updatedAt: new Date().toISOString(),
        path: `/search/${handle}`
    };
}

export async function getMenu(handle: string): Promise<Menu[]> {
    return [
        { title: 'All', path: '/search' }
    ];
}

export async function getPages(): Promise<Page[]> {
    return [];
}

export async function getPage(handle: string): Promise<Page> {
    return {
        id: '1',
        title: 'Stub Page',
        handle: handle,
        body: 'Content',
        bodySummary: 'Content',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
}

export async function getCollectionProducts({ collection, sortKey, reverse }: { collection: string, sortKey?: string, reverse?: boolean }): Promise<Product[]> {
    return getProducts({ sortKey, reverse, query: collection === 'all' ? undefined : collection });
}

export async function revalidate(req: any): Promise<any> {
    return new Response(JSON.stringify({ revalidated: true, now: Date.now() }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}
