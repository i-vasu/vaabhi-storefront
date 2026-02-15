'use client';

import { AddToCart } from 'components/cart/add-to-cart';
import Price from 'components/price';
import Prose from 'components/prose';
import { motion } from 'framer-motion';
import { Product } from 'lib/backend';
import SizeGuide from './size-guide';
import { VariantSelector } from './variant-selector';
import VirtualTryOn from './virtual-try-on';
import { WhatsAppOrderButton } from './whatsapp-order-button';
import { WishlistButton } from './wishlist-button';

export function ProductDescription({ product }: { product: Product }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-6 flex flex-col pb-6 border-b border-neutral-100 dark:border-neutral-800"
      >
        <h1 className="mb-2 text-2xl md:text-3xl lg:text-4xl font-serif font-black tracking-tight text-heritage-black dark:text-white leading-tight uppercase">{product.title}</h1>
        <div className="flex items-center gap-6 mt-2">
          <div className="text-xl font-medium tracking-wider text-neutral-800 dark:text-neutral-200">
            <Price
              amount={product.priceRange.maxVariantPrice.amount}
              currencyCode={product.priceRange.maxVariantPrice.currencyCode}
            />
          </div>
          {(product as any).totalQuantity > 0 && (product as any).totalQuantity < 10 && (
            <div className="text-xs font-bold uppercase tracking-widest text-red-600 dark:text-red-400">
               Only {(product as any).totalQuantity} left
            </div>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <VariantSelector options={product.options} variants={product.variants} />
        <div className="mb-8 bg-neutral-50 dark:bg-neutral-900/50 p-4 rounded-2xl">
          <SizeGuide sizeGuide={(product as any).sizeGuide} />
        </div>
        {product.descriptionHtml ? (
          <Prose
            className="mb-8 text-base leading-relaxed dark:text-white/[70%] font-light italic opacity-90"
            html={product.descriptionHtml}
          />
        ) : null}

        {/* Luxury Storytelling Sections */}
        <div className="space-y-6 mb-8">
          {product.materialStory && (
            <div className="border-l-2 border-heritage-red pl-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-heritage-red mb-1">The Material Story</h4>
              <p className="text-sm font-medium leading-relaxed text-heritage-black">{product.materialStory}</p>
            </div>
          )}
          {product.stylistNotes && (
            <div className="border-l-2 border-heritage-gold pl-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-heritage-gold mb-1">Stylist Notes</h4>
              <p className="text-sm font-medium leading-relaxed italic text-heritage-black">{product.stylistNotes}</p>
            </div>
          )}
          {product.modelMeasurements && (
            <div className="border-l-2 border-heritage-black/20 pl-4">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-heritage-black/60 mb-1">Size & Fit</h4>
              <p className="text-sm font-medium leading-relaxed text-heritage-black opacity-70">{product.modelMeasurements}</p>
            </div>
          )}
        </div>
        <div className="flex gap-4">
          <div className="flex-1">
             <AddToCart product={product} />
          </div>
          <WishlistButton product={product} />
        </div>
        <WhatsAppOrderButton product={product} />
        <div className="mt-6 border-t border-neutral-100 dark:border-neutral-800 pt-6">
          <VirtualTryOn productImageUrl={product.featuredImage?.url} />
        </div>
      </motion.div>
    </>
  );
}
