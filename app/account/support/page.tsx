
import CreateTicketForm from 'components/account/support/CreateTicketForm';
import { getUserTickets } from 'lib/backend';
import { ArrowRight, BadgeCheck, Clock, LifeBuoy, MessageCircle } from 'lucide-react';
import { cookies } from 'next/headers';
import Link from 'next/link';

export default async function SupportPortalPage() {
    const cookieStore = await cookies();
    const userCookie = cookieStore.get('vaabhi_user')?.value;
    const user = userCookie ? JSON.parse(decodeURIComponent(userCookie)) : null;
    const email = user?.email || 'customer@example.com';

    const tickets = await getUserTickets(email);

    return (
        <div className="space-y-16">
            {/* Header */}
            <div>
                <h1 className="text-4xl font-black tracking-tight uppercase font-serif">Concierge Support</h1>
                <p className="mt-2 text-sm text-neutral-500 uppercase tracking-widest font-medium">Personalized assistance for our patrons</p>
            </div>

            <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
                {/* Inquiry Tracking */}
                <div className="space-y-10">
                    <div>
                         <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-6">Inquiry History</h2>
                         {tickets.length > 0 ? (
                             <div className="space-y-4">
                                 {tickets.map((ticket) => (
                                     <div 
                                        key={ticket.id} 
                                        className="group rounded-3xl border border-neutral-100 bg-neutral-50/50 p-6 transition-all hover:bg-white hover:shadow-xl dark:border-neutral-800 dark:bg-neutral-900/30"
                                     >
                                         <div className="flex items-center justify-between mb-4">
                                              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[8px] font-black uppercase tracking-widest ${
                                                ticket.status === 'OPEN' ? 'bg-black text-white dark:bg-white dark:text-black' : 
                                                ticket.status === 'CLOSED' ? 'bg-neutral-200 text-neutral-500 dark:bg-neutral-800' :
                                                'bg-luxury-gold text-black'
                                              }`}>
                                                  {ticket.status === 'OPEN' ? <Clock className="h-2 w-2" /> : <BadgeCheck className="h-2 w-2" />}
                                                  {ticket.status}
                                              </span>
                                              <span className="text-[9px] font-medium text-neutral-400 uppercase tracking-wider">
                                                  Ref #{ticket.id}
                                              </span>
                                         </div>
                                         <h3 className="font-serif text-lg font-bold truncate group-hover:text-luxury-gold transition-colors">{ticket.subject}</h3>
                                         <p className="mt-2 line-clamp-2 text-xs text-neutral-500 leading-relaxed italic">{ticket.description}</p>
                                         <div className="mt-6 flex items-center justify-between">
                                              <Link 
                                                href={`/account/support/${ticket.id}`}
                                                className="inline-flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                                              >
                                                  Open Ticket Details <ArrowRight className="h-3 w-3" />
                                              </Link>
                                         </div>
                                     </div>
                                 ))}
                             </div>
                         ) : (
                             <div className="flex flex-col items-center justify-center rounded-[2rem] border border-dashed border-neutral-200 py-20 text-center dark:border-neutral-800">
                                 <LifeBuoy className="h-8 w-8 text-neutral-200 mb-4" />
                                 <p className="text-[11px] font-black uppercase tracking-widest text-neutral-400">No active inquiries</p>
                             </div>
                         )}
                    </div>
                </div>

                {/* New Ticket Creation */}
                <div className="rounded-[2.5rem] bg-white p-10 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] dark:bg-neutral-900 h-fit sticky top-24 border border-neutral-100 dark:border-neutral-800">
                    <CreateTicketForm userEmail={email} />
                </div>
            </div>

            {/* Support Resources */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                 {[
                    { title: 'Logistics', desc: 'Track current shipments or handle returns', icon: Clock },
                    { title: 'Heritage Care', desc: 'Detailed guides for silk and zari maintenance', icon: LifeBuoy },
                    { title: 'Global Concierge', desc: 'WhatsApp support for urgent requests', icon: MessageCircle }
                 ].map((res) => (
                    <div key={res.title} className="rounded-3xl border border-neutral-100 bg-neutral-50/50 p-8 transition-colors hover:border-luxury-gold dark:border-neutral-800 dark:bg-neutral-950/50">
                        <div className="mb-4 h-8 w-8 text-luxury-gold">
                            <res.icon className="h-full w-full" />
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] mb-2">{res.title}</h4>
                        <p className="text-xs text-neutral-500 leading-relaxed font-medium">{res.desc}</p>
                    </div>
                 ))}
            </div>
        </div>
    );
}
