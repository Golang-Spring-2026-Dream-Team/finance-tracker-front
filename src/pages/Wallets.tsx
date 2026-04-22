import { useState } from "react";
import { AppLayout } from "@/widgets/app-layout/AppLayout";
import { useCurrency } from "@/features/currency/model/currency-store";
import { accountsApi } from "@/features/accounts/api/accounts-api";
import { Account } from "@/shared/api/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Plus,
  Wallet,
  CreditCard,
  Smartphone,
  Pencil,
  Trash2,
  X,
  DollarSign,
} from "lucide-react";

type AccountType = "cash" | "bank_card" | "e_wallet";

const TYPE_META: Record<AccountType, { label: string; Icon: React.ElementType; color: string }> = {
  cash: { label: "Наличные", Icon: DollarSign, color: "bg-emerald-500/10 text-emerald-500" },
  bank_card: { label: "Банковская карта", Icon: CreditCard, color: "bg-blue-500/10 text-blue-500" },
  e_wallet: { label: "Электронный кошелёк", Icon: Smartphone, color: "bg-violet-500/10 text-violet-500" },
};

interface WalletFormState {
  name: string;
  account_type: AccountType;
  currency: string;
  balance: string;
}

const EMPTY_FORM: WalletFormState = {
  name: "",
  account_type: "cash",
  currency: "KZT",
  balance: "",
};

const WalletCard = ({
  account,
  onEdit,
  onDelete,
}: {
  account: Account;
  onEdit: (a: Account) => void;
  onDelete: (a: Account) => void;
}) => {
  const { formatConverted } = useCurrency();
  const meta = TYPE_META[account.account_type];

  return (
    <div className="glass-card p-5 flex flex-col gap-4 relative group">
      <div className="flex items-start justify-between">
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${meta.color}`}>
          <meta.Icon className="w-5 h-5" />
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(account)}
            className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground transition-colors"
          >
            <Pencil className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(account)}
            className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div>
        <p className="text-xs text-muted-foreground mb-0.5">{meta.label}</p>
        <p className="font-heading font-bold text-foreground text-base truncate">{account.name}</p>
      </div>

      <div>
        <p className="text-xs text-muted-foreground mb-0.5">Баланс</p>
        <p className="text-2xl font-heading font-bold text-foreground">
          {formatConverted(Number(account.balance), account.currency)}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">{account.currency}</p>
      </div>
    </div>
  );
};

const WalletModal = ({
  initial,
  onClose,
  onSubmit,
  isPending,
  serverError,
}: {
  initial: WalletFormState & { id?: number };
  onClose: () => void;
  onSubmit: (form: WalletFormState) => void;
  isPending: boolean;
  serverError: string;
}) => {
  const isEdit = Boolean(initial.id);
  const [form, setForm] = useState<WalletFormState>({
    name: initial.name,
    account_type: initial.account_type,
    currency: initial.currency,
    balance: initial.balance,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Обязательное поле";
    if (!isEdit && form.balance !== "" && Number(form.balance) < 0)
      e.balance = "Баланс не может быть отрицательным";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    onSubmit(form);
  };

  const inputClass = (field: string) =>
    `w-full rounded-xl bg-secondary text-foreground px-3 py-2.5 text-sm border outline-none focus:ring-2 focus:ring-ring transition-all ${
      errors[field] ? "border-destructive" : "border-transparent"
    }`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="glass-card p-6 w-full max-w-md shadow-2xl bg-card"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-heading font-bold text-foreground">
            {isEdit ? "Редактировать кошелёк" : "Новый кошелёк"}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Название
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className={inputClass("name")}
              placeholder="Например: Основная карта"
            />
            {errors.name && (
              <p className="text-xs text-destructive mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Тип
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(Object.entries(TYPE_META) as [AccountType, typeof TYPE_META[AccountType]][]).map(
                ([type, meta]) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, account_type: type }))}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border text-xs font-medium transition-all ${
                      form.account_type === type
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-transparent bg-secondary text-muted-foreground hover:bg-secondary/80"
                    }`}
                  >
                    <meta.Icon className="w-4 h-4" />
                    {meta.label}
                  </button>
                ),
              )}
            </div>
          </div>

          {!isEdit && (
            <div>
              <label className="text-sm font-medium text-foreground mb-1.5 block">
                Начальный баланс
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.balance}
                onChange={(e) => setForm((f) => ({ ...f, balance: e.target.value }))}
                className={inputClass("balance")}
                placeholder="0.00"
              />
              {errors.balance && (
                <p className="text-xs text-destructive mt-1">{errors.balance}</p>
              )}
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-foreground mb-1.5 block">
              Валюта
            </label>
            <select
              value={form.currency}
              onChange={(e) => setForm((f) => ({ ...f, currency: e.target.value }))}
              className={`${inputClass("")} appearance-none cursor-pointer`}
            >
              <option value="KZT">KZT — Тенге</option>
              <option value="USD">USD — Доллар</option>
              <option value="EUR">EUR — Евро</option>
              <option value="RUB">RUB — Рубль</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-2.5 rounded-xl gradient-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {isPending ? "Сохранение..." : isEdit ? "Сохранить" : "Создать кошелёк"}
          </button>

          {serverError && (
            <p className="text-xs text-destructive">{serverError}</p>
          )}
        </form>
      </div>
    </div>
  );
};

const DeleteConfirm = ({
  account,
  onConfirm,
  onCancel,
  isPending,
}: {
  account: Account;
  onConfirm: () => void;
  onCancel: () => void;
  isPending: boolean;
}) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-foreground/20 backdrop-blur-sm"
    onClick={onCancel}
  >
    <div
      className="glass-card p-6 w-full max-w-sm shadow-2xl bg-card"
      onClick={(e) => e.stopPropagation()}
    >
      <h2 className="text-lg font-heading font-bold text-foreground mb-2">
        Удалить кошелёк?
      </h2>
      <p className="text-sm text-muted-foreground mb-5">
        Кошелёк <span className="text-foreground font-medium">"{account.name}"</span> будет удалён.
        Это действие необратимо.
      </p>
      <div className="flex gap-3">
        <button
          onClick={onCancel}
          className="flex-1 py-2.5 rounded-xl bg-secondary text-foreground text-sm font-medium hover:bg-secondary/80 transition-colors"
        >
          Отмена
        </button>
        <button
          onClick={onConfirm}
          disabled={isPending}
          className="flex-1 py-2.5 rounded-xl bg-destructive text-destructive-foreground text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-60"
        >
          {isPending ? "Удаление..." : "Удалить"}
        </button>
      </div>
    </div>
  </div>
);

const Wallets = () => {
  const { format, convert } = useCurrency();
  const queryClient = useQueryClient();

  const [showCreate, setShowCreate] = useState(false);
  const [editAccount, setEditAccount] = useState<Account | null>(null);
  const [deleteAccount, setDeleteAccount] = useState<Account | null>(null);
  const [serverError, setServerError] = useState("");

  const accountsQuery = useQuery({
    queryKey: ["accounts"],
    queryFn: accountsApi.list,
  });

  const accounts = accountsQuery.data || [];
  const totalBalance = accounts.reduce((s, a) => s + convert(Number(a.balance), a.currency), 0);

  const invalidate = () => queryClient.invalidateQueries({ queryKey: ["accounts"] });

  const createMutation = useMutation({
    mutationFn: (form: WalletFormState) =>
      accountsApi.create({
        name: form.name,
        account_type: form.account_type,
        currency: form.currency,
        balance: form.balance || "",
      }),
    onSuccess: () => {
      invalidate();
      setShowCreate(false);
      setServerError("");
    },
    onError: (err) =>
      setServerError(err instanceof Error ? err.message : "Ошибка создания"),
  });

  const updateMutation = useMutation({
    mutationFn: (form: WalletFormState) =>
      accountsApi.update(editAccount!.id, {
        name: form.name,
        account_type: form.account_type,
        currency: form.currency,
      }),
    onSuccess: () => {
      invalidate();
      setEditAccount(null);
      setServerError("");
    },
    onError: (err) =>
      setServerError(err instanceof Error ? err.message : "Ошибка обновления"),
  });

  const deleteMutation = useMutation({
    mutationFn: () => accountsApi.remove(deleteAccount!.id),
    onSuccess: () => {
      invalidate();
      setDeleteAccount(null);
    },
    onError: (err) =>
      setServerError(err instanceof Error ? err.message : "Ошибка удаления"),
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
              Кошельки
            </h1>
            <p className="text-muted-foreground text-sm mt-1">
              Управляйте вашими счётами и кошельками
            </p>
          </div>
          <button
            onClick={() => { setShowCreate(true); setServerError(""); }}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity self-start"
          >
            <Plus className="w-4 h-4" />
            Новый кошелёк
          </button>
        </div>

        <div className="glass-card p-4 flex items-center gap-4">
          <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center flex-shrink-0">
            <Wallet className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Общий баланс</p>
            <p className="text-2xl font-heading font-bold text-foreground">
              {format(totalBalance)}
            </p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-muted-foreground">Кошельков</p>
            <p className="text-xl font-heading font-bold text-foreground">{accounts.length}</p>
          </div>
        </div>

        {accountsQuery.isPending ? (
          <div className="glass-card p-8 text-center text-muted-foreground">
            Загрузка кошельков...
          </div>
        ) : accounts.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <Wallet className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-foreground font-medium mb-1">Кошельков нет</p>
            <p className="text-muted-foreground text-sm">
              Создайте первый кошелёк, чтобы начать отслеживать финансы
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {accounts.map((account) => (
              <WalletCard
                key={account.id}
                account={account}
                onEdit={(a) => { setEditAccount(a); setServerError(""); }}
                onDelete={setDeleteAccount}
              />
            ))}
          </div>
        )}
      </div>

      {showCreate && (
        <WalletModal
          initial={{ ...EMPTY_FORM }}
          onClose={() => setShowCreate(false)}
          onSubmit={(form) => createMutation.mutate(form)}
          isPending={createMutation.isPending}
          serverError={serverError}
        />
      )}

      {editAccount && (
        <WalletModal
          initial={{
            id: editAccount.id,
            name: editAccount.name,
            account_type: editAccount.account_type,
            currency: editAccount.currency,
            balance: editAccount.balance,
          }}
          onClose={() => setEditAccount(null)}
          onSubmit={(form) => updateMutation.mutate(form)}
          isPending={updateMutation.isPending}
          serverError={serverError}
        />
      )}

      {deleteAccount && (
        <DeleteConfirm
          account={deleteAccount}
          onConfirm={() => deleteMutation.mutate()}
          onCancel={() => setDeleteAccount(null)}
          isPending={deleteMutation.isPending}
        />
      )}
    </AppLayout>
  );
};

export default Wallets;
