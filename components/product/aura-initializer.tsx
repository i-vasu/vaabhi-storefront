'use client';

import { useAura } from 'hooks/use-aura';

export default function AuraInitializer({ imageUrl }: { imageUrl: string | undefined }) {
    useAura(imageUrl);
    return null;
}
