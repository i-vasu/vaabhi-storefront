import { Carousel } from 'components/carousel';
import { ThreeItemGrid } from 'components/grid/three-items';
import { EditorialSection } from 'components/layout/editorial-section';
import Footer from 'components/layout/footer';
import { Hero } from 'components/layout/hero';
import { InstagramFeed } from 'components/layout/instagram-feed';
import { ProductListCarousel } from 'components/product-list-carousel';
import { CarouselSkeleton } from 'components/skeleton';
import { getBestSellers, getTenantConfig, getTrendingProducts } from 'lib/backend';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
  title: 'VAABHI | Heritage Luxury',
  description: 'Discover the house of VAABHI. Artisanal luxury, modern aesthetics, and timeless style.',
  openGraph: {
     type: 'website'
  }
};

const websiteJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Vaabhi',
  url: 'https://vaabhi.com',
  potentialAction: {
    '@type': 'SearchAction',
    target: 'https://vaabhi.com/search?q={search_term_string}',
    'query-input': 'required name=search_term_string'
  }
};

async function TrendingCarousel() {
  const trendingProducts = await getTrendingProducts(8);
  return <ProductListCarousel products={trendingProducts} title="Trending Now" />;
}

async function BestSellersCarousel() {
  const bestSellers = await getBestSellers(8);
  return <ProductListCarousel products={bestSellers} title="Best Sellers" />;
}

export default async function HomePage() {
  const config = await getTenantConfig();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteJsonLd)
        }}
      />
      
      {/* 1. Full Screen Hero */}
      <Hero 
        videoUrl={config.heroVideoUrl} 
        posterUrl={config.heroPosterUrl} 
      />

      {/* 2. Featured Grid (Key Looks) */}
      <section className="py-20 lg:py-24">
         <div className="mb-12 text-center">
            <h2 className="font-serif text-3xl font-black uppercase tracking-[0.2em] text-heritage-black dark:text-white md:text-5xl">
              The Collection
            </h2>
            <div className="mx-auto mt-6 h-[2px] w-24 bg-gradient-to-r from-transparent via-heritage-gold to-transparent" />
         </div>
         <ThreeItemGrid />
      </section>

      {/* 3. Editorial: The Atelier */}
      <EditorialSection 
        title="The Atelier" 
        subtitle="Craftsmanship"
        description="Every piece tells a story of heritage, hand-woven by master artisans using techniques passed down through generations. Sustainable luxury defined by detail."
        image="https://cdn.shopify.com/s/files/1/0550/0636/3705/files/Sabyasachi_Desktop_Banner.jpg?v=1686742583" // Placeholder
        imageAlt="Artisans at work in the atelier"
        ctaText="Discover Our Process"
        ctaLink="/search" // Placeholder page
        alignment="left"
      />

      {/* 4. Trending Carousel */}
      <section className="py-12 bg-neutral-50 dark:bg-neutral-900/50">
        <Suspense fallback={<CarouselSkeleton />}>
          <TrendingCarousel />
        </Suspense>
      </section>

      {/* 5. Editorial: Handcrafted Heritage */}
       <EditorialSection 
        title="Royal Heritage" 
        subtitle="The Collection"
        description="Inspired by the royal courts of India, re-imagined for the modern connoisseur. opulent fabrics, intricate embroideries, and a silhouette that commands attention."
        image="https://images.pexels.com/photos/1721937/pexels-photo-1721937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" // Placeholder (Fashion/Texture)
        imageAlt="Close up of royal embroidery"
        ctaText="View The Collection"
        ctaLink="/search"
        alignment="right"
      />

      {/* 6. Best Sellers */}
      <section className="py-12 bg-white dark:bg-black">
        <Suspense fallback={<CarouselSkeleton />}>
          <BestSellersCarousel />
        </Suspense>
      </section>

      {/* 7. Infinite Scroll Carousel (existing) */}
      <div className="relative overflow-hidden bg-neutral-100 py-16 dark:bg-neutral-900 border-y border-neutral-200 dark:border-neutral-800">
        <Carousel />
      </div>

      <InstagramFeed />
      <Footer />
    </>
  );
}
