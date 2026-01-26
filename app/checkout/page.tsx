
'use client';

import { useCart } from 'components/cart/cart-context';
import { createOrderAction } from 'components/checkout/actions';
import HyperswitchButton from 'components/checkout/HyperswitchButton';
import RazorpayButton from 'components/checkout/RazorpayButton';
import { AddressDTO, getAddresses } from 'lib/backend';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CheckoutPage() {
    const { cart } = useCart();
    const router = useRouter();
    const [addresses, setAddresses] = useState<AddressDTO[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [saveAddress, setSaveAddress] = useState(false);
    const [orderInfo, setOrderInfo] = useState<{ id: number; total: number; email: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [formValues, setFormValues] = useState({
        email: '',
        address: '',
        city: '',
        pincode: '',
        state: ''
    });
    const [paymentGateway, setPaymentGateway] = useState<'razorpay' | 'hyperswitch'>('hyperswitch');

    useEffect(() => {
        getAddresses().then(setAddresses);

        // Auto-fill email from cookie if available
        const match = document.cookie.match(new RegExp('(^| )vaabhi_user=([^;]+)'));
        if (match) {
            try {
                const user = JSON.parse(decodeURIComponent(match[2]));
                if (user.email) setFormValues(v => ({ ...v, email: user.email }));
            } catch (e) { }
        }
    }, []);

    const handleAddressSelect = (addr: any) => {
        setSelectedAddressId(addr.addressId);
        setFormValues({
            ...formValues,
            address: `${addr.buildingName || addr.building || addr.buildingNo || ''}, ${addr.street}`,
            city: addr.city,
            pincode: addr.pincode,
            state: addr.state
        });
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!cart) return;

        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const res = await createOrderAction(formData, Number(cart.id), paymentGateway.toUpperCase());

        if (res.success) {
            setOrderInfo({
                id: res.order.orderId,
                total: res.order.totalAmount,
                email: formData.get('email') as string
            });
        } else {
            setError(res.error || 'Failed to place order');
        }
        setLoading(false);
    };

    if (orderInfo) {
        return (
            <div className="mx-auto max-w-2xl px-4 py-8 text-center">
                <h1 className="mb-4 text-3xl font-bold">Complete Your Payment</h1>
                <p className="mb-8 text-neutral-500">Order ID: #{orderInfo.id} | Total: ₹{orderInfo.total}</p>

                <div className="mx-auto max-w-sm rounded-lg border border-neutral-200 p-8 dark:border-neutral-700">
                    <p className="mb-6 text-sm">Please pay to confirm your order via <strong>{paymentGateway}</strong>.</p>

                    {paymentGateway === 'razorpay' ? (
                        <RazorpayButton
                            orderId={orderInfo.id}
                            email={orderInfo.email}
                            amount={orderInfo.total}
                            onSuccess={() => router.push(`/checkout/success?id=${orderInfo.id}`)}
                            onError={(err) => setError(err)}
                        />
                    ) : (
                        <HyperswitchButton
                            orderId={orderInfo.id}
                            amount={orderInfo.total}
                            onSuccess={() => router.push(`/checkout/success?id=${orderInfo.id}`)}
                            onError={(err) => setError(err)}
                        />
                    )}

                    <button
                        onClick={() => setOrderInfo(null)}
                        className="mt-4 text-xs text-neutral-500 underline"
                    >
                        Change Payment Method
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-2xl px-4 py-8">
            <h1 className="mb-8 text-3xl font-bold">Checkout</h1>

            {error && (
                <div className="mb-6 rounded-md bg-red-50 p-4 text-sm text-red-600 dark:bg-red-900/20">
                    {error}
                </div>
            )}

            {addresses.length > 0 && (
                <div className="mb-6 rounded-lg border border-neutral-200 p-6 dark:border-neutral-700">
                    <h2 className="mb-4 text-xl font-semibold">Saved Addresses</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        {addresses.map((addr) => (
                            <button
                                key={addr.addressId}
                                type="button"
                                onClick={() => handleAddressSelect(addr)}
                                className={`rounded-lg border p-4 text-left transition-all ${selectedAddressId === addr.addressId ? 'border-black bg-neutral-50 dark:border-white dark:bg-neutral-800' : 'border-neutral-200 hover:border-neutral-400 dark:border-neutral-700'}`}
                            >
                                <p className="text-sm font-bold">{addr.building || addr.buildingNo}, {addr.street}</p>
                                <p className="text-xs text-neutral-500">{addr.city}, {addr.state} - {addr.pincode}</p>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-700">
                    <h2 className="mb-4 text-xl font-semibold">Contact & Shipping</h2>

                    <div className="grid gap-4">
                        <div>
                            <label className="mb-1 block text-sm text-neutral-500">Email</label>
                            <input
                                required
                                name="email"
                                type="email"
                                value={formValues.email}
                                onChange={handleInputChange}
                                placeholder="you@example.com"
                                className="w-full rounded-md border border-neutral-200 p-2 dark:border-neutral-700 dark:bg-black"
                            />
                        </div>

                        <div>
                            <label className="mb-1 block text-sm text-neutral-500">Address</label>
                            <input
                                required
                                name="address"
                                type="text"
                                value={formValues.address}
                                onChange={handleInputChange}
                                placeholder="123 Main St"
                                className="w-full rounded-md border border-neutral-200 p-2 dark:border-neutral-700 dark:bg-black"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="mb-1 block text-sm text-neutral-500">City</label>
                                <input
                                    required
                                    name="city"
                                    type="text"
                                    value={formValues.city}
                                    onChange={handleInputChange}
                                    placeholder="Mumbai"
                                    className="w-full rounded-md border border-neutral-200 p-2 dark:border-neutral-700 dark:bg-black"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-sm text-neutral-500">Pincode</label>
                                <input
                                    required
                                    name="pincode"
                                    type="text"
                                    value={formValues.pincode}
                                    onChange={handleInputChange}
                                    placeholder="400001"
                                    className="w-full rounded-md border border-neutral-200 p-2 dark:border-neutral-700 dark:bg-black"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {cart && (
                    <div className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-700">
                        <h2 className="mb-4 text-xl font-semibold">Payment Method</h2>
                        <div className="flex gap-4">
                            <button
                                type="button"
                                onClick={() => setPaymentGateway('hyperswitch')}
                                className={`flex-1 rounded-md border p-3 text-sm font-medium transition-all ${paymentGateway === 'hyperswitch' ? 'border-slate-900 bg-slate-50' : 'border-neutral-200'}`}
                            >
                                Hyperswitch (Global)
                            </button>
                            <button
                                type="button"
                                onClick={() => setPaymentGateway('razorpay')}
                                className={`flex-1 rounded-md border p-3 text-sm font-medium transition-all ${paymentGateway === 'razorpay' ? 'border-blue-600 bg-blue-50' : 'border-neutral-200'}`}
                            >
                                Razorpay
                            </button>
                        </div>
                    </div>
                )}

                {cart && (
                    <div className="rounded-lg border border-neutral-200 p-6 dark:border-neutral-700">
                        <h2 className="mb-4 text-xl font-semibold">Order Summary</h2>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-neutral-500">Subtotal</span>
                                <span>₹{cart.cost.subtotalAmount.amount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-neutral-500">GST (12%)</span>
                                <span>₹{cart.cost.totalTaxAmount.amount}</span>
                            </div>
                            <div className="flex justify-between border-t border-neutral-100 pt-2 font-bold dark:border-neutral-800">
                                <span>Total</span>
                                <span>₹{cart.cost.totalAmount.amount}</span>
                            </div>
                        </div>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading || !cart}
                    className="mt-6 w-full rounded-full bg-blue-600 p-3 text-center text-sm font-medium text-white hover:opacity-90 disabled:opacity-50"
                >
                    {loading ? 'Processing...' : 'Place Order'}
                </button>
            </form>
        </div>
    );
}
