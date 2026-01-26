import { getOrderHistory } from 'lib/backend';
import { cookies } from 'next/headers';

export default async function OrdersPage() {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('vaabhi_user')?.value;
    const user = userCookie ? JSON.parse(userCookie) : null;
    const email = user?.email || 'customer@example.com';

    const orders = await getOrderHistory(email);

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Your Orders</h1>
            <div className="space-y-4">
                {orders.length > 0 ? (
                    orders.map((order) => (
                        <div key={order.orderId} className="flex flex-col gap-4 rounded-lg border border-neutral-100 p-6 dark:border-neutral-800">
                            <div className="flex items-center justify-between border-b border-neutral-50 pb-4 dark:border-neutral-800">
                                <div>
                                    <p className="text-xs text-neutral-500 uppercase font-bold">Order Number</p>
                                    <p className="font-medium">#{order.orderId}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-neutral-500 uppercase font-bold text-right">Date</p>
                                    <p className="font-medium">{new Date(order.orderDate).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-neutral-500 uppercase font-bold">Status</p>
                                    <span className="inline-block mt-1 rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-600 dark:bg-blue-900/30">
                                        {order.orderStatus}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs text-neutral-500 uppercase font-bold">Total</p>
                                    <p className="text-lg font-bold">₹{order.totalAmount}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <p className="text-neutral-500">You haven't placed any orders yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
