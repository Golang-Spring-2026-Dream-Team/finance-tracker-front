import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Wallet, ArrowLeftRight, Upload, Settings, Sun, Moon, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useTheme } from '@/features/theme/model/theme-store';
import { CurrencySelector } from '@/features/currency/ui/CurrencySelector';
import { LanguageSelector } from '@/features/i18n/ui/LanguageSelector';
import { t } from '@/shared/lib/i18n';
import { useState } from 'react';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'nav.dashboard' },
  { to: '/budgets', icon: Wallet, label: 'nav.budgets' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'nav.transactions' },
  { to: '/import', icon: Upload, label: 'nav.import' },
  { to: '/settings', icon: Settings, label: 'nav.settings' },
];

export const AppSidebar = () => {
  const { theme, toggle } = useTheme();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={`hidden md:flex flex-col h-screen sticky top-0 border-r border-border bg-card transition-all duration-200 ${collapsed ? 'w-[76px]' : 'w-[260px]'}`}>
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
          <Wallet className="w-5 h-5 text-primary-foreground" />
        </div>
        {!collapsed && <span className="font-heading text-xl font-bold text-foreground">{t('app.name')}</span>}
      </div>

      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(item => {
          const isActive = location.pathname === item.to;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${isActive
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{t(item.label)}</span>}
            </NavLink>
          );
        })}
      </nav>

      <div className="px-3 pb-4 space-y-2">
        {!collapsed && <CurrencySelector />}
        {!collapsed && <LanguageSelector />}

        <button
          onClick={toggle}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          {theme === 'light' ? <Moon className="w-5 h-5 flex-shrink-0" /> : <Sun className="w-5 h-5 flex-shrink-0" />}
          {!collapsed && <span>{theme === 'light' ? t('theme.dark') : t('theme.light')}</span>}
        </button>

        <button
          onClick={() => setCollapsed((prev) => !prev)}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
        >
          {collapsed ? <PanelLeftOpen className="w-5 h-5 flex-shrink-0" /> : <PanelLeftClose className="w-5 h-5 flex-shrink-0" />}
          {!collapsed && <span>{t("common.collapse")}</span>}
        </button>
      </div>
    </aside>
  );
};
