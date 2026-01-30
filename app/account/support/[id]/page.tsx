import { getSessionEmail } from 'lib/auth-utils';
import { getTicket } from 'lib/backend';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import TicketDetail from './TicketDetail';

export default async function SupportTicketPage({ params }: { params: { id: string } }) {
    const email = await getSessionEmail();
    const ticket = await getTicket(Number(params.id));

    if (!ticket || ticket.userEmail !== email) {
        notFound();
    }

    return (
        <div className="mx-auto max-w-4xl space-y-8 pb-20">
            <header>
                <Link href="/account/support" className="text-sm font-medium text-neutral-500 hover:underline">← Back to Support</Link>
                <div className="mt-4 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{ticket.subject}</h1>
                        <p className="text-neutral-500">Ticket #{ticket.ticketId} • Opened on {new Date(ticket.createdAt).toLocaleDateString()}</p>
                    </div>
                    <span className={`rounded-full px-4 py-1 text-xs font-bold ${ticket.status === 'OPEN' ? 'bg-green-100 text-green-600' :
                            ticket.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-600' :
                                'bg-neutral-100 text-neutral-500'
                        }`}>
                        {ticket.status}
                    </span>
                </div>
            </header>

            <TicketDetail ticket={ticket} />
        </div>
    );
}
