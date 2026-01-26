'use client';

import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { Fragment, useState } from 'react';

export default function SizeGuide({ sizeGuide }: { sizeGuide: Record<string, string> }) {
    const [isOpen, setIsOpen] = useState(false);

    if (!sizeGuide || Object.keys(sizeGuide).length === 0) return null;

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-black hover:underline"
            >
                View Size Guide
            </button>

            <Transition show={isOpen} as={Fragment}>
                <Dialog onClose={() => setIsOpen(false)} className="relative z-50">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl dark:bg-black dark:border dark:border-neutral-800">
                                    <div className="flex items-center justify-between mb-4">
                                        <Dialog.Title className="text-xl font-bold">Size Guide</Dialog.Title>
                                        <button onClick={() => setIsOpen(false)}>
                                            <XMarkIcon className="h-6 w-6" />
                                        </button>
                                    </div>
                                    <div className="overflow-hidden rounded-lg border border-neutral-100 dark:border-neutral-800">
                                        <table className="w-full text-left text-sm">
                                            <thead>
                                                <tr className="bg-neutral-50 dark:bg-neutral-900">
                                                    <th className="px-4 py-2 font-bold">Measurement</th>
                                                    <th className="px-4 py-2 font-bold">Value</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                                {Object.entries(sizeGuide).map(([key, value]) => (
                                                    <tr key={key}>
                                                        <td className="px-4 py-2 text-neutral-500">{key}</td>
                                                        <td className="px-4 py-2 font-medium">{value}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <p className="mt-4 text-[10px] text-neutral-400">
                                        * All measurements are in inches. Fits may vary by style.
                                    </p>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    );
}
