import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import clsx from 'clsx';

export default function OpenCart({
  className,
  quantity
}: {
  className?: string;
  quantity?: number;
}) {
  return (
    <div className="relative flex h-10 w-10 md:h-11 md:w-11 items-center justify-center rounded-full text-neutral-600 transition-colors hover:bg-heritage-red/5 hover:text-heritage-gold dark:text-neutral-400 dark:hover:bg-neutral-900 border-none">
      <ShoppingCartIcon
        className={clsx('h-5 w-5 transition-all ease-in-out hover:scale-110', className)}
      />

      {quantity ? (
        <div className="absolute top-1 right-1 h-4 w-4 rounded-full bg-heritage-red text-[8px] font-black text-white flex items-center justify-center border border-heritage-gold shadow-sm">
          {quantity}
        </div>
      ) : null}
    </div>
  );
}
