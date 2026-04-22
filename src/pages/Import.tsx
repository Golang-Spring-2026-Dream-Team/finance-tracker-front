import { useState, useCallback, useRef } from "react";
import { AppLayout } from "@/widgets/app-layout/AppLayout";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  FileText,
  Check,
  X,
  Wallet,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
} from "lucide-react";
import { useCurrency } from "@/features/currency/model/currency-store";
import { t } from "@/shared/lib/i18n";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { accountsApi } from "@/features/accounts/api/accounts-api";
import { transactionsApi } from "@/features/transactions/api/transactions-api";
import { parseKaspiPdf, type ParsedTransaction } from "@/features/import/lib/kaspi-parser";

type Step = "upload" | "preview" | "done";
type WalletChoice = "existing" | "new";

const ImportPage = () => {
  const { formatConverted } = useCurrency();
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [step, setStep] = useState<Step>("upload");
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [parseError, setParseError] = useState("");
  const [fileName, setFileName] = useState("");
  const [transactions, setTransactions] = useState<ParsedTransaction[]>([]);

  const [walletChoice, setWalletChoice] = useState<WalletChoice>("existing");
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [newWalletName, setNewWalletName] = useState("");

  const [importError, setImportError] = useState("");
  const [importedCount, setImportedCount] = useState(0);

  const accountsQuery = useQuery({
    queryKey: ["accounts"],
    queryFn: accountsApi.list,
  });

  const selected = transactions.filter((t) => t.selected);
  const incomeCount = selected.filter((t) => t.type === "income").length;
  const expenseCount = selected.filter((t) => t.type === "expense").length;

  const processFile = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setParseError("Поддерживаются только PDF-файлы (выписка Kaspi)");
      return;
    }
    setParseError("");
    setIsParsing(true);
    setFileName(file.name);
    try {
      const txs = await parseKaspiPdf(file);
      if (txs.length === 0) {
        setParseError("Транзакции не найдены. Убедитесь, что это выписка Kaspi Bank.");
        setIsParsing(false);
        return;
      }
      setTransactions(txs);
      setStep("preview");
    } catch {
      setParseError("Ошибка чтения PDF. Попробуйте другой файл.");
    } finally {
      setIsParsing(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  const toggleTx = (i: number) =>
    setTransactions((prev) =>
      prev.map((t, idx) => (idx === i ? { ...t, selected: !t.selected } : t)),
    );

  const toggleAll = (val: boolean) =>
    setTransactions((prev) => prev.map((t) => ({ ...t, selected: val })));

  const importMutation = useMutation({
    mutationFn: async () => {
      let accountId: number;

      if (walletChoice === "new") {
        if (!newWalletName.trim()) throw new Error("Введите название кошелька");
        const acc = await accountsApi.create({
          name: newWalletName.trim(),
          account_type: "bank_card",
          currency: "KZT",
          balance: "",
        });
        accountId = acc.id;
      } else {
        const id = selectedAccountId || accountsQuery.data?.[0]?.id?.toString();
        if (!id) throw new Error("Выберите кошелёк");
        accountId = Number(id);
      }

      let count = 0;
      for (const tx of selected) {
        await transactionsApi.create({
          account_id: accountId,
          amount: tx.amount,
          currency: "KZT",
          type: tx.type,
          description: tx.description,
          transacted_at: tx.date,
        });
        count++;
      }
      return count;
    },
    onSuccess: (count) => {
      setImportedCount(count);
      setStep("done");
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["analytics"] });
    },
    onError: (err) =>
      setImportError(err instanceof Error ? err.message : "Ошибка импорта"),
  });

  const reset = () => {
    setStep("upload");
    setTransactions([]);
    setFileName("");
    setParseError("");
    setImportError("");
    setWalletChoice("existing");
    setSelectedAccountId("");
    setNewWalletName("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const stepIndex = { upload: 0, preview: 1, done: 2 };
  const stepLabels = [t("import.stepFile"), t("import.stepPreview"), t("import.stepDone")];

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
            {t("import.title")}
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            {t("import.subtitle")}
          </p>
        </div>

        {/* Steps */}
        <div className="flex items-center w-full">
          {stepLabels.map((label, i) => (
            <div key={label} className="flex items-center flex-1 min-w-0">
              <div
                className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center text-sm font-semibold transition-colors ${
                  stepIndex[step] === i
                    ? "gradient-primary text-primary-foreground"
                    : stepIndex[step] > i
                      ? "bg-success text-success-foreground"
                      : "bg-secondary text-muted-foreground"
                }`}
              >
                {stepIndex[step] > i ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              <span
                className={`text-sm font-medium hidden sm:inline ml-2 ${stepIndex[step] === i ? "text-foreground" : "text-muted-foreground"}`}
              >
                {label}
              </span>
              {i < 2 && <div className="h-px bg-border flex-1 ml-3 mr-3" />}
            </div>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* ── STEP 1: UPLOAD ── */}
          {step === "upload" && (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-4"
            >
              <div
                onDrop={handleDrop}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onClick={() => fileInputRef.current?.click()}
                className={`glass-card p-12 text-center cursor-pointer transition-all ${
                  isDragging
                    ? "ring-2 ring-primary bg-primary/5"
                    : "hover:bg-secondary/50"
                } ${isParsing ? "pointer-events-none opacity-60" : ""}`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  onChange={handleFileInput}
                />
                {isParsing ? (
                  <>
                    <Loader2 className="w-10 h-10 text-primary mx-auto mb-4 animate-spin" />
                    <p className="text-lg font-heading font-semibold text-foreground">
                      {t("import.parsing")}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t("import.parsingSubtitle")}
                    </p>
                  </>
                ) : (
                  <>
                    <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Upload className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-lg font-heading font-semibold text-foreground">
                      {t("import.dragDrop")}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {t("import.browse")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-3 opacity-60">
                      {t("import.kaspiHint")}
                    </p>
                  </>
                )}
              </div>

              {parseError && (
                <p className="text-sm text-destructive text-center">{parseError}</p>
              )}
            </motion.div>
          )}

          {/* ── STEP 2: PREVIEW ── */}
          {step === "preview" && (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-4"
            >
              {/* File info + summary */}
              <div className="glass-card p-4 flex items-center gap-3">
                <FileText className="w-5 h-5 text-primary flex-shrink-0" />
                <span className="text-sm font-medium text-foreground truncate flex-1">
                  {fileName}
                </span>
                <span className="text-xs text-muted-foreground flex-shrink-0">
                  {transactions.length} транзакций
                </span>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="glass-card p-3 text-center">
                  <p className="text-xs text-muted-foreground">Выбрано</p>
                  <p className="text-xl font-heading font-bold text-foreground">{selected.length}</p>
                </div>
                <div className="glass-card p-3 text-center">
                  <p className="text-xs text-muted-foreground">Доходы</p>
                  <p className="text-xl font-heading font-bold text-success">{incomeCount}</p>
                </div>
                <div className="glass-card p-3 text-center">
                  <p className="text-xs text-muted-foreground">Расходы</p>
                  <p className="text-xl font-heading font-bold text-destructive">{expenseCount}</p>
                </div>
              </div>

              {/* Wallet selection */}
              <div className="glass-card p-5 space-y-4">
                <p className="text-sm font-semibold text-foreground">{t("import.walletTarget")}</p>

                <div className="flex gap-2 p-1 bg-secondary rounded-xl">
                  <button
                    type="button"
                    onClick={() => setWalletChoice("existing")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                      walletChoice === "existing"
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground"
                    }`}
                  >
                    <Wallet className="w-4 h-4" />
                    {t("import.walletExisting")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setWalletChoice("new")}
                    className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                      walletChoice === "new"
                        ? "bg-card text-foreground shadow-sm"
                        : "text-muted-foreground"
                    }`}
                  >
                    <Plus className="w-4 h-4" />
                    {t("import.walletNew")}
                  </button>
                </div>

                {walletChoice === "existing" ? (
                  <select
                    value={selectedAccountId}
                    onChange={(e) => setSelectedAccountId(e.target.value)}
                    className="w-full rounded-xl bg-secondary text-foreground text-sm px-3 py-2.5 border-0 outline-none focus:ring-2 focus:ring-ring"
                  >
                    {(accountsQuery.data || []).map((acc) => (
                      <option key={acc.id} value={acc.id}>
                        {acc.name} — {acc.currency}
                      </option>
                    ))}
                    {(accountsQuery.data || []).length === 0 && (
                      <option value="">Нет кошельков — создайте новый</option>
                    )}
                  </select>
                ) : (
                  <input
                    type="text"
                    value={newWalletName}
                    onChange={(e) => setNewWalletName(e.target.value)}
                    placeholder={t("import.walletNamePlaceholder")}
                    className="w-full rounded-xl bg-secondary text-foreground text-sm px-3 py-2.5 border-transparent border outline-none focus:ring-2 focus:ring-ring"
                  />
                )}
              </div>

              {/* Transaction list */}
              <div className="glass-card overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                  <p className="text-sm font-semibold text-foreground">{t("import.transactions")}</p>
                  <div className="flex gap-3">
                    <button
                      onClick={() => toggleAll(true)}
                      className="text-xs text-primary hover:underline"
                    >
                      {t("import.selectAll")}
                    </button>
                    <button
                      onClick={() => toggleAll(false)}
                      className="text-xs text-muted-foreground hover:underline"
                    >
                      {t("import.deselectAll")}
                    </button>
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto divide-y divide-border">
                  {transactions.map((tx, i) => (
                    <div
                      key={i}
                      onClick={() => toggleTx(i)}
                      className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${
                        tx.selected ? "hover:bg-secondary/30" : "opacity-40 hover:bg-secondary/20"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded flex items-center justify-center flex-shrink-0 border-2 transition-colors ${
                          tx.selected
                            ? "bg-primary border-primary"
                            : "border-muted-foreground"
                        }`}
                      >
                        {tx.selected && <Check className="w-3 h-3 text-primary-foreground" />}
                      </div>

                      <div
                        className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          tx.type === "income"
                            ? "bg-success/10"
                            : "bg-destructive/10"
                        }`}
                      >
                        {tx.type === "income" ? (
                          <ArrowUpRight className="w-4 h-4 text-success" />
                        ) : (
                          <ArrowDownRight className="w-4 h-4 text-destructive" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {tx.description}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {tx.date} · {tx.rawType}
                        </p>
                      </div>

                      <span
                        className={`text-sm font-semibold flex-shrink-0 ${
                          tx.type === "income" ? "text-success" : "text-foreground"
                        }`}
                      >
                        {tx.type === "income" ? "+" : "−"}
                        {formatConverted(Number(tx.amount), "KZT")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {importError && (
                <p className="text-sm text-destructive">{importError}</p>
              )}

              <div className="flex justify-between gap-3">
                <button
                  onClick={reset}
                  className="px-4 py-2.5 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-colors"
                >
                  {t("import.back")}
                </button>
                <button
                  onClick={() => { setImportError(""); importMutation.mutate(); }}
                  disabled={selected.length === 0 || importMutation.isPending}
                  className="px-6 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                >
                  {importMutation.isPending && (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  )}
                  {importMutation.isPending
                    ? t("import.importing")
                    : `${t("import.apply")} (${selected.length})`}
                </button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 3: DONE ── */}
          {step === "done" && (
            <motion.div
              key="done"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-card p-12 text-center space-y-4"
            >
              <div className="w-16 h-16 rounded-2xl bg-success/10 flex items-center justify-center mx-auto">
                <Check className="w-8 h-8 text-success" />
              </div>
              <h2 className="text-xl font-heading font-bold text-foreground">
                {t("import.done")}
              </h2>
              <p className="text-muted-foreground text-sm">
                <strong className="text-foreground">{importedCount}</strong> {t("import.transactions").toLowerCase()}
              </p>
              <button
                onClick={reset}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl gradient-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity mx-auto"
              >
                <X className="w-4 h-4" />
                {t("import.importMore")}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AppLayout>
  );
};

export default ImportPage;
