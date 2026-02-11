'use client';

import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
            {/* Hero Section */}
            <header className="mb-24 text-center">
                <motion.span
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600"
                >
                    Since 1984
                </motion.span>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mt-6 text-6xl font-black tracking-tighter md:text-8xl"
                >
                    The Vaabhi Story
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mx-auto mt-8 max-w-2xl text-xl text-neutral-500 leading-relaxed font-light italic"
                >
                    "Where ancient artisanal craftsmanship meets the uncompromising silhouette of modern luxury."
                </motion.p>
            </header>

            {/* Philosophy Section */}
            <section className="grid gap-16 lg:grid-cols-2 lg:items-center">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="relative aspect-square overflow-hidden rounded-[4rem]"
                >
                    <img
                        src="https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1000&auto=format&fit=crop"
                        alt="Artisan at work"
                        className="h-full w-full object-cover grayscale transition-all duration-700 hover:grayscale-0"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </motion.div>

                <div className="space-y-8">
                    <h2 className="text-4xl font-bold tracking-tight">Radical Transparency in Luxury</h2>
                    <p className="text-lg text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
                        At Vaabhi, we believe luxury isn't just about the final garment; it's about the hands that touched it, the heritage that inspired it, and the future it respects. Every piece in our collection is a collaboration between master weavers of Banaras and contemporary designers in Paris.
                    </p>
                    <div className="flex gap-12">
                        <div>
                            <p className="text-3xl font-black">100%</p>
                            <p className="text-[10px] uppercase tracking-widest text-neutral-500">Organic Silk</p>
                        </div>
                        <div>
                            <p className="text-3xl font-black">400+</p>
                            <p className="text-[10px] uppercase tracking-widest text-neutral-500">Master Crafters</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Quote Section */}
            <section className="my-32 rounded-[3.5rem] bg-neutral-900 px-8 py-24 text-white dark:bg-neutral-800">
                <div className="mx-auto max-w-3xl text-center">
                    <Quote className="mx-auto h-12 w-12 text-blue-500 opacity-50" />
                    <blockquote className="mt-12 text-3xl font-bold italic md:text-4xl">
                        "Fashion is fleeting, but the story of a thread remains. Vaabhi is my attempt to preserve that story for the generation that demands both style and substance."
                    </blockquote>
                    <p className="mt-8 text-[10px] font-black uppercase tracking-[0.3em] text-blue-400">
                        — Vaabhi Singhania, Creative Director
                    </p>
                </div>
            </section>

            {/* Commitment Section */}
            <section className="grid gap-12 sm:grid-cols-3">
                {[
                    { title: 'The Ethos', desc: 'Sustainable luxury that prioritizes Earth as much as Elegance.' },
                    { title: 'The Origin', desc: 'Sourcing the finest raw materials from centuries-old agrarian hubs.' },
                    { title: 'The Future', desc: 'Innovating with AI to maximize precision while minimizing waste.' }
                ].map((item, i) => (
                    <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: i * 0.1 }}
                        className="rounded-3xl border border-neutral-100 p-8 dark:border-neutral-800"
                    >
                        <h4 className="text-xs font-black uppercase tracking-widest text-blue-600 mb-4">{item.title}</h4>
                        <p className="text-sm font-medium leading-relaxed opacity-70">{item.desc}</p>
                    </motion.div>
                ))}
            </section>
        </div>
    );
}
