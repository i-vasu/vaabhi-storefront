import { getSessionEmail } from 'lib/auth-utils';
import { getUserTickets } from 'lib/backend';
import Link from 'next/link';
import { handleCreateTicket } from '../actions';

export default async function SupportPage() {
    const email = await getSessionEmail();
    const tickets = await getUserTickets(email);

    return (
        <div className="mx-auto max-w-4xl space-y-8">
            <header>
                <h1 className="text-3xl font-bold tracking-tight">Support Hub</h1>
                <p className="text-neutral-500">Need help? Our concierge team is ready to assist you.</p>
            </header>

            <section className="grid gap-8 md:grid-cols-2">
                {/* Ticket List */}
                <div className="rounded-2xl border border-neutral-100 bg-white shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                    <div className="border-b border-neutral-100 p-6 dark:border-neutral-800">
                        <h2 className="text-lg font-bold">Your Tickets</h2>
                    </div>
                    <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                        {tickets.length === 0 ? (
                            <div className="p-12 text-center text-neutral-500">
                                <p>No active tickets found.</p>
                            </div>
                        ) : (
                            tickets.map((ticket: any) => (
                                <Link
                                    key={ticket.id || ticket.ticketId}
                                    href={`/account/support/${ticket.id || ticket.ticketId}`}
                                    className="block p-6 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                                >
                                    <div className="flex items-center justify-between">
                                        <p className="font-bold">#{ticket.id || ticket.ticketId} - {ticket.subject}</p>
                                        <span className="rounded-full bg-blue-100 px-3 py-1 text-[10px] font-black uppercase text-blue-600 dark:bg-blue-900/30">
                                            {ticket.status}
                                        </span>
                                    </div>
                                    <p className="mt-2 text-sm text-neutral-500 line-clamp-2">
                                        {ticket.messages?.[0]?.message || 'No description provided.'}
                                    </p>
                                </Link>
                            ))
                        )}
                    </div>
                </div>

                {/* Create Ticket Form */}
                <div className="rounded-2xl bg-neutral-900 p-8 text-white shadow-xl">
                    <h2 className="text-xl font-bold">New Assistance Request</h2>
                    <p className="mt-2 text-sm text-neutral-400">Describe your issue and we'll get back to you within 24 hours.</p>

                    <form action={handleCreateTicket} className="mt-8 space-y-6">
                        <div>
                            <label className="text-xs font-black uppercase tracking-widest text-neutral-500">Subject</label>
                            <input
                                type="text"
                                name="subject"
                                placeholder="Shipping Delay, Wrong Item..."
                                className="mt-2 w-full rounded-xl border border-neutral-800 bg-black px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-xs font-black uppercase tracking-widest text-neutral-500">Description</label>
                            <textarea
                                rows={4}
                                name="description"
                                placeholder="Tell us more details..."
                                className="mt-2 w-full rounded-xl border border-neutral-800 bg-black px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>
                        <button type="submit" className="w-full rounded-full bg-white py-4 text-sm font-black uppercase tracking-[0.2em] text-black hover:bg-neutral-200">
                            Open Ticket
                        </button>
                    </form>
                </div>
            </section>

            <div className="flex justify-center pt-6">
                <Link href="/account" className="text-sm font-medium text-blue-600 hover:underline">
                    ← Back to Account Dashboard
                </Link>
            </div>
        </div>
    );
}
