
import { getUserReturns } from 'lib/backend';
import Link from 'next/link';

export default async function ReturnsPage() {
    const returns = await getUserReturns();

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Returns & Exchanges</h1>
                <p className="text-neutral-500">Track and manage your return requests.</p>
            </div>

            {returns.length === 0 ? (
                <div className="rounded-2xl border border-neutral-100 bg-neutral-50 px-8 py-12 text-center dark:border-neutral-800 dark:bg-black">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-3xl dark:bg-blue-900/20">
                        📦
                    </div>
                    <h2 className="text-xl font-bold">No Active Returns</h2>
                    <p className="mt-2 text-sm text-neutral-500">
                        You don't have any active return or exchange requests at the moment.
                    </p>
                    <Link
                        href="/account/orders"
                        className="mt-8 inline-block rounded-full bg-black px-8 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 dark:bg-white dark:text-black"
                    >
                        Return an Item
                    </Link>
                </div>
            ) : (
                <div className="grid gap-4">
                    {returns.map((request: any) => (
                        <div key={request.returnRequestId} className="rounded-2xl border border-neutral-100 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-bold">Return Request #{request.returnRequestId}</p>
                                    <p className="text-xs text-neutral-500">Order #{request.order?.orderId} • {new Date(request.createdAt).toLocaleDateString()}</p>
                                </div>
                                <span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-tighter ${request.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                                    {request.status}
                                </span>
                            </div>
                            <div className="mt-4 flex items-center justify-between border-t border-neutral-50 pt-4 dark:border-neutral-800">
                                <p className="text-sm text-neutral-500">{request.items?.length} Items • {request.reason}</p>
                                <p className="font-bold">Refund: ₹{request.refundAmount}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="rounded-2xl border border-neutral-100 p-8 dark:border-neutral-800">
                <h3 className="mb-4 text-lg font-bold">Our Return Policy</h3>
                <ul className="list-disc space-y-2 pl-6 text-sm text-neutral-600 dark:text-neutral-400">
                    <li>Items must be returned within 15 days of delivery.</li>
                    <li>Garments must be unworn, unwashed, and have original tags attached.</li>
                    <li>Personalized and custom-designed items are not eligible for return.</li>
                    <li>Refunds are processed within 5-7 business days of receipt.</li>
                </ul>
            </div>
        </div>
    );
}
