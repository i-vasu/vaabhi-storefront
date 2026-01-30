'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { handleReplyTicket } from '../../actions';

export default function TicketDetail({ ticket }: { ticket: any }) {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('message', message);

        try {
            const res = await handleReplyTicket(ticket.ticketId, formData);
            if (res.success) {
                toast.success('Reply sent!');
                setMessage('');
                // Note: revalidatePath will refresh the server component
            } else {
                toast.error(res.error || 'Failed to send reply');
            }
        } catch (err) {
            toast.error('An error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8">
            {/* Thread */}
            <div className="space-y-6">
                {/* Original Message */}
                <div className="flex flex-col items-start">
                    <div className="max-w-[80%] rounded-2xl rounded-tl-none bg-neutral-100 p-6 dark:bg-neutral-800">
                        <p className="text-sm">{ticket.messages?.[0]?.message || 'No message content.'}</p>
                        <time className="mt-2 block text-[10px] text-neutral-400">
                            {new Date(ticket.createdAt).toLocaleString()}
                        </time>
                    </div>
                </div>

                {/* Messages (excluding the first one which is shown as Original Message) */}
                {ticket.messages?.slice(1).map((msg: any) => (
                    <div
                        key={msg.messageId}
                        className={`flex flex-col ${msg.senderType === 'USER' ? 'items-end' : 'items-start'}`}
                    >
                        <div className={`max-w-[80%] rounded-2xl p-6 ${msg.senderType === 'USER'
                            ? 'rounded-tr-none bg-black text-white dark:bg-white dark:text-black'
                            : 'rounded-tl-none bg-neutral-100 dark:bg-neutral-800'
                            }`}>
                            <p className="text-sm font-bold mb-1 opacity-50 text-[10px] uppercase tracking-widest">
                                {msg.senderType === 'USER' ? 'You' : 'Agent'}
                            </p>
                            <p className="text-sm">{msg.message}</p>
                            <time className="mt-2 block text-[10px] opacity-40">
                                {new Date(msg.timestamp).toLocaleString()}
                            </time>
                        </div>
                    </div>
                ))}
            </div>

            {ticket.status !== 'CLOSED' && (
                <form onSubmit={handleSubmit} className="relative mt-12">
                    <textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Write your reply..."
                        className="min-h-[150px] w-full rounded-3xl border border-neutral-200 bg-white p-6 text-sm outline-none focus:ring-2 focus:ring-black dark:border-neutral-800 dark:bg-neutral-900 shadow-sm"
                        required
                    />
                    <div className="absolute bottom-4 right-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="rounded-full bg-black px-8 py-2 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-black"
                        >
                            {loading ? 'Sending...' : 'Send Reply'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
