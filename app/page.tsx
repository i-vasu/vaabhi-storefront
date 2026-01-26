import { Carousel } from 'components/carousel';
import { ThreeItemGrid } from 'components/grid/three-items';
import Footer from 'components/layout/footer';
import SocialFeed from 'components/layout/social-feed';
import { ProductListCarousel } from 'components/product-list-carousel';
import { getBestSellers, getTrendingProducts } from 'lib/backend';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vaabhi | Artisanal Luxury Fashion',
  description: 'Discover the house of Vaabhi. Artisanal luxury, modern aesthetics, and timeless style.',
  openGraph: {
    type: 'website'
  }
};

export default async function HomePage() {
  const trendingProducts = await getTrendingProducts(8);
  const bestSellers = await getBestSellers(8);

  return (
    <>
      <ThreeItemGrid />

      <section className="py-12 bg-white dark:bg-black">
        <ProductListCarousel products={trendingProducts} title="Trending Now" />
      </section>

      <div className="relative overflow-hidden bg-neutral-100 py-16 dark:bg-neutral-900">
        <Carousel />
      </div>

      <section className="py-12 bg-white dark:bg-black">
        <ProductListCarousel products={bestSellers} title="Best Sellers" />
      </section>

      <SocialFeed />
      <Footer />
    </>
  );
}
