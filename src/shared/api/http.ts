import { useAuthStore } from "@/features/auth/model/auth-store";
import { ApiErrorEnvelope, AuthTokens } from "@/shared/api/types";

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");
const API_PREFIX = "/api/v1";

export class ApiError extends Error {
  status: number;
  code: string;

  constructor(status: number, message: string, code = "UNKNOWN_ERROR") {
    super(message);
    this.status = status;
    this.code = code;
  }
}

const buildUrl = (path: string): string => `${API_BASE_URL}${API_PREFIX}${path}`;

async function parseError(res: Response): Promise<ApiError> {
  let payload: ApiErrorEnvelope | null = null;
  try {
    payload = (await res.json()) as ApiErrorEnvelope;
  } catch {
    payload = null;
  }
  const code = payload?.error?.code || "HTTP_ERROR";
  const message = payload?.error?.message || `Request failed with status ${res.status}`;
  return new ApiError(res.status, message, code);
}

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  const state = useAuthStore.getState();
  if (!state.refreshToken) {
    return null;
  }
  if (refreshPromise) {
    return refreshPromise;
  }

  refreshPromise = (async () => {
    try {
      const res = await fetch(buildUrl("/auth/refresh"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: state.refreshToken }),
      });

      if (!res.ok) {
        useAuthStore.getState().clearSession();
        return null;
      }

      const tokens = (await res.json()) as AuthTokens;
      useAuthStore.getState().setSession({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
      });

      return tokens.access_token;
    } catch {
      useAuthStore.getState().clearSession();
      return null;
    } finally {
      refreshPromise = null;
    }
  })();

  return refreshPromise;
}

interface RequestOptions extends RequestInit {
  auth?: boolean;
  retryUnauthorized?: boolean;
}

export async function requestJson<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = false, retryUnauthorized = true, headers, ...rest } = options;
  const state = useAuthStore.getState();
  const authHeaders =
    auth && state.accessToken ? { Authorization: `Bearer ${state.accessToken}` } : {};

  const res = await fetch(buildUrl(path), {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...authHeaders,
      ...headers,
    },
  });

  if (res.status === 401 && auth && retryUnauthorized) {
    const newAccessToken = await refreshAccessToken();
    if (newAccessToken) {
      return requestJson<T>(path, { ...options, retryUnauthorized: false });
    }
  }

  if (!res.ok) {
    throw await parseError(res);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return (await res.json()) as T;
}
