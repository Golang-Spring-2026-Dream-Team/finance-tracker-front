export interface ExchangeRates {
  base: string;
  rates: Record<string, number>;
}

// Fallback rates relative to USD (updated periodically)
const FALLBACK_RATES: Record<string, number> = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  KZT: 511,
  JPY: 154,
  RUB: 89,
};

export const fetchRates = async (): Promise<ExchangeRates> => {
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/USD");
    if (!res.ok) throw new Error("non-ok response");
    const data = await res.json();
    return { base: "USD", rates: data.rates as Record<string, number> };
  } catch {
    return { base: "USD", rates: FALLBACK_RATES };
  }
};

export const convert = (
  amount: number,
  from: string,
  to: string,
  rates: Record<string, number>,
): number => {
  if (from === to) return amount;
  const fromRate = rates[from];
  const toRate = rates[to];
  if (!fromRate || !toRate) return amount;
  return (amount / fromRate) * toRate;
};
