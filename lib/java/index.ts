import { Product } from '../shopify/types';

const BACKEND_URL = process.env.NEXT_PUBLIC_JAVA_BACKEND_URL || 'http://localhost:8080/api';

const reshapeProduct = (product: any): Product => {
  return {
    id: product.productId.toString(),
    handle: product.productName.toLowerCase().replace(/ /g, '-'),
    availableForSale: product.quantity > 0,
    title: product.productName,
    description: product.description,
    descriptionHtml: product.description,
    options: [],
    priceRange: {
      maxVariantPrice: {
        amount: product.specialPrice.toString(),
        currencyCode: 'INR'
      },
      minVariantPrice: {
        amount: product.specialPrice.toString(),
        currencyCode: 'INR'
      }
    },
    variants: [
      {
        id: product.productId.toString(),
        title: product.productName,
        availableForSale: product.quantity > 0,
        selectedOptions: [],
        price: {
          amount: product.specialPrice.toString(),
          currencyCode: 'INR'
        }
      }
    ],
    featuredImage: {
      url: product.image.startsWith('http') ? product.image : `${BACKEND_URL}/public/products/image/${product.image}`,
      altText: product.productName,
      width: 600,
      height: 600
    },
    images: [
      {
        url: product.image.startsWith('http') ? product.image : `${BACKEND_URL}/public/products/image/${product.image}`,
        altText: product.productName,
        width: 600,
        height: 600
      }
    ],
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
    const res = await fetch(url);
    const data = await res.json();
    if (!data.content) return [];
    return data.content.map(reshapeProduct);
  } catch (e) {
    console.error('Error fetching products from Java:', e);
    return [];
  }
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  const products = await getProducts({});
  return products.find((p) => p.handle === handle);
}

export async function getProductRecommendations(productId: string): Promise<Product[]> {
  const products = await getProducts({});
  return products.filter((p) => p.id !== productId).slice(0, 4);
}

export async function getCollectionProducts({ collection }: { collection: string }): Promise<Product[]> {
  return getProducts({});
}

export async function getCollections() {
  return [
    {
      handle: '',
      title: 'All',
      description: 'All products',
      seo: {
        title: 'All',
        description: 'All products'
      },
      path: '/search',
      updatedAt: new Date().toISOString()
    }
  ];
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
