'use client';

import Grid from 'components/grid';
import ProductGridItems from 'components/layout/product-grid-items';
import { useWishlist } from 'components/wishlist-context';
import Link from 'next/link';

export default function WishlistPage() {
    const { wishlist } = useWishlist();

    return (
        <div className="space-y-12">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-4xl font-black tracking-tight uppercase">Wishlist</h1>
                    <p className="mt-2 text-sm text-neutral-500 uppercase tracking-widest font-medium">Curated Pieces</p>
                </div>
                <div className="hidden sm:block">
                    <p className="text-xs font-black uppercase tracking-widest text-neutral-400">
                        {wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'}
                    </p>
                </div>
            </div>

            {wishlist.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-[3rem] border border-dashed border-neutral-200 py-32 text-center dark:border-neutral-800">
                    <div className="mb-6 text-6xl opacity-20">❤️</div>
                    <h2 className="text-xl font-bold">Your gallery is empty</h2>
                    <p className="mt-2 text-neutral-500">Discover our collection and save your favorite pieces.</p>
                    <Link
                        href="/search"
                        className="mt-8 rounded-full bg-black px-10 py-4 text-xs font-black uppercase tracking-widest text-white hover:opacity-90 dark:bg-white dark:text-black"
                    >
                        Start Exploring
                    </Link>
                </div>
            ) : (
                <Grid className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    <ProductGridItems products={wishlist} />
                </Grid>
            )}
        </div>
    );
}
