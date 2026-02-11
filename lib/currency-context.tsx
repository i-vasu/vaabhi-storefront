'use client';

import { getExchangeRates } from 'lib/backend';
import React, { createContext, useContext, useEffect, useState } from 'react';

type Currency = 'INR' | 'USD' | 'GBP' | 'AED';

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  convertPrice: (amountInINR: number) => { amount: number; currency: Currency };
  formatPrice: (amountInINR: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>('INR');
  const [rates, setRates] = useState<Record<string, number>>({ INR: 1 });

  useEffect(() => {
    // Load stored currency
    const saved = localStorage.getItem('vaabhi_currency') as Currency;
    if (saved) setCurrency(saved);

    // Fetch rates from backend
    getExchangeRates().then((fetchedRates: Record<string, number>) => {
        setRates(fetchedRates);
    });
  }, []);

  const handleSetCurrency = (c: Currency) => {
    setCurrency(c);
    localStorage.setItem('vaabhi_currency', c);
  };

  const convertPrice = (amountInINR: number) => {
    const rate = rates[currency] || 1;
    return {
      amount: amountInINR * rate,
      currency
    };
  };

  const formatPrice = (amountInINR: number) => {
    const { amount, currency: code } = convertPrice(amountInINR);
    return new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: code,
      currencyDisplay: 'narrowSymbol'
    }).format(amount);
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: handleSetCurrency, convertPrice, formatPrice }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
}
