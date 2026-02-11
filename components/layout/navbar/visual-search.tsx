
'use client';

import { CameraIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { trackEvent } from 'components/analytics/umami';
import { Product, visualSearchByImage } from 'lib/backend';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';

export default function VisualSearch() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [results, setResults] = useState<Product[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const handleIconClick = (e: React.MouseEvent) => {
        e.preventDefault(); 
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file.');
            return;
        }

        setLoading(true);
        const reader = new FileReader();
        reader.onload = (e) => setPreviewImage(e.target?.result as string);
        reader.readAsDataURL(file);

        trackEvent('Visual Search Uploaded', { fileName: file.name });

        try {
            const products = await visualSearchByImage(file);
            const matches = products || [];
            setResults(matches);
            setIsOpen(true);
            trackEvent('Visual Search Results Displayed', { matchCount: matches.length });
        } catch (err) {
            console.error('Visual search failed:', err);
            trackEvent('Visual Search Failed');
            alert('Visual search service is currently unavailable. Please try again later.');
        } finally {
            setLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />
            <button
                type="button" 
                onClick={handleIconClick}
                disabled={loading}
                className="group relative flex items-center justify-center p-2 text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white transition-colors disabled:opacity-50"
                title="Search by Image"
            >
                {loading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-luxury-gold border-t-transparent" />
                ) : (
                    <CameraIcon className="h-5 w-5" />
                )}
                
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100 dark:bg-white dark:text-black z-50 pointer-events-none">
                    Visual Search
                </span>
            </button>

            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                    <div className="relative w-full max-w-5xl max-h-[90vh] flex flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl dark:bg-neutral-900">
                        
                        <div className="flex items-center justify-between border-b border-neutral-100 p-6 dark:border-neutral-800 shrink-0">
                            <div>
                                <h2 className="text-xl font-black uppercase tracking-tight font-serif">Visual Discovery</h2>
                                <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">Matched {results.length} items from the atelier</p>
                            </div>
                            <button 
                                onClick={() => {
                                    setIsOpen(false);
                                    trackEvent('Visual Search Closed');
                                }} 
                                className="rounded-full p-2 hover:bg-neutral-100 transition-colors dark:hover:bg-neutral-800"
                            >
                                <XMarkIcon className="h-6 w-6" />
                            </button>
                        </div>

                        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                            <div className="w-full md:w-1/3 p-6 bg-neutral-50 border-r border-neutral-100 dark:bg-neutral-950 dark:border-neutral-800 flex flex-col items-center justify-center shrink-0">
                                <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden shadow-lg border border-white dark:border-neutral-800">
                                    {previewImage && (
                                        <Image
                                            src={previewImage}
                                            alt="Uploaded search"
                                            fill
                                            className="object-cover"
                                        />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                                        <p className="text-white text-xs font-bold uppercase tracking-widest">Your Inspiration</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        fileInputRef.current?.click();
                                        trackEvent('Visual Search Re-upload Triggered');
                                    }}
                                    className="mt-6 text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-black dark:hover:text-white border-b border-transparent hover:border-black dark:hover:border-white transition-all pb-0.5"
                                >
                                    Try Another Image
                                </button>
                            </div>

                            <div className="flex-1 overflow-y-auto p-6 md:p-8">
                                {results.length > 0 ? (
                                    <div className="grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-3">
                                        {results.map((product) => (
                                            <Link
                                                key={product.id}
                                                href={`/product/${product.handle}`}
                                                onClick={() => {
                                                    setIsOpen(false);
                                                    trackEvent('Visual Search Result Clicked', { productHandle: product.handle });
                                                }}
                                                className="group block"
                                            >
                                                <div className="relative aspect-[4/5] overflow-hidden bg-neutral-100 dark:bg-neutral-800 mb-4">
                                                    <Image
                                                        src={product.featuredImage?.url || 'https://placehold.co/400'}
                                                        alt={product.title}
                                                        fill
                                                        sizes="(min-width: 768px) 33vw, 50vw"
                                                        className="object-cover transition-duration-500 group-hover:scale-110"
                                                    />
                                                    <div className="absolute inset-x-0 bottom-0 translate-y-full bg-white/90 p-2 text-center text-[10px] font-bold uppercase tracking-widest opacity-0 backdrop-blur-sm transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100 dark:bg-black/90">
                                                        View Details
                                                    </div>
                                                </div>
                                                <h3 className="text-sm font-bold text-neutral-900 dark:text-white truncate">{product.title}</h3>
                                                <div className="mt-1 flex items-center justify-between">
                                                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                                        {product.priceRange.minVariantPrice.amount} {product.priceRange.minVariantPrice.currencyCode}
                                                    </p>
                                                    <div className="h-2 w-2 rounded-full bg-green-500" title="In Stock" />
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-12">
                                        <div className="h-16 w-16 mb-6 rounded-full bg-neutral-100 flex items-center justify-center dark:bg-neutral-800">
                                            <CameraIcon className="h-8 w-8 text-neutral-400" />
                                        </div>
                                        <h3 className="text-lg font-bold font-serif mb-2">No Matches Found</h3>
                                        <p className="text-sm text-neutral-500 max-w-xs mx-auto">
                                            Our atelier couldn't find a close match. Try an image with better lighting or a clearer view of the garment.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
