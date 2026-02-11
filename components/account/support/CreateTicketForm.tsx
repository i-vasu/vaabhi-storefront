
'use client';

import { createTicket } from 'lib/backend';
import { AlertCircle, CheckCircle2, MessageSquarePlus, Send } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CreateTicketForm({ userEmail }: { userEmail: string }) {
    const [subject, setSubject] = useState('');
    const [description, setDescription] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            await createTicket({
                subject,
                description,
                userEmail
            });
            setSuccess(true);
            setSubject('');
            setDescription('');
            router.refresh();
        } catch (err) {
            setError('Failed to transmit your request. Our artisans are currently busy.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="rounded-[2rem] border border-green-100 bg-green-50/50 p-10 text-center dark:border-green-900/20 dark:bg-green-900/10">
                <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                    <CheckCircle2 className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-xl font-serif font-black uppercase tracking-tight mb-2">Dossier Received</h3>
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-500 mb-8">Your support request has been logged in our archives.</p>
                <button 
                    onClick={() => setSuccess(false)}
                    className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 hover:text-black dark:hover:text-white transition-colors"
                >
                    Create Another Inquiry
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mb-8 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black">
                    <MessageSquarePlus className="h-5 w-5" />
                </div>
                <div>
                     <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Concierge Inquiry</h2>
                     <p className="font-serif text-lg font-bold">New Support Request</p>
                </div>
            </div>

            {error && (
                <div className="flex items-center gap-3 rounded-2xl bg-red-50 p-4 text-red-600 dark:bg-red-900/10 transition-all border border-red-100 dark:border-red-900/20">
                    <AlertCircle className="h-5 w-5" />
                    <p className="text-xs font-bold uppercase tracking-widest">{error}</p>
                </div>
            )}

            <div>
                <label className="mb-3 block text-[10px] font-black uppercase tracking-widest text-neutral-400">Subject</label>
                <input
                    type="text"
                    required
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Inquiry regarding my recent acquisition"
                    className="w-full rounded-2xl border border-neutral-100 bg-neutral-50 p-4 text-sm font-medium outline-none transition-all focus:border-luxury-gold focus:bg-white focus:ring-1 focus:ring-luxury-gold dark:border-neutral-800 dark:bg-neutral-900/50"
                />
            </div>

            <div>
                <label className="mb-3 block text-[10px] font-black uppercase tracking-widest text-neutral-400">Inquiry Details</label>
                <textarea
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your request with as much detail as possible..."
                    rows={6}
                    className="w-full rounded-2xl border border-neutral-100 bg-neutral-50 p-4 text-sm font-medium outline-none transition-all focus:border-luxury-gold focus:bg-white focus:ring-1 focus:ring-luxury-gold dark:border-neutral-800 dark:bg-neutral-900/50 resize-none"
                />
            </div>

            <button
                type="submit"
                disabled={isSubmitting}
                className="group flex w-full items-center justify-center gap-3 rounded-full bg-black py-5 text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all hover:bg-neutral-800 active:scale-[0.98] disabled:opacity-50 dark:bg-white dark:text-black"
            >
                {isSubmitting ? (
                    'Transmitting...'
                ) : (
                    <>
                        <Send className="h-4 w-4" />
                        Transmit Inquiry
                    </>
                )}
            </button>
        </form>
    );
}
