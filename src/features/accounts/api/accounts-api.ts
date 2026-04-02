import { requestJson } from "@/shared/api/http";
import { Account } from "@/shared/api/types";

interface CreateAccountPayload {
  name: string;
  account_type: "cash" | "bank_card" | "e_wallet";
  currency: string;
  balance: string;
}

export const accountsApi = {
  list: () =>
    requestJson<Account[]>("/accounts", {
      auth: true,
    }),
  create: (payload: CreateAccountPayload) =>
    requestJson<Account>("/accounts", {
      method: "POST",
      auth: true,
      body: JSON.stringify(payload),
    }),
};
