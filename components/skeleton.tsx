import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function Skeleton({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn("animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-800", className)}
            {...props}
        />
    );
}

export function ProductSkeleton() {
    return (
        <div className="flex flex-col space-y-3">
            <Skeleton className="aspect-square w-full rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-4 w-1/3" />
            </div>
        </div>
    );
}

export function CarouselSkeleton() {
    return (
        <div className="w-full pb-10">
            <div className="flex items-center justify-between px-4 pb-4 sm:px-6 lg:px-8">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-20" />
            </div>
            <div className="flex gap-4 px-4 sm:px-6 lg:px-8 overflow-hidden">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="aspect-square h-[30vh] max-h-[275px] w-2/3 max-w-[475px] flex-none md:w-1/3 lg:w-1/4">
                        <Skeleton className="h-full w-full rounded-xl" />
                    </div>
                ))}
            </div>
        </div>
    );
}
