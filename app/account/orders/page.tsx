import { getOrderHistory } from 'lib/backend';
import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function OrdersPage() {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('vaabhi_user')?.value;
    const user = userCookie ? JSON.parse(userCookie) : null;
    const email = user?.email || 'customer@example.com';

    const orders = await getOrderHistory(email);

    return (
        <div className="space-y-12">
            <div>
                <h1 className="text-4xl font-black tracking-tight uppercase">Order History</h1>
                <p className="mt-2 text-sm text-neutral-500 uppercase tracking-widest font-medium">Your Acquisitions</p>
            </div>

            <div className="space-y-6">
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <div key={order.orderId} className="group relative flex flex-col gap-6 rounded-[2.5rem] border border-neutral-100 bg-neutral-50/50 p-8 transition-all hover:bg-white hover:shadow-2xl dark:border-neutral-800 dark:bg-neutral-900/30 dark:hover:bg-neutral-900/50">
                            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-neutral-100 pb-6 dark:border-neutral-800">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Order Reference</p>
                                    <p className="mt-1 font-bold text-lg">#{order.orderId}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Date of Acquisition</p>
                                    <p className="mt-1 font-medium">{new Date(order.orderDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center justify-between gap-6">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Current Status</p>
                                    <span className="inline-flex items-center gap-2 rounded-full bg-black px-4 py-1.5 text-[10px] font-black uppercase tracking-widest text-white dark:bg-white dark:text-black">
                                        <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                                        {order.orderStatus}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Investment Total</p>
                                    <p className="mt-1 text-2xl font-black">₹{order.totalAmount.toLocaleString()}</p>
                                </div>
                            </div>

                            <div className="pt-2">
                                <Link
                                    href={`/account/orders/${order.orderId}`}
                                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-neutral-400 transition-colors hover:text-black dark:hover:text-white"
                                >
                                    View Detailed Dossier →
                                </Link>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center rounded-[3rem] border border-dashed border-neutral-200 py-32 text-center dark:border-neutral-800">
                        <div className="mb-6 text-6xl opacity-20">📦</div>
                        <h2 className="text-xl font-bold">No orders found</h2>
                        <p className="mt-2 text-neutral-500">Your collection is waiting for its first piece.</p>
                        <Link
                            href="/search"
                            className="mt-8 rounded-full bg-black px-10 py-4 text-xs font-black uppercase tracking-widest text-white hover:opacity-90 dark:bg-white dark:text-black"
                        >
                            Shop Collection
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
