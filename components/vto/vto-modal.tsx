
'use client';

import { Dialog, Transition } from '@headlessui/react';
import { trackEvent } from 'components/analytics/umami';
import { AnimatePresence, motion } from 'framer-motion';
import { uploadMedia, virtualTryOn } from 'lib/backend';
import { Camera, RefreshCw, User, X } from 'lucide-react';
import { Fragment, useRef, useState } from 'react';

export default function VirtualTryOnModal({
    isOpen,
    onClose,
    garmentUrl
}: {
    isOpen: boolean;
    onClose: () => void;
    garmentUrl: string | null;
}) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [userPhoto, setUserPhoto] = useState<string | null>(null);
    const [userPhotoFile, setUserPhotoFile] = useState<File | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setUserPhotoFile(file);
            trackEvent('VTO User Photo Selected', { fileName: file.name });
            const reader = new FileReader();
            reader.onload = (e) => setUserPhoto(e.target?.result as string);
            reader.readAsDataURL(file);
            setResultImage(null); 
        }
    };

    const handleTryOn = async () => {
        if (!userPhotoFile || !garmentUrl) return;
        setIsProcessing(true);
        setError(null);
        trackEvent('VTO Processing Started');

        try {
            // 1. Upload User Photo
            const userPhotoUrl = await uploadMedia(userPhotoFile);

            // 2. Call VTO Backend
            const vtoResult = await virtualTryOn(userPhotoUrl, garmentUrl);
            setResultImage(vtoResult);
            trackEvent('VTO Processing Successful');
        } catch (err) {
            console.error('VTO Failed:', err);
            setError('Failed to generate try-on. Please ensure a clear photo is used.');
            trackEvent('VTO Processing Failed');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <Transition show={isOpen} as={Fragment}>
            <Dialog 
                onClose={() => {
                    onClose();
                    trackEvent('VTO Modal Closed');
                }} 
                className="relative z-50"
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" />
                </Transition.Child>

                <div className="fixed inset-0 flex items-center justify-center p-4">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 scale-95"
                        enterTo="opacity-100 scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 scale-100"
                        leaveTo="opacity-0 scale-95"
                    >
                        <Dialog.Panel className="w-full max-w-5xl overflow-hidden rounded-[2rem] bg-white shadow-2xl dark:bg-neutral-900 flex flex-col md:flex-row h-[80vh]">
                            
                            <div className="w-full md:w-1/3 bg-neutral-50 p-8 border-r border-neutral-100 dark:bg-neutral-900 dark:border-neutral-800 flex flex-col overflow-y-auto">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-xl font-black uppercase tracking-tight font-serif">Virtual Mirror</h2>
                                    <button 
                                        onClick={() => {
                                            onClose();
                                            trackEvent('VTO Modal X Clicked');
                                        }} 
                                        className="p-2 hover:bg-neutral-200 rounded-full transition-colors dark:hover:bg-neutral-800"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                <div className="space-y-6 flex-1">
                                    <div>
                                        <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-neutral-400">Selected Garment</p>
                                        <div className="h-32 w-full rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-black">
                                            {garmentUrl ? (
                                                <img src={garmentUrl} alt="Garment" className="h-full w-full object-cover" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-neutral-400 text-xs">No garment selected</div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-neutral-400">Your Photo</p>
                                        <div 
                                            onClick={() => fileInputRef.current?.click()}
                                            className="cursor-pointer group relative h-48 w-full rounded-xl border-2 border-dashed border-neutral-300 bg-white flex flex-col items-center justify-center text-center hover:border-luxury-gold hover:bg-yellow-50/50 transition-all dark:bg-neutral-800 dark:border-neutral-700 dark:hover:border-luxury-gold"
                                        >
                                            {userPhoto ? (
                                                <img src={userPhoto} alt="You" className="h-full w-full object-cover rounded-xl" />
                                            ) : (
                                                <>
                                                    <div className="h-10 w-10 rounded-full bg-neutral-100 flex items-center justify-center mb-3 group-hover:bg-white group-hover:text-luxury-gold transition-colors dark:bg-neutral-700 dark:text-neutral-300">
                                                        <User className="h-5 w-5" />
                                                    </div>
                                                    <p className="text-sm font-bold text-neutral-600 dark:text-neutral-300">Upload Full Body Photo</p>
                                                    <p className="text-[10px] text-neutral-400 mt-1 uppercase tracking-wider">Click to browse</p>
                                                </>
                                            )}
                                            <input 
                                                type="file" 
                                                ref={fileInputRef} 
                                                onChange={handleFileSelect} 
                                                accept="image/*" 
                                                className="hidden" 
                                            />
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleTryOn}
                                        disabled={isProcessing || !userPhoto || !garmentUrl}
                                        className="w-full rounded-full bg-black py-4 text-xs font-black uppercase tracking-widest text-white hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all dark:bg-white dark:text-black flex items-center justify-center gap-2"
                                    >
                                        {isProcessing ? (
                                            <RefreshCw className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Camera className="h-4 w-4" />
                                        )}
                                        {isProcessing ? 'Weaving Magic...' : 'Try It On'}
                                    </button>

                                    {error && (
                                        <p className="text-xs text-red-500 font-medium text-center bg-red-50 p-2 rounded-lg border border-red-100 dark:bg-red-900/20 dark:border-red-900">{error}</p>
                                    )}
                                </div>
                            </div>

                            <div className="flex-1 bg-white relative dark:bg-neutral-900">
                                <AnimatePresence mode="wait">
                                    {isProcessing ? (
                                        <motion.div
                                            key="processing"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="absolute inset-0 flex flex-col items-center justify-center"
                                        >
                                            <div className="relative h-24 w-24 mb-6">
                                                <div className="absolute inset-0 border-4 border-neutral-100 rounded-full dark:border-neutral-800"></div>
                                                <div className="absolute inset-0 border-4 border-luxury-gold rounded-full border-t-transparent animate-spin"></div>
                                            </div>
                                            <h3 className="text-xl font-serif font-bold">Fitting Room in Progress</h3>
                                            <p className="text-xs text-neutral-500 mt-2 uppercase tracking-widest">Adjusting fit and drape...</p>
                                        </motion.div>
                                    ) : resultImage ? (
                                        <motion.div
                                            key="result"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="h-full w-full p-4"
                                        >
                                            <img src={resultImage} alt="Virtual Try-On Result" className="h-full w-full object-contain rounded-xl shadow-lg" />
                                            <button 
                                                onClick={() => trackEvent('VTO Result Shared')}
                                                className="absolute bottom-12 left-1/2 -translate-x-1/2 rounded-full bg-white/20 backdrop-blur-md px-6 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-white border border-white/30 hover:bg-white hover:text-black transition-all"
                                            >
                                                Share My Reflection
                                            </button>
                                        </motion.div>
                                    ) : (
                                        <div className="h-full w-full flex flex-col items-center justify-center text-neutral-300 dark:text-neutral-700">
                                            <Camera className="h-16 w-16 mb-4 opacity-50" />
                                            <p className="text-sm font-bold uppercase tracking-widest">Your reflection will appear here</p>
                                        </div>
                                    )}
                                </AnimatePresence>
                            </div>

                        </Dialog.Panel>
                    </Transition.Child>
                </div>
            </Dialog>
        </Transition>
    );
}
