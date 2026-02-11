'use client';

import { Dialog, Transition } from '@headlessui/react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Fragment, Suspense, useEffect, useState } from 'react';

import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import CurrencySelector from 'components/layout/currency-selector';
import { Collection, Menu } from 'lib/backend';
import Search, { SearchSkeleton } from './search';

export default function MobileMenu({ menu, collections }: { menu: Menu[], collections: Collection[] }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const openMobileMenu = () => setIsOpen(true);
  const closeMobileMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathname, searchParams]);

  return (
    <>
      <button
        onClick={openMobileMenu}
        aria-label="Open mobile menu"
        className="flex h-11 w-11 items-center justify-center text-heritage-red transition-all hover:scale-110 active:scale-95 md:hidden"
      >
        <Bars3Icon className="h-6 w-6" />
      </button>
      <Transition show={isOpen}>
        <Dialog onClose={closeMobileMenu} className="relative z-50">
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="opacity-0 backdrop-blur-none"
            enterTo="opacity-100 backdrop-blur-[.5px]"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="opacity-100 backdrop-blur-[.5px]"
            leaveTo="opacity-0 backdrop-blur-none"
          >
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          </Transition.Child>
          <Transition.Child
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition-all ease-in-out duration-200"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="fixed bottom-0 left-0 right-0 top-0 flex h-full w-full flex-col bg-white pb-6 dark:bg-black shadow-xl">
              <div className="p-4 flex justify-between items-center border-b border-neutral-100 dark:border-neutral-800">
                <span className="text-lg font-serif font-bold uppercase tracking-widest">Menu</span>
                <button
                  className="flex h-11 w-11 items-center justify-center rounded-md border border-neutral-200 text-black transition-colors dark:border-neutral-700 dark:text-white"
                  onClick={closeMobileMenu}
                  aria-label="Close mobile menu"
                >
                  <XMarkIcon className="h-6" />
                </button>
              </div>

               <div className="p-4 space-y-6 overflow-y-auto">
                 <div className="mb-4 w-full">
                   <Suspense fallback={<SearchSkeleton />}>
                     <Search />
                   </Suspense>
                 </div>

                 {/* Main Navigation Links */}
                 <ul className="space-y-4">
                    <li>
                       <Link href="/search?sort=created_at" className="text-xl font-medium block" onClick={closeMobileMenu}>New Arrivals</Link>
                    </li>
                    <li>
                       <Link href="/search" className="text-xl font-medium block" onClick={closeMobileMenu}>Shop All</Link>
                    </li>
                 </ul>
                 
                 {/* Collections Grid */}
                 <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800">
                    <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-4">Collections</h3>
                    <ul className="grid grid-cols-2 gap-4">
                        {collections.map((item) => (
                           <li key={item.handle}>
                              <Link 
                                href={item.path} 
                                className="text-sm text-neutral-600 dark:text-neutral-400 block p-2 bg-neutral-50 dark:bg-neutral-900 rounded-lg text-center"
                                onClick={closeMobileMenu}
                              >
                                {item.title}
                              </Link>
                           </li>
                        ))}
                    </ul>
                 </div>

                 {/* Footer Links */}
                 <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800">
                    <ul className="space-y-2">
                      {menu.map((item: Menu) => (
                        <li key={item.title}>
                          <Link href={item.path} onClick={closeMobileMenu} className="text-sm font-bold uppercase tracking-widest text-neutral-500">
                            {item.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                 </div>

                 <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800">
                    <p className="mb-4 text-xs font-black uppercase tracking-widest text-neutral-400">Settings</p>
                    <CurrencySelector />
                 </div>
               </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </>
  );
}
