import { useCurrency, currencies, CurrencyCode } from '@/features/currency/model/currency-store';
import { t } from '@/shared/lib/i18n';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

export const CurrencySelector = () => {
  const { currency, setCurrency } = useCurrency();

  return (
    <FormControl size="small" fullWidth>
      <InputLabel sx={{ fontSize: '0.75rem' }}>{t('currency.label')}</InputLabel>
      <Select
        value={currency.code}
        label={t('currency.label')}
        onChange={(e) => setCurrency(e.target.value as CurrencyCode)}
        sx={{ borderRadius: '12px' }}
      >
        {currencies.map((c) => (
          <MenuItem key={c.code} value={c.code}>
            {c.symbol} {c.code} — {c.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
