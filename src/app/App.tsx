import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/shared/ui/sonner";
import { Toaster } from "@/shared/ui/toaster";
import { TooltipProvider } from "@/shared/ui/tooltip";
import { useLocaleStore } from "@/shared/lib/i18n";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ImportPage from "@/pages/Import";
import Transactions from "@/pages/Transactions";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  useLocaleStore((state) => state.locale);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/import" element={<ImportPage />} />
            <Route path="/budgets" element={<Index />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/settings" element={<Index />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
