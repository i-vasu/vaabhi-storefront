'use client';

import { motion } from 'framer-motion';
import { Minus, Plus } from 'lucide-react';
import { useState } from 'react';

const faqs = [
    {
        question: "How long does a Bespoke AI Design take?",
        answer: "Initial designs are generated in real-time. Once you finalize a design, our master weavers take 3-5 weeks to handcraft the garment depending on the complexity of the motif."
    },
    {
        question: "Is the Virtual Try-On accurate?",
        answer: "Our AI uses advanced silhouette mapping to provide a high-fidelity visualization of how the garment drapes. While it is 95% accurate to scale, we recommend checking the detailed size guide for final measurements."
    },
    {
        question: "Do you ship internationally?",
        answer: "Yes, Vaabhi ships to over 40 countries. Premium express shipping is complimentary for orders above ₹50,000."
    },
    {
        question: "What is your return policy for custom designs?",
        answer: "Custom AI-generated designs are made-to-order and therefore non-returnable. However, we offer one complimentary modification session if the fit requires adjustment."
    }
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <div className="mx-auto max-w-4xl px-6 py-20">
            <header className="mb-20">
                <span className="text-[10px] font-black uppercase tracking-[0.4em] text-neutral-400">Knowledge Base</span>
                <h1 className="mt-4 text-5xl font-black tracking-tighter">Frequently Asked</h1>
            </header>

            <div className="space-y-4">
                {faqs.map((faq, i) => (
                    <motion.div
                        key={faq.question}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="overflow-hidden rounded-3xl border border-neutral-100 bg-white dark:border-neutral-800 dark:bg-neutral-900"
                    >
                        <button
                            onClick={() => setOpenIndex(openIndex === i ? null : i)}
                            className="flex w-full items-center justify-between p-8 text-left"
                        >
                            <span className="text-lg font-bold tracking-tight">{faq.question}</span>
                            {openIndex === i ? <Minus className="h-5 w-5" /> : <Plus className="h-5 w-5" />}
                        </button>
                        {openIndex === i && (
                            <div className="px-8 pb-8 text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
                                {faq.answer}
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>

            <div className="mt-20 rounded-[2.5rem] bg-neutral-50 p-12 text-center dark:bg-neutral-950">
                <h3 className="text-xl font-bold">Still have questions?</h3>
                <p className="mt-2 text-sm text-neutral-500">Our concierge is available 24/7 for our elite members.</p>
                <div className="mt-8">
                    <a
                        href="/contact"
                        className="rounded-full bg-black px-10 py-4 text-xs font-black uppercase tracking-widest text-white dark:bg-white dark:text-black"
                    >
                        Contact Concierge
                    </a>
                </div>
            </div>
        </div>
    );
}
