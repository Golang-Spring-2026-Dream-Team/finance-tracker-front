import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { useCurrency } from "@/features/currency/model/currency-store";
import { AnalyticsCategoryExpense } from "@/features/analytics/api/analytics-api";

interface Props {
  data: AnalyticsCategoryExpense[];
}

const PALETTE = [
  "hsl(162,63%,41%)",
  "hsl(262,60%,58%)",
  "hsl(38,92%,58%)",
  "hsl(200,80%,50%)",
  "hsl(0,72%,58%)",
  "hsl(290,60%,55%)",
  "hsl(152,50%,55%)",
  "hsl(25,85%,55%)",
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}

export const CategoryChart = ({ data }: Props) => {
  const { format } = useCurrency();

  const chartData = useMemo(
    () =>
      [...data]
        .sort((a, b) => Number(b.amount) - Number(a.amount))
        .slice(0, 8)
        .map((d) => ({ name: d.category || "Other", value: Number(d.amount) })),
    [data],
  );

  const CustomTooltip = useMemo(
    () =>
      ({ active, payload, label }: CustomTooltipProps) => {
        if (!active || !payload?.length) return null;
        return (
          <div className="glass-card p-3 text-sm shadow-lg">
            <p className="font-heading font-semibold text-foreground mb-1">{label}</p>
            <p className="text-muted-foreground">
              Spent: <span className="font-medium text-foreground">{format(payload[0].value)}</span>
            </p>
          </div>
        );
      },
    [format],
  );

  return (
    <div className="glass-card p-5">
      <h3 className="font-heading font-semibold text-foreground mb-4">Expenses by Category</h3>
      {data.length === 0 ? (
        <div className="h-64 flex items-center justify-center text-muted-foreground text-sm">
          No expense data for this period
        </div>
      ) : (
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} className="opacity-20" />
              <XAxis type="number" tick={{ fontSize: 11 }} className="text-muted-foreground" />
              <YAxis
                dataKey="name"
                type="category"
                tick={{ fontSize: 11 }}
                width={80}
                className="text-muted-foreground"
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={22}>
                {chartData.map((_, i) => (
                  <Cell key={i} fill={PALETTE[i % PALETTE.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
