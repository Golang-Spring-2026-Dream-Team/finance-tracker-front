import { requestJson } from "@/shared/api/http";
import { AuthTokens, User } from "@/shared/api/types";

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  currency: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  register: (payload: RegisterPayload) =>
    requestJson<AuthTokens>("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  login: (payload: LoginPayload) =>
    requestJson<AuthTokens>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  me: () =>
    requestJson<User>("/users/me", {
      auth: true,
    }),
  logout: () =>
    requestJson<void>("/auth/logout", {
      method: "POST",
      auth: true,
    }),
};
