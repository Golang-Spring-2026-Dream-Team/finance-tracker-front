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

export const analyticsApi = {
  monthlyProfit: (months = 6) =>
    requestJson<MonthlyProfitPoint[]>(`/analytics/monthly-profit?months=${months}`, { auth: true }),

  summary: (from?: string, to?: string) => {
    const params = new URLSearchParams();
    if (from) params.set("from", from);
    if (to) params.set("to", to);
    const q = params.toString();
    return requestJson<AnalyticsSummary>(`/analytics/summary${q ? `?${q}` : ""}`, { auth: true });
  },
};
