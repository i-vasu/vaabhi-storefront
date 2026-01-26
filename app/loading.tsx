import { CarouselSkeleton } from 'components/skeleton';

export default function Loading() {
    return (
        <div className="mx-auto max-w-(--breakpoint-2xl) px-4">
            <div className="flex flex-col gap-8 py-8 md:flex-row">
                <div className="flex-1 space-y-12">
                    <CarouselSkeleton />
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="animate-pulse bg-neutral-100 dark:bg-neutral-800 rounded-2xl aspect-[4/5]" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
