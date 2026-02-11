'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import Form from 'next/form';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import VisualSearch from './visual-search';

export default function Search() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams?.get('q') || '');
  const [results, setResults] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length > 1) {
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
          const data = await res.json();
          setResults(data);
          setIsOpen(true);
        } catch (e) {
          console.error(e);
        }
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className="relative w-full lg:w-80 xl:w-full" ref={dropdownRef}>
      <Form action="/search" className="w-full relative group">
        <input
          type="text"
          name="q"
          placeholder="SEARCH"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length > 1 && setIsOpen(true)}
          className="w-full border-b border-neutral-300 bg-transparent py-2 pl-2 pr-10 text-xs font-bold uppercase tracking-widest text-black placeholder:text-neutral-400 focus:border-black focus:outline-none dark:border-neutral-700 dark:text-white dark:focus:border-white transition-colors"
        />
        <div className="absolute right-0 top-0 flex h-full items-center gap-3">
          <VisualSearch />
          <button type="submit" aria-label="Search">
            <MagnifyingGlassIcon className="h-5 text-neutral-500 group-hover:text-black dark:group-hover:text-white transition-colors" />
          </button>
        </div>
      </Form>

      {/* Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full z-50 mt-2 w-full overflow-hidden rounded-xl border border-neutral-100 bg-white shadow-2xl dark:border-neutral-800 dark:bg-black">
          <ul className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {results.map((product) => (
              <li key={product.id}>
                <Link
                  href={`/product/${product.handle}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-4 p-4 hover:bg-neutral-50 dark:hover:bg-neutral-900"
                >
                  <div className="relative h-12 w-12 flex-none overflow-hidden rounded-md bg-neutral-100 dark:bg-neutral-800">
                    <Image
                      src={product.featuredImage?.url}
                      alt={product.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-bold">{product.title}</p>
                    <p className="text-xs text-neutral-500">
                      ₹{product.priceRange.minVariantPrice.amount}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
          <div className="bg-neutral-50 p-3 dark:bg-neutral-900/50">
            <Link
              href={`/search?q=${query}`}
              className="text-center block text-xs font-bold uppercase tracking-widest text-neutral-500 hover:text-black"
            >
              See all results →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export function SearchSkeleton() {
  return (
    <form className="w-max-[550px] relative w-full lg:w-80 xl:w-full">
      <input
        placeholder="Search for products..."
        className="w-full rounded-lg border bg-white px-4 py-2 text-sm text-black placeholder:text-neutral-500 dark:border-neutral-800 dark:bg-transparent dark:text-white dark:placeholder:text-neutral-400"
      />
      <div className="absolute right-0 top-0 mr-3 flex h-full items-center">
        <MagnifyingGlassIcon className="h-4" />
      </div>
    </form>
  );
}
