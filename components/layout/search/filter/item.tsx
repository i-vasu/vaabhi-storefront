'use client';

import clsx from 'clsx';
import type { SortFilterItem } from 'lib/constants';
import { createUrl } from 'lib/utils';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import type { ListItem, PathFilterItem } from '.';

function PathFilterItem({ item }: { item: PathFilterItem }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = pathname === item.path;
  const newParams = new URLSearchParams(searchParams.toString());
  const DynamicTag = active ? 'p' : Link;

  newParams.delete('q');

  return (
    <li className="mt-3 flex items-center text-sm text-neutral-600 dark:text-neutral-400" key={item.title}>
      <DynamicTag
        href={createUrl(item.path, newParams)}
        className={clsx(
            'group flex w-full items-center gap-3 transition-colors hover:text-black dark:hover:text-white',
          {
            'font-bold text-luxury-black dark:text-white': active
          }
        )}
      >
        <div className={clsx("h-4 w-4 border border-neutral-300 transition-colors group-hover:border-luxury-gold flex items-center justify-center", {
            "bg-luxury-black border-luxury-black text-white": active,
            "bg-transparent": !active
        })}>
             {active && <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 4L3.5 6.5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
        </div>
        <span>{item.title}</span>
      </DynamicTag>
    </li>
  );
}

function SortFilterItem({ item }: { item: SortFilterItem }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const active = searchParams.get('sort') === item.slug;
  const q = searchParams.get('q');
  const href = createUrl(
    pathname,
    new URLSearchParams({
      ...(q && { q }),
      ...(item.slug && item.slug.length && { sort: item.slug })
    })
  );
  const DynamicTag = active ? 'p' : Link;

  return (
    <li className="mt-3 flex items-center text-sm text-neutral-600 dark:text-neutral-400" key={item.title}>
      <DynamicTag
        prefetch={!active ? false : undefined}
        href={href}
        className={clsx('group flex w-full items-center gap-3 transition-colors hover:text-black dark:hover:text-white', {
          'font-bold text-luxury-black dark:text-white': active
        })}
      >
        <div className={clsx("h-4 w-4 rounded-full border border-neutral-300 transition-colors group-hover:border-luxury-gold flex items-center justify-center", {
            "border-luxury-gold": active,
            "bg-transparent": !active
        })}>
            {active && <div className="h-2 w-2 rounded-full bg-luxury-gold" />}
        </div>
        <span>{item.title}</span>
      </DynamicTag>
    </li>
  );
}

export function FilterItem({ item }: { item: ListItem }) {
  return 'path' in item ? <PathFilterItem item={item} /> : <SortFilterItem item={item} />;
}
