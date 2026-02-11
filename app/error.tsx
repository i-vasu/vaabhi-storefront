'use client';

import { RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="mx-auto my-20 flex max-w-2xl flex-col items-center justify-center rounded-3xl border border-neutral-200 bg-white p-12 text-center shadow-2xl dark:border-neutral-800 dark:bg-black">
      <div className="mb-6 rounded-full bg-red-50 p-4 dark:bg-red-900/20">
        <RefreshCw className="h-8 w-8 text-red-600" />
      </div>
      <h2 className="text-3xl font-black uppercase tracking-tighter">Something went wrong</h2>
      <p className="my-4 text-neutral-500">
        Our atelier is currently experiencing a technical adjustment. Please try refreshing the page or contact our concierge if the issue persists.
      </p>
      <div className="flex w-full flex-col gap-4 sm:flex-row">
        <button
          className="flex flex-1 items-center justify-center rounded-full bg-black p-4 text-sm font-bold uppercase tracking-widest text-white transition-all hover:bg-neutral-800 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
          onClick={() => reset()}
        >
          Try Again
        </button>
        <a
          href="/account/support"
          className="flex flex-1 items-center justify-center rounded-full border border-neutral-200 p-4 text-sm font-bold uppercase tracking-widest transition-all hover:bg-neutral-50 active:scale-95 dark:border-neutral-800 dark:hover:bg-neutral-900"
        >
          Contact Support
        </a>
      </div>
    </div>
  );
}
