
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import Price from 'components/price';
import { getOrderById } from 'lib/backend';
import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function CheckoutSuccessPage({
    searchParams
}: {
    searchParams: { id?: string };
}) {
    const orderId = searchParams.id;
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('vaabhi_user')?.value;
    const user = userCookie ? JSON.parse(userCookie) : null;
    const email = user?.email || 'customer@example.com';

    let order = null;
    if (orderId) {
        order = await getOrderById(email, Number(orderId));
    }

    return (
        <div className="mx-auto max-w-2xl px-4 py-16 text-center">
            <div className="mb-8 flex justify-center">
                <CheckCircleIcon className="h-24 w-24 text-green-500" />
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight">Order Confirmed!</h1>
            <p className="mb-12 text-lg text-neutral-600 dark:text-neutral-400">
                Thank you for your purchase. We've received your order and are getting it ready for shipment.
            </p>

            {order ? (
                <div className="rounded-xl border border-neutral-200 bg-white p-8 text-left dark:border-neutral-800 dark:bg-black">
                    <div className="mb-6 flex items-center justify-between border-b border-neutral-100 pb-6 dark:border-neutral-800">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Order Number</p>
                            <p className="text-lg font-bold">#{order.orderId}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold uppercase tracking-wider text-neutral-500">Date</p>
                            <p className="text-lg font-bold">{new Date().toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="mb-8 space-y-4">
                        {order.orderItems?.map((item: any) => (
                            <div key={item.orderItemId} className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-16 w-16 overflow-hidden rounded-md bg-neutral-100 dark:bg-neutral-900">
                                        {/* Simplified image for success page */}
                                        <div className="flex h-full w-full items-center justify-center text-xs text-neutral-400">
                                            {item.product?.productName?.[0]}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="font-medium">{item.product?.productName}</p>
                                        <p className="text-sm text-neutral-500">Qty: {item.quantity}</p>
                                    </div>
                                </div>
                                <Price
                                    amount={item.orderedProductPrice.toString()}
                                    currencyCode="INR"
                                />
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-neutral-100 pt-6 dark:border-neutral-800">
                        <div className="flex justify-between font-bold">
                            <span>Total Amount</span>
                            <Price
                                amount={order.totalAmount.toString()}
                                currencyCode="INR"
                            />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="rounded-xl border border-neutral-200 p-8 dark:border-neutral-800">
                    <p className="text-neutral-500">Loading order details...</p>
                </div>
            )}

            <div className="mt-12 space-x-4">
                <Link
                    href="/account/orders"
                    className="inline-block rounded-full border border-neutral-200 px-8 py-3 text-sm font-medium hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
                >
                    Track Order
                </Link>
                <Link
                    href="/"
                    className="inline-block rounded-full bg-blue-600 px-8 py-3 text-sm font-medium text-white hover:opacity-90"
                >
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
}
