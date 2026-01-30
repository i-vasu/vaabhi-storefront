'use client';

import { createPaymentOrder, verifyPayment } from 'lib/backend';
import { useEffect, useState } from 'react';

interface RazorpayOptions {
    key: string;
    amount: number;
    currency: string;
    name: string;
    description: string;
    order_id: string;
    handler: (response: any) => void;
    prefill: {
        name?: string;
        email?: string;
        contact?: string;
    };
    theme: {
        color: string;
    };
}

export default function RazorpayButton({
    orderId,
    email,
    amount,
    onSuccess,
    onError
}: {
    orderId: number;
    email: string;
    amount: number;
    onSuccess: (response: any) => void;
    onError: (err: string) => void;
}) {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        script.async = true;
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const handlePayment = async () => {
        setLoading(true);
        try {
            const res = await createPaymentOrder(orderId);
            if (!res.success) throw new Error(res.data || 'Failed to create payment order');

            const options: RazorpayOptions = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY || 'rzp_test_6XNqE6Lq6f6f6f', // Fallback for POC
                amount: amount * 100, // Amount in paise
                currency: 'INR',
                name: 'Vaabhi Store',
                description: `Order #${orderId}`,
                order_id: res.data,
                handler: async (response: any) => {
                    try {
                        await verifyPayment(
                            orderId,
                            response.razorpay_payment_id,
                            response.razorpay_signature
                        );
                        onSuccess(response);
                    } catch (err) {
                        onError('Payment verification failed');
                    }
                },
                prefill: {
                    email: email
                },
                theme: {
                    color: '#2563eb' // Blue-600
                }
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
        } catch (err: any) {
            onError(err.message || 'Payment initiation failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handlePayment}
            className="mt-6 w-full rounded-full bg-blue-600 p-3 text-center text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
            disabled={loading}
        >
            {loading ? 'Initializing...' : 'Pay with Razorpay'}
        </button>
    );
}
