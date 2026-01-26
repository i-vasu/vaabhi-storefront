'use client';

import { Product } from 'lib/shopify/types';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface WishlistContextType {
    wishlist: Product[];
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (productId: string) => void;
    isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [wishlist, setWishlist] = useState<Product[]>([]);

    useEffect(() => {
        const saved = localStorage.getItem('vaabhi_wishlist');
        if (saved) {
            try {
                setWishlist(JSON.parse(saved));
            } catch (e) {
                console.error('Failed to load wishlist');
            }
        }
    }, []);

    const addToWishlist = (product: Product) => {
        setWishlist((prev) => {
            if (prev.find((p) => p.id === product.id)) return prev;
            const updated = [...prev, product];
            localStorage.setItem('vaabhi_wishlist', JSON.stringify(updated));
            toast.success('Added to wishlist');
            return updated;
        });
    };

    const removeFromWishlist = (productId: string) => {
        setWishlist((prev) => {
            const updated = prev.filter((p) => p.id !== productId);
            localStorage.setItem('vaabhi_wishlist', JSON.stringify(updated));
            toast.success('Removed from wishlist');
            return updated;
        });
    };

    const isInWishlist = (productId: string) => {
        return wishlist.some((p) => p.id === productId);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
}

export function useWishlist() {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error('useWishlist must be used within a WishlistProvider');
    }
    return context;
}
