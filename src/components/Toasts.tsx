"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/client/hooks";
import { toastDismissed, type Toast } from "@/client/uiSlice";

function ToastItem({ toast }: { toast: Toast }) {
  const dispatch = useAppDispatch();
  useEffect(() => {
    const timer = setTimeout(() => dispatch(toastDismissed(toast.id)), 6000);
    return () => clearTimeout(timer);
  }, [dispatch, toast.id]);

  const tone =
    toast.tone === "error"
      ? "border-red-200 bg-red-50 text-red-800"
      : "border-emerald-200 bg-emerald-50 text-emerald-800";

  return (
    <div role="status" className={`flex items-start gap-3 rounded-md border px-4 py-3 text-sm shadow-sm ${tone}`}>
      <p className="flex-1">{toast.message}</p>
      <button
        type="button"
        onClick={() => dispatch(toastDismissed(toast.id))}
        className="text-xs font-medium opacity-70 hover:opacity-100"
        aria-label="Dismiss"
      >
        Close
      </button>
    </div>
  );
}

export function Toasts() {
  const toasts = useAppSelector((state) => state.ui.toasts);
  return (
    <div aria-live="polite" className="fixed right-4 bottom-4 z-50 flex w-80 flex-col gap-2">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} />
      ))}
    </div>
  );
}
