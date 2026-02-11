import clsx from 'clsx';
import Image from 'next/image';
import Label from '../label';

export function GridTileImage({
  isInteractive = true,
  active,
  label,
  ...props
}: {
  isInteractive?: boolean;
  active?: boolean;
  label?: {
    title: string;
    amount: string;
    currencyCode: string;
    rating?: number;
    position?: 'bottom' | 'center';
    date?: string;
  };
} & React.ComponentProps<typeof Image>) {
  return (
    <div
      className={clsx(
        'group flex h-full w-full items-center justify-center overflow-hidden bg-white dark:bg-neutral-900',
        {
          relative: label,
          'ring-2 ring-heritage-gold': active,
          'border-none': !active
        }
      )}
    >
      {props.src ? (
        <Image
          className={clsx('relative h-full w-full object-cover transition duration-700 ease-in-out', {
            'group-hover:scale-110': isInteractive
          })}
          {...props}
        />
      ) : null}
      {label ? (
        <Label
          title={label.title}
          amount={label.amount}
          currencyCode={label.currencyCode}
          rating={label.rating}
          position={label.position}
        />
      ) : null}
    </div>
  );
}
