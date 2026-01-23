
'use client';

import { performCheckout } from 'components/checkout/actions';
import { useFormStatus } from 'react-dom';

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <button
            type="submit"
            disabled={pending}
            className="mt-6 w-full rounded-full bg-blue-600 p-3 text-center text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
        >
            {pending ? 'Processing...' : 'Place Order'}
        </button>
    );
}

export default function CheckoutPage() {
    return (
        <div className="mx-auto max-w-2xl px-4 py-8">
            <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

            <form action={performCheckout} className="space-y-4">
                <div className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-700">
                    <h2 className="mb-4 text-xl font-semibold">Contact & Shipping</h2>

                    <div className="grid gap-4">
                        <div>
                            <label className="mb-1 block text-sm text-neutral-500">Email</label>
                            <input
                                required
                                name="email"
                                type="email"
                                placeholder="you@example.com"
                                className="w-full rounded-md border border-neutral-200 p-2 dark:border-neutral-700 dark:bg-black"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm text-neutral-500">Address</label>
                            <input
                                required
                                name="address"
                                type="text"
                                placeholder="123 Main St"
                                className="w-full rounded-md border border-neutral-200 p-2 dark:border-neutral-700 dark:bg-black"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1 block text-sm text-neutral-500">City</label>
                                <input
                                    required
                                    name="city"
                                    type="text"
                                    placeholder="New York"
                                    className="w-full rounded-md border border-neutral-200 p-2 dark:border-neutral-700 dark:bg-black"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm text-neutral-500">ZIP Code</label>
                                <input
                                    required
                                    name="zip"
                                    type="text"
                                    placeholder="10001"
                                    className="w-full rounded-md border border-neutral-200 p-2 dark:border-neutral-700 dark:bg-black"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-700">
                    <h2 className="mb-4 text-xl font-semibold">Payment</h2>

                    <div>
                        <label className="mb-1 block text-sm text-neutral-500">Card Number (Mock)</label>
                        <input
                            required
                            name="card"
                            type="text"
                            placeholder="4242 4242 4242 4242"
                            className="w-full rounded-md border border-neutral-200 p-2 dark:border-neutral-700 dark:bg-black"
                        />
                    </div>
                </div>

                <SubmitButton />
            </form>
        </div>
    );
}
