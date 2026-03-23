import { useState } from 'react';
import { AppLayout } from '@/widgets/app-layout/AppLayout';
import { useCurrency } from '@/features/currency/model/currency-store';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, ArrowUpRight, ArrowDownRight, Search, Filter, X, Calendar, Tag, FileText, DollarSign } from 'lucide-react';
import { t } from '@/shared/lib/i18n';

interface Transaction {
  id: number;
  name: string;
  category: string;
  amount: number;
  date: string;
  budget: string;
}

const initialTransactions: Transaction[] = [
  { id: 1, name: 'Grocery Store', category: 'Food', amount: -85.50, date: '2024-03-20', budget: 'Groceries' },
  { id: 2, name: 'Salary Deposit', category: 'Income', amount: 4800, date: '2024-03-19', budget: 'General' },
  { id: 3, name: 'Netflix', category: 'Entertainment', amount: -15.99, date: '2024-03-18', budget: 'Entertainment' },
  { id: 4, name: 'Gas Station', category: 'Transport', amount: -52.00, date: '2024-03-17', budget: 'Transport' },
  { id: 5, name: 'Freelance Work', category: 'Income', amount: 650, date: '2024-03-16', budget: 'General' },
  { id: 6, name: 'Electric Bill', category: 'Utilities', amount: -120.00, date: '2024-03-15', budget: 'Utilities' },
  { id: 7, name: 'Coffee Shop', category: 'Food', amount: -6.50, date: '2024-03-14', budget: 'Groceries' },
  { id: 8, name: 'Gym Membership', category: 'Health', amount: -45.00, date: '2024-03-13', budget: 'General' },
];

const categories = ['Food', 'Income', 'Entertainment', 'Transport', 'Utilities', 'Health', 'Shopping', 'Other'];
const budgets = ['General', 'Groceries', 'Entertainment', 'Transport', 'Utilities'];

const Transactions = () => {
  const { format } = useCurrency();
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', amount: '', category: categories[0], date: new Date().toISOString().split('T')[0], type: 'expense' as 'expense' | 'income', budget: budgets[0] });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const filtered = transactions.filter(tx => {
    const matchesSearch = tx.name.toLowerCase().includes(search.toLowerCase()) || tx.category.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !filterCategory || tx.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.name.trim()) errs.name = 'Required';
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) errs.amount = 'Enter a valid amount';
    if (!form.date) errs.date = 'Required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const amount = form.type === 'expense' ? -Math.abs(Number(form.amount)) : Math.abs(Number(form.amount));
    const newTx: Transaction = {
      id: Date.now(),
      name: form.name,
      category: form.type === 'income' ? 'Income' : form.category,
      amount,
      date: form.date,
      budget: form.budget,
    };
    setTransactions(prev => [newTx, ...prev]);
    setShowModal(false);
    setForm({ name: '', amount: '', category: categories[0], date: new Date().toISOString().split('T')[0], type: 'expense', budget: budgets[0] });
    setErrors({});
  };

  const totalIncome = filtered.filter(tx => tx.amount > 0).reduce((s, tx) => s + tx.amount, 0);
  const totalExpenses = filtered.filter(tx => tx.amount < 0).reduce((s, tx) => s + tx.amount, 0);

  const inputClass = (field: string) =>
    `w-full rounded-xl bg-secondary text-foreground px-3 py-2.5 text-sm border outline-none focus:ring-2 focus:ring-ring transition-all ${errors[field] ? 'border-destructive' : 'border-transparent'}`;

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">{t('nav.transactions')}</h1>
            <p className="text-muted-foreground text-sm mt-1">Manage and track all your transactions</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity self-start"
          >
            <Plus className="w-4 h-4" />
            Add Transaction
          </button>
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="glass-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <ArrowUpRight className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Income</p>
              <p className="text-lg font-heading font-bold text-success">{format(totalIncome)}</p>
            </div>
          </div>
          <div className="glass-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <ArrowDownRight className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Expenses</p>
              <p className="text-lg font-heading font-bold text-destructive">{format(Math.abs(totalExpenses))}</p>
            </div>
          </div>
          <div className="glass-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Net</p>
              <p className={`text-lg font-heading font-bold ${totalIncome + totalExpenses >= 0 ? 'text-success' : 'text-destructive'}`}>
                {format(totalIncome + totalExpenses)}
              </p>
            </div>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search transactions..."
              className="w-full rounded-xl bg-card text-foreground pl-10 pr-4 py-2.5 text-sm border border-border outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="rounded-xl bg-card text-foreground pl-10 pr-8 py-2.5 text-sm border border-border outline-none focus:ring-2 focus:ring-ring appearance-none cursor-pointer"
            >
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Transaction list */}
        <div className="glass-card divide-y divide-border">
          {filtered.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No transactions found</div>
          ) : (
            filtered.map((tx, i) => (
              <motion.div
                key={tx.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className="flex items-center justify-between p-4 hover:bg-secondary/30 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    tx.amount > 0 ? 'bg-success/10' : 'bg-destructive/10'
                  }`}>
                    {tx.amount > 0 ? <ArrowUpRight className="w-4 h-4 text-success" /> : <ArrowDownRight className="w-4 h-4 text-destructive" />}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{tx.name}</p>
                    <p className="text-xs text-muted-foreground">{tx.category} В· {tx.budget} В· {tx.date}</p>
                  </div>
                </div>
                <span className={`text-sm font-semibold flex-shrink-0 ml-4 ${tx.amount > 0 ? 'text-success' : 'text-foreground'}`}>
                  {tx.amount > 0 ? '+' : ''}{format(tx.amount)}
                </span>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Create Transaction Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              onClick={e => e.stopPropagation()}
              className="glass-card p-6 w-full max-w-md shadow-2xl bg-card"
            >
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-heading font-bold text-foreground">New Transaction</h2>
                <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreate} className="space-y-4">
                {/* Type toggle */}
                <div className="flex gap-2 p-1 bg-secondary rounded-xl">
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, type: 'expense' }))}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      form.type === 'expense' ? 'bg-destructive text-destructive-foreground shadow-sm' : 'text-muted-foreground'
                    }`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setForm(f => ({ ...f, type: 'income' }))}
                    className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                      form.type === 'income' ? 'bg-success text-success-foreground shadow-sm' : 'text-muted-foreground'
                    }`}
                  >
                    Income
                  </button>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Description</label>
                  <div className="relative">
                    <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="text"
                      value={form.name}
                      onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                      className={`${inputClass('name')} pl-10`}
                      placeholder="e.g. Coffee Shop"
                    />
                  </div>
                  {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Amount</label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="number"
                      step="0.01"
                      value={form.amount}
                      onChange={e => setForm(f => ({ ...f, amount: e.target.value }))}
                      className={`${inputClass('amount')} pl-10`}
                      placeholder="0.00"
                    />
                  </div>
                  {errors.amount && <p className="text-xs text-destructive mt-1">{errors.amount}</p>}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {form.type === 'expense' && (
                    <div>
                      <label className="text-sm font-medium text-foreground mb-1.5 block">Category</label>
                      <div className="relative">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <select
                          value={form.category}
                          onChange={e => setForm(f => ({ ...f, category: e.target.value }))}
                          className={`${inputClass('')} pl-10 appearance-none cursor-pointer`}
                        >
                          {categories.filter(c => c !== 'Income').map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                  )}
                  <div className={form.type === 'income' ? 'col-span-2' : ''}>
                    <label className="text-sm font-medium text-foreground mb-1.5 block">Date</label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="date"
                        value={form.date}
                        onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
                        className={`${inputClass('date')} pl-10`}
                      />
                    </div>
                    {errors.date && <p className="text-xs text-destructive mt-1">{errors.date}</p>}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-1.5 block">Budget</label>
                  <select
                    value={form.budget}
                    onChange={e => setForm(f => ({ ...f, budget: e.target.value }))}
                    className={`${inputClass('')} appearance-none cursor-pointer`}
                  >
                    {budgets.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>

                <button type="submit" className="w-full py-2.5 rounded-xl gradient-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
                  Add Transaction
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </AppLayout>
  );
};

export default Transactions;
