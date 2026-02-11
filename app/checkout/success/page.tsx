
import { ArrowRightIcon, CheckCircleIcon, SparklesIcon } from '@heroicons/react/24/solid';
import Price from "components/price";
import { getImageUrl, getOrderById, getProducts, verifyPayment } from "lib/backend";
import { cookies } from "next/headers";
import Image from "next/image";
import Link from "next/link";

export default async function CheckoutSuccessPage({
    searchParams
}: {
    searchParams: {
        id?: string;
        razorpay_payment_id?: string;
        razorpay_order_id?: string;
        razorpay_signature?: string;
    };
}) {
    const orderId = searchParams.id;
    const cookieStore = await cookies();
    const userCookie = cookieStore.get("vaabhi_user")?.value;
    const user = userCookie ? JSON.parse(decodeURIComponent(userCookie)) : null;
    const email = user?.email || "customer@example.com";

    let order = null;
    let verificationError = false;

    if (orderId && searchParams.razorpay_payment_id && searchParams.razorpay_signature) {
        try {
            const verification = await verifyPayment(
                Number(orderId),
                searchParams.razorpay_payment_id,
                searchParams.razorpay_signature
            );
            if (verification && (verification.status === "error" || verification.success === false)) {
                verificationError = true;
            }
        } catch (e) {
            console.error("Payment verification failed:", e);
            verificationError = true;
        }
    }

    if (orderId && !verificationError) {
        order = await getOrderById(email, Number(orderId));
    }

    // Recommendations for Post-Purchase Lookbook
    const recommendations = await getProducts({});

    return (
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
            <div className="mx-auto max-w-3xl text-center mb-16">
                <div className="mb-8 flex justify-center">
                    <div className="relative">
                        <CheckCircleIcon className={`h-24 w-24 ${verificationError ? 'text-heritage-red' : 'text-heritage-gold'}`} />
                        <div className="absolute inset-0 animate-ping rounded-full border-4 border-heritage-gold/20 scale-150" />
                    </div>
                </div>
                
                {verificationError ? (
                    <>
                        <h1 className="mb-6 text-5xl font-black uppercase tracking-tight text-heritage-red">Verification Pending</h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-heritage-black/40">
                            The Scribe is reviewing your settlement for Order #{orderId}.
                        </p>
                    </>
                ) : (
                    <>
                        <h1 className="mb-6 text-5xl font-black uppercase tracking-tight text-heritage-red">Acquisition Secured</h1>
                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-heritage-black/40">
                            Your treasures are being curated at our atelier. Welcome to the VAABHI Circle.
                        </p>
                    </>
                )}
            </div>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                {/* Order Summary Recap */}
                <div className="lg:col-span-2">
                    {order && !verificationError ? (
                        <div className="overflow-hidden rounded-[3rem] border-2 border-heritage-gold/20 bg-white shadow-2xl">
                            <div className="bg-heritage-red p-10 flex items-center justify-between text-white">
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-heritage-gold-light/60">Order Dossier</p>
                                    <p className="text-3xl font-black tracking-tighter">#{order.orderId}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-heritage-gold-light/60">Confirmation Date</p>
                                    <p className="text-lg font-black uppercase tracking-widest">{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                </div>
                            </div>

                            <div className="p-10 space-y-10">
                                {order.orderItems?.map((item: any) => (
                                    <div key={item.orderItemId} className="flex gap-8 items-center group">
                                        <div className="relative h-32 w-24 flex-none overflow-hidden rounded-2xl bg-heritage-cream">
                                            <Image
                                                src={getImageUrl(item.product?.image)}
                                                alt={item.product?.productName}
                                                fill
                                                className="object-cover transition-transform group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xl font-black uppercase tracking-tight text-heritage-black">{item.product?.productName}</p>
                                            <p className="mt-2 text-[10px] font-black uppercase tracking-widest text-heritage-black/40">Procurement Qty: {item.quantity}</p>
                                        </div>
                                        <div className="text-right">
                                            <Price
                                                className="text-xl font-black text-heritage-red"
                                                amount={item.orderedProductPrice.toString()}
                                                currencyCode="INR"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="bg-heritage-cream/30 p-10 border-t-2 border-heritage-gold/20">
                                <div className="flex justify-between items-center">
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-heritage-black/40">Total Settlement</span>
                                    <Price
                                        className="text-4xl font-black tracking-tighter text-heritage-black"
                                        amount={order.totalAmount.toString()}
                                        currencyCode="INR"
                                    />
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex h-96 items-center justify-center rounded-[3rem] border-2 border-dashed border-heritage-gold/20 bg-heritage-cream/10">
                            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-heritage-black/40 animate-pulse">Syncing with our global logistics...</p>
                        </div>
                    )}
                </div>

                {/* AI Stylist & Engagement Sidebar */}
                <div className="space-y-8">
                    <div className="rounded-[3rem] bg-heritage-black p-10 text-white shadow-2xl relative overflow-hidden group">
                        <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-full bg-heritage-red shadow-lg group-hover:bg-heritage-gold group-hover:text-heritage-black transition-all">
                            <SparklesIcon className="h-7 w-7" />
                        </div>
                        <h3 className="mb-4 text-2xl font-black uppercase tracking-tighter text-heritage-gold">The AI Atelier</h3>
                        <p className="mb-10 text-xs text-white/60 font-medium leading-relaxed uppercase tracking-wider">
                            Need inspiration on how to style your new acquisition? Our AI Atelier can curate the perfect ensemble for your next grand entrance.
                        </p>
                        <Link
                            href="/ai-stylist"
                            className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-heritage-red py-6 text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:bg-heritage-gold hover:text-heritage-black shadow-xl active:scale-95"
                        >
                            Start Styling
                            <ArrowRightIcon className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                    </div>

                    <div className="rounded-[3rem] border-2 border-heritage-gold/20 bg-white p-10 shadow-xl">
                        <h4 className="mb-8 text-[10px] font-black uppercase tracking-[0.3em] text-heritage-black/40">Complete the Dossier</h4>
                        <div className="space-y-8">
                            {recommendations.slice(0, 3).map((prod) => (
                                <Link key={prod.id} href={`/product/${prod.handle}`} className="flex items-center gap-5 group">
                                    <div className="h-16 w-12 overflow-hidden rounded-xl bg-heritage-cream flex-none">
                                        <img src={prod.featuredImage?.url} alt={prod.title} className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all active:scale-95" />
                                    </div>
                                    <div className="flex-1 overflow-hidden">
                                        <p className="truncate text-[10px] font-black uppercase tracking-widest text-heritage-black group-hover:text-heritage-red transition-colors">{prod.title}</p>
                                        <p className="text-[10px] text-heritage-black/40 font-bold uppercase mt-1">₹{prod.priceRange.minVariantPrice.amount}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                        <Link href="/search" className="mt-10 block text-center text-[10px] font-black uppercase tracking-[0.3em] text-heritage-red hover:text-heritage-gold transition-colors">View Sacred Collection</Link>
                    </div>
                </div>
            </div>

            <div className="mt-20 flex flex-col sm:flex-row justify-center gap-8">
                <Link
                    href="/account/orders"
                    className="group inline-flex items-center justify-center gap-4 rounded-2xl border-2 border-heritage-black px-12 py-6 text-[10px] font-black uppercase tracking-[0.3em] transition-all hover:bg-heritage-black hover:text-white active:scale-95"
                >
                    Review Dossiers
                </Link>
                <Link
                    href="/"
                    className="inline-flex justify-center rounded-2xl bg-heritage-red px-12 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white transition-all hover:bg-heritage-gold hover:text-heritage-black shadow-[0_10px_30px_rgba(139,0,0,0.3)] active:scale-95"
                >
                    Continue Journey
                </Link>
            </div>
        </div>
    );
}
