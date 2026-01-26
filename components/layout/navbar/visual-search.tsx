'use client';

import { CameraIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Product, visualSearchByImage } from 'lib/backend';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

export default function VisualSearch() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<Product[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const handleIconClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        try {
            const products = await visualSearchByImage(file);
            setResults(products);
            setIsOpen(true);
        } catch (err) {
            console.error('Visual search failed:', err);
            alert('Visual search failed. Please try another image.');
        } finally {
            setLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <div className="flex items-center">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />
            <button
                onClick={handleIconClick}
                disabled={loading}
                className="hover:text-blue-600 transition-colors disabled:opacity-50"
                title="Search by image"
            >
                {loading ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                ) : (
                    <CameraIcon className="h-5 w-5" />
                )}
            </button>

            {/* Results Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <div className="relative w-full max-w-4xl max-h-[80vh] overflow-hidden rounded-3xl bg-white shadow-2xl dark:bg-neutral-900">
                        <div className="flex items-center justify-between border-b border-neutral-100 p-6 dark:border-neutral-800">
                            <h2 className="text-xl font-bold">Visual Search Results</h2>
                            <button onClick={() => setIsOpen(false)} className="rounded-full p-2 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="overflow-y-auto p-6">
                            {results.length > 0 ? (
                                <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
                                    {results.map((product) => (
                                        <Link
                                            key={product.id}
                                            href={`/product/${product.handle}`}
                                            onClick={() => setIsOpen(false)}
                                            className="group"
                                        >
                                            <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800">
                                                <Image
                                                    src={product.featuredImage?.url || 'https://placehold.co/400'}
                                                    alt={product.title}
                                                    fill
                                                    className="object-cover transition-transform group-hover:scale-105"
                                                />
                                            </div>
                                            <p className="mt-3 text-sm font-bold truncate">{product.title}</p>
                                            <p className="text-xs text-neutral-500">₹{product.priceRange.minVariantPrice.amount}</p>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="py-20 text-center text-neutral-500">
                                    <p>No similar products found. Try a different angle or lighting.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
