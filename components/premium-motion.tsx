'use client';

import { motion } from 'framer-motion';
import { ReactNode } from 'react';

interface FadeInProps {
    children: ReactNode;
    delay?: number;
    direction?: 'up' | 'down' | 'left' | 'right';
    className?: string;
}

export function FadeIn({ children, delay = 0, direction = 'up', className = "" }: FadeInProps) {
    const directions = {
        up: { y: 20 },
        down: { y: -20 },
        left: { x: 20 },
        right: { x: -20 },
    };

    return (
        <motion.div
            initial={{
                opacity: 0,
                ...directions[direction],
            }}
            whileInView={{
                opacity: 1,
                x: 0,
                y: 0,
            }}
            viewport={{ once: true }}
            transition={{
                duration: 0.6,
                delay: delay,
                ease: [0.25, 0.1, 0.25, 1], // Premium bezier curve
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

export function PremiumHover({ children }: { children: ReactNode }) {
    return (
        <motion.div
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
            {children}
        </motion.div>
    );
}
