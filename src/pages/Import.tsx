import { useState, useCallback } from 'react';
import { AppLayout } from '@/widgets/app-layout/AppLayout';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Check, ArrowRight, AlertCircle } from 'lucide-react';
import { t } from '@/shared/lib/i18n';
import { useCurrency } from '@/features/currency/model/currency-store';

type Step = 'upload' | 'mapping' | 'preview';

const sampleCSVData = [
  { date: '2024-03-20', description: 'Grocery Store', amount: '-85.50', category: '' },
  { date: '2024-03-19', description: 'Salary', amount: '4800.00', category: '' },
  { date: '2024-03-18', description: 'Netflix', amount: '-15.99', category: '' },
  { date: '2024-03-17', description: 'Gas Station', amount: '-52.00', category: '' },
];

const appFields = ['Date', 'Description', 'Amount', 'Category', 'Notes'];

const ImportPage = () => {
  const [step, setStep] = useState<Step>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [fileName, setFileName] = useState('');
  const [mappings, setMappings] = useState<Record<string, string>>({
    date: 'Date',
    description: 'Description',
    amount: 'Amount',
    category: 'Category',
  });
  const [targetBudget, setTargetBudget] = useState('groceries');
  const { format } = useCurrency();

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file?.name.endsWith('.csv')) {
      setFileName(file.name);
      setStep('mapping');
    }
  }, []);

  const handleFileSelect = () => {
    setFileName('bank_statement_march.csv');
    setStep('mapping');
  };

  const csvColumns = ['date', 'description', 'amount', 'category'];

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">{t('import.title')}</h1>

        {/* Steps indicator */}
        <div className="flex items-center w-full">
          {(['upload', 'mapping', 'preview'] as Step[]).map((s, i) => (
            <div key={s} className="flex items-center flex-1 min-w-0">
              <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-semibold transition-colors ${
                step === s ? 'gradient-primary text-primary-foreground' :
                (['upload', 'mapping', 'preview'].indexOf(step) > i) ? 'bg-success text-success-foreground' :
                'bg-secondary text-muted-foreground'
              }`}>
                {['upload', 'mapping', 'preview'].indexOf(step) > i ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span className={`text-sm font-medium hidden sm:inline ml-2 ${step === s ? 'text-foreground' : 'text-muted-foreground'}`}>
                {s === 'upload' ? 'Upload' : s === 'mapping' ? t('import.mapping') : t('import.preview')}
              </span>
              {i < 2 && <div className="h-px bg-border flex-1 ml-3 mr-3" />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {step === 'upload' && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              onDrop={handleDrop}
              onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onClick={handleFileSelect}
              className={`glass-card p-12 text-center cursor-pointer transition-all ${
                isDragging ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-secondary/50'
              }`}
            >
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-primary" />
              </div>
              <p className="text-lg font-heading font-semibold text-foreground">{t('import.dragDrop')}</p>
              <p className="text-sm text-muted-foreground mt-1">{t('import.browse')}</p>
              <p className="text-xs text-muted-foreground mt-3">Supports .csv files</p>
            </motion.div>
          )}

          {step === 'mapping' && (
            <motion.div
              key="mapping"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-4"
            >
              <div className="glass-card p-5">
                <div className="flex items-center gap-3 mb-4">
                  <FileText className="w-5 h-5 text-primary" />
                  <span className="text-sm font-medium text-foreground">{fileName}</span>
                </div>

                <div className="space-y-3">
                  <div className="grid grid-cols-3 gap-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider pb-2 border-b border-border">
                    <span>CSV Column</span>
                    <span>в†’</span>
                    <span>App Field</span>
                  </div>
                  {csvColumns.map(col => (
                    <div key={col} className="grid grid-cols-3 gap-4 items-center">
                      <span className="text-sm font-medium text-foreground capitalize">{col}</span>
                      <ArrowRight className="w-4 h-4 text-muted-foreground mx-auto" />
                      <select
                        value={mappings[col] || ''}
                        onChange={e => setMappings(prev => ({ ...prev, [col]: e.target.value }))}
                        className="rounded-xl bg-secondary text-foreground text-sm px-3 py-2 border-0 outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">Skip</option>
                        {appFields.map(f => <option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card p-5">
                <label className="text-sm font-medium text-foreground mb-2 block">Target Budget</label>
                <select
                  value={targetBudget}
                  onChange={e => setTargetBudget(e.target.value)}
                  className="w-full rounded-xl bg-secondary text-foreground text-sm px-3 py-2.5 border-0 outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="groceries">рџ›’ Groceries</option>
                  <option value="entertainment">рџЋ¬ Entertainment</option>
                  <option value="transport">рџљ— Transport</option>
                  <option value="new">+ Create New Budget</option>
                </select>
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={() => setStep('upload')} className="px-4 py-2.5 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors">
                  Back
                </button>
                <button onClick={() => setStep('preview')} className="px-6 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
                  {t('import.preview')}
                </button>
              </div>
            </motion.div>
          )}

          {step === 'preview' && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-4"
            >
              <div className="glass-card p-5">
                <div className="flex items-center gap-2 mb-4">
                  <AlertCircle className="w-4 h-4 text-warning" />
                  <span className="text-sm text-muted-foreground">
                    <strong className="text-foreground">4 transactions</strong> will be imported to <strong className="text-foreground">Groceries</strong> budget
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left py-2 text-xs font-semibold text-muted-foreground uppercase">Date</th>
                        <th className="text-left py-2 text-xs font-semibold text-muted-foreground uppercase">Description</th>
                        <th className="text-right py-2 text-xs font-semibold text-muted-foreground uppercase">Amount</th>
                        <th className="text-left py-2 text-xs font-semibold text-muted-foreground uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sampleCSVData.map((row, i) => (
                        <tr key={i} className="border-b border-border last:border-0">
                          <td className="py-2.5 text-foreground">{row.date}</td>
                          <td className="py-2.5 text-foreground">{row.description}</td>
                          <td className={`py-2.5 text-right font-medium ${parseFloat(row.amount) >= 0 ? 'text-success' : 'text-foreground'}`}>
                            {format(parseFloat(row.amount))}
                          </td>
                          <td className="py-2.5">
                            <span className="inline-flex items-center gap-1 text-xs font-medium text-success bg-success/10 px-2 py-0.5 rounded-full">
                              <Check className="w-3 h-3" /> Ready
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={() => setStep('mapping')} className="px-4 py-2.5 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors">
                  Back
                </button>
                <button className="px-6 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity">
                  {t('import.apply')}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
};

export default ImportPage;
