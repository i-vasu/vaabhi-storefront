
'use client';

import { useCart } from 'components/cart/cart-context';
import { createOrderAction } from 'components/checkout/actions';
import RazorpayButton from 'components/checkout/RazorpayButton';
import { AnimatePresence, motion } from 'framer-motion';
import { AddressDTO, calculateOrderTotal, getAddresses, updateCartAddress } from 'lib/backend';
import { ChevronRight, CreditCard, MapPin, ShieldCheck, ShoppingBag, Truck } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function CheckoutPage() {
    const { cart } = useCart();
    const router = useRouter();
    const [addresses, setAddresses] = useState<AddressDTO[]>([]);
    const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
    const [orderInfo, setOrderInfo] = useState<{ id: number; total: number; email: string } | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [calculating, setCalculating] = useState(false);
    const [formValues, setFormValues] = useState({
        email: '',
        address: '',
        city: '',
        pincode: '',
        state: '',
        phone: ''
    });
    const [couponCode, setCouponCode] = useState('');
    const [liveSummary, setLiveSummary] = useState<any>(null);
    const [paymentGateway, setPaymentGateway] = useState<'razorpay' | 'hyperswitch'>('razorpay');

    useEffect(() => {
        getAddresses().then(setAddresses);
        const match = document.cookie.match(new RegExp('(^| )vaabhi_user=([^;]+)'));
        const userCookie = match?.[2];
        if (userCookie) {
            try {
                const user = JSON.parse(decodeURIComponent(userCookie));
                if (user && user.email) setFormValues(v => ({ ...v, email: user.email }));
            } catch (e) { }
        }
    }, []);

    const refreshTotals = useCallback(async (stateValue?: string, couponValue?: string) => {
        if (!cart || cart.lines.length === 0) return;

        setCalculating(true);
        try {
            const input = {
                id: Number(cart.id),
                email: formValues.email,
                shippingState: stateValue || formValues.state || 'Maharashtra', // Default to operating state
                shippingZip: formValues.pincode,
                couponCode: couponValue !== undefined ? couponValue : couponCode,
                items: cart.lines.map(line => ({
                    productId: Number(line.merchandise.id),
                    itemCode: line.merchandise.product.handle,
                    price: Number(line.cost.totalAmount.amount) / line.quantity,
                    quantity: line.quantity
                }))
            };

            const summary = await calculateOrderTotal(input);
            setLiveSummary(summary);
        } catch (err) {
            console.error('Failed to calculate totals:', err);
        } finally {
            setCalculating(false);
        }
    }, [cart, formValues.email, formValues.pincode, formValues.state, couponCode]);

    // Refresh totals when address or coupon changes
    useEffect(() => {
        if (cart) {
            refreshTotals();
        }
    }, [cart, formValues.state, formValues.pincode]);

    const handleAddressSelect = (addr: any) => {
        setSelectedAddressId(addr.addressId);
        const newValues = {
            ...formValues,
            address: `${addr.buildingName || ''}, ${addr.street}`,
            city: addr.city,
            pincode: addr.pincode,
            state: addr.state,
            phone: addr.receiverPhoneNumber || ''
        };
        setFormValues(newValues);
        
        // Dynamic Pricing: Update address in backend to trigger tax recalculation
        if (cart) {
            updateCartAddress(Number(cart.id), addr.addressId)
                .then(() => refreshTotals(addr.state, couponCode))
                .catch(err => console.error('Failed to sync cart address:', err));
        }
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
        formData.append('couponCode', couponCode);
        const res = await createOrderAction(formData, Number(cart.id), paymentGateway.toUpperCase());

        if (res.success) {
            setOrderInfo({
                id: res.order.orderId,
                total: res.order.totalAmount,
                email: formData.get('email') as string
            });
        } else {
            setError(res.error || 'Failed to place order');
            toast.error(res.error || 'Failed to place order');
        }
        setLoading(false);
    };

    if (orderInfo) {
        return (
            <div className="mx-auto max-w-2xl px-6 py-20 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="rounded-[3rem] border border-neutral-100 bg-white p-12 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900"
                >
                    <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-heritage-red/5">
                        <CreditCard className="h-10 w-10 text-heritage-red" />
                    </div>
                    <h1 className="text-4xl font-black tracking-tight text-heritage-black">Final Step</h1>
                    <p className="mt-4 text-neutral-500 uppercase tracking-widest text-xs font-black">Secure Payment Required</p>
                    <div className="my-10 border-y border-neutral-50 py-8 dark:border-neutral-800">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-neutral-400">Order Reference</span>
                            <span className="font-bold">#{orderInfo.id}</span>
                        </div>
                        <div className="flex justify-between items-center mt-4 text-xl">
                            <span className="font-light text-heritage-black/60">Amount Due</span>
                            <span className="font-black text-heritage-red">₹{orderInfo.total}</span>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <RazorpayButton
                            orderId={orderInfo.id}
                            email={orderInfo.email}
                            amount={orderInfo.total}
                            onSuccess={(res) => {
                                const params = new URLSearchParams({ id: orderInfo.id.toString() });
                                if (res?.razorpay_payment_id) {
                                    params.append("razorpay_payment_id", res.razorpay_payment_id);
                                    params.append("razorpay_order_id", res.razorpay_order_id);
                                    params.append("razorpay_signature", res.razorpay_signature);
                                }
                                router.push(`/checkout/success?${params.toString()}`);
                            }}
                            onError={(err) => setError(err)}
                        />
                        <button
                            onClick={() => setOrderInfo(null)}
                            className="text-[10px] font-black uppercase tracking-widest text-heritage-black/40 hover:text-heritage-red transition-colors"
                        >
                            Modify Dossier
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-7xl px-6 py-12">
            <header className="mb-12">
                <h1 className="text-4xl font-black tracking-tighter uppercase md:text-6xl text-heritage-red">Maison Checkout</h1>
                <div className="mt-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.4em] text-heritage-black/40">
                    <span>Archive</span> <ChevronRight className="h-3 w-3" />
                    <span className="text-heritage-red">Procurement</span> <ChevronRight className="h-3 w-3" />
                    <span>Settlement</span>
                </div>
            </header>

            <form onSubmit={handleSubmit} className="grid gap-12 lg:grid-cols-12">
                {/* LEFT: Shipping Details */}
                <div className="lg:col-span-12 xl:col-span-8 space-y-10">
                    {error && (
                        <div className="rounded-2xl bg-red-50 p-4 text-sm font-bold text-red-600 dark:bg-red-900/20">
                            {error}
                        </div>
                    )}

                    {addresses.length > 0 && (
                        <section>
                            <label className="mb-4 block text-[10px] font-black uppercase tracking-widest text-neutral-400">Saved Concierge Addresses</label>
                            <div className="grid gap-4 sm:grid-cols-2">
                                {addresses.map((addr) => (
                                    <button
                                        key={addr.addressId}
                                        type="button"
                                        onClick={() => handleAddressSelect(addr)}
                                        className={`group relative overflow-hidden rounded-2xl border-2 p-6 text-left transition-all ${selectedAddressId === addr.addressId ? 'border-heritage-red bg-heritage-red/5' : 'border-heritage-gold/20 hover:border-heritage-gold bg-white'}`}
                                    >
                                        <p className="text-[11px] font-black uppercase tracking-widest text-heritage-black">{addr.buildingName || addr.street}</p>
                                        <p className="mt-2 text-xs font-medium text-heritage-black/60 uppercase tracking-wide">{addr.city}, {addr.state} - {addr.pincode}</p>
                                        {selectedAddressId === addr.addressId && (
                                            <div className="absolute right-4 top-4 h-2 w-2 rounded-full bg-heritage-red animate-pulse" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </section>
                    )}

                    <section className="space-y-8 rounded-[2.5rem] border-2 border-heritage-gold/20 bg-white p-10 shadow-xl">
                        <div className="flex items-center gap-4">
                            <Truck className="h-6 w-6 text-heritage-red" />
                            <h2 className="text-2xl font-black uppercase tracking-tighter text-heritage-black">Shipping Dossier</h2>
                        </div>

                        <div className="grid gap-8 sm:grid-cols-2">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Contact Email</label>
                                <input
                                    required
                                    name="email"
                                    type="email"
                                    value={formValues.email}
                                    onChange={handleInputChange}
                                    className="w-full border-b-2 border-heritage-gold/20 bg-transparent py-4 text-sm font-black uppercase tracking-widest outline-none focus:border-heritage-red transition-colors"
                                    placeholder="SOVEREIGN@VAABHI.COM"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Full Shipping Address</label>
                                <input
                                    required
                                    name="address"
                                    type="text"
                                    value={formValues.address}
                                    onChange={handleInputChange}
                                    className="w-full border-b-2 border-heritage-gold/20 bg-transparent py-4 text-sm font-black uppercase tracking-widest outline-none focus:border-heritage-red transition-colors"
                                    placeholder="ARCHIVE STREET, SUITE 101"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">City / Region</label>
                                <input
                                    required
                                    name="city"
                                    type="text"
                                    value={formValues.city}
                                    onChange={handleInputChange}
                                    className="w-full border-b-2 border-heritage-gold/20 bg-transparent py-4 text-sm font-black uppercase tracking-widest outline-none focus:border-heritage-red transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">State / Province</label>
                                <input
                                    required
                                    name="state"
                                    type="text"
                                    value={formValues.state}
                                    onChange={handleInputChange}
                                    className="w-full border-b-2 border-heritage-gold/20 bg-transparent py-4 text-sm font-black uppercase tracking-widest outline-none focus:border-heritage-red transition-colors"
                                    placeholder="STATE OF ORIGIN"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Postal Code</label>
                                <input
                                    required
                                    name="pincode"
                                    type="text"
                                    pattern="^[1-9][0-9]{5}$"
                                    title="Pincode must be 6 digits"
                                    value={formValues.pincode}
                                    onChange={handleInputChange}
                                    className="w-full border-b-2 border-heritage-gold/20 bg-transparent py-4 text-sm font-black uppercase tracking-widest outline-none focus:border-heritage-red transition-colors"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Phone Number</label>
                                <input
                                    required
                                    name="phone"
                                    type="tel"
                                    pattern="^[6-9]\d{9}$"
                                    title="Please enter a valid 10-digit mobile number"
                                    value={formValues.phone}
                                    onChange={handleInputChange}
                                    className="w-full border-b-2 border-heritage-gold/20 bg-transparent py-4 text-sm font-black uppercase tracking-widest outline-none focus:border-heritage-red transition-colors"
                                    placeholder="+91 00000 00000"
                                />
                            </div>
                        </div>
                    </section>

                    <div className="grid gap-6 sm:grid-cols-3">
                        <div className="flex items-center gap-3 rounded-2xl border border-heritage-gold/10 bg-white p-5 shadow-sm">
                            <ShieldCheck className="h-6 w-6 text-heritage-red" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-heritage-black">Secure Entry</span>
                        </div>
                        <div className="flex items-center gap-3 rounded-2xl border border-heritage-gold/10 bg-white p-5 shadow-sm">
                            <Truck className="h-6 w-6 text-heritage-red" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-heritage-black">Global Transit</span>
                        </div>
                        <div className="flex items-center gap-3 rounded-2xl border border-heritage-gold/10 bg-white p-5 shadow-sm">
                            <MapPin className="h-6 w-6 text-heritage-red" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-heritage-black">Origin Authenticated</span>
                        </div>
                    </div>

                    <section className="space-y-6 rounded-[2.5rem] border-2 border-heritage-gold/20 bg-white p-10 shadow-xl">
                        <h2 className="text-2xl font-black uppercase tracking-tighter text-heritage-black">Gift Options</h2>
                        <div className="flex items-start gap-6">
                            <input
                                name="isGift"
                                type="checkbox"
                                className="mt-1 h-6 w-6 rounded border-heritage-gold/20 text-heritage-red focus:ring-heritage-red bg-transparent cursor-pointer"
                            />
                            <div className="space-y-4 flex-1">
                                <label className="text-sm font-black uppercase tracking-widest text-heritage-black">Maison Gifting Service</label>
                                <p className="text-xs font-medium text-heritage-black/60 italic">Complimentary removal of price nodes and inclusion of a signature VAABHI message card.</p>
                                <textarea
                                    name="giftMessage"
                                    rows={3}
                                    placeholder="Compose your personal message here..."
                                    className="w-full rounded-2xl border-2 border-heritage-gold/20 bg-transparent p-5 text-sm font-medium outline-none focus:border-heritage-red transition-colors"
                                />
                            </div>
                        </div>
                    </section>
                    
                    <section className="space-y-6 rounded-[2.5rem] border-2 border-heritage-gold/20 bg-white p-10 shadow-xl">
                         <h2 className="text-2xl font-black uppercase tracking-tighter text-heritage-black">Delivery Logistics</h2>
                         <div className="grid gap-6 sm:grid-cols-2">
                            <label className="relative flex cursor-pointer items-start gap-4 rounded-2xl border-2 border-heritage-gold/10 p-6 hover:bg-heritage-red/5 transition-colors group">
                                <input type="radio" name="deliverySlot" value="standard" defaultChecked className="mt-1 h-5 w-5 text-heritage-red focus:ring-heritage-red bg-transparent" />
                                <div>
                                    <span className="block text-sm font-black uppercase tracking-widest text-heritage-black group-hover:text-heritage-red">Standard Archive</span>
                                    <span className="block text-xs font-medium text-heritage-black/40 mt-1 uppercase">3-5 Procurement Days</span>
                                </div>
                            </label>
                            <label className="relative flex cursor-pointer items-start gap-4 rounded-2xl border-2 border-heritage-gold/10 p-6 hover:bg-heritage-red/5 transition-colors group">
                                <input type="radio" name="deliverySlot" value="express" className="mt-1 h-5 w-5 text-heritage-red focus:ring-heritage-red bg-transparent" />
                                <div>
                                    <span className="block text-sm font-black uppercase tracking-widest text-heritage-black group-hover:text-heritage-red">Express Concierge</span>
                                    <span className="block text-xs font-medium text-heritage-black/40 mt-1 uppercase italic">Within 48 hours (+₹500)</span>
                                </div>
                            </label>
                         </div>
                    </section>
                </div>

                {/* RIGHT: Order Summary */}
                <div className="lg:col-span-12 xl:col-span-4 lg:sticky lg:top-8 h-fit">
                    <div className="rounded-[3rem] bg-heritage-black p-10 text-white shadow-2xl border border-heritage-gold/10">
                        <header className="flex items-center justify-between">
                            <h2 className="text-2xl font-black uppercase tracking-tighter text-heritage-gold">Order Manifest</h2>
                            <ShoppingBag className="h-6 w-6 text-heritage-red" />
                        </header>

                        {/* Item Manifest */}
                        <div className="mt-8 max-h-48 overflow-y-auto pr-2 space-y-4 custom-scrollbar">
                            {cart?.lines.map((line) => (
                                <div key={line.id} className="flex gap-4">
                                    <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-neutral-800">
                                        <Image
                                            src={line.merchandise.product.featuredImage.url}
                                            alt={line.merchandise.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[10px] font-black uppercase tracking-widest truncate">{line.merchandise.title}</p>
                                        <p className="mt-1 text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Qty: {line.quantity} × ₹{Number(line.cost.totalAmount.amount) / line.quantity}</p>
                                    </div>
                                    <span className="text-xs font-bold">₹{line.cost.totalAmount.amount}</span>
                                </div>
                            ))}
                        </div>

                        {/* Coupon Section */}
                        <div className="mt-10 pt-10 border-t border-heritage-gold/20">
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-heritage-gold/60">Privilege Recognition Code</label>
                            <div className="mt-4 flex gap-3">
                                <input
                                    type="text"
                                    name="coupon"
                                    id="couponInput"
                                    placeholder="ENTER CODE"
                                    value={couponCode}
                                    onChange={(e) => setCouponCode(e.target.value)}
                                    className="flex-1 rounded-2xl border-2 border-heritage-gold/10 bg-white/5 px-6 py-4 text-sm font-black uppercase tracking-widest outline-none focus:border-heritage-gold transition-colors"
                                />
                                <button
                                    type="button"
                                    disabled={calculating || !couponCode}
                                    onClick={() => refreshTotals(undefined, couponCode)}
                                    className="rounded-2xl bg-heritage-gold px-6 py-4 text-[10px] font-black uppercase tracking-widest text-heritage-black hover:bg-white transition-all disabled:opacity-50"
                                >
                                    Apply
                                </button>
                            </div>
                            {liveSummary?.discountTotal < 0 && (
                                <p className="mt-2 text-[10px] font-bold text-green-500 uppercase tracking-widest">
                                    ✓ Code {couponCode} Applied Successfully
                                </p>
                            )}
                        </div>

                        <div className="mt-8 space-y-4 border-b border-heritage-gold/20 pb-8">
                            <div className="flex justify-between text-sm">
                                <span className="text-neutral-400">Subtotal</span>
                                <span>₹{liveSummary?.subTotal || cart?.cost.subtotalAmount.amount}</span>
                            </div>

                            <AnimatePresence>
                                {liveSummary?.totals.map((total: any) => {
                                    if (total.code === 'subtotal' || total.code === 'total') return null;
                                    return (
                                        <motion.div
                                            key={total.code}
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="flex justify-between text-sm"
                                        >
                                            <span className="text-neutral-400">{total.title}</span>
                                            <span className={total.value < 0 ? 'text-green-500' : ''}>
                                                {total.value < 0 ? '-' : ''}₹{Math.abs(total.value)}
                                            </span>
                                        </motion.div>
                                    );
                                })}
                            </AnimatePresence>

                            {!liveSummary && (
                                <>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-400">Shipping</span>
                                        <span className="text-green-500">Complimentary</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-neutral-400">Maison Tax (Estimated)</span>
                                        <span>₹{cart?.cost.totalTaxAmount.amount}</span>
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="mt-10 pt-10 border-t border-heritage-gold/20 space-y-6">
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-heritage-gold/40">Total Settlement</span>
                                <span className={`text-4xl font-black tracking-tighter text-heritage-gold transition-all ${calculating ? 'opacity-30 blur-sm' : ''}`}>
                                    ₹{liveSummary?.total || cart?.cost.totalAmount.amount}
                                </span>
                            </div>

                            <button
                                type="submit"
                                disabled={loading || calculating || !cart}
                                className="w-full rounded-[2rem] bg-heritage-red py-6 text-[10px] font-black uppercase tracking-[0.4em] text-white transition-all hover:bg-heritage-gold hover:text-heritage-black shadow-[0_10px_30px_rgba(139,0,0,0.3)] hover:shadow-gold disabled:opacity-50 active:scale-95"
                            >
                                {loading ? 'Authorizing Dossier...' : 'Authorize Transaction'}
                            </button>
                        </div>

                        <p className="mt-6 text-center text-[9px] font-bold uppercase tracking-widest text-neutral-500 leading-relaxed">
                            By clicking, you agree to our terms of service and artisanal craftsmanship guidelines.
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
}
