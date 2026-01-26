'use client';

import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useWishlist } from 'components/wishlist-context';
import { Product } from 'lib/shopify/types';

export function WishlistButton({ product }: { product: Product }) {
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const wishlisted = isInWishlist(product.id);

    return (
        <button
            onClick={() => wishlisted ? removeFromWishlist(product.id) : addToWishlist(product)}
            className="flex h-12 w-12 items-center justify-center rounded-full border border-neutral-200 bg-white transition-all hover:scale-110 active:scale-95 dark:border-neutral-800 dark:bg-black"
            title={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        >
            {wishlisted ? (
                <HeartIconSolid className="h-6 w-6 text-red-500" />
            ) : (
                <HeartIcon className="h-6 w-6" />
            )}
        </button>
    );
}
