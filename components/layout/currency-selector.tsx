'use client';

import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useCurrency } from 'lib/currency-context';
import { Fragment } from 'react';

const currencies = ['INR', 'USD', 'GBP', 'AED'];

export default function CurrencySelector() {
  const { currency, setCurrency } = useCurrency();

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="group inline-flex items-center justify-center text-sm font-medium text-neutral-700 hover:text-black dark:text-neutral-400 dark:hover:text-white">
          <span>{currency}</span>
          <ChevronDownIcon
            className="ml-1 h-3 w-3 flex-shrink-0 text-neutral-500 group-hover:text-black dark:text-neutral-400 dark:group-hover:text-white"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 bottom-full mb-2 w-20 origin-bottom-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:bg-neutral-900 dark:ring-white dark:ring-opacity-10">
          <div className="py-1">
            {currencies.map((c) => (
              <Menu.Item key={c}>
                {({ active }) => (
                  <button
                    onClick={() => setCurrency(c as any)}
                    className={clsx(
                      active ? 'bg-neutral-100 dark:bg-neutral-800' : '',
                      'block w-full px-4 py-2 text-left text-xs font-bold text-neutral-700 dark:text-neutral-300'
                    )}
                  >
                    {c}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
