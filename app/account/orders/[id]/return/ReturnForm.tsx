'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { handleReturnRequest } from '../../../actions';

export default function ReturnForm({ orderId, items }: { orderId: number, items: any[] }) {
    const [selectedItems, setSelectedItems] = useState<Record<number, boolean>>({});
    const [reason, setReason] = useState('');
    const [refundType, setRefundType] = useState('WALLET');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const toggleItem = (itemId: number) => {
        setSelectedItems(prev => ({ ...prev, [itemId]: !prev[itemId] }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const itemIds = Object.keys(selectedItems).filter(id => selectedItems[Number(id)]);

        if (itemIds.length === 0) {
            toast.error('Please select at least one item');
            return;
        }

        if (!reason) {
            toast.error('Please select a reason');
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append('reason', reason);
        formData.append('refundType', refundType);
        // In a real app we'd pass item details too

        try {
            const res = await handleReturnRequest(orderId, formData);
            if (res.success) {
                toast.success('Return request submitted!');
                router.push(`/account/orders/${orderId}`);
            } else {
                toast.error(res.error || 'Failed to submit return');
            }
        } catch (err) {
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">Select Items</h3>
                <div className="space-y-3">
                    {items.map((item) => (
                        <div key={item.orderItemId} className="rounded-2xl border border-neutral-100 p-6 dark:border-neutral-800">
                            <label className="flex items-center space-x-4 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={!!selectedItems[item.orderItemId]}
                                    onChange={() => toggleItem(item.orderItemId)}
                                    className="h-5 w-5 rounded border-gray-300 text-black focus:ring-black"
                                />
                                <div className="flex flex-1 items-center justify-between">
                                    <div>
                                        <p className="font-bold">{item.product?.productName || 'Product'}</p>
                                        <p className="text-xs text-neutral-500">Price: ₹{item.orderedProductPrice}</p>
                                    </div>
                                    <p className="font-medium text-neutral-500">Qty: {item.quantity}</p>
                                </div>
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">Reason for Return</h3>
                <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    required
                    className="w-full rounded-xl border border-neutral-200 bg-white p-4 text-sm dark:border-neutral-800 dark:bg-neutral-900 focus:ring-2 focus:ring-black outline-none"
                >
                    <option value="">Select a reason...</option>
                    <option value="DEFECTIVE">Defective / Damaged</option>
                    <option value="WRONG_ITEM">Wrong item received</option>
                    <option value="NOT_AS_DESCRIBED">Item not as described</option>
                    <option value="FIT_ISSUE">Size or Fit issue</option>
                    <option value="OTHER">Other</option>
                </select>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-400">Refund Method</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                    <label className={`relative flex cursor-pointer rounded-xl border p-4 transition-all ${refundType === 'WALLET' ? 'border-black bg-neutral-50 dark:border-white dark:bg-neutral-800' : 'border-neutral-200 dark:border-neutral-800'}`}>
                        <input
                            type="radio"
                            name="refund"
                            value="WALLET"
                            checked={refundType === 'WALLET'}
                            onChange={() => setRefundType('WALLET')}
                            className="mt-1"
                        />
                        <div className="ml-3">
                            <p className="text-sm font-bold">Store Wallet</p>
                            <p className="text-xs text-neutral-500">Instant credit (Recommended)</p>
                        </div>
                    </label>
                    <label className={`relative flex cursor-pointer rounded-xl border p-4 transition-all ${refundType === 'ORIGINAL' ? 'border-black bg-neutral-50 dark:border-white dark:bg-neutral-800' : 'border-neutral-200 dark:border-neutral-800'}`}>
                        <input
                            type="radio"
                            name="refund"
                            value="ORIGINAL"
                            checked={refundType === 'ORIGINAL'}
                            onChange={() => setRefundType('ORIGINAL')}
                            className="mt-1"
                        />
                        <div className="ml-3">
                            <p className="text-sm font-bold">Original Method</p>
                            <p className="text-xs text-neutral-500">5-7 business days</p>
                        </div>
                    </label>
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full rounded-full bg-black py-4 text-sm font-black uppercase tracking-[0.2em] text-white hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-black"
            >
                {loading ? 'Submitting...' : 'Submit Request'}
            </button>
        </form>
    );
}
