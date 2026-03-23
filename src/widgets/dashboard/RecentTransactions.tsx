import { useCurrency } from '@/features/currency/model/currency-store';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const transactions = [
  { id: 1, name: 'Grocery Store', category: 'Food', amount: -85.50, date: '2024-03-20' },
  { id: 2, name: 'Salary Deposit', category: 'Income', amount: 4800, date: '2024-03-19' },
  { id: 3, name: 'Netflix', category: 'Entertainment', amount: -15.99, date: '2024-03-18' },
  { id: 4, name: 'Gas Station', category: 'Transport', amount: -52.00, date: '2024-03-17' },
  { id: 5, name: 'Freelance Work', category: 'Income', amount: 650, date: '2024-03-16' },
];

export const RecentTransactions = () => {
  const { format } = useCurrency();

  return (
    <div className="glass-card p-5">
      <h3 className="font-heading font-semibold text-foreground mb-4">Recent Transactions</h3>
      <div className="space-y-3">
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
              {tx.amount > 0 ? '+' : ''}{format(tx.amount)}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
