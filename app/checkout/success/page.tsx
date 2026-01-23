
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
    return (
        <div className="mt-20 flex w-full flex-col items-center justify-center space-y-6 px-4">
            <CheckCircleIcon className="h-24 w-24 text-green-500" />
            <h1 className="text-3xl font-bold">Order Confirmed!</h1>
            <p className="max-w-md text-center text-lg text-neutral-600 dark:text-neutral-400">
                Thank you for your purchase. We have received your order and will process it immediately.
            </p>
            <Link
                href="/"
                className="rounded-full bg-blue-600 px-8 py-3 text-sm font-medium text-white hover:opacity-90"
            >
                Continue Shopping
            </Link>
        </div>
    );
}
