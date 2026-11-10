/**
 * Toast ringan pengganti notifikasi bawaan browser / modal "OK".
 * Ditampilkan oleh <AppToaster /> di layout.
 */
export type ToastKind = "success" | "error" | "info";

export interface Toast {
  id: number;
  kind: ToastKind;
  title: string;
  text?: string;
}

let seq = 0;

export function useToast() {
  const toasts = useState<Toast[]>("toasts", () => []);

  function dismiss(id: number) {
    toasts.value = toasts.value.filter((t) => t.id !== id);
  }

  function show(kind: ToastKind, title: string, text?: string, ms = kind === "error" ? 6000 : 4000) {
    if (import.meta.server) return;
    const id = ++seq;
    toasts.value = [...toasts.value.slice(-2), { id, kind, title, text }];
    setTimeout(() => dismiss(id), ms);
    return id;
  }

  return {
    toasts,
    dismiss,
    success: (title: string, text?: string) => show("success", title, text),
    error: (title: string, text?: string) => show("error", title, text),
    info: (title: string, text?: string) => show("info", title, text),
  };
}
