import { AppLayout } from '@/widgets/app-layout/AppLayout';
import { StatCard } from '@/widgets/dashboard/StatCard';
import { BudgetCard } from '@/widgets/dashboard/BudgetCard';
import { SpendingChart } from '@/widgets/dashboard/SpendingChart';
import { RecentTransactions } from '@/widgets/dashboard/RecentTransactions';
import { useCurrency } from '@/features/currency/model/currency-store';
import { t } from '@/shared/lib/i18n';
import { TrendingUp, TrendingDown, PiggyBank, DollarSign, ShoppingCart, Clapperboard, Car, Lightbulb } from 'lucide-react';

const budgets = [
  { name: 'Groceries', total: 600, spent: 420, color: 'bg-primary/10 text-primary', icon: <ShoppingCart className="w-5 h-5" /> },
  { name: 'Entertainment', total: 200, spent: 185, color: 'bg-accent/10 text-accent', icon: <Clapperboard className="w-5 h-5" /> },
  { name: 'Transport', total: 300, spent: 145, color: 'bg-warning/10 text-warning', icon: <Car className="w-5 h-5" /> },
  { name: 'Utilities', total: 250, spent: 210, color: 'bg-destructive/10 text-destructive', icon: <Lightbulb className="w-5 h-5" /> },
];

const Index = () => {
  const { format } = useCurrency();

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground mt-1">{t('dashboard.welcome')}, Alisher</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title={t('dashboard.totalBalance')}
            value={format(12840)}
            change="+12.5% from last month"
            changeType="positive"
            icon={<DollarSign className="w-5 h-5 text-primary-foreground" />}
            gradient="gradient-primary"
          />
          <StatCard
            title={t('dashboard.income')}
            value={format(5450)}
            change="+8.2% from last month"
            changeType="positive"
            icon={<TrendingUp className="w-5 h-5 text-success" />}
          />
          <StatCard
            title={t('dashboard.expenses')}
            value={format(3200)}
            change="-3.1% from last month"
            changeType="positive"
            icon={<TrendingDown className="w-5 h-5 text-destructive" />}
          />
          <StatCard
            title={t('dashboard.savings')}
            value="41%"
            change="+5% from last month"
            changeType="positive"
            icon={<PiggyBank className="w-5 h-5 text-accent" />}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <SpendingChart />
          </div>
          <RecentTransactions />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-heading font-semibold text-foreground">{t('budget.title')}</h2>
            <button className="text-sm font-medium text-primary hover:text-primary/80 transition-colors">
              + {t('budget.create')}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {budgets.map(b => (
              <BudgetCard key={b.name} {...b} />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Index;
