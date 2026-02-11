
'use client';

import { replyToTicket } from 'lib/backend';
import { Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function TicketReplyForm({ ticketId, userEmail }: { ticketId: number, userEmail: string }) {
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await replyToTicket(ticketId, {
                senderType: 'USER',
                senderId: userEmail,
                message: message
            });
            setMessage('');
            router.refresh();
        } catch (err) {
            console.error('Reply failed:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <textarea
                required
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your response to the atelier..."
                rows={4}
                className="w-full rounded-2xl border border-neutral-100 bg-white p-6 text-sm font-medium outline-none transition-all focus:border-luxury-gold dark:border-neutral-800 dark:bg-neutral-900 shadow-sm"
            />
            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={isSubmitting || !message.trim()}
                    className="flex items-center gap-3 rounded-full bg-black px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-neutral-800 active:scale-[0.98] disabled:opacity-50 dark:bg-white dark:text-black shadow-lg"
                >
                    {isSubmitting ? 'Transmitting...' : (
                        <>
                            <Send className="h-4 w-4" />
                            Send Message
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}
