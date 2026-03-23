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

interface CurrencyState {
  currency: CurrencyInfo;
  setCurrency: (code: CurrencyCode) => void;
  format: (amount: number) => string;
}

export const useCurrency = create<CurrencyState>((set, get) => ({
  currency: currencies[0],
  setCurrency: (code) =>
    set((state) => {
      const found = currencies.find((c) => c.code === code);
      return found ? { currency: found } : state;
    }),
  format: (amount) => {
    const { currency } = get();
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.code,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(amount);
  },
}));
