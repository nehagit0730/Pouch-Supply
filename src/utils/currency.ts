import { useState, useEffect } from 'react';

export interface CurrencyInfo {
  code: string;
  symbol: string;
  name: string;
  flag: string;
  rateAgainstINR: number;
}

export const SUPPORTED_CURRENCIES: CurrencyInfo[] = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: '🇮🇳', rateAgainstINR: 1 },
  { code: 'GBP', symbol: '£', name: 'British Pound', flag: '🇬🇧', rateAgainstINR: 0.0095 },
  { code: 'USD', symbol: '$', name: 'US Dollar', flag: '🇺🇸', rateAgainstINR: 0.012 },
  { code: 'EUR', symbol: '€', name: 'Euro', flag: '🇪🇺', rateAgainstINR: 0.011 },
  { code: 'AED', symbol: 'AED', name: 'UAE Dirham', flag: '🇦🇪', rateAgainstINR: 0.044 },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', flag: '🇨🇦', rateAgainstINR: 0.016 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', flag: '🇦🇺', rateAgainstINR: 0.018 },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', flag: '🇸🇬', rateAgainstINR: 0.016 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', flag: '🇯🇵', rateAgainstINR: 1.8 }
];

export function getActiveCurrency(): CurrencyInfo {
  try {
    const saved = localStorage.getItem('ps_store_currency');
    if (saved) {
      const found = SUPPORTED_CURRENCIES.find(c => c.code === saved.toUpperCase());
      if (found) return found;
    }
  } catch (e) {}
  // Default to INR (India)
  return SUPPORTED_CURRENCIES[0];
}

export function setActiveCurrency(code: string): CurrencyInfo {
  const found = SUPPORTED_CURRENCIES.find(c => c.code === code.toUpperCase()) || SUPPORTED_CURRENCIES[0];
  try {
    localStorage.setItem('ps_store_currency', found.code);
    window.dispatchEvent(new CustomEvent('store-currency-changed', { detail: found }));
  } catch (e) {}
  return found;
}

export function formatPrice(amount: number | string | undefined | null, currencyCode?: string): string {
  const numericAmount = typeof amount === 'string' ? parseFloat(amount) || 0 : (amount || 0);
  const curr = currencyCode 
    ? (SUPPORTED_CURRENCIES.find(c => c.code === currencyCode.toUpperCase()) || getActiveCurrency())
    : getActiveCurrency();

  if (curr.code === 'INR') {
    return `₹${numericAmount.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
  return `${curr.symbol}${numericAmount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function useStoreCurrency(initialCode?: string) {
  const [currency, setCurrencyState] = useState<CurrencyInfo>(() => {
    if (initialCode) {
      const found = SUPPORTED_CURRENCIES.find(c => c.code === initialCode.toUpperCase());
      if (found) return found;
    }
    return getActiveCurrency();
  });

  useEffect(() => {
    const handler = (e: any) => {
      if (e.detail && e.detail.code) {
        setCurrencyState(e.detail);
      } else {
        setCurrencyState(getActiveCurrency());
      }
    };
    window.addEventListener('store-currency-changed', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('store-currency-changed', handler);
      window.removeEventListener('storage', handler);
    };
  }, []);

  const changeCurrency = (code: string) => {
    const updated = setActiveCurrency(code);
    setCurrencyState(updated);
  };

  const format = (amt: number | string | undefined | null) => {
    return formatPrice(amt, currency.code);
  };

  return {
    currency,
    setCurrency: changeCurrency,
    formatPrice: format,
    symbol: currency.symbol,
    code: currency.code
  };
}
