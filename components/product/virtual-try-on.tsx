'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Camera, RefreshCcw, Sparkles, X } from 'lucide-react';
import { useState } from 'react';

export default function VirtualTryOn({ productImageUrl }: { productImageUrl: string | undefined }) {
    const [isOpen, setIsOpen] = useState(false);
    const [userImage, setUserImage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showResult, setShowResult] = useState(false);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => setUserImage(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const startTryOn = () => {
        setIsProcessing(true);
        // Simulate AI processing
        setTimeout(() => {
            setIsProcessing(false);
            setShowResult(true);
        }, 3000);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="flex w-full items-center justify-center gap-2 rounded-full border border-neutral-200 bg-white py-3 text-sm font-medium transition-all hover:bg-neutral-50 dark:border-neutral-800 dark:bg-black dark:hover:bg-neutral-900"
            >
                <Sparkles className="h-4 w-4 text-purple-600" />
                AI Virtual Try-On
            </button>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-neutral-900"
                        >
                            <div className="flex items-center justify-between border-b border-neutral-100 p-4 dark:border-neutral-800">
                                <h3 className="font-bold">AI Virtual Try-On (Beta)</h3>
                                <button onClick={() => setIsOpen(false)} className="rounded-full p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                                    <X className="h-5 w-5" />
                                </button>
                            </div>

                            <div className="p-8">
                                <div className="grid gap-8 md:grid-cols-2">
                                    {/* Photo Upload Area */}
                                    <div className="relative aspect-[3/4] overflow-hidden rounded-xl border-2 border-dashed border-neutral-200 bg-neutral-50 dark:border-neutral-800 dark:bg-black">
                                        {userImage ? (
                                            <img src={userImage} alt="User" className="h-full w-full object-cover" />
                                        ) : (
                                            <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center space-y-2">
                                                <Camera className="h-8 w-8 text-neutral-400" />
                                                <span className="text-xs text-neutral-500 text-center px-4">Upload your full-body photo for best results</span>
                                                <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                                            </label>
                                        )}
                                        {userImage && !isProcessing && (
                                            <button
                                                onClick={() => setUserImage(null)}
                                                className="absolute right-2 top-2 rounded-full bg-black/50 p-1 text-white backdrop-blur-md"
                                            >
                                                <RefreshCcw className="h-4 w-4" />
                                            </button>
                                        )}
                                    </div>

                                    {/* Result/Instruction Area */}
                                    <div className="flex flex-col justify-center space-y-4">
                                        {!showResult ? (
                                            <>
                                                <div className="space-y-2">
                                                    <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-400">Step 1</h4>
                                                    <p className="text-sm">Upload a well-lit photo of yourself standing straight.</p>
                                                </div>
                                                <div className="space-y-2">
                                                    <h4 className="text-sm font-bold uppercase tracking-wider text-neutral-400">Step 2</h4>
                                                    <p className="text-sm">Our AI will virtually overlay this garment on your frame.</p>
                                                </div>
                                                <button
                                                    disabled={!userImage || isProcessing}
                                                    onClick={startTryOn}
                                                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-purple-600 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                                                >
                                                    {isProcessing ? (
                                                        <>
                                                            <RefreshCcw className="h-4 w-4 animate-spin" />
                                                            AI Processing...
                                                        </>
                                                    ) : (
                                                        'Generate Try-On'
                                                    )}
                                                </button>
                                            </>
                                        ) : (
                                            <div className="space-y-4 text-center">
                                                <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
                                                    AI simulation complete!
                                                </div>
                                                <p className="text-xs text-neutral-500 italic">
                                                    *This is an AI-generated simulation for sizing and style visualization.
                                                </p>
                                                <button
                                                    onClick={() => setShowResult(false)}
                                                    className="text-sm font-medium text-purple-600 hover:underline"
                                                >
                                                    Try another photo
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
