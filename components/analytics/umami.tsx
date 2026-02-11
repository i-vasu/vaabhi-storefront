'use client';

import Script from 'next/script';

export default function UmamiAnalytics() {
    const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
    const umamiScriptUrl = process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL || 'https://cloud.umami.is/script.js';

    if (!umamiWebsiteId) {
        return null;
    }

    return (
        <Script
            async
            src={umamiScriptUrl}
            data-website-id={umamiWebsiteId}
            strategy="afterInteractive"
        />
    );
}

import { sendGTMEvent } from './gtm';

/**
 * Utility for tracking custom events in Umami and GTM
 * @param eventName Name of the event
 * @param eventData Metadata for the event
 */
export const trackEvent = (eventName: string, eventData?: Record<string, any>) => {
    // 1. Track in Umami
    if (typeof window !== 'undefined' && (window as any).umami) {
        (window as any).umami.track(eventName, eventData);
    }

    // 2. Track in GTM
    sendGTMEvent(eventName, eventData);
};
