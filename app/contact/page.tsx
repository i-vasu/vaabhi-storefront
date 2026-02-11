'use client';

import { motion } from 'framer-motion';
import { Mail, MapPin, MessageSquare, Phone } from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Your message has been received. Our concierge will contact you shortly.");
    };

    return (
        <div className="mx-auto max-w-7xl px-6 py-20">
            <header className="mb-20 text-center">
                <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600"
                >
                    The Concierge
                </motion.span>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 text-5xl font-black tracking-tighter md:text-7xl"
                >
                    How Can We Assist?
                </motion.h1>
            </header>

            <div className="grid gap-16 lg:grid-cols-3">
                {/* Contact INFO */}
                <div className="space-y-12">
                    <section>
                        <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-6">Connect</h3>
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="rounded-full bg-neutral-100 p-3 dark:bg-neutral-800">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Inquiries</p>
                                    <p className="text-sm text-neutral-500">concierge@vaabhi.com</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <div className="rounded-full bg-neutral-100 p-3 dark:bg-neutral-800">
                                    <Phone className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold">Direct Line</p>
                                    <p className="text-sm text-neutral-500">+91 (22) 4412 8800</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-6">Maison</h3>
                        <div className="flex items-start gap-4">
                            <div className="rounded-full bg-neutral-100 p-3 dark:bg-neutral-800">
                                <MapPin className="h-5 w-5" />
                            </div>
                            <div>
                                <p className="text-sm font-bold">Mumbai Studio</p>
                                <p className="text-sm text-neutral-500 leading-relaxed">
                                    44/A Luxury Lane, Worli Heights<br />
                                    Mumbai, Maharashtra 400018
                                </p>
                            </div>
                        </div>
                    </section>
                </div>

                {/* Contact FORM */}
                <div className="lg:col-span-2">
                    <div className="rounded-[2.5rem] border border-neutral-100 bg-white p-10 shadow-2xl dark:border-neutral-800 dark:bg-neutral-900">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid gap-8 sm:grid-cols-2">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full border-b border-neutral-200 bg-transparent py-4 text-sm outline-none transition-all focus:border-black dark:border-neutral-800 dark:focus:border-white"
                                        placeholder="Alexander Luxe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Email Address</label>
                                    <input
                                        type="email"
                                        required
                                        className="w-full border-b border-neutral-200 bg-transparent py-4 text-sm outline-none transition-all focus:border-black dark:border-neutral-800 dark:focus:border-white"
                                        placeholder="alex@example.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Subject</label>
                                <select className="w-full border-b border-neutral-200 bg-transparent py-4 text-sm outline-none dark:border-neutral-800">
                                    <option>Bespoke Design Inquiry</option>
                                    <option>Bulk/Wedding Orders</option>
                                    <option>Technical Support</option>
                                    <option>Brand Cooperation</option>
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-500">Your Message</label>
                                <textarea
                                    required
                                    rows={4}
                                    className="w-full border-b border-neutral-200 bg-transparent py-4 text-sm outline-none transition-all focus:border-black dark:border-neutral-800 dark:focus:border-white"
                                    placeholder="Tell us about your requirements..."
                                />
                            </div>

                            <button
                                type="submit"
                                className="group flex items-center gap-3 rounded-full bg-black px-10 py-5 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                            >
                                <MessageSquare className="h-4 w-4" />
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
