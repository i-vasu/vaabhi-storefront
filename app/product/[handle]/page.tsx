import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

import { GridTileImage } from 'components/grid/tile';
import Footer from 'components/layout/footer';
import Price from 'components/price';
import AuraInitializer from 'components/product/aura-initializer';
import { Gallery } from 'components/product/gallery';
import { ProductProvider } from 'components/product/product-context';
import { ProductDescription } from 'components/product/product-description';
import { ProductStorytelling } from 'components/product/product-storytelling';
import ProductReviews from 'components/product/reviews';
import { getProduct, getProductRecommendations, getRecentlyViewed, Image, trackProductView } from 'lib/backend';
import { HIDDEN_PRODUCT_TAG } from 'lib/constants';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { Suspense } from 'react';

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo?.title || product.title,
    description: product.seo?.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable
      }
    },
    openGraph: url
      ? {
        images: [
          {
            url,
            width,
            height,
            alt
          }
        ]
      }
      : null
  };
}

export default async function ProductPage(props: { params: Promise<{ handle: string }> }) {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  // Track view (using dynamic userId)
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('vaabhi_user')?.value;
  const user = userCookie ? JSON.parse(userCookie) : null;
  const userId = user?.userId || user?.id || 1;

  trackProductView(userId, Number(product.id)).catch(() => { });

  const productJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: product.featuredImage.url,
    offers: {
      '@type': 'AggregateOffer',
      availability: product.availableForSale
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      highPrice: product.priceRange.maxVariantPrice.amount,
      lowPrice: product.priceRange.minVariantPrice.amount
    }
  };

  return (
    <ProductProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd)
        }}
      />
      <div className="mx-auto max-w-[1920px] px-4 md:px-12">
        <nav className="mb-8 py-4 text-xs font-bold uppercase tracking-widest text-neutral-400">
          <Link href="/" className="hover:text-black transition-colors">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/search" className="hover:text-black transition-colors">Collection</Link>
          <span className="mx-2">/</span>
          <span className="text-neutral-900 request dark:text-white">{product.title}</span>
        </nav>
        <div className="flex flex-col lg:flex-row lg:gap-16">
          <div className="h-full w-full basis-full lg:basis-7/12">
            <Suspense
              fallback={
                <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
              }
            >
              <Gallery
                images={product.images.slice(0, 5).map((image: Image) => ({
                  src: image.url,
                  altText: image.altText
                }))}
              />
            </Suspense>
          </div>

          <div className="basis-full lg:basis-5/12 lg:sticky lg:top-24 lg:self-start">
            <Suspense fallback={null}>
              <ProductDescription product={product} />
            </Suspense>
          </div>
        </div>

        <ProductStorytelling
          productTitle={product.title}
          productImage={product.featuredImage?.url}
          materialStory={product.materialStory}
        />

        <RelatedProducts id={product.id} />

        <div className="my-12">
          <Suspense fallback={null}>
            <RecentlyViewedProducts />
          </Suspense>
        </div>

        <ProductReviews productId={product.id} initialReviews={(product as any).reviews} />
      </div>
      <AuraInitializer imageUrl={product.featuredImage?.url} />
      <Footer />
    </ProductProvider>
  );
}

async function RelatedProducts({ id }: { id: string }) {
  const relatedProducts = await getProductRecommendations(id);

  if (!relatedProducts.length) return null;

  return (
    <div className="py-12 border-t border-neutral-200 dark:border-neutral-800">
      <h2 className="mb-8 text-2xl font-serif font-bold uppercase tracking-widest text-center">Complete The Look</h2>
      <ul className="flex w-full gap-8 overflow-x-auto pb-4 pt-1 no-scrollbar">
        {relatedProducts.map((product) => (
          <li
            key={product.handle}
            className="aspect-[3/4] w-64 flex-none"
          >
            <Link
              className="group block h-full w-full"
              href={`/product/${product.handle}`}
              prefetch={true}
            >
              <div className="relative h-full w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                  <GridTileImage
                    alt={product.title}
                    src={product.featuredImage?.url}
                    fill
                    sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
                    isInteractive={false}
                    active={false}
                  />
              </div>
              <div className="mt-4 text-center">
                  <h3 className="text-sm font-medium text-neutral-900 dark:text-white line-clamp-1">
                    {product.title}
                  </h3>
                  <div className="mt-1 flex justify-center">
                       <Price
                          className="font-serif text-sm text-neutral-500 dark:text-neutral-400"
                          amount={product.priceRange.maxVariantPrice.amount}
                          currencyCode={product.priceRange.maxVariantPrice.currencyCode}
                       />
                  </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

async function RecentlyViewedProducts() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get('vaabhi_user')?.value;
  const user = userCookie ? JSON.parse(userCookie) : null;
  const userId = user?.userId || user?.id || 1;

  const products = await getRecentlyViewed(userId, 6);

  if (!products.length) return null;

  return (
    <div className="py-12 border-t border-neutral-200 dark:border-neutral-800">
      <h2 className="mb-8 text-2xl font-serif font-bold uppercase tracking-widest text-center">Recently Viewed</h2>
      <ul className="flex w-full gap-8 overflow-x-auto pb-4 pt-1 no-scrollbar">
        {products.map((product) => (
          <li
            key={product.id}
            className="aspect-[3/4] w-64 flex-none"
          >
             <Link
              className="group block h-full w-full"
              href={`/product/${product.handle}`}
              prefetch={true}
            >
              <div className="relative h-full w-full overflow-hidden bg-neutral-100 dark:bg-neutral-900">
                  <GridTileImage
                    alt={product.title}
                    src={product.featuredImage?.url}
                    fill
                    sizes="(min-width: 1024px) 20vw, (min-width: 768px) 25vw, (min-width: 640px) 33vw, (min-width: 475px) 50vw, 100vw"
                    isInteractive={false}
                    active={false}
                  />
              </div>
              <div className="mt-4 text-center">
                  <h3 className="text-sm font-medium text-neutral-900 dark:text-white line-clamp-1">
                    {product.title}
                  </h3>
                  <div className="mt-1 flex justify-center">
                       <Price
                          className="font-serif text-sm text-neutral-500 dark:text-neutral-400"
                          amount={product.priceRange.maxVariantPrice.amount}
                          currencyCode={product.priceRange.maxVariantPrice.currencyCode}
                       />
                  </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
