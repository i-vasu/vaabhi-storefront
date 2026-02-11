
'use client';

import { motion, useScroll } from 'framer-motion';
import Image from 'next/image';
import { useRef } from 'react';

interface StorySection {
    title: string;
    description: string;
    image: string;
    align: 'left' | 'right';
}

export function ProductStorytelling({
    productTitle,
    productImage,
    materialStory
}: {
    productTitle: string,
    productImage: string,
    materialStory?: string
}) {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const sections: StorySection[] = [
        {
            title: "Artisanal Craftsmanship",
            description: materialStory || "Every thread is woven with precision, honoring centuries of tradition while embracing modern silhouettes. Our artisans spend weeks perfecting each pattern.",
            image: productImage,
            align: 'left'
        },
        {
            title: "The Perfection of Detail",
            description: "From hand-stitched seams to bespoke hardware, no element is too small. We believe that true luxury lies in the things you don't immediately see.",
            image: productImage,
            align: 'right'
        }
    ];

    return (
        <div ref={containerRef} className="mt-24 space-y-32 pb-24 overflow-hidden">
            {/* Hero Narrative */}
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center px-4"
            >
                <span className="text-xs font-black uppercase tracking-[0.3em] text-luxury-gold mb-4 block">The Design Ethos</span>
                <h2 className="text-5xl md:text-7xl font-serif font-bold tracking-tighter mb-8 max-w-4xl mx-auto">
                    Designed for the <span className="text-neutral-400">Extraordinary.</span>
                </h2>
                <p className="text-lg text-neutral-500 max-w-2xl mx-auto">
                    {productTitle} isn't just a garment. It's an exploration of form, texture, and the relentless pursuit of perfection.
                </p>
            </motion.div>

            {/* Story Sections */}
            {sections.map((section, index) => (
                <section key={index} className={`flex flex-col md:flex-row items-center gap-12 px-6 md:px-12 ${section.align === 'right' ? 'md:flex-row-reverse' : ''}`}>
                    <motion.div
                        initial={{ opacity: 0, x: section.align === 'left' ? -100 : 100 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="flex-1"
                    >
                        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm bg-neutral-100 dark:bg-neutral-900">
                            <Image
                                src={section.image}
                                alt={section.title}
                                fill
                                className="object-cover transition-transform duration-700 hover:scale-110"
                            />
                        </div>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                        viewport={{ once: true }}
                        className="flex-1 space-y-6"
                    >
                        <h3 className="text-3xl md:text-5xl font-serif font-bold tracking-tight">{section.title}</h3>
                        <p className="text-lg text-neutral-500 leading-relaxed font-light">
                            {section.description}
                        </p>
                        <div className="pt-4">
                            <div className="h-px w-24 bg-luxury-gold" />
                        </div>
                    </motion.div>
                </section>
            ))}

            {/* Technical Hotspots Simulation / Detail Grid */}
            <div className="bg-neutral-50 dark:bg-neutral-900/50 py-24 rounded-[3rem] mx-4">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { label: "Fabric", val: "Italian Mulberry Silk", desc: "Sourced from sustainable valleys." },
                            { label: "Durability", val: "Tensile-Strength+", desc: "Reinforced seams for timeless wear." },
                            { label: "Finish", val: "Matte-Lustre", desc: "A soft, sophisticated glow in any light." }
                        ].map((item, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                viewport={{ once: true }}
                                className="space-y-2 text-center md:text-left"
                            >
                                <p className="text-[10px] font-black uppercase tracking-widest text-luxury-gold">{item.label}</p>
                                <h4 className="text-xl font-bold">{item.val}</h4>
                                <p className="text-sm text-neutral-500">{item.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
