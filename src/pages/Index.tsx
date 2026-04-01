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

const monthLabel = (date: string) =>
  new Date(date).toLocaleString("en-US", {
    month: "short",
  });

const Index = () => {
  const { format } = useCurrency();

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
    queryFn: () => transactionsApi.list({ page: 1, limit: 200 }),
  });

  const transactions = transactionsQuery.data || [];
  const totalBalance = (accountsQuery.data || []).reduce((sum, acc) => sum + Number(acc.balance), 0);
  const totalIncome = transactions
    .filter((tx) => tx.type === "income")
    .reduce((sum, tx) => sum + Number(tx.amount), 0);
  const totalExpenses = transactions
    .filter((tx) => tx.type === "expense")
    .reduce((sum, tx) => sum + Number(tx.amount), 0);
  const savingsPercent = totalIncome > 0 ? ((totalIncome - totalExpenses) / totalIncome) * 100 : 0;

  const recentTransactions = transactions
    .slice()
    .sort((a, b) => b.transacted_at.localeCompare(a.transacted_at))
    .slice(0, 5)
    .map((tx) => ({
      id: tx.id,
      name: tx.description,
      category: tx.type === "income" ? "Income" : "Expense",
      amount: tx.type === "expense" ? -Math.abs(Number(tx.amount)) : Math.abs(Number(tx.amount)),
    }));

  const monthlyMap = new Map<string, { month: string; income: number; expenses: number }>();
  transactions.forEach((tx) => {
    const month = monthLabel(tx.transacted_at);
    const current = monthlyMap.get(month) || { month, income: 0, expenses: 0 };
    if (tx.type === "income") {
      current.income += Number(tx.amount);
    }
    if (tx.type === "expense") {
      current.expenses += Number(tx.amount);
    }
    monthlyMap.set(month, current);
  });
  const chartData = Array.from(monthlyMap.values());

  const isLoading = meQuery.isPending || accountsQuery.isPending || transactionsQuery.isPending;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">{t("dashboard.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("dashboard.welcome")}, {meQuery.data?.name || "User"}</p>
        </div>

        {isLoading ? (
          <div className="glass-card p-6 text-muted-foreground">Loading dashboard...</div>
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
