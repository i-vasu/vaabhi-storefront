'use client';

import clsx from 'clsx';
import { useCurrency } from 'lib/currency-context';

const Price = ({
  amount,
  className,
  currencyCode = 'INR',
  currencyCodeClassName
}: {
  amount: string;
  className?: string;
  currencyCode: string;
  currencyCodeClassName?: string;
} & React.ComponentProps<'p'>) => {
  const { formatPrice } = useCurrency();
  // Assume input amount is always in INR (base currency) for now, or handle conversion differently.
  // Ideally, backend should send base currency. If currencyCode matches context, fine.
  // But our simple context does simple conversion from INR.
  // If the product price is already in the target currency, we shouldn't convert again.
  // However, the backend sends INR usually.
  
  // Since we don't know if 'amount' is INR or not without context, we assume the input 'currencyCode' tells us.
  // If input is INR, we convert. If not, we just show it (or convert if we had cross-rates).
  // For this PoC, we assume base price is INR.
  
  const priceValue = parseFloat(amount);

  return (
    <p suppressHydrationWarning={true} className={clsx('font-black text-heritage-gold', className)}>
      {currencyCode === 'INR' ? formatPrice(priceValue) : (
          <>
            {new Intl.NumberFormat(undefined, {
                style: 'currency',
                currency: currencyCode,
                currencyDisplay: 'narrowSymbol'
            }).format(priceValue)}
            <span className={clsx('ml-1 inline text-xs align-top opacity-60', currencyCodeClassName)}>{currencyCode}</span>
          </>
      )}
    </p>
  );
};

export default Price;
