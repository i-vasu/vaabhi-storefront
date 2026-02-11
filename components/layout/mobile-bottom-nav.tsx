'use client';

import { HeartIcon, HomeIcon, MagnifyingGlassIcon, ShoppingBagIcon, UserIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { name: 'Home', href: '/', icon: HomeIcon },
  { name: 'Search', href: '/search', icon: MagnifyingGlassIcon },
  { name: 'Bag', href: '/cart', icon: ShoppingBagIcon },
  { name: 'Wishlist', href: '/account/wishlist', icon: HeartIcon },
  { name: 'Profile', href: '/account', icon: UserIcon },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 block bg-heritage-cream/90 backdrop-blur-xl border-t border-heritage-gold/20 pb-safe md:hidden shadow-[0_-5px_20px_rgba(139,0,0,0.1)]">
      <div className="flex items-center justify-around h-16">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex flex-col items-center justify-center w-full h-full transition-all duration-300",
                isActive ? "text-heritage-red scale-110" : "text-heritage-black/40 hover:text-heritage-red"
              )}
            >
              <Icon className={clsx("h-6 w-6", isActive && "fill-heritage-red/10")} />
              <span className="text-[9px] font-black uppercase tracking-widest mt-1">
                {item.name}
              </span>
              {isActive && (
                <div className="absolute bottom-1 h-1 w-1 rounded-full bg-heritage-gold" />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
