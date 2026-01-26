import { getCurrentUser } from 'lib/auth-utils';
import { getOrderHistory } from 'lib/backend';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReturnForm from './ReturnForm';

export default async function ReturnPage({ params }: { params: { id: string } }) {
    const user = await getCurrentUser();
    const email = user?.email || 'customer@example.com';
    const orderId = params.id;

    const orders = await getOrderHistory(email);
    const order = orders.find(o => o.orderId.toString() === orderId);

    if (!order) {
        notFound();
    }

    return (
        <div className="mx-auto max-w-2xl space-y-8 py-12">
            <header>
                <Link href={`/account/orders/${orderId}`} className="text-sm font-medium text-neutral-500 hover:underline">← Back to Order</Link>
                <h1 className="mt-4 text-3xl font-bold tracking-tight">Return Request</h1>
                <p className="text-neutral-500">Tell us why you're returning order #{orderId}.</p>
            </header>

            <ReturnForm orderId={Number(orderId)} items={order.orderItems || []} />
        </div>
    );
}
