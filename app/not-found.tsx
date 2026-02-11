import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
            <div className="mb-8 text-9xl font-black text-neutral-200 dark:text-neutral-800">404</div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">Page Missing</h1>
            <p className="mt-6 text-lg leading-7 text-neutral-500 max-w-md">
                The piece of couture you're looking for seems to have moved to a different collection or doesn't exist.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                    href="/"
                    className="rounded-full bg-blue-600 px-8 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl transition-all hover:scale-105 active:scale-95 hover:bg-blue-500"
                >
                    Return to Studio
                </Link>
                <Link href="/search" className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Browse Collection <span aria-hidden="true">&rarr;</span>
                </Link>
            </div>
        </div>
    );
}
