import { motion } from 'framer-motion';
import { t } from '@/shared/lib/i18n';
import { useCurrency } from '@/features/currency/model/currency-store';
import { ReactNode } from 'react';

interface BudgetCardProps {
  name: string;
  total: number;
  spent: number;
  color: string;
  icon: ReactNode;
}

export const BudgetCard = ({ name, total, spent, color, icon }: BudgetCardProps) => {
  const { format } = useCurrency();
  const percentage = Math.min((spent / total) * 100, 100);
  const remaining = total - spent;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="glass-card p-5 cursor-pointer transition-shadow hover:shadow-lg"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${color}`}>
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-heading font-semibold text-foreground truncate">{name}</h3>
          <p className="text-xs text-muted-foreground">{format(total)} {t('budget.title').toLowerCase()}</p>
        </div>
      </div>

      <div className="mb-3">
        <div className="h-2 rounded-full bg-secondary overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={`h-full rounded-full ${
              percentage > 90 ? 'bg-destructive' : percentage > 70 ? 'bg-warning' : 'bg-primary'
            }`}
          />
        </div>
      </div>

      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">
          {t('budget.spent')}: <span className="text-foreground font-medium">{format(spent)}</span>
        </span>
        <span className="text-muted-foreground">
          {t('budget.remaining')}: <span className="text-success font-medium">{format(remaining)}</span>
        </span>
      </div>
    </motion.div>
  );
};
