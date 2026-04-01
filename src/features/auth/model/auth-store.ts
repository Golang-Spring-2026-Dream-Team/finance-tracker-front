import { create } from "zustand";
import { User } from "@/shared/api/types";

const ACCESS_TOKEN_KEY = "finance_tracker_access_token";
const REFRESH_TOKEN_KEY = "finance_tracker_refresh_token";

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  setSession: (tokens: { accessToken: string; refreshToken: string }) => void;
  setUser: (user: User | null) => void;
  clearSession: () => void;
}

const getStoredToken = (key: string): string | null => {
  if (typeof window === "undefined") {
    return null;
  }
  return localStorage.getItem(key);
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: getStoredToken(ACCESS_TOKEN_KEY),
  refreshToken: getStoredToken(REFRESH_TOKEN_KEY),
  user: null,
  setSession: ({ accessToken, refreshToken }) => {
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
    set({ accessToken, refreshToken });
  },
  setUser: (user) => set({ user }),
  clearSession: () => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    set({ accessToken: null, refreshToken: null, user: null });
  },
}));
