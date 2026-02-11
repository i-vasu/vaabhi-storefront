
'use client';

import { trackEvent } from 'components/analytics/umami';
import VirtualTryOnModal from 'components/vto/vto-modal'; // New Import
import { AnimatePresence, motion } from 'framer-motion';
import { Camera, Download, RefreshCw, Share2, Sparkles, Wand2 } from 'lucide-react';
import { useState } from 'react';

export default function AIStylistPage() {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [status, setStatus] = useState('');
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [isVtoOpen, setIsVtoOpen] = useState(false); // VTO State

    const handleGenerate = () => {
        if (!prompt) return;
        setIsGenerating(true);
        setResultImage(null);
        setStatus('Initializing Atelier...');
        
        trackEvent('AI Stylist Generation Started', { prompt });

        const url = `/api/backend/v1/search/custom-design/public/generate/stream?prompt=${encodeURIComponent(prompt)}`;
        const eventSource = new EventSource(url);

        eventSource.onmessage = (event) => {
            const data = event.data;
            if (data.startsWith('DONE:')) {
                setResultImage(data.replace('DONE:', ''));
                setIsGenerating(false);
                trackEvent('AI Stylist Generation Completed', { prompt, success: true });
                eventSource.close();
            } else {
                setStatus(data);
            }
        };

        eventSource.onerror = (err) => {
            console.error('EventSource failed:', err);
            setStatus('The atelier is currently busy. Please try again.');
            setIsGenerating(false);
            trackEvent('AI Stylist Generation Failed', { prompt });
            eventSource.close();
        };
    };

    const handlePurchase = async () => {
        if (!resultImage) return;
        setIsGenerating(true);
        setStatus('Preparing Commission...');
        trackEvent('AI Stylist Commission Started', { prompt });
        try {
             const match = document.cookie.match(new RegExp('(^| )vaabhi_user=([^;]+)'));
             const userStr = match?.[2];
             const user = userStr ? JSON.parse(decodeURIComponent(userStr)) : null;
             const email = user?.email || 'guest@example.com';
             const userId = user?.userId || 1;

             // 1. Save Design
             const saveRes = await fetch('/api/backend/v1/search/custom-design/public', {
                 method: 'POST',
                 headers: { 'Content-Type': 'application/json' },
                 body: JSON.stringify({
                     prompt: prompt,
                     imageUrl: resultImage,
                     userId: userId
                 })
             });
             const savedDesign = await saveRes.json();

             // 2. Purchase / Convert to Product
             const purchaseRes = await fetch(`/api/backend/v1/search/custom-design/${savedDesign.id}/order?email=${email}`, {
                 method: 'POST'
             });
             const purchaseData = await purchaseRes.json();

             if (purchaseData.success) {
                 trackEvent('AI Stylist Commission Successful', { designId: savedDesign.id });
                 alert('Exclusive Design added to your Bag! Proceeding to Checkout.');
                 window.location.href = '/checkout';
             }
        } catch (err) {
             console.error('Purchase failed:', err);
             trackEvent('AI Stylist Commission Failed', { prompt });
             alert('Failed to process custom order. Please try again.');
        } finally {
             setIsGenerating(false);
        }
    };

    return (
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
            <VirtualTryOnModal 
                isOpen={isVtoOpen} 
                onClose={() => setIsVtoOpen(false)} 
                garmentUrl={resultImage} 
            />

            <header className="mb-12 text-center">
                <h1 className="text-4xl font-black uppercase tracking-tight font-serif md:text-5xl">The AI Atelier</h1>
                <p className="mt-4 text-xs font-bold uppercase tracking-widest text-neutral-500">Bespoke Design • Virtual Craftsmanship</p>
            </header>

            <div className="flex flex-col gap-12 lg:flex-row">
                {/* Control Panel */}
                <div className="w-full lg:w-1/3">
                    <div className="rounded-[2rem] border border-neutral-200 bg-white p-8 shadow-xl dark:border-neutral-800 dark:bg-neutral-900">
                        <div className="mb-8 flex items-center gap-3 border-b border-neutral-100 pb-6 dark:border-neutral-800">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white dark:bg-white dark:text-black">
                                <Sparkles className="h-5 w-5" />
                            </div>
                            <div>
                                <h2 className="text-lg font-bold font-serif uppercase tracking-wider">Design Studio</h2>
                                <p className="text-[10px] text-neutral-500 uppercase tracking-widest">Powered by Vaabhi Intelligence</p>
                            </div>
                        </div>

                        <p className="mb-8 text-sm italic text-neutral-600 dark:text-neutral-400">
                            "Describe your vision—fabric, silhouette, embroidery details—and watch as our digital artisans bring it to life."
                        </p>

                        <div className="space-y-6">
                            <div>
                                <label className="mb-3 block text-[10px] font-black uppercase tracking-widest text-neutral-400">Your Vision</label>
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="e.g. A royal blue velvet lehenga with intricate zardosi embroidery in gold, featuring peacock motifs and a scalloped dupatta..."
                                    className="h-40 w-full rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-sm outline-none transition-all focus:border-luxury-gold focus:bg-white focus:ring-1 focus:ring-luxury-gold dark:border-neutral-800 dark:bg-neutral-900/50"
                                />
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating || !prompt}
                                className="group relative flex w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-black py-4 text-xs font-black uppercase tracking-widest text-white transition-all hover:bg-neutral-800 active:scale-[0.98] disabled:opacity-50 dark:bg-white dark:text-black disabled:cursor-not-allowed"
                            >
                                <AnimatePresence mode="wait">
                                    {isGenerating ? (
                                        <motion.div
                                            key="loading"
                                            initial={{ rotate: 0 }}
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                        >
                                            <RefreshCw className="h-4 w-4" />
                                        </motion.div>
                                    ) : (
                                        <motion.div key="ready" className="flex items-center gap-2">
                                            <Wand2 className="h-4 w-4" />
                                            <span>Generate Design</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            </button>
                        </div>

                        <div className="mt-10 space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Curated Inspirations</h4>
                            <div className="flex flex-wrap gap-2">
                                {['Banarasi Silk Saree', 'Velvet Sherwani', 'Floral Organza Lehenga', 'Sustainable Khadi Kurta'].map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => {
                                            setPrompt(tag);
                                            trackEvent('AI Stylist Inspiration Clicked', { tag });
                                        }}
                                        className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-[10px] font-bold uppercase tracking-wide hover:border-luxury-gold hover:text-luxury-gold transition-colors dark:border-neutral-800 dark:bg-neutral-900"
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Canvas Area */}
                <div className="relative flex-1 rounded-[2rem] border border-neutral-200 bg-neutral-50 overflow-hidden shadow-inner dark:border-neutral-800 dark:bg-neutral-900/30 min-h-[600px]">
                    <AnimatePresence mode="wait">
                        {isGenerating ? (
                            <motion.div
                                key="generating"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex h-full w-full flex-col items-center justify-center p-12 text-center"
                            >
                                <div className="relative mb-8 h-24 w-24">
                                    <div className="absolute inset-0 animate-ping rounded-full border-2 border-luxury-gold/30" />
                                    <div className="absolute inset-2 animate-spin rounded-full border-2 border-luxury-gold border-t-transparent" />
                                    <div className="flex h-full w-full items-center justify-center text-3xl">✨</div>
                                </div>
                                <h3 className="text-xl font-serif font-bold text-neutral-800 dark:text-white">{status}</h3>
                                <p className="mt-2 text-xs font-medium uppercase tracking-widest text-luxury-gold">Crafting pixels into thread...</p>
                            </motion.div>
                        ) : resultImage ? (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative h-full w-full p-4"
                            >
                                <div className="h-full w-full overflow-hidden rounded-2xl shadow-2xl relative group">
                                    <img src={resultImage} alt="Generated Design" className="h-full w-full object-cover" />
                                    
                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    
                                    {/* Actions */}
                                    <div className="absolute bottom-8 left-8 right-8 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 flex flex-col gap-3">
                                        <button
                                            onClick={handlePurchase}
                                            className="w-full flex items-center justify-center gap-3 rounded-full bg-white py-4 text-xs font-black uppercase tracking-widest text-black shadow-lg hover:bg-luxury-gold hover:text-white transition-colors"
                                        >
                                            <Sparkles className="h-4 w-4" />
                                            Commission This Piece
                                        </button>
                                        
                                        <div className="flex gap-3">
                                            <button 
                                                className="flex-1 flex items-center justify-center gap-2 rounded-full bg-white/20 backdrop-blur-md py-3 text-xs font-bold uppercase tracking-widest text-white border border-white/30 hover:bg-white hover:text-black transition-all"
                                                onClick={() => {
                                                    setIsVtoOpen(true);
                                                    trackEvent('Virtual Try-On Opened', { source: 'ai-stylist' });
                                                }}
                                            >
                                                <Camera className="h-4 w-4" />
                                                Virtual Try-On
                                            </button>
                                            <button 
                                                className="h-10 w-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white hover:text-black transition-all"
                                                title="Download"
                                                onClick={async () => {
                                                    trackEvent('AI Stylist Design Downloaded');
                                                    const response = await fetch(resultImage!);
                                                    const blob = await response.blob();
                                                    const url = window.URL.createObjectURL(blob);
                                                    const a = document.createElement('a');
                                                    a.href = url;
                                                    a.download = `vaabhi-design-${Date.now()}.png`;
                                                    document.body.appendChild(a);
                                                    a.click();
                                                    window.URL.revokeObjectURL(url);
                                                    document.body.removeChild(a);
                                                }}
                                            >
                                                <Download className="h-4 w-4" />
                                            </button>
                                            <button 
                                                className="h-10 w-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md text-white border border-white/30 hover:bg-white hover:text-black transition-all"
                                                title="Share"
                                                onClick={() => trackEvent('AI Stylist Design Shared')}
                                            >
                                                <Share2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="flex h-full w-full flex-col items-center justify-center p-12 text-center">
                                <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                                    <Wand2 className="h-8 w-8 text-neutral-400" />
                                </div>
                                <h3 className="text-2xl font-serif font-bold text-neutral-400">The Canvas is Empty</h3>
                                <p className="mt-2 text-xs font-bold uppercase tracking-widest text-neutral-500">Awaiting your creative direction</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
