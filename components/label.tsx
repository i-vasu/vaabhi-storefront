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
      className={clsx('absolute bottom-0 left-0 flex w-full px-2 pb-2 md:px-4 md:pb-4 @container/label', {
        'lg:px-20 lg:pb-[35%]': position === 'center'
      })}
    >
      <div className="flex w-full items-center rounded-2xl border border-heritage-gold bg-heritage-cream/90 p-1 text-[10px] md:text-xs font-black text-heritage-red backdrop-blur-md transition-all group-hover:bg-heritage-red group-hover:text-heritage-gold group-hover:border-heritage-red">
        <h3 className="mr-2 line-clamp-1 grow pl-2 leading-none tracking-widest uppercase">{title}</h3>
        <Price
          className="flex-none rounded-xl bg-heritage-red px-2 py-1.5 md:px-3 md:py-2 text-white transition-colors group-hover:bg-heritage-gold group-hover:text-heritage-black"
          amount={amount}
          currencyCode={currencyCode}
          currencyCodeClassName="hidden @[200px]/label:inline"
        />
      </div>
    </div>
  );
};

export default Label;
