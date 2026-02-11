
import CancelOrderButton from 'components/account/CancelOrderButton';
import Price from 'components/price';
import { getCurrentUser } from 'lib/auth-utils';
import { getImageUrl, getOrderHistory } from 'lib/backend';
import { CalendarIcon, MapPinIcon, ShieldCheckIcon, Sparkles } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function OrderDetailPage({ params }: { params: { id: string } }) {
    const user = await getCurrentUser();
    const email = user?.email || 'customer@example.com';

    const orders = await getOrderHistory(email);
    const order = orders.find(o => o.orderId.toString() === params.id);

    if (!order) {
        notFound();
    }

    const statusSteps = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED'];
    const currentStepIndex = statusSteps.indexOf(order.orderStatus);

    return (
        <div className="mx-auto max-w-5xl space-y-12 pb-24">
            {/* Header */}
            <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between border-b border-neutral-100 pb-10 dark:border-neutral-800">
                <div>
                    <Link href="/account/orders" className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2 mb-4">
                        ← Return to Acquisitions
                    </Link>
                    <h1 className="text-4xl font-black tracking-tight uppercase font-serif">Order Dossier</h1>
                    <div className="mt-4 flex flex-wrap gap-6">
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500">
                             <span className="text-neutral-300">#</span>
                             <span className="text-black dark:text-white">{order.orderId}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-neutral-500">
                             <CalendarIcon className="h-4 w-4" />
                             <span>{new Date(order.orderDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</span>
                        </div>
                    </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                    <span className="inline-flex items-center gap-2 rounded-full bg-black px-6 py-2 text-[10px] font-black uppercase tracking-widest text-white dark:bg-white dark:text-black">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
                        {order.orderStatus}
                    </span>
                    {(order.orderStatus === 'PENDING' || order.orderStatus === 'PAID') && (
                        <CancelOrderButton orderId={order.orderId} email={email} />
                    )}
                </div>
            </header>

            {/* Tracking Progress */}
            <section className="relative rounded-[2.5rem] border border-neutral-100 bg-neutral-50/50 p-10 dark:border-neutral-800 dark:bg-neutral-900/30 overflow-hidden">
                <div className="flex flex-col md:flex-row justify-between gap-8 relative z-10">
                    {statusSteps.map((step, idx) => {
                        const isDone = idx < currentStepIndex;
                        const isCurrent = idx === currentStepIndex;
                        const isFuture = idx > currentStepIndex;
                        return (
                            <div key={step} className="flex-1 group">
                                <div className="flex items-center gap-4 md:flex-col md:items-start md:gap-3">
                                    <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-500 ${
                                        isDone ? 'border-luxury-gold bg-luxury-gold text-black' : 
                                        isCurrent ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black scale-110 shadow-xl' : 
                                        'border-neutral-200 text-neutral-300 dark:border-neutral-800'
                                    }`}>
                                        {isDone ? '✓' : idx + 1}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${isFuture ? 'text-neutral-400' : 'text-black dark:text-white'}`}>
                                            {step}
                                        </span>
                                        <p className="hidden md:block text-[9px] text-neutral-500 uppercase tracking-widest mt-1">
                                            {step === 'PAID' ? 'Atelier Review' : step === 'SHIPPED' ? 'En Route' : 'Awaiting Arrival'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                {/* Connector Line for Desktop */}
                <div className="absolute top-[3.75rem] left-20 right-20 h-px bg-neutral-200 dark:bg-neutral-800 hidden md:block" />
            </section>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                {/* Line Items */}
                <div className="lg:col-span-2 space-y-8">
                    <section className="overflow-hidden rounded-[2.5rem] border border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="border-b border-neutral-100 p-8 dark:border-neutral-800 flex items-center justify-between">
                             <h2 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400">Items Selection</h2>
                             <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">{order.orderItems?.length} Products</span>
                        </div>
                        <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                            {order.orderItems?.map((item: any) => (
                                <div key={item.orderItemId} className="p-8 flex items-center gap-6 group">
                                    <div className="h-28 w-20 flex-none bg-neutral-100 rounded-xl dark:bg-neutral-800 overflow-hidden relative">
                                        <Image
                                            src={getImageUrl(item.product?.image)}
                                            alt={item.product?.productName || 'Product'}
                                            fill
                                            className="object-cover transition-transform group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-serif text-lg font-bold">{item.product?.productName || 'Unnamed Masterpiece'}</p>
                                        <div className="mt-2 flex items-center gap-4">
                                            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Qty: {item.quantity}</p>
                                            <div className="h-1 w-1 rounded-full bg-neutral-300" />
                                            <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Verified</p>
                                        </div>
                                    </div>
                                    <Price 
                                        className="font-serif text-lg font-bold"
                                        amount={(item.orderedProductPrice * item.quantity).toString()}
                                        currencyCode="INR"
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="bg-neutral-50 p-8 dark:bg-neutral-950/50">
                            <div className="space-y-4">
                                <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-neutral-500">
                                    <span>Subtotal</span>
                                    <span>₹{(order.totalAmount - (order.discountAmount || 0)).toFixed(2)}</span>
                                </div>
                                {order.discountAmount > 0 && (
                                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-luxury-gold">
                                        <span>Patron Benefit ({order.couponCode})</span>
                                        <span>-₹{order.discountAmount}</span>
                                    </div>
                                )}
                                <div className="flex justify-between border-t border-neutral-100 dark:border-neutral-800 pt-6">
                                    <span className="text-xs font-black uppercase tracking-[0.2em]">Total Investment</span>
                                    <Price 
                                        className="font-serif text-3xl font-black"
                                        amount={order.totalAmount.toString()}
                                        currencyCode="INR"
                                    />
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Sidebar Details */}
                <div className="space-y-8">
                    {/* Shipping Address */}
                    <div className="rounded-[2.5rem] border border-neutral-100 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="mb-6 flex items-center gap-3">
                             <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                                <MapPinIcon className="h-4 w-4" />
                             </div>
                             <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Destination</h3>
                        </div>
                        <p className="font-serif text-lg font-bold leading-relaxed">
                            {user?.name || 'Valued Patron'}<br />
                            Athenaeum Heights, Floor 12<br />
                            Whitefield, Bengaluru<br />
                            560066
                        </p>
                    </div>

                    {/* AI Care Instructions */}
                    <div className="rounded-[2.5rem] bg-black p-8 text-white dark:bg-white dark:text-black shadow-2xl">
                         <div className="mb-6 flex items-center justify-between">
                             <div className="flex h-10 w-10 items-center justify-center rounded-full bg-luxury-gold">
                                <Sparkles className="h-5 w-5 text-black" />
                             </div>
                             <span className="text-[8px] font-black uppercase tracking-widest bg-white/10 dark:bg-black/10 px-3 py-1 rounded-full">AI Care Guide</span>
                         </div>
                         <h3 className="mb-4 font-serif text-xl font-bold uppercase">Heritage Preservation</h3>
                         <div className="space-y-4">
                              <p className="text-[10px] leading-relaxed text-neutral-400 dark:text-neutral-500">
                                Based on your acquisition's weave (Silk/Zari), our AI recommends:
                              </p>
                              <div className="flex gap-4">
                                   <div className="flex-1 rounded-2xl bg-white/5 dark:bg-black/5 p-4 border border-white/10 dark:border-black/10">
                                        <p className="text-[10px] font-black uppercase tracking-wider mb-2">Storage</p>
                                        <p className="text-[9px] text-neutral-500">Muslin wrap only. Avoid direct scent contact.</p>
                                   </div>
                                   <div className="flex-1 rounded-2xl bg-white/5 dark:bg-black/5 p-4 border border-white/10 dark:border-black/10">
                                        <p className="text-[10px] font-black uppercase tracking-wider mb-2">Resting</p>
                                        <p className="text-[9px] text-neutral-500">Rotate folds every 3 months to preserve fiber.</p>
                                   </div>
                              </div>
                         </div>
                    </div>

                    {/* Support & Warranty */}
                    <div className="rounded-[2.5rem] border border-neutral-200 bg-neutral-50 p-8 dark:border-neutral-800 dark:bg-neutral-950">
                        <div className="flex items-center gap-2 mb-4">
                             <ShieldCheckIcon className="h-4 w-4 text-luxury-gold" />
                             <span className="text-[10px] font-black uppercase tracking-[0.2em]">Authenticity Guaranteed</span>
                        </div>
                        <p className="text-[9px] uppercase tracking-widest text-neutral-500 leading-normal">
                             This acquisition includes an NFT-verified authenticity certificate available in your Digital Atelier soon.
                        </p>
                    </div>
                </div>
            </div>

            {order.orderStatus === 'DELIVERED' && (
                <section className="rounded-[3rem] bg-neutral-900 p-12 text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-luxury-gold/10 blur-[100px] rounded-full group-hover:bg-luxury-gold/20 transition-all" />
                    <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-10">
                        <div className="max-w-xl">
                            <h3 className="text-3xl font-serif font-black uppercase tracking-tight">Not a Perfect Match?</h3>
                            <p className="mt-4 text-sm text-neutral-400 font-medium leading-relaxed">
                                Our commitment to your satisfaction is as absolute as our craftsmanship. Initiate a return within 7 days for an effortless resolution.
                            </p>
                        </div>
                        <Link
                            href={`/account/orders/${order.orderId}/return`}
                            className="inline-flex justify-center items-center rounded-full bg-white px-12 py-5 text-[10px] font-black uppercase tracking-widest text-black hover:bg-luxury-gold transition-all shadow-xl hover:scale-105"
                        >
                            Request Return Dossier
                        </Link>
                    </div>
                </section>
            )}
        </div>
    );
}
