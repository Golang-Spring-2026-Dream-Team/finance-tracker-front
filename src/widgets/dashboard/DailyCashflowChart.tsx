import { useMemo } from "react";
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useCurrency } from "@/features/currency/model/currency-store";
import { AnalyticsDailyPoint } from "@/features/analytics/api/analytics-api";

interface Props {
  data: AnalyticsDailyPoint[];
}

interface TooltipPayloadItem {
  dataKey: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

const LABELS: Record<string, string> = {
  income: "Income",
  expense: "Expense",
  profit: "Net",
};

export const DailyCashflowChart = ({ data }: Props) => {
  const { format } = useCurrency();

  const chartData = useMemo(
    () =>
      data.map((d) => ({
        date: d.date.slice(5),
        income: Number(d.income),
        expense: Number(d.expense),
        profit: Number(d.profit),
      })),
    [data],
  );

  const CustomTooltip = useMemo(
    () =>
      ({ active, payload, label }: CustomTooltipProps) => {
        if (!active || !payload?.length) return null;
        return (
          <div className="glass-card p-3 text-sm shadow-lg min-w-[150px]">
            <p className="font-heading font-semibold text-foreground mb-2">{label}</p>
            {payload.map((p) => (
              <p key={p.dataKey} className="flex justify-between gap-4">
                <span style={{ color: p.color }}>{LABELS[p.dataKey] ?? p.dataKey}</span>
                <span className="font-medium text-foreground">{format(p.value)}</span>
              </p>
            ))}
          </div>
        );
      },
    [format],
  );

  return (
    <div className="glass-card p-5">
      <h3 className="font-heading font-semibold text-foreground mb-4">Daily Cashflow</h3>
      {data.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
          No data for this period
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="incomeBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(152,60%,42%)" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="hsl(152,60%,42%)" stopOpacity={0.5} />
                </linearGradient>
                <linearGradient id="expenseBarGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(0,72%,58%)" stopOpacity={0.9} />
                  <stop offset="100%" stopColor="hsl(0,72%,58%)" stopOpacity={0.5} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-20" />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 11 }}
                interval="preserveStartEnd"
                className="text-muted-foreground"
              />
              <YAxis tick={{ fontSize: 11 }} className="text-muted-foreground" width={60} />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                formatter={(v) => LABELS[v] ?? v}
                wrapperStyle={{ fontSize: 12 }}
              />
              <Bar dataKey="income" fill="url(#incomeBarGrad)" radius={[3, 3, 0, 0]} maxBarSize={20} />
              <Bar dataKey="expense" fill="url(#expenseBarGrad)" radius={[3, 3, 0, 0]} maxBarSize={20} />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="hsl(162,63%,41%)"
                strokeWidth={2}
                dot={false}
                strokeDasharray="4 2"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
