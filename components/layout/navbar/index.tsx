import CartModal from 'components/cart/modal';
import LogoSquare from 'components/logo-square';
import { getCollections, getMenu, getTenantConfig } from 'lib/backend';
import Link from 'next/link';
import { Suspense } from 'react';
import MegaMenu from './mega-menu';
import MobileMenu from './mobile-menu';
import Search, { SearchSkeleton } from './search';
import UserNav from './user-nav';

export async function Navbar() {
  const menu = await getMenu('next-js-frontend-header-menu');
  const collections = await getCollections();
  const tenant = await getTenantConfig();

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between bg-white/90 p-3 backdrop-blur-md lg:px-6 dark:bg-black/95 border-b border-heritage-gold/20 shadow-sm">
      {/* Left: Menu Icon (Mobile) / Mega Menu (Desktop) */}
      <div className="flex w-1/4 items-center md:w-1/3">
        <div className="md:hidden">
          <Suspense fallback={null}>
            <MobileMenu menu={menu} collections={collections} />
          </Suspense>
        </div>
        <div className="hidden md:block">
           <MegaMenu collections={collections} />
        </div>
      </div>

      {/* Center: Brand Logo */}
      <div className="flex flex-1 justify-center md:w-1/3">
          <Link
            href="/"
            prefetch={true}
            className="flex items-center justify-center gap-2 group"
          >
            <LogoSquare size="sm" />
            <div className="text-lg font-serif font-black tracking-[0.2em] uppercase md:text-2xl lg:text-3xl transition-colors group-hover:text-heritage-red">
              {tenant.name}
            </div>
          </Link>
      </div>

      {/* Right: Actions */}
      <div className="flex w-1/4 justify-end items-center gap-1 md:w-1/3 md:gap-4">
        <div className="hidden lg:block w-48">
             <Suspense fallback={<SearchSkeleton />}>
                <Search />
             </Suspense>
        </div>
        <UserNav />
        <CartModal />
      </div>
    </nav>
  );
}
