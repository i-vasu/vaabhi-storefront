
import { getCustomDesigns } from 'lib/backend';
import { ArrowRight, Camera, Download, Sparkles, Wand2 } from 'lucide-react';
import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function AtelierHistoryPage() {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('vaabhi_user')?.value;
    const user = userCookie ? JSON.parse(decodeURIComponent(userCookie)) : null;
    const userId = user?.userId || 1;

    const designs = await getCustomDesigns(userId);

    return (
        <div className="space-y-12">
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div>
                    <h1 className="text-4xl font-black tracking-tight uppercase font-serif">Your AI Atelier</h1>
                    <p className="mt-2 text-sm text-neutral-500 uppercase tracking-widest font-medium">History of your digital craftsmanship</p>
                </div>
                <Link 
                    href="/ai-stylist" 
                    className="group flex items-center gap-2 rounded-full bg-black px-6 py-3 text-[10px] font-black uppercase tracking-widest text-white hover:bg-luxury-gold hover:text-black transition-all dark:bg-white dark:text-black"
                >
                    <Wand2 className="h-4 w-4" />
                    Create New Design
                </Link>
            </div>

            {designs.length > 0 ? (
                <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {designs.map((design) => (
                        <div key={design.id} className="group overflow-hidden rounded-[2rem] border border-neutral-100 bg-white transition-all hover:shadow-2xl dark:border-neutral-800 dark:bg-neutral-900/30">
                            <div className="relative aspect-[3/4] overflow-hidden">
                                <img 
                                    src={design.imageUrl} 
                                    alt={design.prompt} 
                                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                                <div className="absolute inset-x-4 bottom-4 flex gap-2 opacity-0 transition-all translate-y-4 group-hover:opacity-100 group-hover:translate-y-0">
                                    <button className="flex-1 flex items-center justify-center gap-2 rounded-full bg-white/20 backdrop-blur-md py-2.5 text-[10px] font-bold uppercase tracking-widest text-white border border-white/30 hover:bg-white hover:text-black transition-all">
                                        <Camera className="h-3 w-3" />
                                        VTO
                                    </button>
                                    <button className="h-10 w-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white hover:text-black transition-all">
                                        <Download className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <Sparkles className="h-3 w-3 text-luxury-gold" />
                                        <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Custom Design</span>
                                    </div>
                                    <span className="text-[10px] font-medium text-neutral-400">
                                        {new Date(design.createdAt || Date.now()).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="mb-6 line-clamp-2 text-sm italic text-neutral-600 dark:text-neutral-400 font-serif leading-relaxed">
                                    "{design.prompt}"
                                </p>
                                <button className="w-full flex items-center justify-center gap-3 rounded-full border border-neutral-200 py-3 text-[10px] font-black uppercase tracking-widest transition-all hover:bg-black hover:text-white dark:border-neutral-700 dark:hover:bg-white dark:hover:text-black">
                                    Re-commission Piece
                                    <ArrowRight className="h-3 w-3" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center rounded-[3rem] border border-dashed border-neutral-200 py-32 text-center dark:border-neutral-800">
                    <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                        <Sparkles className="h-8 w-8 text-neutral-300" />
                    </div>
                    <h2 className="text-xl font-bold font-serif uppercase">The Archive is Empty</h2>
                    <p className="mt-2 text-sm text-neutral-500 uppercase tracking-widest font-medium">Awaiting your first digital creation.</p>
                    <Link
                        href="/ai-stylist"
                        className="mt-8 rounded-full bg-black px-12 py-4 text-[10px] font-black uppercase tracking-widest text-white hover:bg-luxury-gold hover:text-black transition-all dark:bg-white dark:text-black"
                    >
                        Visit the Atelier
                    </Link>
                </div>
            )}
        </div>
    );
}
