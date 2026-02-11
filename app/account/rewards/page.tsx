import { getCurrentUser } from 'lib/auth-utils';
import { getRewardPoints } from 'lib/backend';
import { handleTransferPoints } from '../actions';

export default async function RewardsPage() {
    const user = await getCurrentUser();
    const userId = user?.userId || 1;
    const rewards = await getRewardPoints();

    return (
        <div className="mx-auto max-w-4xl space-y-12">
            <header className="text-center">
                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-widest text-heritage-red">Privilege Club</h1>
                <div className="mx-auto mt-4 h-[2px] w-24 bg-heritage-gold" />
                <p className="mt-6 font-medium text-heritage-black/60 uppercase text-[10px] tracking-[0.4em]">Where Loyalty Meets Legacy</p>
            </header>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Balance Card */}
                <div className="rounded-[3rem] bg-heritage-red p-12 text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-heritage-gold/20 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-150 duration-700" />
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/60">Privilege Points</p>
                    <div className="mt-8 flex items-baseline gap-4">
                        <span className="text-7xl font-black tracking-tighter">{rewards.rewardPoints}</span>
                        <span className="text-lg font-black uppercase tracking-widest text-heritage-gold-light">Credits</span>
                    </div>
                    <div className="mt-12">
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-6 py-2 text-[10px] font-black uppercase tracking-widest border border-white/20">
                            <span className="h-2 w-2 rounded-full bg-heritage-gold animate-pulse" />
                            {rewards.customerGroup} Tier Sovereign
                        </span>
                    </div>
                </div>

                {/* Transfer Form */}
                <div className="rounded-[3rem] border-2 border-heritage-gold/10 bg-white p-12 shadow-xl">
                    <h2 className="text-2xl font-black uppercase tracking-tighter text-heritage-black">Endorse a Friend</h2>
                    <p className="mt-2 text-xs font-medium text-heritage-black/60 tracking-wide uppercase italic">Transfer your privilege credits instantly.</p>

                    <form action={handleTransferPoints as any} className="mt-10 space-y-6">
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-heritage-red">Recipient Address</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="COLLEAGUE@VAABHI.COM"
                                className="w-full border-b-2 border-heritage-gold/20 bg-transparent py-4 text-sm font-black uppercase tracking-widest focus:border-heritage-red outline-none transition-colors"
                                required
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-heritage-red">Credit Amount</label>
                            <input
                                type="number"
                                name="points"
                                placeholder="0.00"
                                className="w-full border-b-2 border-heritage-gold/20 bg-transparent py-4 text-sm font-black uppercase tracking-widest focus:border-heritage-red outline-none transition-colors"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full rounded-2xl bg-heritage-red py-6 text-[10px] font-black uppercase tracking-[0.3em] text-white hover:bg-heritage-gold hover:text-heritage-black transition-all shadow-xl active:scale-95">
                            Authorize Transfer
                        </button>
                    </form>
                </div>
            </div>

            {/* Perks Section */}
            <section className="space-y-10 pt-10">
                <div className="flex items-center gap-6">
                   <h2 className="text-3xl font-black uppercase tracking-tight text-heritage-black">Sovereign Perks</h2>
                   <div className="flex-1 h-px bg-heritage-gold/20" />
                </div>
                <div className="grid gap-6 sm:grid-cols-3">
                    {[
                        { icon: "🚚", title: "Royal Transit", desc: "Priority delivery on all procurements." },
                        { icon: "🎟️", title: "Early Access", desc: "Access archives 48 hours before general release." },
                        { icon: "💎", title: "Heritage Day", desc: "Special benefits on your anniversary of joining." }
                    ].map((perk, i) => (
                        <div key={i} className="rounded-3xl border border-heritage-gold/10 bg-white/50 p-8 backdrop-blur-sm transition-all hover:border-heritage-red hover:shadow-lg">
                            <div className="mb-6 text-3xl">{perk.icon}</div>
                            <h3 className="text-sm font-black uppercase tracking-widest text-heritage-red">{perk.title}</h3>
                            <p className="mt-2 text-xs font-medium leading-relaxed text-heritage-black/70">{perk.desc}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
