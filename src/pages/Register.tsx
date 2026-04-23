import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';
import { t } from '@/shared/lib/i18n';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/features/auth/api/auth-api';
import { useAuthStore } from '@/features/auth/model/auth-store';
import { ApiError } from '@/shared/api/http';

const Register = () => {
  const navigate = useNavigate();
  const setSession = useAuthStore((state) => state.setSession);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currency, setCurrency] = useState('USD');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState('');

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!name) errs.name = 'Name is required';
    if (!email) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Invalid email';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 8) errs.password = 'Min 8 characters';
    if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const registerMutation = useMutation({
    mutationFn: authApi.register,
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
      setServerError('Registration failed. Please try again.');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      setServerError('');
      registerMutation.mutate({
        name,
        email,
        password,
        currency,
      });
    }
  };

  const inputClass = (field: string) =>
    `w-full rounded-xl bg-secondary text-foreground px-3 py-2.5 text-sm border outline-none focus:ring-2 focus:ring-ring transition-all ${
      errors[field] ? 'border-destructive' : 'border-transparent'
    }`;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-7 h-7 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground">{t('auth.register')}</h1>
        </div>

        <div className="glass-card p-6 space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">{t('auth.name')}</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" value={name} onChange={e => setName(e.target.value)} className={`${inputClass('name')} pl-10`} placeholder="John Doe" />
              </div>
              {errors.name && <p className="text-xs text-destructive mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">{t('auth.email')}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={`${inputClass('email')} pl-10`} placeholder="you@example.com" />
              </div>
              {errors.email && <p className="text-xs text-destructive mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">{t('auth.password')}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} className={`${inputClass('password')} pl-10 pr-10`} placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-destructive mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">{t('auth.confirmPassword')}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className={`${inputClass('confirmPassword')} pl-10`} placeholder="••••••••" />
              </div>
              {errors.confirmPassword && <p className="text-xs text-destructive mt-1">{errors.confirmPassword}</p>}
            </div>

            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">Currency</label>
              <select
                value={currency}
                onChange={e => setCurrency(e.target.value)}
                className={inputClass('')}
              >
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
                <option value="KZT">KZT</option>
                <option value="JPY">JPY</option>
                <option value="RUB">RUB</option>
              </select>
            </div>

            <button type="submit" className="w-full py-2.5 rounded-xl gradient-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity">
              {registerMutation.isPending ? 'Creating account...' : t('auth.register')}
            </button>
            {serverError && <p className="text-xs text-destructive">{serverError}</p>}
          </form>

          <p className="text-center text-sm text-muted-foreground">
            {t('auth.hasAccount')}{' '}
            <Link to="/login" className="text-primary font-medium hover:text-primary/80 transition-colors">{t('auth.login')}</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
