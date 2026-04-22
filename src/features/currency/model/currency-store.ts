import { create } from "zustand";

export type CurrencyCode = "USD" | "EUR" | "GBP" | "KZT" | "JPY" | "RUB";

interface CurrencyInfo {
  code: CurrencyCode;
  symbol: string;
  name: string;
}

export const currencies: CurrencyInfo[] = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "KZT", symbol: "₸", name: "Kazakhstani Tenge" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "RUB", symbol: "₽", name: "Russian Ruble" },
];

// Fallback rates relative to USD
const FALLBACK_RATES: Record<string, number> = {
  USD: 1, EUR: 0.92, GBP: 0.79, KZT: 511, JPY: 154, RUB: 89,
};

interface CurrencyState {
  currency: CurrencyInfo;
  rates: Record<string, number>;
  setCurrency: (code: CurrencyCode) => void;
  setRates: (rates: Record<string, number>) => void;
  // Format amount already in the selected currency
  format: (amount: number) => string;
  // Convert from source currency then format
  formatConverted: (amount: number, fromCurrency: string) => string;
  // Raw conversion without formatting
  convert: (amount: number, fromCurrency: string) => number;
}

export const useCurrency = create<CurrencyState>((set, get) => ({
  currency: currencies[0],
  rates: FALLBACK_RATES,

  setCurrency: (code) =>
    set((state) => {
      const found = currencies.find((c) => c.code === code);
      return found ? { currency: found } : state;
    }),

  setRates: (rates) => set({ rates }),

  format: (amount) => {
    const { currency } = get();
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  },

  convert: (amount, fromCurrency) => {
    const { currency, rates } = get();
    if (fromCurrency === currency.code) return amount;
    const fromRate = rates[fromCurrency];
    const toRate = rates[currency.code];
    if (!fromRate || !toRate) return amount;
    return (amount / fromRate) * toRate;
  },

  formatConverted: (amount, fromCurrency) => {
    const { convert, format } = get();
    return format(convert(amount, fromCurrency));
  },
}));
