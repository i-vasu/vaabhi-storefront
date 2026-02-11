'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { uploadMedia, virtualTryOn } from 'lib/backend';
import { Camera, RefreshCcw, Sparkles, X } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

export default function VirtualTryOn({ productImageUrl }: { productImageUrl: string | undefined }) {
    const [isOpen, setIsOpen] = useState(false);
    const [userImage, setUserImage] = useState<string | null>(null);
    const [userFile, setUserFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [resultImage, setResultImage] = useState<string | null>(null);

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUserFile(file);
            const reader = new FileReader();
            reader.onload = (e) => setUserImage(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const startTryOn = async () => {
        if (!userFile || !productImageUrl) return;

        setIsProcessing(true);
        try {
            // 1. Upload user image to get a URL
            const userPhotoUrl = await uploadMedia(userFile);

            // 2. Call AI Try-On service
            const result = await virtualTryOn(userPhotoUrl, productImageUrl);
            setResultImage(result);
            setShowResult(true);
            toast.success('AI Try-On generated!');
        } catch (error: any) {
            toast.error(error.message || 'AI Processing failed');
        } finally {
            setIsProcessing(false);
        }
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
                                        {showResult && resultImage ? (
                                            <img src={resultImage} alt="Try-On Result" className="h-full w-full object-cover" />
                                        ) : userImage ? (
                                            <img src={userImage} alt="User" className="h-full w-full object-cover" />
                                        ) : (
                                            <label className="flex h-full w-full cursor-pointer flex-col items-center justify-center space-y-2">
                                                <Camera className="h-8 w-8 text-neutral-400" />
                                                <span className="text-xs text-neutral-500 text-center px-4 font-black uppercase tracking-widest">Upload Portrait</span>
                                                <input type="file" className="hidden" onChange={handleFileUpload} accept="image/*" />
                                            </label>
                                        )}
                                        {userImage && !isProcessing && (
                                            <button
                                                onClick={() => {
                                                    setUserImage(null);
                                                    setUserFile(null);
                                                    setShowResult(false);
                                                }}
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
                                                <div className="space-y-4">
                                                    <div className="space-y-1">
                                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Step 1</h4>
                                                        <p className="text-sm font-medium">Upload a well-lit photo from your gallery.</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-neutral-400">Step 2</h4>
                                                        <p className="text-sm font-medium">Our AI Artisan will drape the garment onto your silhouette.</p>
                                                    </div>
                                                </div>
                                                <button
                                                    disabled={!userFile || isProcessing}
                                                    onClick={startTryOn}
                                                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-black py-4 text-xs font-black uppercase tracking-widest text-white transition-all hover:opacity-90 disabled:opacity-50 dark:bg-white dark:text-black"
                                                >
                                                    {isProcessing ? (
                                                        <>
                                                            <RefreshCcw className="h-4 w-4 animate-spin" />
                                                            Processing Heritage...
                                                        </>
                                                    ) : (
                                                        'Generate Vision'
                                                    )}
                                                </button>
                                            </>
                                        ) : (
                                            <div className="space-y-6 text-center">
                                                <div className="rounded-2xl bg-blue-50/50 p-6 dark:bg-blue-900/20">
                                                    <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                                                        Your personalized AI silhouette is ready.
                                                    </p>
                                                </div>
                                                <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                                                    *AI simulation for visual luxury reference.
                                                </p>
                                                <button
                                                    onClick={() => setShowResult(false)}
                                                    className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-neutral-500 hover:text-black dark:hover:text-white"
                                                >
                                                    <RefreshCcw className="h-3 w-3" />
                                                    Restart Session
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
