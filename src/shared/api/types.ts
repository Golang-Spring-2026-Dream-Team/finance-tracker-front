export interface ApiErrorEnvelope {
  error?: {
    code?: string;
    message?: string;
  };
}

export interface AuthTokens {
  access_token: string;
  expires_in: number;
}

export interface User {
  id: number;
  email: string;
  name: string;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface Account {
  id: number;
  user_id: number;
  name: string;
  account_type: "cash" | "bank_card" | "e_wallet";
  balance: string;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: number;
  account_id: number;
  category_id?: number;
  amount: string;
  currency: string;
  type: "income" | "expense" | "transfer";
  description: string;
  notes?: string;
  transacted_at: string;
  created_at: string;
  updated_at: string;
}
