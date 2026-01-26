import Link from 'next/link';
import { ReactNode } from 'react';

const menuItems = [
    { title: 'Overview', path: '/account' },
    { title: 'Orders', path: '/account/orders' },
    { title: 'Profile', path: '/account/profile' },
    { title: 'Addresses', path: '/account/addresses' },
    { title: 'Wishlist', path: '/account/wishlist' },
    { title: 'Returns', path: '/account/returns' },
];

export default function AccountLayout({ children }: { children: ReactNode }) {
    return (
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-6 py-12 md:flex-row">
            <aside className="w-full md:w-64">
                <nav className="flex flex-col gap-1">
                    <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-500">My Account</h2>
                    {menuItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className="rounded-md px-4 py-2 text-sm font-medium hover:bg-neutral-100 dark:hover:bg-neutral-800"
                        >
                            {item.title}
                        </Link>
                    ))}
                    <button className="mt-4 border-t border-neutral-200 pt-4 text-left px-4 py-2 text-sm font-medium text-red-600 hover:opacity-80 dark:border-neutral-700">
                        Sign Out
                    </button>
                </nav>
            </aside>
            <main className="flex-1 rounded-xl border border-neutral-200 bg-white p-8 dark:border-neutral-700 dark:bg-black">
                {children}
            </main>
        </div>
    );
}
