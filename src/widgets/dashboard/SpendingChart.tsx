import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useCurrency } from '@/features/currency/model/currency-store';

interface MonthlyPoint {
  month: string;
  income: number;
  expenses: number;
}

interface TooltipPayloadItem {
  dataKey: string;
  value: number;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

export const SpendingChart = ({ data }: { data: MonthlyPoint[] }) => {
  const { format } = useCurrency();

  const CustomTooltip = useMemo(() => {
    return ({ active, payload, label }: CustomTooltipProps) => {
      if (!active || !payload || !label) return null;
      return (
        <div className="glass-card p-3 text-sm shadow-lg">
          <p className="font-heading font-semibold text-foreground mb-1">{label}</p>
          {payload.map((p) => (
            <p key={p.dataKey} className="text-muted-foreground">
              {p.dataKey === 'income' ? 'Income' : 'Expenses'}: <span className="font-medium text-foreground">{format(p.value)}</span>
            </p>
          ))}
        </div>
      );
    };
  }, [format]);

  return (
    <div className="glass-card p-5">
      <h3 className="font-heading font-semibold text-foreground mb-4">Spending Overview</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="incomeGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(162, 63%, 41%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(162, 63%, 41%)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(262, 60%, 58%)" stopOpacity={0.3} />
                <stop offset="100%" stopColor="hsl(262, 60%, 58%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} className="text-muted-foreground" />
            <YAxis tick={{ fontSize: 12 }} className="text-muted-foreground" />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="income" stroke="hsl(162, 63%, 41%)" fill="url(#incomeGrad)" strokeWidth={2} />
            <Area type="monotone" dataKey="expenses" stroke="hsl(262, 60%, 58%)" fill="url(#expenseGrad)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
