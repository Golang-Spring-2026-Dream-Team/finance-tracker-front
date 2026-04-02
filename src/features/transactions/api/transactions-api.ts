import { requestJson } from "@/shared/api/http";
import { Transaction } from "@/shared/api/types";

interface ListTransactionsParams {
  page?: number;
  limit?: number;
}

interface CreateTransactionPayload {
  account_id: number;
  amount: string;
  currency: string;
  type: "income" | "expense" | "transfer";
  description: string;
  transacted_at: string;
  notes?: string;
}

const toQueryString = (params: Record<string, string | number | undefined>): string => {
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      searchParams.set(key, String(value));
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

export const transactionsApi = {
  list: (params: ListTransactionsParams = {}) =>
    requestJson<Transaction[]>(`/transactions${toQueryString(params)}`, {
      auth: true,
    }),
  create: (payload: CreateTransactionPayload) =>
    requestJson<Transaction>("/transactions", {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    }),
};
