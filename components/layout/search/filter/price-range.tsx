'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function PriceRangeFilter() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [min, setMin] = useState(searchParams?.get('minPrice') || '');
    const [max, setMax] = useState(searchParams?.get('maxPrice') || '');

    const handleApply = () => {
        const params = new URLSearchParams(searchParams?.toString());
        if (min) params.set('minPrice', min);
        else params.delete('minPrice');

        if (max) params.set('maxPrice', max);
        else params.delete('maxPrice');

        router.push(`${pathname}?${params.toString()}`);
    };

    const handleClear = () => {
        setMin('');
        setMax('');
        const params = new URLSearchParams(searchParams?.toString());
        params.delete('minPrice');
        params.delete('maxPrice');
        router.push(`${pathname}?${params.toString()}`);
    };

    return (
        <div className="mt-8 px-2">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 dark:text-neutral-500 mb-4">Price Range</h3>
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-neutral-400">₹</span>
                        <input
                            type="number"
                            placeholder="Min"
                            value={min}
                            onChange={(e) => setMin(e.target.value)}
                            className="w-full rounded-xl border border-neutral-100 bg-neutral-50 pl-7 pr-3 py-2.5 text-xs transition-all focus:border-black focus:bg-white dark:border-neutral-800 dark:bg-neutral-900 dark:focus:border-white"
                        />
                    </div>
                    <span className="text-neutral-300">/</span>
                    <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-neutral-400">₹</span>
                        <input
                            type="number"
                            placeholder="Max"
                            value={max}
                            onChange={(e) => setMax(e.target.value)}
                            className="w-full rounded-xl border border-neutral-100 bg-neutral-50 pl-7 pr-3 py-2.5 text-xs transition-all focus:border-black focus:bg-white dark:border-neutral-800 dark:bg-neutral-900 dark:focus:border-white"
                        />
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleApply}
                        className="flex-1 rounded-full bg-black py-3 text-[10px] font-black uppercase tracking-widest text-white transition-all hover:bg-neutral-800 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                    >
                        Filter
                    </button>
                    {(min || max) && (
                        <button
                            onClick={handleClear}
                            className="rounded-full border border-neutral-200 px-4 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
                        >
                            Reset
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
