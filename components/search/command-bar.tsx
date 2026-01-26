'use client';

import { Package, Search, ShoppingBag, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function CommandBar() {
    const [open, setOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                setOpen((open) => !open);
            }
        };

        document.addEventListener('keydown', down);
        return () => document.removeEventListener('keydown', down);
    }, []);

    if (!open) return null;

    const items = [
        { icon: Search, label: 'Search products...', path: '/search', color: 'text-blue-500' },
        { icon: Package, label: 'My Orders', path: '/account/orders', color: 'text-green-500' },
        { icon: User, label: 'Profile Settings', path: '/account/profile', color: 'text-purple-500' },
        { icon: ShoppingBag, label: 'Checkout Now', path: '/checkout', color: 'text-orange-500' },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 transition-all duration-300">
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setOpen(false)} />

            <div className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-neutral-200 bg-white/90 shadow-2xl backdrop-blur-xl dark:border-neutral-800 dark:bg-black/90">
                <div className="flex items-center border-b border-neutral-100 p-4 dark:border-neutral-800">
                    <Search className="mr-3 h-5 w-5 text-neutral-400" />
                    <input
                        autoFocus
                        placeholder="Type a command or search..."
                        className="flex-1 bg-transparent text-sm outline-none"
                    />
                    <kbd className="rounded border border-neutral-200 bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-500 dark:border-neutral-700 dark:bg-neutral-800">ESC</kbd>
                </div>

                <div className="max-h-[300px] overflow-y-auto p-2">
                    {items.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => {
                                router.push(item.path);
                                setOpen(false);
                            }}
                            className="flex w-full items-center rounded-lg px-4 py-3 text-sm transition-colors hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        >
                            <item.icon className={`mr-3 h-4 w-4 ${item.color}`} />
                            <span className="flex-1 text-left">{item.label}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
