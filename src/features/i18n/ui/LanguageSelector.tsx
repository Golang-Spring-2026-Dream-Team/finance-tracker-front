import { t, type Locale, useLocaleStore } from "@/shared/lib/i18n";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";

const languages: Array<{ code: Locale; label: string }> = [
  { code: "ru", label: "language.ru" },
  { code: "kk", label: "language.kk" },
  { code: "en", label: "language.en" },
];

export const LanguageSelector = () => {
  const locale = useLocaleStore((state) => state.locale);
  const setLocale = useLocaleStore((state) => state.setLocale);

  return (
    <div className="px-3 py-2">
      <label className="text-xs font-medium text-muted-foreground mb-1.5 block">{t("language.label")}</label>
      <Select value={locale} onValueChange={(value) => setLocale(value as Locale)}>
        <SelectTrigger className="h-9 rounded-xl bg-secondary text-secondary-foreground border-0 focus:ring-2 focus:ring-ring">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {languages.map((lang) => (
            <SelectItem key={lang.code} value={lang.code}>
              {t(lang.label)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};
