'use client';

import { cancelOrder } from 'lib/backend';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function CancelOrderButton({ orderId, email }: { orderId: number; email: string }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleCancel = async () => {
        if (!confirm('Are you sure you want to cancel this order? This action cannot be undone.')) return;

        setLoading(true);
        try {
            await cancelOrder(email, orderId);
            toast.success('Order cancelled successfully');
            router.refresh();
        } catch (err: any) {
            console.error('Order cancellation failed:', err);
            toast.error(err.message || 'Failed to cancel order. Please contact support.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleCancel}
            disabled={loading}
            className="text-xs font-black uppercase tracking-widest text-red-600 hover:text-red-700 disabled:opacity-50"
        >
            {loading ? 'Processing...' : 'Cancel Order'}
        </button>
    );
}
