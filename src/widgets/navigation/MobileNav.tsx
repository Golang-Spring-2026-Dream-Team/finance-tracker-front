import { NavLink, useLocation } from 'react-router-dom';
import { LayoutDashboard, Wallet, ArrowLeftRight, Upload, Settings, Sun, Moon, Menu, X, LogOut } from 'lucide-react';
import { useTheme } from '@/features/theme/model/theme-store';
import { t } from '@/shared/lib/i18n';
import { LanguageSelector } from '@/features/i18n/ui/LanguageSelector';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useAuthStore } from '@/features/auth/model/auth-store';
import { authApi } from '@/features/auth/api/auth-api';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'nav.dashboard' },
  { to: '/wallets', icon: Wallet, label: 'nav.wallets' },
  { to: '/transactions', icon: ArrowLeftRight, label: 'nav.transactions' },
  { to: '/import', icon: Upload, label: 'nav.import' },
  { to: '/settings', icon: Settings, label: 'nav.settings' },
];

export const MobileNav = () => {
  const { theme, toggle } = useTheme();
  const clearSession = useAuthStore((state) => state.clearSession);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  const handleLogout = async () => {
    if (!refreshToken) {
      clearSession();
      return;
    }
    try {
      await authApi.logout(refreshToken);
    } catch {
      // best-effort logout; clear local session anyway
    } finally {
      clearSession();
    }
  };

  return (
    <div className="md:hidden">
      <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
            <Wallet className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="font-heading text-lg font-bold">{t('app.name')}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={toggle} className="p-2 rounded-lg hover:bg-secondary transition-colors text-muted-foreground">
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>
          <button onClick={() => setOpen(!open)} className="p-2 rounded-lg hover:bg-secondary transition-colors text-foreground">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-border bg-card"
          >
            <nav className="px-4 py-2 space-y-1">
              {navItems.map(item => {
                const isActive = location.pathname === item.to;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors
                      ${isActive ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'}`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{t(item.label)}</span>
                  </NavLink>
                );
              })}
            </nav>
            <div className="px-4 pb-4">
              <LanguageSelector />
              <button
                onClick={handleLogout}
                className="mt-2 flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
