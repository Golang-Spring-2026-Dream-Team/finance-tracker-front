import { requestJson } from "@/shared/api/http";

export interface MonthlyProfitPoint {
  month: string;
  income: string;
  expense: string;
  profit: string;
}

export interface AnalyticsSummary {
  period_start: string;
  period_end: string;
  income: string;
  expense: string;
  profit: string;
}

export interface AnalyticsDailyPoint {
  date: string;
  income: string;
  expense: string;
  profit: string;
}

export interface AnalyticsCategoryExpense {
  category: string;
  amount: string;
}

export interface AnalyticsNetWorth {
  total_balance: string;
  as_of: string;
}

const rangeParams = (from?: string, to?: string) => {
  const p = new URLSearchParams();
  if (from) p.set("from", from);
  if (to) p.set("to", to);
  const q = p.toString();
  return q ? `?${q}` : "";
};

export const analyticsApi = {
  monthlyProfit: (months = 6) =>
    requestJson<MonthlyProfitPoint[]>(`/analytics/monthly-profit?months=${months}`, { auth: true }),

  summary: (from?: string, to?: string) =>
    requestJson<AnalyticsSummary>(`/analytics/summary${rangeParams(from, to)}`, { auth: true }),

  lastMonthSummary: () =>
    requestJson<AnalyticsSummary>(`/analytics/summary/last-month`, { auth: true }),

  dailyProfit: (from?: string, to?: string) =>
    requestJson<AnalyticsDailyPoint[]>(`/analytics/daily-profit${rangeParams(from, to)}`, { auth: true }),

  byCategory: (from?: string, to?: string) =>
    requestJson<AnalyticsCategoryExpense[]>(`/analytics/by-category${rangeParams(from, to)}`, { auth: true }),

  cashflow: (from?: string, to?: string) =>
    requestJson<AnalyticsDailyPoint[]>(`/analytics/cashflow${rangeParams(from, to)}`, { auth: true }),

  netWorth: () =>
    requestJson<AnalyticsNetWorth>(`/analytics/net-worth`, { auth: true }),

  lastMonthExpenseByCategory: () =>
    requestJson<AnalyticsCategoryExpense[]>(`/analytics/expense-categories/last-month`, { auth: true }),
};
