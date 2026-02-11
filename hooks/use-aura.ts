'use client';

import { useEffect } from 'react';

/**
 * Hook to extract dominant color from a product image and update 
 * CSS variables for the "Aura" effect.
 * 
 * Uses a hidden canvas for light-weight color extraction.
 */
export function useAura(imageUrl: string | undefined) {
    useEffect(() => {
        if (!imageUrl) return;

        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = imageUrl;

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            if (!context) return;

            canvas.width = 1;
            canvas.height = 1;

            context.drawImage(img, 0, 0, 1, 1);
            const data = context.getImageData(0, 0, 1, 1).data;
            const r = data[0]!;
            const g = data[1]!;
            const b = data[2]!;

            // Update CSS variables for themed accents
            document.documentElement.style.setProperty('--aura-color', `rgb(${r}, ${g}, ${b})`);
            document.documentElement.style.setProperty('--aura-color-soft', `rgba(${r}, ${g}, ${b}, 0.1)`);

            // Calculate brightness to determine contrasting text color if needed
            const brightness = (r * 299 + g * 587 + b * 114) / 1000;
            document.documentElement.style.setProperty('--aura-contrast', brightness > 128 ? '#000' : '#fff');
        };
    }, [imageUrl]);
}
