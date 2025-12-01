"use client";

import { toast as sonnerToast } from "sonner";

interface ToastOptions {
  title: string;
  description?: string;
  variant?: "default" | "destructive";
}

export function useToast() {
  const toast = ({ title, description, variant }: ToastOptions) => {
    if (variant === "destructive") {
      sonnerToast.error(title, {
        description,
      });
    } else {
      sonnerToast.success(title, {
        description,
      });
    }
  };

  return { toast };
}

// Direct toast functions for simpler usage
export const showToast = {
  success: (title: string, description?: string) => {
    sonnerToast.success(title, { description });
  },
  error: (title: string, description?: string) => {
    sonnerToast.error(title, { description });
  },
  info: (title: string, description?: string) => {
    sonnerToast.info(title, { description });
  },
  loading: (title: string, description?: string) => {
    return sonnerToast.loading(title, { description });
  },
  dismiss: (id?: string | number) => {
    sonnerToast.dismiss(id);
  },
};
