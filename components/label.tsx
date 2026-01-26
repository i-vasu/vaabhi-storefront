import clsx from 'clsx';
import Price from './price';

const Label = ({
  title,
  amount,
  currencyCode,
  rating,
  position = 'bottom'
}: {
  title: string;
  amount: string;
  currencyCode: string;
  rating?: number;
  position?: 'bottom' | 'center';
}) => {
  return (
    <div
      className={clsx('absolute bottom-0 left-0 flex w-full px-4 pb-4 @container/label', {
        'lg:px-20 lg:pb-[35%]': position === 'center'
      })}
    >
      <div className="flex items-center rounded-full border bg-white/70 p-1 text-xs font-semibold text-black backdrop-blur-md dark:border-neutral-800 dark:bg-black/70 dark:text-white">
        <h3 className="mr-2 line-clamp-2 grow pl-2 leading-none tracking-tight">{title}</h3>
        {rating && rating > 0 ? (
          <div className="mr-2 flex items-center text-[10px] text-orange-500">
            ★ {rating.toFixed(1)}
          </div>
        ) : null}
        <Price
          className="flex-none rounded-full bg-blue-600 p-2 text-white"
          amount={amount}
          currencyCode={currencyCode}
          currencyCodeClassName="hidden @[275px]/label:inline"
        />
      </div>
    </div>
  );
};

export default Label;
