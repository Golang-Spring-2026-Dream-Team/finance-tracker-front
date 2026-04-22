import { useCurrency } from '@/features/currency/model/currency-store';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface RecentTransaction {
  id: number;
  name: string;
  category: string;
  amount: number;
  currency: string;
}

export const RecentTransactions = ({ transactions }: { transactions: RecentTransaction[] }) => {
  const { formatConverted } = useCurrency();

  return (
    <div className="glass-card p-5">
      <h3 className="font-heading font-semibold text-foreground mb-4">Recent Transactions</h3>
      <div className="space-y-3">
        {transactions.length === 0 && (
          <p className="text-sm text-muted-foreground">No recent transactions yet</p>
        )}
        {transactions.map((tx, i) => (
          <motion.div
            key={tx.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            className="flex items-center justify-between py-2 border-b border-border last:border-0"
          >
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                tx.amount > 0 ? 'bg-success/10' : 'bg-destructive/10'
              }`}>
                {tx.amount > 0 ? (
                  <ArrowUpRight className="w-4 h-4 text-success" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-destructive" />
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">{tx.name}</p>
                <p className="text-xs text-muted-foreground">{tx.category}</p>
              </div>
            </div>
            <span className={`text-sm font-semibold ${tx.amount > 0 ? 'text-success' : 'text-foreground'}`}>
              {tx.amount > 0 ? '+' : ''}{formatConverted(tx.amount, tx.currency)}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
