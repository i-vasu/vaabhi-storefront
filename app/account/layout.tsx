'use client';

import { useAuth } from 'components/auth-context';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';

const menuItems = [
    { title: 'Overview', path: '/account' },
    { title: 'Orders', path: '/account/orders' },
    { title: 'AI Atelier', path: '/account/atelier' },
    { title: 'Addresses', path: '/account/addresses' },
    { title: 'Wishlist', path: '/account/wishlist' },
    { title: 'Support', path: '/account/support' },
    { title: 'Returns', path: '/account/returns' },
];

export default function AccountLayout({ children }: Readonly<{ children: ReactNode }>) {
    const pathname = usePathname();
    const { logout } = useAuth();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-16 md:flex-row">
            <aside className="w-full md:w-72">
                <div className="sticky top-24 space-y-8">
                    <div>
                        <h2 className="mb-6 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                            Member Portfolio
                        </h2>
                        <nav className="flex flex-col gap-2">
                            {menuItems.map((item) => {
                                const isActive = pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        href={item.path}
                                        className={`group relative flex items-center justify-between rounded-2xl px-5 py-3 text-sm transition-all ${isActive
                                            ? 'bg-black font-bold text-white shadow-xl dark:bg-white dark:text-black'
                                            : 'text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-900'
                                            }`}
                                    >
                                        <span className="relative z-10">{item.title}</span>
                                        {isActive && (
                                            <span className="h-1.5 w-1.5 rounded-full bg-white dark:bg-black" />
                                        )}
                                        {!isActive && (
                                            <span className="opacity-0 transition-opacity group-hover:opacity-100">→</span>
                                        )}
                                    </Link>
                                );
                            })}
                        </nav>
                    </div>

                    <div className="pt-8 border-t border-neutral-100 dark:border-neutral-800">
                        <button
                            onClick={handleLogout}
                            className="flex w-full items-center gap-3 px-5 py-3 text-sm font-bold text-red-500 transition-colors hover:bg-red-50 rounded-2xl dark:hover:bg-red-950/20"
                        >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>
            <main className="flex-1 min-w-0">
                <div className="rounded-[2.5rem] border border-neutral-100 bg-white p-10 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.05)] dark:border-neutral-800 dark:bg-neutral-900/50 dark:backdrop-blur-xl">
                    {children}
                </div>
            </main>
        </div>
    );
}
