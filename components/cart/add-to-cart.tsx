'use client';

import clsx from 'clsx';
import { addItem } from 'components/cart/actions';
import { useProduct } from 'components/product/product-context';
import { motion } from 'framer-motion';
import { Product, ProductVariant } from 'lib/backend';
import { useActionState } from 'react';
import { useCart } from './cart-context';

function SubmitButton({
  availableForSale,
  selectedVariantId
}: {
  availableForSale: boolean;
  selectedVariantId: string | undefined;
}) {
  const buttonClasses =
    'relative flex w-full items-center justify-center border border-transparent bg-heritage-red p-4 text-sm font-black uppercase tracking-[0.2em] text-white transition-all duration-500 hover:bg-heritage-gold hover:text-black dark:bg-white dark:text-black dark:hover:bg-heritage-gold shadow-xl';
  const disabledClasses = 'cursor-not-allowed opacity-40 hover:opacity-40 hover:bg-heritage-red hover:text-white';

  if (!availableForSale) {
    return (
      <button disabled className={clsx(buttonClasses, disabledClasses)}>
        Sold Out
      </button>
    );
  }

  if (!selectedVariantId) {
    return (
      <button
        aria-label="Please select an option"
        disabled
        className={clsx(buttonClasses, disabledClasses)}
      >
        Select Size
      </button>
    );
  }

  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      aria-label="Add to cart"
      className={clsx(buttonClasses)}
    >
      Add To Bag
    </motion.button>
  );
}

import { trackEvent } from 'components/analytics/umami';

export function AddToCart({ product }: { product: Product }) {
  const { variants, availableForSale } = product;
  const { addCartItem } = useCart();
  const { state } = useProduct();
  const [message, formAction] = useActionState(addItem, null);

  const variant = variants.find((variant: ProductVariant) =>
    variant.selectedOptions.every(
      (option) => option.value === state[option.name.toLowerCase()]
    )
  );
  const defaultVariantId = variants.length === 1 ? variants[0]?.id : undefined;
  const selectedVariantId = variant?.id || defaultVariantId;
  const addItemAction = formAction.bind(null, selectedVariantId);
  const finalVariant = variants.find(
    (variant) => variant.id === selectedVariantId
  )!;

  return (
    <form
      action={async () => {
        addCartItem(finalVariant, product);
        trackEvent('Add to Cart', {
          product: product.title,
          productId: product.id,
          price: product.priceRange.maxVariantPrice.amount
        });
        addItemAction();
      }}
    >
      <SubmitButton
        availableForSale={availableForSale}
        selectedVariantId={selectedVariantId}
      />
      <p aria-live="polite" className="sr-only" role="status">
        {message}
      </p>
    </form>
  );
}
