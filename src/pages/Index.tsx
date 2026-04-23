import { useMemo, useState } from "react";
import { AppLayout } from "@/widgets/app-layout/AppLayout";
import { StatCard } from "@/widgets/dashboard/StatCard";
import { SpendingChart } from "@/widgets/dashboard/SpendingChart";
import { RecentTransactions } from "@/widgets/dashboard/RecentTransactions";
import { DailyCashflowChart } from "@/widgets/dashboard/DailyCashflowChart";
import { CategoryChart } from "@/widgets/dashboard/CategoryChart";
import { useCurrency } from "@/features/currency/model/currency-store";
import { t } from "@/shared/lib/i18n";
import { TrendingUp, TrendingDown, PiggyBank, Landmark } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { transactionsApi } from "@/features/transactions/api/transactions-api";
import { authApi } from "@/features/auth/api/auth-api";
import { analyticsApi } from "@/features/analytics/api/analytics-api";

type Period = "7d" | "30d" | "month" | "last-month";

const PERIOD_LABELS: Record<Period, string> = {
  "7d": "7 days",
  "30d": "30 days",
  month: "This month",
  "last-month": "Last month",
};

const toDate = (d: Date) => d.toISOString().split("T")[0];

const getPeriodRange = (period: Period): { from: string; to: string } => {
  const now = new Date();
  if (period === "7d") {
    const from = new Date(now);
    from.setDate(from.getDate() - 6);
    return { from: toDate(from), to: toDate(now) };
  }
  if (period === "30d") {
    const from = new Date(now);
    from.setDate(from.getDate() - 29);
    return { from: toDate(from), to: toDate(now) };
  }
  if (period === "month") {
    const from = new Date(now.getFullYear(), now.getMonth(), 1);
    return { from: toDate(from), to: toDate(now) };
  }
  // last-month
  const first = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const last = new Date(now.getFullYear(), now.getMonth(), 0);
  return { from: toDate(first), to: toDate(last) };
};

const Index = () => {
  const { format } = useCurrency();
  const [period, setPeriod] = useState<Period>("30d");

  const { from, to } = useMemo(() => getPeriodRange(period), [period]);

  const meQuery = useQuery({ queryKey: ["auth", "me"], queryFn: authApi.me });

  const summaryQuery = useQuery({
    queryKey: ["analytics", "summary", from, to],
    queryFn: () => analyticsApi.summary(from, to),
  });

  const dailyQuery = useQuery({
    queryKey: ["analytics", "daily-profit", from, to],
    queryFn: () => analyticsApi.dailyProfit(from, to),
  });

  const categoryQuery = useQuery({
    queryKey: ["analytics", "by-category", from, to],
    queryFn: () => analyticsApi.byCategory(from, to),
  });

  const netWorthQuery = useQuery({
    queryKey: ["analytics", "net-worth"],
    queryFn: analyticsApi.netWorth,
  });

  const monthlyQuery = useQuery({
    queryKey: ["analytics", "monthly-profit"],
    queryFn: () => analyticsApi.monthlyProfit(6),
  });

  const transactionsQuery = useQuery({
    queryKey: ["transactions", "dashboard"],
    queryFn: () => transactionsApi.list({ page: 1, limit: 5 }),
  });

  const summary = summaryQuery.data;
  const totalIncome = Number(summary?.income ?? 0);
  const totalExpenses = Number(summary?.expense ?? 0);
  const profit = Number(summary?.profit ?? 0);
  const savingsPercent = totalIncome > 0 ? (profit / totalIncome) * 100 : 0;

  const netWorthValue = netWorthQuery.data
    ? Number(netWorthQuery.data.total_balance)
    : null;

  const chartData = useMemo(
    () =>
      (monthlyQuery.data || []).map((p) => ({
        month: new Date(p.month + "-01").toLocaleString("ru-RU", {
          month: "short",
          year: "2-digit",
        }),
        income: Number(p.income),
        expenses: Number(p.expense),
      })),
    [monthlyQuery.data],
  );

  const recentTransactions = useMemo(
    () =>
      (transactionsQuery.data || [])
        .slice()
        .sort((a, b) => b.transacted_at.localeCompare(a.transacted_at))
        .slice(0, 5)
        .map((tx) => ({
          id: tx.id,
          name: tx.description,
          category: tx.type === "income" ? "Income" : "Expense",
          currency: tx.currency,
          amount:
            tx.type === "expense"
              ? -Math.abs(Number(tx.amount))
              : Math.abs(Number(tx.amount)),
        })),
    [transactionsQuery.data],
  );

  const isLoading = summaryQuery.isPending || netWorthQuery.isPending;

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
              {t("dashboard.title")}
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              {t("dashboard.welcome")}, {meQuery.data?.name || "User"}
            </p>
          </div>

          {/* Period selector */}
          <div className="flex gap-1 p-1 bg-secondary rounded-xl self-start">
            {(Object.keys(PERIOD_LABELS) as Period[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  period === p
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {PERIOD_LABELS[p]}
              </button>
            ))}
          </div>
        </div>

        {/* Stat cards */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass-card p-5 h-24 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              title="Net Worth"
              value={netWorthValue !== null ? format(netWorthValue) : "—"}
              icon={<Landmark className="w-5 h-5 text-primary-foreground" />}
              gradient="gradient-primary"
            />
            <StatCard
              title={t("dashboard.income")}
              value={format(totalIncome)}
              icon={<TrendingUp className="w-5 h-5 text-success" />}
              change={profit >= 0 ? `+${format(profit)} net` : `${format(profit)} net`}
              changeType={profit >= 0 ? "positive" : "negative"}
            />
            <StatCard
              title={t("dashboard.expenses")}
              value={format(totalExpenses)}
              icon={<TrendingDown className="w-5 h-5 text-destructive" />}
            />
            <StatCard
              title={t("dashboard.savings")}
              value={`${Math.max(0, savingsPercent).toFixed(0)}%`}
              icon={<PiggyBank className="w-5 h-5 text-accent" />}
              changeType={savingsPercent >= 20 ? "positive" : savingsPercent < 0 ? "negative" : "neutral"}
            />
          </div>
        )}

        {/* Daily cashflow + Category breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {dailyQuery.isPending ? (
              <div className="glass-card p-5 h-[312px] animate-pulse" />
            ) : (
              <DailyCashflowChart data={dailyQuery.data || []} />
            )}
          </div>
          <div>
            {categoryQuery.isPending ? (
              <div className="glass-card p-5 h-[312px] animate-pulse" />
            ) : (
              <CategoryChart data={categoryQuery.data || []} />
            )}
          </div>
        </div>

        {/* Monthly trend + Recent transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {monthlyQuery.isPending ? (
              <div className="glass-card p-5 h-[312px] animate-pulse" />
            ) : (
              <SpendingChart data={chartData} />
            )}
          </div>
          <RecentTransactions transactions={recentTransactions} />
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
