'use client';

import { addToWishlist as backendAddToWishlist, removeFromWishlist as backendRemoveFromWishlist, getWishlist } from 'lib/backend';
import { Product } from 'lib/shopify/types';
import React, { createContext, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useAuth } from './auth-context';

interface WishlistContextType {
    wishlist: Product[];
    addToWishlist: (product: Product) => void;
    removeFromWishlist: (productId: string) => void;
    isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
    const [wishlist, setWishlist] = useState<Product[]>([]);

    const { isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated) {
            getWishlist().then(setWishlist);
        } else {
            const saved = localStorage.getItem('vaabhi_wishlist');
            if (saved) {
                try {
                    setWishlist(JSON.parse(saved));
                } catch (e) {
                    console.error('Failed to load wishlist');
                }
            }
        }
    }, [isAuthenticated]);

    const addToWishlist = async (product: Product) => {
        if (isAuthenticated) {
            try {
                await backendAddToWishlist(product.id);
                setWishlist(await getWishlist());
                toast.success('Added to wishlist');
            } catch (e) {
                toast.error('Failed to add to wishlist');
            }
        } else {
            setWishlist((prev) => {
                if (prev.find((p) => p.id === product.id)) return prev;
                const updated = [...prev, product];
                localStorage.setItem('vaabhi_wishlist', JSON.stringify(updated));
                toast.success('Added to wishlist');
                return updated;
            });
        }
    };

    const removeFromWishlist = async (productId: string) => {
        if (isAuthenticated) {
            try {
                await backendRemoveFromWishlist(productId);
                setWishlist(await getWishlist());
                toast.success('Removed from wishlist');
            } catch (e) {
                toast.error('Failed to remove from wishlist');
            }
        } else {
            setWishlist((prev) => {
                const updated = prev.filter((p) => p.id !== productId);
                localStorage.setItem('vaabhi_wishlist', JSON.stringify(updated));
                toast.success('Removed from wishlist');
                return updated;
            });
        }
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
