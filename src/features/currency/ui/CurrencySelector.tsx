import { useCurrency, currencies, CurrencyCode } from '@/features/currency/model/currency-store';
import { t } from '@/shared/lib/i18n';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/ui/select';

export const CurrencySelector = () => {
  const { currency, setCurrency } = useCurrency();

  return (
    <div className="px-3 py-2">
      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t('currency.label')}</label>
      <Select value={currency.code} onValueChange={(value) => setCurrency(value as CurrencyCode)}>
        <SelectTrigger className="h-9 rounded-xl bg-secondary text-secondary-foreground border-0 focus:ring-2 focus:ring-ring">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {currencies.map((c) => (
            <SelectItem key={c.code} value={c.code}>
              {c.symbol} {c.code} - {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
