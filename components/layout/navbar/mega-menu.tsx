'use client';

import { Transition } from '@headlessui/react';
import clsx from 'clsx';
import { Collection } from 'lib/shopify/types';
import Link from 'next/link';
import { Fragment, useState } from 'react';

export default function MegaMenu({ collections }: { collections: Collection[] }) {
  const [open, setOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const navigation = [
    { name: 'New Arrivals', href: '/search?sort=created_at' },
    { 
      name: 'Collections', 
      href: '/search', 
      isMega: true,
      items: collections 
    },
    { name: 'Accessories', href: '/search?q=accessories' },
    { name: 'Editorial', href: '/blog' }
  ];

  return (
    <nav className="hidden md:flex items-center gap-8" onMouseLeave={() => { setOpen(false); setActiveCategory(null); }}>
      {navigation.map((item) => (
        <div 
          key={item.name} 
          className="relative"
          onMouseEnter={() => {
            if (item.isMega) {
              setOpen(true);
              setActiveCategory(item.name);
            } else {
              setOpen(false);
              setActiveCategory(null);
            }
          }}
        >
          <Link
            href={item.href}
            className={clsx(
              "text-xs font-bold uppercase tracking-widest transition-colors py-4 inline-block",
              activeCategory === item.name ? "text-luxury-gold" : "text-neutral-500 hover:text-black dark:hover:text-white"
            )}
          >
            {item.name}
          </Link>

          {item.isMega && activeCategory === item.name && (
            <Transition
              as={Fragment}
              show={open}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-y-2"
              enterTo="opacity-100 translate-y-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0"
              leaveTo="opacity-0 translate-y-2"
            >
              <div className="absolute left-1/2 -translate-x-1/2 top-full pt-4 w-screen max-w-screen-xl px-4 z-50">
                  <div className="bg-white dark:bg-black border border-neutral-100 dark:border-neutral-800 shadow-2xl rounded-2xl overflow-hidden p-8 grid grid-cols-12 gap-8">
                    
                    {/* Collections List */}
                    <div className="col-span-3 space-y-4 border-r border-neutral-100 dark:border-neutral-800">
                        <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-6">Browse By Category</h3>
                        <ul className="space-y-3">
                            {collections.slice(0, 8).map((collection) => (
                                <li key={collection.handle}>
                                    <Link 
                                        href={collection.path}
                                        className="text-sm font-medium text-neutral-600 hover:text-luxury-gold dark:text-neutral-300 dark:hover:text-luxury-gold transition-colors block"
                                    >
                                        {collection.title}
                                    </Link>
                                </li>
                            ))}
                            <li>
                                <Link href="/search" className="text-sm font-bold underline decoration-luxury-gold underline-offset-4 mt-2 block">
                                    View All
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Featured Sections */}
                    <div className="col-span-5">
                       <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-6">Featured Collection</h3>
                       <Link href="/search/festive-edit" className="group block relative overflow-hidden rounded-xl aspect-[16/9] bg-neutral-100">
                          {/* Placeholder for featured image - In real app, pass this data */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10" />
                          <div className="absolute bottom-4 left-4 z-20 text-white">
                             <p className="text-xs font-bold uppercase tracking-wider mb-1 text-luxury-gold">New Season</p>
                             <p className="text-xl font-serif">The Royal Heritage Edit</p>
                          </div>
                       </Link>
                    </div>

                    <div className="col-span-4">
                        <h3 className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-6">Trending Now</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <Link href="/search?q=sarees" className="group block space-y-2">
                                <div className="aspect-[3/4] bg-neutral-100 rounded-lg overflow-hidden relative">
                                     <div className="absolute inset-x-0 bottom-0 p-2 bg-white/90 dark:bg-black/90 backdrop-blur-sm text-center transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                        <span className="text-[10px] font-bold uppercase">Shop Sarees</span>
                                     </div>
                                </div>
                                <p className="text-xs font-bold text-center">Silk Sarees</p>
                            </Link> 
                             <Link href="/search?q=gowns" className="group block space-y-2">
                                <div className="aspect-[3/4] bg-neutral-100 rounded-lg overflow-hidden relative">
                                    <div className="absolute inset-x-0 bottom-0 p-2 bg-white/90 dark:bg-black/90 backdrop-blur-sm text-center transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                                        <span className="text-[10px] font-bold uppercase">Shop Gowns</span>
                                     </div>
                                </div>
                                <p className="text-xs font-bold text-center">Evening Gowns</p>
                            </Link> 
                        </div>
                    </div>

                  </div>
              </div>
            </Transition>
          )}
        </div>
      ))}
    </nav>
  );
}
