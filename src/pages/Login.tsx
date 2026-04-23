import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { t } from '@/shared/lib/i18n';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/features/auth/api/auth-api';
import { useAuthStore } from '@/features/auth/model/auth-store';
import { ApiError } from '@/shared/api/http';

const Login = () => {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Invalid email';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 6) errs.password = 'Min 6 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (tokens) => {
      setSession({
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
      });
      navigate('/');
    },
    onError: (err) => {
      if (err instanceof ApiError) {
        setServerError(err.message);
        return;
      }
      setServerError('Login failed. Please try again.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setServerError('');
      loginMutation.mutate({ email, password });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground">{t('auth.login')}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t('dashboard.welcome')}</p>
        </div>

        <div className="glass-card p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">{t('auth.email')}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={`w-full rounded-xl bg-secondary text-foreground pl-10 pr-4 py-2.5 text-sm border outline-none focus:ring-2 focus:ring-ring transition-all ${
                    errors.email ? 'border-destructive' : 'border-transparent'
                  }`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-foreground">{t('auth.password')}</label>
                <button type="button" className="text-xs text-primary hover:text-primary/80 transition-colors">{t('auth.forgotPassword')}</button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={`w-full rounded-xl bg-secondary text-foreground pl-10 pr-10 py-2.5 text-sm border outline-none focus:ring-2 focus:ring-ring transition-all ${
                    errors.password ? 'border-destructive' : 'border-transparent'
                  }`}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
            </div>

            <button type="submit" className="w-full py-2.5 rounded-xl gradient-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
              {loginMutation.isPending ? 'Signing in...' : t('auth.login')}
            </button>
            {serverError && <p className="text-xs text-destructive">{serverError}</p>}
          </form>

          <p className="text-center text-sm text-muted-foreground">
            {t('auth.noAccount')}{' '}
            <Link to="/register" className="text-primary font-medium hover:text-primary/80 transition-colors">{t('auth.register')}</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
