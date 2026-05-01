import { t, type Locale, useLocaleStore } from "@/shared/lib/i18n";
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

const languages: Array<{ code: Locale; label: string }> = [
  { code: "ru", label: "language.ru" },
  { code: "kk", label: "language.kk" },
  { code: "en", label: "language.en" },
];

export const LanguageSelector = () => {
  const locale = useLocaleStore((state) => state.locale);
  const setLocale = useLocaleStore((state) => state.setLocale);

  return (
    <FormControl size="small" fullWidth>
      <InputLabel sx={{ fontSize: '0.75rem' }}>{t("language.label")}</InputLabel>
      <Select
        value={locale}
        label={t("language.label")}
        onChange={(e) => setLocale(e.target.value as Locale)}
        sx={{ borderRadius: '12px' }}
      >
        {languages.map((lang) => (
          <MenuItem key={lang.code} value={lang.code}>
            {t(lang.label)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
