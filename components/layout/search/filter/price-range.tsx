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
        <div className="mt-8">
            <h3 className="text-xs text-neutral-500 dark:text-neutral-400">Price Range</h3>
            <div className="mt-2 flex flex-col gap-2">
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        placeholder="Min"
                        value={min}
                        onChange={(e) => setMin(e.target.value)}
                        className="w-full rounded border border-neutral-200 bg-white px-2 py-1 text-xs dark:border-neutral-800 dark:bg-black"
                    />
                    <span className="text-neutral-400">-</span>
                    <input
                        type="number"
                        placeholder="Max"
                        value={max}
                        onChange={(e) => setMax(e.target.value)}
                        className="w-full rounded border border-neutral-200 bg-white px-2 py-1 text-xs dark:border-neutral-800 dark:bg-black"
                    />
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={handleApply}
                        className="flex-1 rounded bg-black px-2 py-1 text-[10px] font-bold text-white hover:opacity-80 dark:bg-white dark:text-black"
                    >
                        Apply
                    </button>
                    <button
                        onClick={handleClear}
                        className="flex-1 rounded border border-neutral-200 px-2 py-1 text-[10px] font-bold hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-900"
                    >
                        Clear
                    </button>
                </div>
            </div>
        </div>
    );
}
