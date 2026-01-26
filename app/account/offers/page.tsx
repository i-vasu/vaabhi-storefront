import CopyButton from 'components/account/copy-button';
import { getActiveCoupons } from 'lib/backend';
import Link from 'next/link';

export default async function CouponsPage() {
    const coupons = await getActiveCoupons();

    return (
        <div className="mx-auto max-w-4xl space-y-8">
            <header>
                <h1 className="text-3xl font-bold tracking-tight">Active Offers</h1>
                <p className="text-neutral-500">Curated discounts and seasonal rewards just for you.</p>
            </header>

            <div className="grid gap-6 md:grid-cols-2">
                {coupons.length === 0 ? (
                    <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-neutral-100 p-12 text-center dark:border-neutral-800">
                        <div className="mb-4 text-4xl">🎫</div>
                        <p className="font-medium text-neutral-500">No active offers right now. Check back soon!</p>
                    </div>
                ) : (
                    coupons.map((coupon: any) => (
                        <div
                            key={coupon.couponId}
                            className="group relative overflow-hidden rounded-3xl border border-neutral-100 bg-white p-8 shadow-sm transition-all hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900"
                        >
                            <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-neutral-50 dark:bg-black" />
                            <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-neutral-50 dark:bg-black" />

                            <div className="flex flex-col items-center justify-center text-center">
                                <span className="text-xs font-black uppercase tracking-[0.3em] text-neutral-400">Exclusive Code</span>
                                <p className="mt-2 text-3xl font-black text-black dark:text-white">{coupon.couponCode}</p>
                                <div className="mt-4 flex flex-col items-center">
                                    <p className="text-lg font-bold text-blue-600">
                                        {coupon.discountType === 'PERCENTAGE' ? `${coupon.discountValue}% OFF` : `₹${coupon.discountValue} OFF`}
                                    </p>
                                    <p className="mt-1 text-xs text-neutral-500">Valid on orders above ₹{coupon.minOrderAmount}</p>
                                </div>
                            </div>

                            <div className="mt-8 border-t border-dashed border-neutral-100 pt-6 dark:border-neutral-800">
                                <CopyButton code={coupon.couponCode} />
                            </div>
                        </div>
                    ))
                )}
            </div>

            <div className="flex justify-center pt-6">
                <Link href="/account" className="text-sm font-medium text-blue-600 hover:underline">
                    ← Back to Account Dashboard
                </Link>
            </div>
        </div>
    );
}
