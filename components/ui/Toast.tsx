"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onDismiss: () => void;
}

export function Toast({ message, type = "info", onDismiss }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 5000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  const styles =
    type === "success"
      ? "bg-emerald-600 text-white"
      : type === "error"
        ? "bg-red-600 text-white"
        : "bg-slate-800 text-white";

  return (
    <div
      role="alert"
      className={`fixed bottom-4 left-4 right-4 z-50 rounded-lg px-4 py-3 pr-10 shadow-lg md:left-auto md:right-4 md:max-w-sm ${styles} relative`}
    >
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={onDismiss}
        className="absolute right-2 top-2 rounded p-1 hover:opacity-80 text-lg leading-none"
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  );
}
