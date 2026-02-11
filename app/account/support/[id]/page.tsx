
import TicketReplyForm from 'components/account/support/reply/TicketReplyForm';
import { getTicket } from 'lib/backend';
import { ArrowLeft, BadgeCheck, Clock, History, ShieldCheck, User } from 'lucide-react';
import { cookies } from 'next/headers';
import Link from 'next/link';
import { notFound } from 'next/navigation';

export default async function TicketDetailPage({ params }: { params: { id: string } }) {
    const ticketId = parseInt(params.id);
    const ticket = await getTicket(ticketId);

    if (!ticket) {
        notFound();
    }

    const cookieStore = await cookies();
    const userCookie = cookieStore.get('vaabhi_user')?.value;
    const user = userCookie ? JSON.parse(decodeURIComponent(userCookie)) : null;
    const email = user?.email || 'customer@example.com';

    return (
        <div className="space-y-12">
            {/* Header */}
            <header className="flex flex-col gap-6 border-b border-neutral-100 pb-10 dark:border-neutral-800">
                <Link 
                    href="/account/support" 
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 hover:text-black dark:hover:text-white transition-colors flex items-center gap-2"
                >
                    <ArrowLeft className="h-3 w-3" /> Back to Inquiries
                </Link>
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                             <span className="text-[10px] font-black uppercase tracking-widest text-luxury-gold flex items-center gap-1">
                                 <History className="h-3 w-3" /> Inquiry #{ticket.id}
                             </span>
                        </div>
                        <h1 className="text-3xl font-black tracking-tight uppercase font-serif">{ticket.subject}</h1>
                    </div>
                    <span className={`inline-flex h-fit items-center gap-1.5 rounded-full px-4 py-2 text-[10px] font-black uppercase tracking-widest ${
                        ticket.status === 'OPEN' ? 'bg-black text-white dark:bg-white dark:text-black' : 
                        'bg-neutral-100 text-neutral-400 dark:bg-neutral-800'
                    }`}>
                        {ticket.status === 'OPEN' ? <Clock className="h-3 w-3" /> : <BadgeCheck className="h-3 w-3" />}
                        {ticket.status}
                    </span>
                </div>
            </header>

            <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
                {/* Conversation Thread */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Original Message */}
                    <div className="rounded-[2.5rem] bg-neutral-50 p-8 dark:bg-neutral-900/30 border border-neutral-100 dark:border-neutral-800">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black">
                                <User className="h-4 w-4" />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest">Your Initial Request</p>
                                <p className="text-[9px] text-neutral-400 uppercase tracking-widest">{new Date(ticket.createdAt).toLocaleString()}</p>
                            </div>
                        </div>
                        <p className="text-sm font-medium leading-relaxed italic text-neutral-600 dark:text-neutral-400">
                             "{ticket.description}"
                        </p>
                    </div>

                    {/* Replies */}
                    <div className="space-y-6">
                        {ticket.replies?.map((reply: any) => (
                            <div 
                                key={reply.id} 
                                className={`rounded-[2rem] p-8 border ${
                                    reply.senderType === 'ADMIN' 
                                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-black border-transparent shadow-2xl ml-8' 
                                    : 'bg-white text-black dark:bg-neutral-900 dark:text-white border-neutral-100 dark:border-neutral-800 mr-8 shadow-sm'
                                }`}
                            >
                                <div className="flex items-center gap-3 mb-4">
                                    <div className={`flex h-8 w-8 items-center justify-center rounded-full ${
                                        reply.senderType === 'ADMIN' ? 'bg-luxury-gold' : 'bg-neutral-100 dark:bg-neutral-800'
                                    }`}>
                                        {reply.senderType === 'ADMIN' ? <ShieldCheck className="h-4 w-4 text-black" /> : <User className="h-4 w-4" />}
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-black uppercase tracking-widest">
                                            {reply.senderType === 'ADMIN' ? 'Vaabhi Concierge' : 'You'}
                                        </p>
                                        <p className={`text-[9px] uppercase tracking-widest ${
                                            reply.senderType === 'ADMIN' ? 'text-neutral-400 dark:text-neutral-500' : 'text-neutral-400'
                                        }`}>
                                            {new Date(reply.createdAt).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                                <p className="text-sm font-medium leading-relaxed">{reply.message}</p>
                            </div>
                        ))}
                    </div>

                    {/* Reply Input */}
                    {ticket.status === 'OPEN' && (
                        <div className="pt-8">
                             <TicketReplyForm ticketId={ticket.id} userEmail={email} />
                        </div>
                    )}
                </div>

                {/* Sidebar Info */}
                <div className="space-y-8 h-fit lg:sticky lg:top-24">
                    <div className="rounded-[2rem] border border-neutral-100 bg-neutral-50/50 p-8 dark:border-neutral-800 dark:bg-neutral-950/50">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-6">Concierge Details</h3>
                        <div className="space-y-6">
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-1">Inquiry Status</p>
                                <p className="text-xs font-bold uppercase">{ticket.status}</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-1">Category</p>
                                <p className="text-xs font-bold uppercase">General Inquiry</p>
                            </div>
                            <div>
                                <p className="text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-1">Estimated Response</p>
                                <p className="text-xs font-bold uppercase text-luxury-gold">Within 24 Hours</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-[2rem] bg-luxury-gold p-8 text-black">
                         <ShieldCheck className="h-8 w-8 mb-4" />
                         <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-2">Authenticated Support</h4>
                         <p className="text-[10px] font-medium leading-relaxed">
                             Every interaction with our concierge is logged and secure. Your privacy is paramount in the Vaabhi Circle.
                         </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
