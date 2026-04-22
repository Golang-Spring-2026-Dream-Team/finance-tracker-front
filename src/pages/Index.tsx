import { AppLayout } from "@/widgets/app-layout/AppLayout";
import { StatCard } from "@/widgets/dashboard/StatCard";
import { SpendingChart } from "@/widgets/dashboard/SpendingChart";
import { RecentTransactions } from "@/widgets/dashboard/RecentTransactions";
import { useCurrency } from "@/features/currency/model/currency-store";
import { t } from "@/shared/lib/i18n";
import { TrendingUp, TrendingDown, PiggyBank, DollarSign } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { transactionsApi } from "@/features/transactions/api/transactions-api";
import { accountsApi } from "@/features/accounts/api/accounts-api";
import { authApi } from "@/features/auth/api/auth-api";
import { analyticsApi } from "@/features/analytics/api/analytics-api";

const Index = () => {
  const { format, formatConverted, convert } = useCurrency();

  const meQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: authApi.me,
  });

  const accountsQuery = useQuery({
    queryKey: ["accounts"],
    queryFn: accountsApi.list,
  });

  const transactionsQuery = useQuery({
    queryKey: ["transactions", "dashboard"],
    queryFn: () => transactionsApi.list({ page: 1, limit: 5 }),
  });

  const summaryQuery = useQuery({
    queryKey: ["analytics", "summary"],
    queryFn: () => analyticsApi.summary(),
  });

  const monthlyQuery = useQuery({
    queryKey: ["analytics", "monthly-profit"],
    queryFn: () => analyticsApi.monthlyProfit(6),
  });

  const totalBalance = (accountsQuery.data || []).reduce(
    (sum, acc) => sum + convert(Number(acc.balance), acc.currency),
    0,
  );

  const summary = summaryQuery.data;
  const totalIncome = Number(summary?.income ?? 0);
  const totalExpenses = Number(summary?.expense ?? 0);
  const savingsPercent =
    totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  const chartData = (monthlyQuery.data || []).map((p) => ({
    month: new Date(p.month + "-01").toLocaleString("ru-RU", { month: "short", year: "2-digit" }),
    income: Number(p.income),
    expenses: Number(p.expense),
  }));

  const recentTransactions = (transactionsQuery.data || [])
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
    }));

  const isLoading =
    meQuery.isPending ||
    accountsQuery.isPending ||
    summaryQuery.isPending ||
    monthlyQuery.isPending;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
            {t("dashboard.title")}
          </h1>
          <p className="text-muted-foreground mt-1">
            {t("dashboard.welcome")}, {meQuery.data?.name || "User"}
          </p>
        </div>

        {isLoading ? (
          <div className="glass-card p-6 text-muted-foreground">
            Loading dashboard...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title={t("dashboard.totalBalance")}
                value={format(totalBalance)}
                icon={<DollarSign className="w-5 h-5 text-primary-foreground" />}
                gradient="gradient-primary"
              />
              <StatCard
                title={t("dashboard.income")}
                value={format(totalIncome)}
                icon={<TrendingUp className="w-5 h-5 text-success" />}
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
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <SpendingChart data={chartData} />
              </div>
              <RecentTransactions transactions={recentTransactions} />
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
};

export default Index;
