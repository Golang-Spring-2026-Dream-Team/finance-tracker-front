import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { create } from "zustand";

export type Locale = "ru" | "kk" | "en";

const DEFAULT_LOCALE: Locale = "ru";
const LOCALE_STORAGE_KEY = "locale";

const resources = {
  ru: {
    translation: {
      "app.name": "FinFlow",
      "nav.dashboard": "Дашборд",
      "nav.wallets": "Кошельки",
      "nav.budgets": "Бюджеты",
      "nav.transactions": "Транзакции",
      "nav.import": "Импорт",
      "nav.settings": "Настройки",
      "dashboard.title": "Дашборд",
      "dashboard.welcome": "С возвращением",
      "dashboard.totalBalance": "Общий баланс",
      "dashboard.income": "Доход",
      "dashboard.expenses": "Расход",
      "dashboard.savings": "Норма сбережений",
      "budget.title": "Ваши бюджеты",
      "budget.create": "Создать бюджет",
      "budget.spent": "Потрачено",
      "budget.remaining": "Осталось",
      "auth.login": "Войти",
      "auth.register": "Создать аккаунт",
      "auth.email": "Email",
      "auth.password": "Пароль",
      "auth.confirmPassword": "Подтвердите пароль",
      "auth.name": "Полное имя",
      "auth.forgotPassword": "Забыли пароль?",
      "auth.noAccount": "Нет аккаунта?",
      "auth.hasAccount": "Уже есть аккаунт?",
      "auth.socialGoogle": "Продолжить через Google",
      "auth.socialApple": "Продолжить через Apple",
      "auth.orDivider": "или продолжить через",
      "import.title": "Импорт выписки",
      "import.subtitle": "Загрузите PDF-выписку Kaspi Bank — транзакции распознаются автоматически",
      "import.stepFile": "Файл",
      "import.stepPreview": "Предпросмотр",
      "import.stepDone": "Готово",
      "import.dragDrop": "Перетащите PDF-выписку сюда",
      "import.browse": "или нажмите для выбора файла",
      "import.kaspiHint": "Формат: выписка Kaspi Gold / Kaspi Bank (PDF)",
      "import.parsing": "Читаем выписку…",
      "import.parsingSubtitle": "Распознаём транзакции",
      "import.walletTarget": "Куда импортировать?",
      "import.walletExisting": "Существующий кошелёк",
      "import.walletNew": "Новый кошелёк",
      "import.walletNamePlaceholder": "Название кошелька, напр. Kaspi Gold",
      "import.transactions": "Транзакции",
      "import.selectAll": "Все",
      "import.deselectAll": "Снять",
      "import.back": "Назад",
      "import.importing": "Импортируем…",
      "import.done": "Импорт завершён",
      "import.importMore": "Импортировать ещё",
      "import.mapping": "Сопоставление колонок",
      "import.preview": "Предпросмотр",
      "import.apply": "Применить импорт",
      "currency.label": "Валюта",
      "theme.light": "Светлая",
      "theme.dark": "Темная",
      "language.label": "Язык",
      "language.ru": "Русский",
      "language.kk": "Казахский",
      "language.en": "English",
      "common.collapse": "Свернуть",
    },
  },
  kk: {
    translation: {
      "app.name": "FinFlow",
      "nav.dashboard": "Басқару панелі",
      "nav.wallets": "Әмияндар",
      "nav.budgets": "Бюджеттер",
      "nav.transactions": "Транзакциялар",
      "nav.import": "Импорт",
      "nav.settings": "Баптаулар",
      "dashboard.title": "Басқару панелі",
      "dashboard.welcome": "Қош келдіңіз",
      "dashboard.totalBalance": "Жалпы баланс",
      "dashboard.income": "Кіріс",
      "dashboard.expenses": "Шығыс",
      "dashboard.savings": "Жинақ нормасы",
      "budget.title": "Сіздің бюджеттеріңіз",
      "budget.create": "Бюджет құру",
      "budget.spent": "Жұмсалды",
      "budget.remaining": "Қалды",
      "auth.login": "Кіру",
      "auth.register": "Тіркелу",
      "auth.email": "Email",
      "auth.password": "Құпиясөз",
      "auth.confirmPassword": "Құпиясөзді растаңыз",
      "auth.name": "Толық аты-жөні",
      "auth.forgotPassword": "Құпиясөзді ұмыттыңыз ба?",
      "auth.noAccount": "Аккаунт жоқ па?",
      "auth.hasAccount": "Аккаунтыңыз бар ма?",
      "auth.socialGoogle": "Google арқылы жалғастыру",
      "auth.socialApple": "Apple арқылы жалғастыру",
      "auth.orDivider": "немесе жалғастыру",
      "import.title": "Үзінді импорттау",
      "import.subtitle": "Kaspi Bank PDF үзіндісін жүктеңіз — транзакциялар автоматты түрде танылады",
      "import.stepFile": "Файл",
      "import.stepPreview": "Алдын ала қарау",
      "import.stepDone": "Дайын",
      "import.dragDrop": "PDF үзіндісін осы жерге сүйреп апарыңыз",
      "import.browse": "немесе файл таңдау үшін басыңыз",
      "import.kaspiHint": "Формат: Kaspi Gold / Kaspi Bank үзіндісі (PDF)",
      "import.parsing": "Үзінді оқылуда…",
      "import.parsingSubtitle": "Транзакциялар танылуда",
      "import.walletTarget": "Қайда импорттау?",
      "import.walletExisting": "Бар әмиян",
      "import.walletNew": "Жаңа әмиян",
      "import.walletNamePlaceholder": "Әмиян атауы, мыс. Kaspi Gold",
      "import.transactions": "Транзакциялар",
      "import.selectAll": "Барлығы",
      "import.deselectAll": "Алып тастау",
      "import.back": "Артқа",
      "import.importing": "Импорттауда…",
      "import.done": "Импорт аяқталды",
      "import.importMore": "Тағы импорттау",
      "import.mapping": "Бағандарды сәйкестендіру",
      "import.preview": "Алдын ала қарау",
      "import.apply": "Импортты қолдану",
      "currency.label": "Валюта",
      "theme.light": "Жарық",
      "theme.dark": "Қараңғы",
      "language.label": "Тіл",
      "language.ru": "Орысша",
      "language.kk": "Қазақша",
      "language.en": "English",
      "common.collapse": "Жинау",
    },
  },
  en: {
    translation: {
      "app.name": "FinFlow",
      "nav.dashboard": "Dashboard",
      "nav.wallets": "Wallets",
      "nav.budgets": "Budgets",
      "nav.transactions": "Transactions",
      "nav.import": "Import",
      "nav.settings": "Settings",
      "dashboard.title": "Dashboard",
      "dashboard.welcome": "Welcome back",
      "dashboard.totalBalance": "Total Balance",
      "dashboard.income": "Income",
      "dashboard.expenses": "Expenses",
      "dashboard.savings": "Savings Rate",
      "budget.title": "Your Budgets",
      "budget.create": "Create Budget",
      "budget.spent": "Spent",
      "budget.remaining": "Remaining",
      "auth.login": "Sign In",
      "auth.register": "Create Account",
      "auth.email": "Email address",
      "auth.password": "Password",
      "auth.confirmPassword": "Confirm password",
      "auth.name": "Full name",
      "auth.forgotPassword": "Forgot password?",
      "auth.noAccount": "Don't have an account?",
      "auth.hasAccount": "Already have an account?",
      "auth.socialGoogle": "Continue with Google",
      "auth.socialApple": "Continue with Apple",
      "auth.orDivider": "or continue with",
      "import.title": "Import Statement",
      "import.subtitle": "Upload a Kaspi Bank PDF statement — transactions are recognized automatically",
      "import.stepFile": "File",
      "import.stepPreview": "Preview",
      "import.stepDone": "Done",
      "import.dragDrop": "Drag & drop your PDF statement here",
      "import.browse": "or click to select a file",
      "import.kaspiHint": "Format: Kaspi Gold / Kaspi Bank statement (PDF)",
      "import.parsing": "Reading statement…",
      "import.parsingSubtitle": "Recognizing transactions",
      "import.walletTarget": "Import to wallet",
      "import.walletExisting": "Existing wallet",
      "import.walletNew": "New wallet",
      "import.walletNamePlaceholder": "Wallet name, e.g. Kaspi Gold",
      "import.transactions": "Transactions",
      "import.selectAll": "All",
      "import.deselectAll": "Deselect",
      "import.back": "Back",
      "import.importing": "Importing…",
      "import.done": "Import complete",
      "import.importMore": "Import more",
      "import.mapping": "Column Mapping",
      "import.preview": "Preview",
      "import.apply": "Apply Import",
      "currency.label": "Currency",
      "theme.light": "Light",
      "theme.dark": "Dark",
      "language.label": "Language",
      "language.ru": "Russian",
      "language.kk": "Kazakh",
      "language.en": "English",
      "common.collapse": "Collapse",
    },
  },
} as const;

const isLocale = (value: string): value is Locale => value === "ru" || value === "kk" || value === "en";

const getInitialLocale = (): Locale => {
  if (typeof window === "undefined") return DEFAULT_LOCALE;
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
  if (stored && isLocale(stored)) return stored;
  const browserLang = navigator.language.split("-")[0];
  return isLocale(browserLang) ? browserLang : DEFAULT_LOCALE;
};

const initialLocale = getInitialLocale();

const applyLocaleAttributes = (locale: Locale) => {
  if (typeof document === "undefined") return;
  document.documentElement.lang = locale;
  document.documentElement.setAttribute("data-locale", locale);
};

i18n.use(initReactI18next).init({
  resources,
  lng: initialLocale,
  fallbackLng: "ru",
  interpolation: { escapeValue: false },
});
applyLocaleAttributes(initialLocale);

interface LocaleState {
  locale: Locale;
  setLocale: (locale: Locale) => void;
}

export const useLocaleStore = create<LocaleState>((set) => ({
  locale: initialLocale,
  setLocale: (locale) => {
    i18n.changeLanguage(locale);
    applyLocaleAttributes(locale);
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    }
    set({ locale });
  },
}));

export const t = (key: string): string => i18n.t(key);
