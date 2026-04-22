import { requestJson } from "@/shared/api/http";
import { Account } from "@/shared/api/types";

interface CreateAccountPayload {
  name: string;
  account_type: "cash" | "bank_card" | "e_wallet";
  currency: string;
  balance: string;
}

interface UpdateAccountPayload {
  name?: string;
  account_type?: "cash" | "bank_card" | "e_wallet";
  currency?: string;
}

export const accountsApi = {
  list: () =>
    requestJson<Account[]>("/accounts", { auth: true }),
  create: (payload: CreateAccountPayload) =>
    requestJson<Account>("/accounts", {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    }),
  update: (id: number, payload: UpdateAccountPayload) =>
    requestJson<Account>(`/accounts/${id}`, {
      method: "PATCH",
      auth: true,
      body: JSON.stringify(payload),
    }),
  remove: (id: number) =>
    requestJson<void>(`/accounts/${id}`, { method: "DELETE", auth: true }),
};
