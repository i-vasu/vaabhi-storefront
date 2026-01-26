import { getCurrentUser } from 'lib/auth-utils';
import { getRewardPoints } from 'lib/backend';
import { handleTransferPoints } from '../actions';

export default async function RewardsPage() {
    const user = await getCurrentUser();
    const userId = user?.userId || 1;
    const rewards = await getRewardPoints();

    return (
        <div className="mx-auto max-w-4xl space-y-10">
            <header>
                <h1 className="text-3xl font-bold tracking-tight">Vaabhi Elite Rewards</h1>
                <p className="text-neutral-500">Your loyalty is recognized. Elevate your status with every purchase.</p>
            </header>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Balance Card */}
                <div className="rounded-3xl bg-black p-10 text-white dark:bg-neutral-900">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-neutral-500">Available Balance</p>
                    <div className="mt-4 flex items-baseline gap-2">
                        <span className="text-6xl font-black">{rewards.rewardPoints}</span>
                        <span className="text-xl font-medium text-neutral-400">Points</span>
                    </div>
                    <div className="mt-8">
                        <span className="rounded-full bg-white/10 px-4 py-1 text-xs font-bold backdrop-blur-md">
                            {rewards.customerGroup} Tier Member
                        </span>
                    </div>
                </div>

                {/* Transfer Form */}
                <div className="rounded-3xl border border-neutral-100 bg-white p-10 dark:border-neutral-800 dark:bg-black">
                    <h2 className="text-xl font-bold">Transfer Points</h2>
                    <p className="mt-2 text-sm text-neutral-500">Share the love. Send points to a friend's Vaabhi account.</p>

                    <form action={handleTransferPoints} className="mt-8 space-y-4">
                        <input
                            type="email"
                            name="email"
                            placeholder="friend@example.com"
                            className="w-full rounded-2xl border border-neutral-200 bg-transparent px-6 py-4 text-sm focus:border-black dark:border-neutral-800"
                            required
                        />
                        <input
                            type="number"
                            name="points"
                            placeholder="Points to transfer"
                            className="w-full rounded-2xl border border-neutral-200 bg-transparent px-6 py-4 text-sm focus:border-black dark:border-neutral-800"
                            required
                        />
                        <button type="submit" className="w-full rounded-full bg-black py-4 text-sm font-bold text-white hover:opacity-90 dark:bg-white dark:text-black">
                            Transfer Now
                        </button>
                    </form>
                </div>
            </div>

            {/* Perks Section */}
            <section className="space-y-6">
                <h2 className="text-2xl font-bold">Your Exclusive Tier Perks</h2>
                <div className="grid gap-4 sm:grid-cols-3">
                    <div className="rounded-2xl border border-neutral-100 p-6 dark:border-neutral-800">
                        <div className="mb-4 text-2xl">🚚</div>
                        <h3 className="font-bold">Free Priority Shipping</h3>
                        <p className="mt-1 text-xs text-neutral-500">Always on the house for Elite members.</p>
                    </div>
                    <div className="rounded-2xl border border-neutral-100 p-6 dark:border-neutral-800">
                        <div className="mb-4 text-2xl">🎟️</div>
                        <h3 className="font-bold">Early Sale Access</h3>
                        <p className="mt-1 text-xs text-neutral-500">Get 48 hours head start on all drops.</p>
                    </div>
                    <div className="rounded-2xl border border-neutral-100 p-6 dark:border-neutral-800">
                        <div className="mb-4 text-2xl">💎</div>
                        <h3 className="font-bold">Birthday Bonus</h3>
                        <p className="mt-1 text-xs text-neutral-500">Double points on your special day.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
