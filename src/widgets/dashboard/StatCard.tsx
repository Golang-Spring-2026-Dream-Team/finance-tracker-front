import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: ReactNode;
  gradient?: string;
}

export const StatCard = ({ title, value, change, changeType = 'neutral', icon, gradient }: StatCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-5 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-muted-foreground">{title}</span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${gradient || 'bg-secondary'}`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-2xl font-heading font-bold text-foreground">{value}</p>
        {change && (
          <p className={`text-xs font-medium mt-1 ${
            changeType === 'positive' ? 'text-success' :
            changeType === 'negative' ? 'text-destructive' :
            'text-muted-foreground'
          }`}>
            {change}
          </p>
        )}
      </div>
    </motion.div>
  );
};
