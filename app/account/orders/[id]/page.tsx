import { getCurrentUser } from 'lib/auth-utils';
import { getOrderHistory } from 'lib/backend';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
    const user = await getCurrentUser();
    const email = user?.email || 'customer@example.com';

    const orders = await getOrderHistory(email);
    const order = orders.find(o => o.orderId.toString() === params.id);

    if (!order) {
        notFound();
    }

    const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

    const statusSteps = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED'];
    const currentStepIndex = statusSteps.indexOf(order.orderStatus);

    return (
        <div className="mx-auto max-w-4xl space-y-8 pb-20">
            <header className="flex items-center justify-between">
                <div>
                    <Link href="/account/orders" className="text-sm font-medium text-neutral-500 hover:underline">← Back to Orders</Link>
                    <h1 className="mt-2 text-3xl font-bold tracking-tight">Order #{order.orderId}</h1>
                    <p className="text-neutral-500">Placed on {new Date(order.orderDate).toLocaleDateString()}</p>
                </div>
                <div>
                    <span className="rounded-full bg-blue-100 px-4 py-1.5 text-xs font-bold text-blue-600 dark:bg-blue-900/30">
                        {order.orderStatus}
                    </span>
                </div>
            </header>

            {/* Tracking Progress Bar */}
            <section className="rounded-3xl border border-neutral-100 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <div className="relative">
                    <div className="absolute top-5 left-0 h-1 w-full bg-neutral-100 dark:bg-neutral-800" />
                    <div
                        className="absolute top-5 left-0 h-1 bg-blue-600 transition-all duration-1000"
                        style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                    />
                    <div className="relative flex justify-between">
                        {statusSteps.map((step, idx) => (
                            <div key={step} className="flex flex-col items-center">
                                <div className={`z-10 h-10 w-10 flex items-center justify-center rounded-full border-4 bg-white transition-colors duration-500 dark:bg-neutral-900 ${idx <= currentStepIndex ? 'border-blue-600' : 'border-neutral-100 dark:border-neutral-800'}`}>
                                    {idx < currentStepIndex ? (
                                        <span className="text-blue-600 font-bold text-lg">✓</span>
                                    ) : (
                                        <span className={`text-sm font-bold ${idx === currentStepIndex ? 'text-blue-600' : 'text-neutral-400'}`}>{idx + 1}</span>
                                    )}
                                </div>
                                <span className={`mt-2 text-[10px] font-black uppercase tracking-widest ${idx <= currentStepIndex ? 'text-black dark:text-white' : 'text-neutral-400'}`}>
                                    {step}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="rounded-2xl border border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                <div className="border-b border-neutral-100 p-6 dark:border-neutral-800">
                    <h2 className="text-lg font-bold">Items</h2>
                </div>
                <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                    {order.orderItems?.map((item: any) => (
                        <div key={item.orderItemId} className="p-6 flex items-center justify-between">
                            <div className="flex items-center">
                                <div className="h-20 w-20 bg-neutral-100 rounded-xl dark:bg-neutral-800 overflow-hidden relative">
                                    <Image
                                        src={item.product?.image && item.product.image !== 'default.png'
                                            ? (item.product.image.startsWith('http') ? item.product.image : `${BACKEND_URL}/public/products/image/${item.product.image}`)
                                            : 'https://placehold.co/100'}
                                        alt={item.product?.productName || 'Product'}
                                        fill
                                        className="object-cover"
                                    />
                                </div>
                                <div className="ml-4">
                                    <p className="font-bold">{item.product?.productName || 'Product'}</p>
                                    <p className="text-xs text-neutral-500">Qty: {item.quantity}</p>
                                </div>
                            </div>
                            <p className="font-bold">₹{item.orderedProductPrice * item.quantity}</p>
                        </div>
                    ))}
                </div>
                <div className="bg-neutral-50 p-6 dark:bg-neutral-950">
                    <div className="flex justify-between text-sm">
                        <span className="text-neutral-500">Subtotal</span>
                        <span>₹{(order.totalAmount - (order.discountAmount || 0)).toFixed(2)}</span>
                    </div>
                    {order.discountAmount > 0 && (
                        <div className="mt-2 flex justify-between text-sm text-green-600">
                            <span>Discount ({order.couponCode})</span>
                            <span>-₹{order.discountAmount}</span>
                        </div>
                    )}
                    <div className="mt-4 flex justify-between border-t border-neutral-200 pt-4 font-black dark:border-neutral-800">
                        <span>Total Paid</span>
                        <span className="text-xl">₹{order.totalAmount}</span>
                    </div>
                </div>
            </section>

            {order.orderStatus === 'DELIVERED' && (
                <section className="rounded-3xl bg-neutral-950 p-10 text-white shadow-2xl">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                        <div>
                            <h3 className="text-2xl font-bold">Something not right?</h3>
                            <p className="mt-2 text-neutral-400">You can return or exchange this item within 7 days of delivery.</p>
                        </div>
                        <Link
                            href={`/account/orders/${order.orderId}/return`}
                            className="inline-flex justify-center rounded-full bg-white px-10 py-4 text-sm font-black uppercase tracking-widest text-black hover:bg-neutral-200 transition-colors"
                        >
                            Initiate Return
                        </Link>
                    </div>
                </section>
            )}
        </div>
    );
}
