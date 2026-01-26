'use client';

import { AddToCart } from 'components/cart/add-to-cart';
import Price from 'components/price';
import Prose from 'components/prose';
import { motion } from 'framer-motion';
import { Product } from 'lib/backend';
import SizeGuide from './size-guide';
import { VariantSelector } from './variant-selector';
import VirtualTryOn from './virtual-try-on';

export function ProductDescription({ product }: { product: Product }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 flex flex-col border-b pb-8 dark:border-neutral-700"
      >
        <h1 className="mb-4 text-5xl md:text-6xl font-bold tracking-tighter leading-none" style={{ color: 'var(--aura-contrast, inherit)' }}>{product.title}</h1>
        <div className="flex items-center gap-6">
          <div
            className="w-auto rounded-full px-8 py-3 text-xl font-black text-white shadow-2xl transition-transform hover:scale-105"
            style={{ backgroundColor: 'var(--aura-color, #2563eb)', color: 'var(--aura-contrast, #fff)' }}
          >
            <Price
              amount={product.priceRange.maxVariantPrice.amount}
              currencyCode={product.priceRange.maxVariantPrice.currencyCode}
            />
          </div>
          {(product as any).totalQuantity > 0 && (product as any).totalQuantity < 10 && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/20">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="text-[11px] font-black uppercase tracking-widest text-red-600 dark:text-red-400">
                Only {(product as any).totalQuantity} left in stock
              </span>
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
        <div className="flex gap-4">
          <div className="group relative flex-1">
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 opacity-25 blur transition duration-1000 group-hover:opacity-100 group-hover:duration-200" style={{ backgroundImage: 'linear-gradient(to right, var(--aura-color), var(--aura-color-soft))' }}></div>
            <div className="relative">
              <AddToCart product={product} />
            </div>
          </div>
          <WishlistButton product={product} />
        </div>
        <div className="mt-6 border-t border-neutral-100 dark:border-neutral-800 pt-6">
          <VirtualTryOn productImageUrl={product.featuredImage?.url} />
        </div>
      </motion.div>
    </>
  );
}
