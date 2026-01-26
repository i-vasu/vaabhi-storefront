'use client';

import { toast } from 'sonner';

export default function CopyButton({ code }: { code: string }) {
    return (
        <button
            onClick={() => {
                navigator.clipboard.writeText(code);
                toast.success('Coupon code copied!');
            }}
            className="w-full rounded-2xl bg-neutral-100 py-3 text-sm font-bold text-black transition-colors hover:bg-black hover:text-white dark:bg-neutral-800 dark:text-white dark:hover:bg-white dark:hover:text-black"
        >
            Copy Code
        </button>
    );
}
