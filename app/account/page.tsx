import { GridTileImage } from 'components/grid/tile';
import { getOrderHistory, getRecentlyViewed, getRewardPoints, getUserProfile, getWalletDetails } from 'lib/backend';
import { cookies } from 'next/headers';
import Link from 'next/link';

export const metadata = {
    title: 'Account | Vaabhi Storefront',
    description: 'Manage your profile, orders, and rewards.'
};

export default async function AccountPage() {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('vaabhi_user')?.value;
    const user = userCookie ? JSON.parse(userCookie) : null;
    const email = user?.email || 'customer@example.com';
    const userId = user?.userId || user?.id || 1;

    const profile = await getUserProfile();
    const orders = await getOrderHistory(email);

    // Feature Parity: Wallet and Rewards
    const wallet = await getWalletDetails();
    const rewards = await getRewardPoints();
    const recentlyViewed = await getRecentlyViewed(userId, 4);
    return (
        <div className="space-y-10">
            <section>
                <h1 className="text-3xl font-bold tracking-tight">Bonjour, {profile?.firstName || 'Fashionista'}!</h1>
                <p className="mt-2 text-neutral-500">Your style hub. Manage orders, wallet, and rewards in one premium space.</p>
            </section>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Offers Card */}
                <div className="rounded-xl border border-neutral-100 bg-gradient-to-br from-white to-amber-50/30 p-6 shadow-sm dark:border-neutral-800 dark:from-neutral-900 dark:to-amber-900/10">
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">Your Offers</h3>
                    <p className="text-3xl font-bold text-amber-600">Rewards</p>
                    <div className="mt-4">
                        <Link href="/account/offers" className="text-sm font-medium hover:underline">
                            View Coupons →
                        </Link>
                    </div>
                </div>
                {/* Wallet Balance Card */}
                <div className="rounded-xl border border-neutral-100 bg-gradient-to-br from-white to-neutral-50 p-6 shadow-sm dark:border-neutral-800 dark:from-neutral-900 dark:to-black">
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">Wallet Balance</h3>
                    <p className="text-3xl font-bold text-blue-600">₹{wallet.balance.toFixed(2)}</p>
                    <div className="mt-4">
                        <Link href="/account/wallet" className="text-sm font-medium hover:underline">
                            View Transactions →
                        </Link>
                    </div>
                </div>

                {/* Reward Points Card */}
                <div className="rounded-xl border border-neutral-100 bg-gradient-to-br from-white to-neutral-50 p-6 shadow-sm dark:border-neutral-800 dark:from-neutral-900 dark:to-black">
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">Reward Points</h3>
                    <p className="text-3xl font-bold text-amber-500">{rewards.rewardPoints}</p>
                    <div className="mt-2">
                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-800 dark:bg-amber-900/30 dark:text-amber-400">
                            {rewards.customerGroup} Tier
                        </span>
                    </div>
                </div>

                {/* Recent Order Card */}
                <div className="rounded-xl border border-neutral-100 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-neutral-400">Recent Order</h3>
                    {orders.length > 0 ? (
                        <div>
                            <p className="text-lg font-medium">#{orders[0].orderId}</p>
                            <p className="text-xs text-neutral-500">{new Date(orders[0].orderDate).toLocaleDateString()}</p>
                            <div className="mt-4">
                                <span className="rounded-full bg-neutral-100 px-3 py-1 text-xs font-bold text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                                    {orders[0].orderStatus}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-neutral-500">No recent orders.</p>
                    )}
                </div>

                {/* Profile Card */}
                <div className="rounded-xl border border-neutral-100 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">Personal Details</h3>
                    <p className="truncate font-medium">{profile?.email || email}</p>
                    <div className="mt-4">
                        <Link href="/account/profile" className="text-sm font-medium text-blue-600 hover:underline">
                            Update Profile
                        </Link>
                    </div>
                </div>

                {/* Social Card */}
                <div className="rounded-xl border border-neutral-100 bg-gradient-to-br from-white to-blue-50/30 p-6 shadow-sm dark:border-neutral-800 dark:from-neutral-900 dark:to-blue-900/10">
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">Friends & Social</h3>
                    <p className="text-3xl font-bold text-indigo-600">Connect</p>
                    <div className="mt-4">
                        <Link href="/account/friends" className="text-sm font-medium hover:underline">
                            Manage Friends →
                        </Link>
                    </div>
                </div>

                {/* Support Card */}
                <div className="rounded-xl border border-neutral-100 bg-white p-6 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">Help & Support</h3>
                    <p className="text-3xl font-bold text-neutral-800 dark:text-neutral-200">Concierge</p>
                    <div className="mt-4">
                        <Link href="/account/support" className="text-sm font-medium text-blue-600 hover:underline">
                            Contact Support →
                        </Link>
                    </div>
                </div>

                {/* Wishlist Card */}
                <div className="rounded-xl border border-neutral-100 bg-gradient-to-br from-white to-pink-50/30 p-6 shadow-sm dark:border-neutral-800 dark:from-neutral-900 dark:to-pink-900/10">
                    <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-neutral-400">Save for Later</h3>
                    <p className="text-3xl font-bold text-pink-600">Wishlist</p>
                    <div className="mt-4">
                        <Link href="/account/wishlist" className="text-sm font-medium hover:underline text-pink-700 dark:text-pink-400">
                            View Saved Items →
                        </Link>
                    </div>
                </div>
            </div>

            {/* Addresses Link */}
            <div className="flex justify-center">
                <Link href="/account/addresses" className="text-sm font-black uppercase tracking-widest text-neutral-400 hover:text-black hover:underline">
                    Manage Saved Addresses
                </Link>
            </div>

            {/* Recently Viewed */}
            {recentlyViewed.length > 0 && (
                <section>
                    <h2 className="mb-6 text-xl font-bold">Picked for You (Recently Viewed)</h2>
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                        {recentlyViewed.map((product) => (
                            <Link
                                key={product.id}
                                href={`/product/${product.handle}`}
                                className="group relative aspect-square overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800"
                            >
                                <GridTileImage
                                    alt={product.title}
                                    src={product.featuredImage?.url}
                                    fill
                                    sizes="(min-width: 1024px) 15vw, (min-width: 768px) 25vw, 50vw"
                                />
                                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 p-4 opacity-0 transition-opacity group-hover:opacity-100">
                                    <p className="truncate text-xs font-bold text-white">{product.title}</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Loyalty Perks Section */}
            <section className="rounded-2xl bg-neutral-900 p-8 text-white">
                <div className="md:flex md:items-center md:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold">Vaabhi Elite Rewards</h2>
                        <p className="mt-2 text-neutral-400">You're just 500 points away from unlocking the <strong>Platinum</strong> tier!</p>
                    </div>
                    <div className="mt-6 md:mt-0">
                        <Link href="/account/rewards" className="rounded-full bg-white px-6 py-2 text-sm font-bold text-black hover:bg-neutral-200">
                            Explore Perks
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
