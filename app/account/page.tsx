'use client';

import { GridTileImage } from 'components/grid/tile';
import { motion } from 'framer-motion';
import { getOrderHistory, getRecentlyViewed, getRewardPoints, getUserProfile, getWalletDetails } from 'lib/backend';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function AccountPage() {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        async function fetchData() {
            const profile = await getUserProfile();
            const orders = await getOrderHistory(profile?.email || 'customer@example.com');
            const wallet = await getWalletDetails();
            const rewards = await getRewardPoints();
            const recentlyViewed = await getRecentlyViewed(profile?.userId || 1, 4);
            setData({ profile, orders, wallet, rewards, recentlyViewed });
        }
        fetchData();
    }, []);

    if (!data) return <div className="p-10 text-center">Loading your style hub...</div>;

    const { profile, orders, wallet, rewards, recentlyViewed } = data;
    return (
        <div className="space-y-12">
            <section className="relative px-6 py-12 bg-heritage-red rounded-[3rem] text-white shadow-2xl overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-heritage-gold/20 rounded-full -mr-32 -mt-32 blur-3xl" />
                <div className="relative z-10">
                    <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">Salutations, {profile?.firstName || 'Sovereign'}</h1>
                    <p className="mt-4 text-[10px] font-black uppercase tracking-[0.4em] text-heritage-gold-light">The VAABHI Digital Archive & Privilege Dashboard</p>
                </div>
            </section>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 px-2">
                {/* Rewards Card */}
                <Link href="/account/rewards" className="group rounded-[2.5rem] border-2 border-heritage-gold/20 bg-white p-8 shadow-lg transition-all hover:border-heritage-red hover:shadow-2xl">
                    <h3 className="mb-4 text-[10px] font-black uppercase tracking-widest text-heritage-red">Privilege Balance</h3>
                    <p className="text-4xl font-black text-heritage-black group-hover:text-heritage-red transition-colors">{rewards.rewardPoints}</p>
                    <div className="mt-6 flex items-center justify-between">
                        <span className="rounded-full bg-heritage-gold/10 px-4 py-1 text-[9px] font-bold text-heritage-gold uppercase tracking-widest border border-heritage-gold/20">
                            {rewards.customerGroup} Tier
                        </span>
                        <span className="text-[10px] font-black text-heritage-red opacity-0 group-hover:opacity-100 transition-opacity">Review →</span>
                    </div>
                </Link>

                {/* Wallet Card */}
                <Link href="/account/wallet" className="group rounded-[2.5rem] border-2 border-heritage-gold/20 bg-white p-8 shadow-lg transition-all hover:border-heritage-red hover:shadow-2xl">
                    <h3 className="mb-4 text-[10px] font-black uppercase tracking-widest text-heritage-red">Available Liquidity</h3>
                    <p className="text-4xl font-black text-heritage-black group-hover:text-heritage-red transition-colors">₹{wallet.balance.toFixed(0)}</p>
                    <div className="mt-6 flex items-center justify-between">
                        <span className="rounded-full bg-heritage-red/5 px-4 py-1 text-[9px] font-bold text-heritage-red uppercase tracking-widest border border-heritage-red/10">
                            Secured
                        </span>
                        <span className="text-[10px] font-black text-heritage-red opacity-0 group-hover:opacity-100 transition-opacity">Ledger →</span>
                    </div>
                </Link>

                {/* Recent Order */}
                <div className="rounded-[2.5rem] border-2 border-heritage-gold/20 bg-white p-8 shadow-lg">
                    <h3 className="mb-4 text-[10px] font-black uppercase tracking-widest text-heritage-red">Latest Procurement</h3>
                    {orders.length > 0 ? (
                        <div>
                            <p className="text-xl font-black text-heritage-black tracking-tighter">ORD-{orders[0].orderId}</p>
                            <p className="text-[10px] font-bold text-heritage-black/40 uppercase tracking-widest mt-1">{new Date(orders[0].orderDate).toLocaleDateString()}</p>
                            <div className="mt-6">
                                <span className="inline-block rounded-full bg-heritage-black px-4 py-1 text-[9px] font-black uppercase tracking-widest text-heritage-gold">
                                    {orders[0].orderStatus}
                                </span>
                            </div>
                        </div>
                    ) : (
                        <p className="text-xs font-medium italic text-heritage-black/40">The archives are empty.</p>
                    )}
                </div>

                {/* Concierge/Support */}
                <Link href="/account/support" className="group rounded-[2.5rem] border-2 border-heritage-gold/20 bg-heritage-black p-8 shadow-lg transition-all hover:bg-heritage-red">
                    <h3 className="mb-4 text-[10px] font-black uppercase tracking-widest text-heritage-gold">Elite Support</h3>
                    <p className="text-2xl font-black text-white group-hover:text-white transition-colors uppercase tracking-tight">Concierge</p>
                    <div className="mt-8">
                        <span className="text-[9px] font-black uppercase tracking-[0.2em] text-heritage-gold/60 group-hover:text-white">Request Assistance →</span>
                    </div>
                </Link>
            </div>

            {/* Quick Actions Grid */}
            <div className="flex flex-wrap justify-center gap-4 py-6 border-y-2 border-heritage-gold/10">
                {[
                    { label: "Dossier Details", href: "/account/profile" },
                    { label: "Secured Addresses", href: "/account/addresses" },
                    { label: "Archived Favorites", href: "/account/wishlist" },
                    { label: "Loyalty Ledger", href: "/account/rewards" }
                ].map((action, i) => (
                    <Link key={i} href={action.href} className="text-[10px] font-black uppercase tracking-[0.2em] text-heritage-red hover:text-heritage-gold px-4 py-2 transition-colors">
                        {action.label}
                    </Link>
                ))}
            </div>

            {/* Recently Viewed */}
            {recentlyViewed.length > 0 && (
                <section className="pt-8">
                    <div className="flex items-center gap-6 mb-8">
                        <h2 className="text-2xl font-black uppercase tracking-tighter text-heritage-black">Curated Archives</h2>
                        <div className="flex-1 h-px bg-heritage-gold/20" />
                    </div>
                    <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
                        {recentlyViewed.map((product: any) => (
                            <Link
                                key={product.id}
                                href={`/product/${product.handle}`}
                                className="group relative aspect-[3/4] overflow-hidden rounded-3xl border border-heritage-gold/10 bg-white"
                            >
                                <GridTileImage
                                    alt={product.title}
                                    src={product.featuredImage?.url}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    sizes="(min-width: 1024px) 15vw, (min-width: 768px) 25vw, 50vw"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-heritage-black/80 via-transparent to-transparent p-6 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-heritage-gold truncate">{product.title}</p>
                                    <p className="text-xs font-black text-white mt-1">View Piece</p>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Tier Progress Section */}
            <section className="relative overflow-hidden rounded-[3rem] bg-heritage-black/5 p-12 border-2 border-heritage-gold/10">
                <div className="relative z-10 md:flex md:items-center md:justify-between gap-12">
                    <div className="flex-1">
                        <div className="mb-6 flex items-center gap-3">
                            <span className="inline-flex items-center rounded-full bg-heritage-red px-4 py-1 text-[9px] font-black uppercase tracking-widest text-white">
                                {rewards.customerGroup} Sovereign
                            </span>
                        </div>
                        <h2 className="text-4xl font-black uppercase tracking-tighter text-heritage-black">The VAABHI Legacy</h2>
                        <div className="mt-10 max-w-lg">
                            <div className="mb-3 flex justify-between text-[10px] font-black uppercase tracking-widest text-heritage-red">
                                <span>Ascending to Platinum</span>
                                <span className="text-heritage-gold">75% Complete</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-heritage-gold/10">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: '75%' }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                    className="h-full bg-heritage-red"
                                />
                            </div>
                            <p className="mt-6 text-xs font-medium leading-relaxed text-heritage-black/60 italic uppercase tracking-wide">
                                Acquire <span className="font-black text-heritage-red">500 more points</span> to unlock the <span className="text-heritage-gold font-black">Platinum Concierge</span> archives.
                            </p>
                        </div>
                    </div>
                    <div className="mt-10 md:mt-0">
                        <Link
                            href="/account/rewards"
                            className="inline-flex items-center gap-2 rounded-2xl bg-heritage-red px-10 py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white transition-all shadow-xl hover:bg-heritage-gold hover:text-heritage-black active:scale-95"
                        >
                            Privilege Archives
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
