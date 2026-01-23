import { Image, Product } from '../shopify/types';

const BACKEND_URL = process.env.NEXT_PUBLIC_JAVA_BACKEND_URL || 'http://localhost:8080/api/v1';

// Types matching Java ProductDTO
interface ProductDTO {
  productId: number;
  productName: string;
  itemCode: string;
  image: string;
  description: string;
  quantity: number;
  price: number;
  specialPrice: number;
  variants: any[];
  media: any[];
}

const reshapeProduct = (product: ProductDTO): Product => {
  // Map images
  const images: Image[] = [];

  // Main image
  if (product.image) {
    images.push({
      url: product.image.startsWith('http') ? product.image : `${BACKEND_URL}/public/products/image/${product.image}`,
      altText: product.productName,
      width: 600,
      height: 600
    });
  }

  // Additional media
  if (product.media) {
    product.media.forEach((m: any) => {
      if (m.type === 'IMAGE') {
        images.push({
          url: m.url,
          altText: product.productName,
          width: 600,
          height: 600
        });
      }
    });
  }

  // Ensure we have at least one image
  if (images.length === 0) {
    images.push({
      url: '/placeholder.png', // Add a placeholder if you have one, or keep empty
      altText: 'No Image',
      width: 600,
      height: 600
    });
  }

  // Extract Options (Color, Size) from variants
  const options: any[] = []; // ProductOption[]
  const uniqueColors = new Set<string>();
  const uniqueSizes = new Set<string>();

  if (product.variants) {
    product.variants.forEach((v: any) => {
      if (v.color) uniqueColors.add(v.color);
      if (v.size) uniqueSizes.add(v.size);
    });
  }

  if (uniqueColors.size > 0) {
    options.push({
      id: "opt-color",
      name: "Color",
      values: Array.from(uniqueColors)
    });
  }
  if (uniqueSizes.size > 0) {
    options.push({
      id: "opt-size",
      name: "Size",
      values: Array.from(uniqueSizes)
    });
  }

  const price = product.specialPrice > 0 ? product.specialPrice.toString() : product.price.toString();

  return {
    id: product.productId.toString(),
    handle: product.itemCode || product.productName.toLowerCase().replace(/ /g, '-'),
    availableForSale: product.quantity > 0,
    title: product.productName,
    description: product.description,
    descriptionHtml: product.description,
    options: options,
    priceRange: {
      maxVariantPrice: {
        amount: price,
        currencyCode: 'INR'
      },
      minVariantPrice: {
        amount: price,
        currencyCode: 'INR'
      }
    },
    variants: product.variants && product.variants.length > 0 ? product.variants.map((v: any) => {
      const variantOptions = [];
      if (v.color) variantOptions.push({ name: 'Color', value: v.color });
      if (v.size) variantOptions.push({ name: 'Size', value: v.size });

      return {
        id: v.variantId?.toString() || product.productId.toString(), // Use variantId if available
        title: v.name || `${product.productName} - ${v.color || ''} ${v.size || ''}`,
        availableForSale: (v.stockQuantity ?? 10) > 0, // Use stockQuantity from DTO
        selectedOptions: variantOptions,
        price: {
          amount: v.price?.toString() || price,
          currencyCode: 'INR'
        }
      };
    }) : [
      {
        id: product.productId.toString(),
        title: product.productName,
        availableForSale: product.quantity > 0,
        selectedOptions: [],
        price: {
          amount: price,
          currencyCode: 'INR'
        }
      }
    ],
    featuredImage: images[0]!,
    images: images,
    seo: {
      title: product.productName,
      description: product.description
    },
    tags: [],
    updatedAt: new Date().toISOString()
  };
};

export async function getProducts({ query }: { query?: string }): Promise<Product[]> {
  const url = query
    ? `${BACKEND_URL}/public/products/keyword/${query}`
    : `${BACKEND_URL}/public/products`;

  try {
    const res = await fetch(url, { cache: 'no-store' }); // Ensure fresh data
    const data = await res.json();

    // Handle Pageable Response (data.content) or List
    const content = data.content || data;

    if (Array.isArray(content)) {
      return content.map(reshapeProduct);
    }
    return [];

  } catch (e) {
    console.error('Error fetching products from Java:', e);
    return [];
  }
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  // Ideally, implemented GET /public/products/handle/{handle}
  // For now, filtering client-side as per previous valid logic
  const products = await getProducts({});
  return products.find((p) => p.handle === handle || p.id === handle);
}

export async function getProductRecommendations(productId: string): Promise<Product[]> {
  const products = await getProducts({});
  return products.filter((p) => p.id !== productId).slice(0, 4);
}

export async function getCollectionProducts({ collection }: { collection: string }): Promise<Product[]> {
  // If collection is 'all' or empty, fetch all.
  // Ideally, filter by Category ID if collection != 'all'.
  // For now, we return all products or search by keyword if collection is a keyword.
  return getProducts({});
}

export async function getCollections() {
  const url = `${BACKEND_URL}/public/categories`;
  try {
    const res = await fetch(url, { cache: 'force-cache' });
    const data = await res.json();
    if (data && data.content) {
      return data.content.map((c: any) => ({
        handle: c.categoryName.toLowerCase(), // In real app, use ID or proper handle
        title: c.categoryName,
        description: c.description || 'Category',
        seo: {
          title: c.categoryName,
          description: c.description || 'Category'
        },
        path: `/search/${c.categoryName.toLowerCase()}`,
        updatedAt: new Date().toISOString()
      }));
    }
    return [];
  } catch (e) {
    console.error("Error fetching categories", e);
    return [];
  }
}

export async function getMenu(handle: string) {
  return [];
}

export async function getPage(handle: string) {
  return null;
}

export async function getPages() {
  return [];
}
