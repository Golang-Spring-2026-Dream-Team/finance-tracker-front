import React from "react";
import { QueryClient, QueryClientProvider, useQuery } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { MuiProvider } from "@/providers/MuiProvider";
import { useLocaleStore } from "@/shared/lib/i18n";
import { authApi } from "@/features/auth/api/auth-api";
import { useAuthStore } from "@/features/auth/model/auth-store";
import { useCurrency, type CurrencyCode } from "@/features/currency/model/currency-store";
import { fetchRates } from "@/features/currency/api/exchange-rates-api";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ImportPage from "@/pages/Import";
import Transactions from "@/pages/Transactions";
import Wallets from "@/pages/Wallets";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const ProtectedRoute = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
};

const GuestRoute = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  if (accessToken) {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

const AppRoutes = () => {
  const accessToken = useAuthStore((state) => state.accessToken);
  const setUser = useAuthStore((state) => state.setUser);
  const clearSession = useAuthStore((state) => state.clearSession);
  const setCurrency = useCurrency((state) => state.setCurrency);
  const setRates = useCurrency((state) => state.setRates);

  React.useEffect(() => {
    fetchRates().then((r) => setRates(r.rates));
  }, [setRates]);

  const meQuery = useQuery({
    queryKey: ["auth", "me", accessToken],
    queryFn: authApi.me,
    enabled: Boolean(accessToken),
    retry: false,
  });

  React.useEffect(() => {
    if (!meQuery.data) {
      return;
    }
    setUser(meQuery.data);
    const code = meQuery.data.currency as CurrencyCode;
    setCurrency(code);
  }, [meQuery.data, setCurrency, setUser]);

  React.useEffect(() => {
    if (meQuery.isError) {
      clearSession();
    }
  }, [clearSession, meQuery.isError]);

  if (accessToken && meQuery.isPending) {
    return <div className="min-h-screen bg-background" />;
  }

  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Index />} />
        <Route path="/import" element={<ImportPage />} />
        <Route path="/wallets" element={<Wallets />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/settings" element={<Index />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => {
  useLocaleStore((state) => state.locale);

  return (
    <QueryClientProvider client={queryClient}>
      <MuiProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </MuiProvider>
    </QueryClientProvider>
  );
};

export default App;
