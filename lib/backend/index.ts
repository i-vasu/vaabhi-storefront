// Removed next/headers cookies from top-level to make it client-safe
import {
    Cart,
    CartItem,
    Collection,
    Menu,
    Page,
    Product
} from 'lib/shopify/types';
export * from 'lib/shopify/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
const API_VERSION_HEADER = 'application/vnd.vaabhi.v1+json';

export function getImageUrl(image: string | undefined): string {
    if (!image || image === 'default.png') {
        return 'https://placehold.co/600x400';
    }
    if (image.startsWith('http')) {
        return image;
    }
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';
    return `${baseUrl}/public/products/image/${image}`;
}

async function setBackendCookie(name: string, value: string) {
    if (typeof window !== 'undefined') {
        document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${60 * 60 * 24 * 30}`; // 30 days
        return;
    }
    try {
        const { cookies } = await import('next/headers');
        (await cookies()).set(name, value, { path: '/', maxAge: 60 * 60 * 24 * 30 });
    } catch (e) { }
}

async function getBackendCookie(name: string): Promise<string | undefined> {
    if (typeof window !== 'undefined') {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        const value = match?.[2];
        return value ? decodeURIComponent(value) : undefined;
    }
    try {
        const { cookies } = await import('next/headers');
        return (await cookies()).get(name)?.value;
    } catch (e) {
        return undefined;
    }
}

async function getBackendEmail(): Promise<string> {
    const userCookie = await getBackendCookie('vaabhi_user');
    if (userCookie) {
        try {
            const user = JSON.parse(decodeURIComponent(userCookie));
            return user.email;
        } catch (e) { }
    }
    return 'customer@example.com';
}

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
    reviews?: any[];
    sizeGuide?: Record<string, string>;
}

interface CartDTO {
    cartId: number;
    totalPrice: number;
    products: ProductDTO[]; // Backend uses ProductDTO as CartItem
}

export interface BlogDTO {
    blogId: number;
    title: string;
    content: string;
    author: string;
    createdAt: string;
    status: string;
}

export interface AddressDTO {
    addressId: number;
    street: string;
    building: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
}

// --- Fetch Wrapper ---

async function backendFetch<T>(path: string, options?: RequestInit, retries = 3): Promise<T> {
    const token = await getBackendCookie('vaabhi_token');

    for (let i = 0; i < retries; i++) {
        try {
            const res = await fetch(`${API_URL}${path}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': API_VERSION_HEADER,
                    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
                    ...options?.headers
                }
            });

            if (res.status === 429) {
                // Rate limited, wait and retry
                const retryAfter = parseInt(res.headers.get('X-Rate-Limit-Retry-After-Seconds') || '5');
                await new Promise(r => setTimeout(r, retryAfter * 1000));
                continue;
            }

            if (!res.ok) {
                throw new Error(`API Error: ${res.status} ${res.statusText}`);
            }

            return await res.json();
        } catch (err) {
            if (i === retries - 1) throw err;
            const backoff = Math.pow(2, i) * 1000;
            await new Promise(r => setTimeout(r, backoff));
        }
    }
    throw new Error('Retries failed');
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
            maxVariantPrice: { amount: price, currencyCode: 'INR' },
            minVariantPrice: { amount: price, currencyCode: 'INR' }
        },
        variants: [
            {
                id: dto.productId.toString(),
                title: 'Default',
                availableForSale: dto.quantity > 0,
                selectedOptions: [],
                price: { amount: price, currencyCode: 'INR' }
            }
        ],
        featuredImage: {
            url: getImageUrl(dto.image),
            altText: dto.productName,
            width: 600,
            height: 400
        },
        images: [
            {
                url: getImageUrl(dto.image),
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
        updatedAt: new Date().toISOString(),
        reviews: dto.reviews || [],
        rating: dto.reviews?.length
            ? dto.reviews.reduce((acc: number, r: any) => acc + r.rating, 0) / dto.reviews.length
            : 0,
        totalQuantity: dto.quantity,
        sizeGuide: dto.sizeGuide || {}
    } as Product & { reviews: any[], totalQuantity: number, rating: number, sizeGuide: Record<string, string> };
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
                totalAmount: { amount: total, currencyCode: 'INR' }
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
            subtotalAmount: { amount: dto.totalPrice.toString(), currencyCode: 'INR' },
            totalAmount: { amount: dto.totalPrice.toString(), currencyCode: 'INR' },
            totalTaxAmount: { amount: (dto.totalPrice * 0.12).toFixed(2), currencyCode: 'INR' }
        },
        lines: lines,
        totalQuantity: lines.reduce((acc, item) => acc + item.quantity, 0)
    };
}

// --- API Functions ---

export async function getProducts({
    query,
    reverse,
    sortKey,
    minPrice,
    maxPrice
}: {
    query?: string;
    reverse?: boolean;
    sortKey?: string;
    minPrice?: number;
    maxPrice?: number;
}): Promise<Product[]> {
    try {
        let endpoint = '/public/products';
        if (query || minPrice !== undefined || maxPrice !== undefined) {
            const params = new URLSearchParams();
            if (query) params.append('keyword', query);
            if (minPrice !== undefined) params.append('minPrice', minPrice.toString());
            if (maxPrice !== undefined) params.append('maxPrice', maxPrice.toString());

            // Backend search by keyword is usually /public/products/keyword/{keyword}
            // or a more generic faceted search if available.
            // Based on ProductController, we have /public/products/keyword/{keyword}
            endpoint = query
                ? `/public/products/keyword/${encodeURIComponent(query)}?${params.toString()}`
                : `/public/products?${params.toString()}`;
        }

        const dtos = await backendFetch<any>(endpoint).then(res => res.data?.content || res.content || res.data || res);
        return Array.isArray(dtos) ? dtos.map(mapProductToShopify) : [];
    } catch (error) {
        console.error('getProducts error:', error);
        return [];
    }
}

export async function getProductRecommendations(productId: string): Promise<Product[]> {
    try {
        // Fallback to trending for now as backend doesn't have a specific recommendations endpoint yet
        return getTrendingProducts(6);
    } catch (error) {
        return [];
    }
}

export async function getProduct(handle: string): Promise<Product | undefined> {
    try {
        // Backend: GET /api/v1/public/products/{productId}
        const res = await backendFetch<any>(`/public/products/${handle}`);
        const dto = res.data || res;
        return mapProductToShopify(dto);
    } catch (error) {
        return undefined;
    }
}

export async function createCart(): Promise<Cart> {
    // Backend: POST /api/v1/public/carts
    const res = await backendFetch<any>("/public/carts", { method: "POST" });
    const cart = mapCartToShopify(res.data || res);
    if (cart.id) {
        await setBackendCookie('cartId', cart.id);
    }
    return cart;
}

export async function getCart(): Promise<Cart | undefined> {
    const cartId = await getBackendCookie('cartId');
    if (!cartId) return undefined;

    const email = await getBackendEmail();

    try {
        // Backend: GET /api/v1/public/users/{email}/carts/{cartId}
        const res = await backendFetch<any>(`/public/users/${email}/carts/${cartId}`);
        return mapCartToShopify(res.data || res);
    } catch (error) {
        return undefined;
    }
}

export async function addToCart(lines: { merchandiseId: string; quantity: number }[]): Promise<Cart> {
    let cartId = await getBackendCookie('cartId');

    if (!cartId) {
        const newCart = await createCart();
        cartId = newCart.id!;
        // Set cookie on response? No, this is server action context usually.
        // Next.js actions handle cookies.
    }

    // Our backend API expected: POST /cart/{id}/items (ProductDTO)
    // Mapping first item only for now as Modulith might not support batch add yet (checking needed)
    // Assuming loop for simplicity if batch not supported.

    // Backend: POST /api/v1/public/carts/{cartId}/products/{productId}/quantity/{quantity}
    for (const line of lines) {
        await backendFetch(`/public/carts/${cartId}/products/${line.merchandiseId}/quantity/${line.quantity}`, {
            method: 'POST'
        });
    }

    return getCart() as Promise<Cart>;
}

export async function removeFromCart(lineIds: string[]): Promise<Cart> {
    const cartId = await getBackendCookie('cartId');
    if (!cartId) throw new Error('No Cart ID');

    // Backend: DELETE /api/v1/public/carts/{cartId}/product/{productId}
    for (const lineId of lineIds) {
        await backendFetch(`/public/carts/${cartId}/product/${lineId}`, { method: 'DELETE' });
    }

    return getCart() as Promise<Cart>;
}

export async function updateCart(lines: { id: string; merchandiseId: string; quantity: number }[]): Promise<Cart> {
    const cartId = await getBackendCookie('cartId');
    if (!cartId) throw new Error('No Cart ID');

    // Backend: PUT /api/v1/public/carts/{cartId}/products/{productId}/quantity/{quantity}
    for (const line of lines) {
        await backendFetch(`/public/carts/${cartId}/products/${line.merchandiseId}/quantity/${line.quantity}`, {
            method: 'PUT'
        });
    }

    return getCart() as Promise<Cart>;
}


export async function applyCoupon(code: string): Promise<Cart> {
    const cartId = await getBackendCookie('cartId');
    if (!cartId) throw new Error('No Cart ID');

    // Backend: POST /api/v1/public/carts/{id}/coupon/{code}
    await backendFetch(`/public/carts/${cartId}/coupon/${code}`, {
        method: 'POST'
    });

    return getCart() as Promise<Cart>;
}

export async function removeCoupon(code: string): Promise<Cart> {
    const cartId = await getBackendCookie('cartId');
    if (!cartId) throw new Error('No Cart ID');

    // Backend: DELETE /api/v1/public/carts/{id}/coupon
    await backendFetch(`/public/carts/${cartId}/coupon`, {
        method: 'DELETE'
    });

    return getCart() as Promise<Cart>;
}

export async function createPaymentOrder(orderId: number): Promise<{ success: boolean; data: string }> {
    // Backend: POST /api/v1/v1/create/{orderId}
    return backendFetch<{ success: boolean; data: string }>(`/v1/create/${orderId}`, {
        method: 'POST'
    });
}

export async function verifyPayment(orderId: number, paymentId: string, signature: string): Promise<any> {
    // Backend: POST /api/v1/verify
    return backendFetch(`/v1/verify?orderId=${orderId}&paymentId=${paymentId}&signature=${signature}`, {
        method: 'POST'
    });
}

export async function placeOrder(email: string, cartId: number, paymentMethod: string): Promise<any> {
    // Backend: POST /api/v1/public/users/{emailId}/carts/{cartId}/payments/{paymentMethod}/order
    return backendFetch(`/public/users/${email}/carts/${cartId}/payments/${paymentMethod}/order`, {
        method: 'POST'
    });
}

export async function getOrderHistory(email: string): Promise<any[]> {
    // Backend: GET /api/v1/public/users/{emailId}/orders
    try {
        const res = await backendFetch<any>(`/public/users/${email}/orders`);
        return res.data || res || [];
    } catch (e) {
        return [];
    }
}

export async function getOrderById(email: string, orderId: number): Promise<any> {
    // Backend: GET /api/v1/public/users/{emailId}/orders/{orderId}
    try {
        const res = await backendFetch<any>(`/public/users/${email}/orders/${orderId}`);
        return res.data || res;
    } catch (e) {
        return null;
    }
}

export async function getUserProfile(): Promise<any> {
    try {
        // Backend: GET /api/v1/public/users/me
        const res = await backendFetch<any>("/public/users/me");
        return res.data || res;
    } catch (e) {
        return null;
    }
}

export async function getWishlist(): Promise<Product[]> {
    try {
        // Backend: GET /api/v1/wishlist
        const res = await backendFetch<any>("/v1/wishlist");
        const dtos = res.data || [];
        return dtos.map(mapProductToShopify);
    } catch (error) {
        console.error("getWishlist error:", error);
        return [];
    }
}

export async function addToWishlist(productId: string): Promise<void> {
    // Backend: POST /api/v1/wishlist/{productId}
    await backendFetch(`/v1/wishlist/${productId}`, {
        method: "POST"
    });
}

export async function removeFromWishlist(productId: string): Promise<void> {
    // Backend: DELETE /api/v1/wishlist/{productId}
    await backendFetch(`/v1/wishlist/${productId}`, {
        method: "DELETE"
    });
}

export async function clearWishlist(): Promise<void> {
    // Backend: DELETE /api/v1/wishlist
    await backendFetch("/v1/wishlist", {
        method: "DELETE"
    });
}

export async function updateUserProfile(userId: number, data: any): Promise<any> {
    // Backend: PUT /api/v1/public/users/{userId}
    const res = await backendFetch<any>(`/public/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
    return res.data || res;
}



export async function login(credentials: any): Promise<any> {
    // Backend: POST /api/v1/login
    return backendFetch('/v1/login', {
        method: 'POST',
        body: JSON.stringify(credentials)
    });
}

export async function register(user: any): Promise<any> {
    // Backend: POST /api/v1/register
    return backendFetch('/v1/register', {
        method: 'POST',
        body: JSON.stringify(user)
    });
}

export async function visualSearchByImage(imageFile: File): Promise<Product[]> {
    const formData = new FormData();
    formData.append('image', imageFile);

    // Backend: POST /api/v1/search/visual
    // Note: We use fetch directly here instead of backendFetch because of FormData
    const res = await fetch(`${API_URL}/v1/search/visual`, {
        method: 'POST',
        body: formData
        // Content-Type is set automatically by the browser for FormData
    });

    if (!res.ok) {
        throw new Error(`Visual Search Error: ${res.status} ${res.statusText}`);
    }

    const dtos = await res.json() as ProductDTO[];
    return dtos.map(mapProductToShopify);
}

export async function getCollections(): Promise<Collection[]> {
    try {
        const res = await backendFetch<any>('/public/categories');
        const categories = res.data?.content || [];

        return categories.map((c: any) => ({
            handle: c.categoryId.toString(),
            title: c.categoryName,
            description: '',
            seo: { title: c.categoryName, description: '' },
            updatedAt: new Date().toISOString(),
            path: `/search/${c.categoryId}`
        }));
    } catch (error) {
        console.error('getCollections error:', error);
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
    if (handle === 'next-js-frontend-footer-menu') {
        return [
            { title: 'Privacy Policy', path: '/privacy-policy' },
            { title: 'Terms of Service', path: '/terms-of-service' }
        ];
    }
    return [
        { title: 'All', path: '/search' },
        { title: 'Blog', path: '/blog' }
    ];
}

export async function getPages(): Promise<Page[]> {
    return [];
}

export async function getPage(handle: string): Promise<Page | undefined> {
    try {
        const res = await backendFetch<any>('/public/config');
        const data = res.data || res;
        const pageContent = data.staticPages?.[handle];

        if (!pageContent) return undefined;

        return {
            id: handle,
            title: handle.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
            handle: handle,
            body: pageContent,
            bodySummary: handle,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
    } catch (e) {
        return undefined;
    }
}

export async function loginUser(credentials: any): Promise<any> {
    return login(credentials);
}

export async function registerUser(userData: any): Promise<any> {
    return register(userData);
}

export async function forgotPassword(email: string): Promise<any> {
    // Backend: POST /api/v1/forgot-password?email={email}
    return backendFetch(`/v1/forgot-password?email=${encodeURIComponent(email)}`, {
        method: 'POST'
    });
}

export async function resetPassword(token: string, newPassword: string): Promise<any> {
    // Backend: POST /api/v1/reset-password?token={token}&newPassword={newPassword}
    return backendFetch(`/v1/reset-password?token=${encodeURIComponent(token)}&newPassword=${encodeURIComponent(newPassword)}`, {
        method: 'POST'
    });
}

export async function verifyEmail(email: string, code: string): Promise<any> {
    // Backend: POST /api/v1/verify-email?email={email}&code={code}
    return backendFetch(`/v1/verify-email?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`, {
        method: 'POST'
    });
}
// Redundant functions removed

export async function getCollectionProducts({ collection, sortKey, reverse }: { collection: string, sortKey?: string, reverse?: boolean }): Promise<Product[]> {
    if (collection === 'all') {
        return getProducts({ sortKey, reverse });
    }
    try {
        const res = await backendFetch<any>(`/public/categories/${collection}/products`);
        const products = res.data?.content || res.content || [];
        return products.map(mapProductToShopify);
    } catch (e) {
        console.error('getCollectionProducts error:', e);
        return [];
    }
}

export async function addReview(productId: number, review: { rating: number; comment: string; userName: string }): Promise<any> {
    // Backend: POST /api/v1/public/products/{productId}/reviews
    return backendFetch(`/public/products/${productId}/reviews`, {
        method: 'POST',
        body: JSON.stringify(review)
    });
}

export async function getBlogs(): Promise<BlogDTO[]> {
    try {
        // Backend: GET /api/v1/v1/blogs/public
        return await backendFetch<BlogDTO[]>('/v1/blogs/public');
    } catch (error) {
        console.error('getBlogs error:', error);
        return [];
    }
}

export async function getBlog(id: string): Promise<BlogDTO | undefined> {
    try {
        // Backend: GET /api/v1/v1/blogs/public/{blogId}
        return await backendFetch<BlogDTO>(`/v1/blogs/public/${id}`);
    } catch (error) {
        console.error('getBlog error:', error);
        return undefined;
    }
}

export async function getWalletDetails(): Promise<{ balance: number; transactions: any[] }> {
    try {
        // Backend: GET /api/v1/user/account/wallet
        return await backendFetch<{ balance: number; transactions: any[] }>('/v1/user/account/wallet');
    } catch (error) {
        return { balance: 0, transactions: [] };
    }
}

export async function getUserReturns(): Promise<any[]> {
    try {
        const res = await backendFetch<any>('/v1/user/orders/returns');
        return Array.isArray(res) ? res : (res.data || []);
    } catch (error) {
        return [];
    }
}

export async function getRewardPoints(): Promise<{ rewardPoints: number; customerGroup: string }> {
    try {
        // Backend: GET /api/v1/user/account/reward-points
        return await backendFetch<{ rewardPoints: number; customerGroup: string }>('/v1/user/account/reward-points');
    } catch (error) {
        return { rewardPoints: 0, customerGroup: 'Standard' };
    }
}

export async function getAddresses(): Promise<AddressDTO[]> {
    try {
        // Backend: GET /api/v1/addresses
        const res = await backendFetch<any>('/v1/addresses');
        return res.content || res || [];
    } catch (error) {
        return [];
    }
}

export async function createAddress(address: Partial<AddressDTO>): Promise<AddressDTO> {
    return backendFetch<AddressDTO>('/v1/address', {
        method: 'POST',
        body: JSON.stringify(address)
    });
}

export async function deleteAddress(addressId: number): Promise<string> {
    return backendFetch<string>(`/v1/addresses/${addressId}`, {
        method: 'DELETE'
    });
}

export async function getTrendingProducts(limit = 10): Promise<Product[]> {
    try {
        const res = await backendFetch<any>(`/personalization/trending?limit=${limit}`);
        const dtos = res.data || [];
        return dtos.map(mapProductToShopify);
    } catch (error) {
        return [];
    }
}

export async function getBestSellers(limit = 10): Promise<Product[]> {
    try {
        const res = await backendFetch<any>(`/personalization/best-sellers?limit=${limit}`);
        const dtos = res.data || [];
        return dtos.map(mapProductToShopify);
    } catch (error) {
        return [];
    }
}

export async function getRecentlyViewed(userId: number, limit = 10): Promise<Product[]> {
    try {
        const res = await backendFetch<any>(`/personalization/recently-viewed?userId=${userId}&limit=${limit}`);
        const dtos = res.data || [];
        return dtos.map(mapProductToShopify);
    } catch (error) {
        return [];
    }
}

export async function trackProductView(userId: number, productId: number): Promise<void> {
    try {
        await backendFetch(`/personalization/track-view/${productId}?userId=${userId}`, {
            method: 'POST'
        });
    } catch (error) {
        // Silent fail
    }
}

export async function submitReturnRequest(orderId: number, payload: { items: Record<number, number>, reason: string, refundType: string }) {
    return backendFetch(`/v1/user/orders/${orderId}/return`, {
        method: 'POST',
        body: JSON.stringify(payload)
    });
}

export async function getFriends(userId: number): Promise<any[]> {
    try {
        const res = await backendFetch<any>(`/public/users/${userId}/friends`);
        return res.data || [];
    } catch (error) {
        return [];
    }
}

export async function addFriend(userId: number, friendEmail: string): Promise<any> {
    return backendFetch(`/public/users/${userId}/friends?friendEmail=${friendEmail}`, {
        method: 'POST'
    });
}

export async function transferRewards(userId: number, recipientEmail: string, points: number): Promise<any> {
    return backendFetch(`/public/users/${userId}/rewards/transfer?recipient=${recipientEmail}&points=${points}`, {
        method: 'POST'
    });
}

export async function getActiveCoupons(): Promise<any[]> {
    try {
        return await backendFetch<any[]>('/v1/coupons/active');
    } catch (error) {
        return [];
    }
}

export async function getUserTickets(email: string): Promise<any[]> {
    try {
        const res = await backendFetch<any>(`/v1/tickets/${email}`);
        return res.content || [];
    } catch (error) {
        return [];
    }
}

export async function createTicket(ticket: { subject: string, description: string, userEmail: string }): Promise<any> {
    return backendFetch('/v1/tickets', {
        method: 'POST',
        body: JSON.stringify({ userEmail: ticket.userEmail, subject: ticket.subject, message: ticket.description })
    });
}

export async function replyToTicket(ticketId: number, message: { senderType: string, senderId: string, message: string }): Promise<any> {
    return backendFetch(`/v1/tickets/${ticketId}/reply`, {
        method: 'POST',
        body: JSON.stringify(message)
    });
}


export async function getTenantConfig() {
    try {
        const res = await backendFetch<any>('/public/config');
        const data = res.data || res;

        return {
            name: data.name || 'Vaabhi Storefront',
            logoUrl: data.logoUrl || '/logo.png',
            accentColor: data.accentColor || '#2563eb',
            supportEmail: data.supportEmail || 'support@vaabhi.com',
            socialLinks: data.socialLinks || { instagram: '', facebook: '' },
            footerMenu: data.footerMenu
        };
    } catch (e) {
        console.error('getTenantConfig error:', e);
        return {
            name: 'Vaabhi Storefront',
            logoUrl: '/logo.png',
            accentColor: '#2563eb',
            supportEmail: 'support@vaabhi.com',
            socialLinks: {
                instagram: 'https://instagram.com/vaabhi',
                facebook: 'https://facebook.com/vaabhi'
            }
        };
    }
}

export async function getStaticPage(handle: string): Promise<{ title: string; content: string } | undefined> {
    try {
        const res = await backendFetch<any>('/public/config');
        const data = res.data || res;
        const pageContent = data.staticPages?.[handle];

        if (!pageContent) return undefined;

        return {
            title: handle.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
            content: pageContent
        };
    } catch (e) {
        return undefined;
    }
}

export async function generateDesign(prompt: string): Promise<string> {
    return backendFetch<string>('/search/custom-design/public/generate', {
        method: 'POST',
        body: JSON.stringify(prompt)
    });
}

export function getGenerateDesignStreamUrl(prompt: string): string {
    // Return the full URL for EventSource to use
    return `${API_URL}/search/custom-design/public/generate/stream?prompt=${encodeURIComponent(prompt)}`;
}

export async function revalidate(req: any): Promise<any> {
    return new Response(JSON.stringify({ revalidated: true, now: Date.now() }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}

export async function getTicket(ticketId: number): Promise<any> {
    try {
        const res = await backendFetch<any>(`/v1/tickets/detail/${ticketId}`);
        return res.data || res;
    } catch (error) {
        return null;
    }
}
