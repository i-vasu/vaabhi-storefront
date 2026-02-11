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
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY!,
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
                    color: '#8B0000' // Heritage Red
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
            className="mt-6 w-full rounded-[2rem] bg-heritage-red py-6 text-[10px] font-black uppercase tracking-[0.4em] text-white transition-all hover:bg-heritage-gold hover:text-heritage-black shadow-[0_10px_30px_rgba(139,0,0,0.3)] disabled:opacity-50 active:scale-95"
            disabled={loading}
        >
            {loading ? 'INITIALIZING SETTLEMENT...' : 'SETTLE SECURELY'}
        </button>
    );
}
