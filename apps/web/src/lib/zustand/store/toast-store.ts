import { create } from 'zustand';

export type ToastStatus = 'success' | 'error' | 'notice';

export interface ToastItem {
  id: string;
  status: ToastStatus;
  title: string;
  subtext?: string;
  autoClose?: boolean;
}

interface ToastState {
  toasts: ToastItem[];
  showToast: (toast: Omit<ToastItem, 'id'>) => void;
  closeToast: (id: string) => void;
}

const MAX_TOAST = 3;

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],
  showToast: (toast) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    set({
      toasts: [...get().toasts, { ...toast, id }].slice(-MAX_TOAST),
    });
    if (toast.autoClose !== false) {
      setTimeout(() => get().closeToast(id), 3000);
    }
  },
  closeToast: (id) => set({ toasts: get().toasts.filter((t) => t.id !== id) }),
}));
