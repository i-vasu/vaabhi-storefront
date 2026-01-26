'use client';

import { useEffect } from 'react';

export default function ThemeInitializer({ accentColor }: { accentColor: string }) {
    useEffect(() => {
        if (accentColor) {
            document.documentElement.style.setProperty('--accent-color', accentColor);

            // Generate a 'surface' version for backgrounds
            if (accentColor.startsWith('#')) {
                const r = parseInt(accentColor.slice(1, 3), 16);
                const g = parseInt(accentColor.slice(3, 5), 16);
                const b = parseInt(accentColor.slice(5, 7), 16);
                document.documentElement.style.setProperty('--accent-surface', `rgba(${r}, ${g}, ${b}, 0.1)`);
            }
        }
    }, [accentColor]);

    return null;
}
