'use client';

import { useAuth } from 'components/auth-context';
import { useWishlist } from 'components/wishlist-context';
import { Heart, User } from 'lucide-react';
import Link from 'next/link';

export default function UserNav() {
    const { wishlist } = useWishlist();
    const { user, isAuthenticated } = useAuth();
    const wishlistCount = wishlist.length;

    return (
        <div className="flex items-center gap-1 md:gap-4">
            <Link
                href="/account/wishlist"
                className="relative flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-heritage-red/5 hover:text-heritage-gold dark:text-neutral-400 dark:hover:bg-neutral-900"
                aria-label="Wishlist"
            >
                <Heart className="h-5 w-5" />
                {wishlistCount > 0 ? (
                    <div className="absolute top-1 right-1 h-4 w-4 rounded-full bg-heritage-red text-[8px] font-black text-white flex items-center justify-center border border-heritage-gold shadow-sm">
                        {wishlistCount}
                    </div>
                ) : null}
            </Link>

            <Link
                href={isAuthenticated ? "/account" : "/login"}
                className="flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-heritage-red/5 hover:text-heritage-gold dark:text-neutral-400 dark:hover:bg-neutral-900"
                aria-label="Account"
            >
                <User className="h-5 w-5" />
            </Link>
        </div>
    );
}
