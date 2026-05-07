import { createContext, useContext, useState, useCallback } from "react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success") => {
    // Generate unique ID for each toast
    const id = Date.now() + Math.random();

    setToasts((prev) => [...prev, { id, message, type }]);

    // Auto remove after 3.5 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // Convenience methods
  const toast = {
    success: (msg) => addToast(msg, "success"),
    error: (msg) => addToast(msg, "error"),
    info: (msg) => addToast(msg, "info"),
    warning: (msg) => addToast(msg, "warning"),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
};

// ─── Toast Container ──────────────────────────────────────────────
const ToastContainer = ({ toasts, onRemove }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
      ))}
    </div>
  );
};

// ─── Individual Toast ─────────────────────────────────────────────
const ToastItem = ({ toast, onRemove }) => {
  const styles = {
    success: {
      container: "bg-green-50 border-green-200",
      icon: "✅",
      text: "text-green-800",
    },
    error: {
      container: "bg-red-50 border-red-200",
      icon: "❌",
      text: "text-red-800",
    },
    info: {
      container: "bg-blue-50 border-blue-200",
      icon: "ℹ️",
      text: "text-blue-800",
    },
    warning: {
      container: "bg-amber-50 border-amber-200",
      icon: "⚠️",
      text: "text-amber-800",
    },
  };

  const style = styles[toast.type] || styles.info;

  return (
    <div
      className={`
        flex items-start gap-3 p-4 rounded-xl border shadow-lg
        animate-slide-in
        ${style.container}
      `}
    >
      <span className="text-base flex-shrink-0">{style.icon}</span>
      <p className={`text-sm font-medium flex-1 ${style.text}`}>
        {toast.message}
      </p>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-slate-400 hover:text-slate-600 flex-shrink-0 transition-colors"
      >
        ✕
      </button>
    </div>
  );
};

// ─── Custom hook ──────────────────────────────────────────────────
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};