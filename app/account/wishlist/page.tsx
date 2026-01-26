'use client';

import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import { useWishlist } from 'components/wishlist-context';

export default function WishlistPage() {
    const { wishlist } = useWishlist();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Your Wishlist</h1>
                <p className="text-neutral-500">Items you've saved for later.</p>
            </div>

            {wishlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="mb-4 text-4xl">❤️</div>
                    <p className="text-neutral-500">Your wishlist is empty.</p>
                </div>
            ) : (
                <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    <ProductGridItems products={wishlist} />
                </Grid>
            )}
        </div>
    );
}
