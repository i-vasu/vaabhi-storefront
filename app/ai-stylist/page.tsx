
'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Download, RefreshCw, Share2, Sparkles, Wand2 } from 'lucide-react';
import { useState } from 'react';

export default function AIStylistPage() {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [status, setStatus] = useState('');
    const [resultImage, setResultImage] = useState<string | null>(null);

    const handleGenerate = () => {
        if (!prompt) return;
        setIsGenerating(true);
        setResultImage(null);
        setStatus('Initializing...');

        const url = `/api/backend/v1/search/custom-design/public/generate/stream?prompt=${encodeURIComponent(prompt)}`;
        const eventSource = new EventSource(url);

        eventSource.onmessage = (event) => {
            const data = event.data;
            if (data.startsWith('DONE:')) {
                setResultImage(data.replace('DONE:', ''));
                setIsGenerating(false);
                eventSource.close();
            } else {
                setStatus(data);
            }
        };

        eventSource.onerror = (err) => {
            console.error('EventSource failed:', err);
            setStatus('Error generating design. Please try again.');
            setIsGenerating(false);
            eventSource.close();
        };
    };

    return (
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
            <div className="flex flex-col gap-12 lg:flex-row">
                {/* Control Panel */}
                <div className="w-full lg:w-1/3">
                    <div className="rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm dark:border-neutral-800 dark:bg-black">
                        <div className="mb-6 flex items-center gap-2">
                            <Sparkles className="h-6 w-6 text-blue-600" />
                            <h1 className="text-2xl font-bold">AI Stylist</h1>
                        </div>

                        <p className="mb-8 text-sm text-neutral-500">
                            Describe your dream outfit in detail. Our AI will generate a unique design inspired by your vision and artisanal craftsmanship.
                        </p>

                        <div className="space-y-6">
                            <div>
                                <label className="mb-2 block text-xs font-bold uppercase tracking-widest text-neutral-400">Describe the outfit</label>
                                <textarea
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="e.g. A silk Banarasi saree in deep emerald green with gold zari work and a modern halter-neck blouse..."
                                    className="h-40 w-full rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm transition-all focus:border-blue-600 focus:bg-white dark:border-neutral-800 dark:bg-neutral-900"
                                />
                            </div>

                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating || !prompt}
                                className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-blue-600 py-4 font-bold text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
                            >
                                <AnimatePresence mode="wait">
                                    {isGenerating ? (
                                        <motion.div
                                            key="loading"
                                            initial={{ rotate: 0 }}
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                                        >
                                            <RefreshCw className="h-5 w-5" />
                                        </motion.div>
                                    ) : (
                                        <motion.div key="ready" className="flex items-center gap-2">
                                            <Wand2 className="h-5 w-5" />
                                            Generate Masterpiece
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                            </button>
                        </div>

                        <div className="mt-8 space-y-4">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Trending Prompts</h4>
                            <div className="flex flex-wrap gap-2">
                                {['Pastel Lehengas', 'Modern Salwars', 'Floral Sarees'].map((tag) => (
                                    <button
                                        key={tag}
                                        onClick={() => setPrompt(tag)}
                                        className="rounded-full border border-neutral-100 bg-neutral-50 px-3 py-1 text-xs hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900"
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Canvas Area */}
                <div className="relative flex-1 rounded-3xl border border-neutral-200 bg-neutral-50 overflow-hidden dark:border-neutral-800 dark:bg-neutral-900/50 min-h-[600px]">
                    <AnimatePresence mode="wait">
                        {isGenerating ? (
                            <motion.div
                                key="generating"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex h-full w-full flex-col items-center justify-center p-12 text-center"
                            >
                                <div className="relative mb-8 h-32 w-32">
                                    <div className="absolute inset-0 animate-ping rounded-full border-4 border-blue-600/30" />
                                    <div className="absolute inset-4 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
                                    <div className="flex h-full w-full items-center justify-center text-4xl">🎨</div>
                                </div>
                                <h3 className="text-2xl font-bold">{status}</h3>
                                <p className="mt-2 text-neutral-500">Processing complex textures and artisanal patterns.</p>
                            </motion.div>
                        ) : resultImage ? (
                            <motion.div
                                key="result"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="relative h-full w-full p-4"
                            >
                                <img src={resultImage} alt="Generated Design" className="h-full w-full rounded-2xl object-cover shadow-2xl" />
                                <div className="absolute bottom-10 right-10 flex gap-4">
                                    <button
                                        onClick={async () => {
                                            const response = await fetch(resultImage);
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
                                        className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-black shadow-lg backdrop-blur-md transition-transform hover:scale-110"
                                        title="Download Design"
                                    >
                                        <Download className="h-5 w-5" />
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (navigator.share) {
                                                try {
                                                    await navigator.share({
                                                        title: 'My Vaabhi Design',
                                                        text: `Check out this custom outfit I generated using Vaabhi AI Stylist!`,
                                                        url: window.location.href,
                                                    });
                                                } catch (err) { }
                                            } else {
                                                navigator.clipboard.writeText(window.location.href);
                                                alert('Link copied to clipboard!');
                                            }
                                        }}
                                        className="flex h-12 w-12 items-center justify-center rounded-full bg-white/80 text-black shadow-lg backdrop-blur-md transition-transform hover:scale-110"
                                        title="Share Design"
                                    >
                                        <Share2 className="h-5 w-5" />
                                    </button>
                                </div>
                            </motion.div>
                        ) : (
                            <div className="flex h-full w-full flex-col items-center justify-center p-12 text-center">
                                <Wand2 className="mb-6 h-16 w-16 text-neutral-200" />
                                <h3 className="text-2xl font-bold text-neutral-400">Your canvas awaits</h3>
                                <p className="mt-2 text-neutral-500 max-w-sm">Enter a prompt to see the first iteration of your custom fashion design.</p>
                            </div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
