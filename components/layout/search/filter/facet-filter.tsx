'use client';

import clsx from 'clsx';
import { createUrl } from 'lib/utils';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

export type FacetItem = { title: string; value: string; colorCode?: string };

export default function FacetFilter({
  title,
  paramName,
  items,
  type = 'checkbox'
}: {
  title: string;
  paramName: string;
  items: FacetItem[];
  type?: 'checkbox' | 'color';
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentValues = searchParams.getAll(paramName); // Supports multiple values eventually, but for now simplest is single? Nah, let's support multiple in URL logic if possible, but standard Link replace behavior replaces.

  return (
    <div className="mb-8">
      <h3 className="mb-4 text-xs font-bold uppercase tracking-widest text-neutral-500 dark:text-neutral-400">
        {title}
      </h3>
      <ul className="space-y-3">
        {items.map((item) => {
          const isActive = currentValues.includes(item.value);
          
          // Logic to toggle: if active, remove. if not, add (or replace).
          // Simplest for now: Single select for simplicity in PoC unless we want multi.
          // Let's do Single Select for now to match Sort/Collection behavior easily.
          // Real apps use arrays.
          
          const newParams = new URLSearchParams(searchParams.toString());
          if (isActive) {
              newParams.delete(paramName);
          } else {
              newParams.set(paramName, item.value); // Set replaces. To add multiple used append, but createUrl logic handles ?param=val
          }

          const href = createUrl(pathname, newParams);
          const DynamicTag = Link; // Always link for filters to update URL

          if (type === 'color') {
             return (
                 <li key={item.value} className="inline-block mr-2 mb-2">
                     <DynamicTag
                        href={href}
                        title={item.title}
                        className={clsx("block h-8 w-8 rounded-full border transition-all", {
                            "border-luxury-black ring-1 ring-luxury-black ring-offset-2": isActive,
                            "border-neutral-200 hover:border-neutral-400": !isActive
                        })}
                        style={{ backgroundColor: item.colorCode || item.value }}
                     />
                 </li>
             )
          }

          return (
            <li key={item.value}>
              <DynamicTag
                href={href}
                className={clsx(
                  'group flex w-full items-center gap-3 text-sm transition-colors hover:text-black dark:hover:text-white',
                  {
                    'font-bold text-luxury-black dark:text-white': isActive,
                    'text-neutral-600 dark:text-neutral-400': !isActive
                  }
                )}
              >
                <div className={clsx("h-4 w-4 border border-neutral-300 transition-colors group-hover:border-luxury-gold flex items-center justify-center", {
                    "bg-luxury-black border-luxury-black text-white": isActive,
                    "bg-transparent": !isActive
                })}>
                    {isActive && <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <span>{item.title}</span>
              </DynamicTag>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
