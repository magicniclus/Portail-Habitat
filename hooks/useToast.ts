"use client";

import { useState, useCallback } from 'react';

export interface Toast {
  id: string;
  title?: string;
  description: string;
  variant?: 'default' | 'destructive' | 'success';
  duration?: number;
}

interface ToastState {
  toasts: Toast[];
}

let toastCount = 0;

const listeners: Array<(state: ToastState) => void> = [];
let memoryState: ToastState = { toasts: [] };

function dispatch(action: { type: string; toast?: Toast; toastId?: string }) {
  switch (action.type) {
    case 'ADD_TOAST':
      if (action.toast) {
        memoryState.toasts = [action.toast, ...memoryState.toasts];
      }
      break;
    case 'UPDATE_TOAST':
      if (action.toast) {
        memoryState.toasts = memoryState.toasts.map((t) =>
          t.id === action.toast!.id ? { ...t, ...action.toast } : t
        );
      }
      break;
    case 'DISMISS_TOAST':
      if (action.toastId) {
        memoryState.toasts = memoryState.toasts.filter((t) => t.id !== action.toastId);
      }
      break;
    case 'REMOVE_TOAST':
      if (action.toastId) {
        memoryState.toasts = memoryState.toasts.filter((t) => t.id !== action.toastId);
      }
      break;
  }

  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

function genId() {
  toastCount = (toastCount + 1) % Number.MAX_VALUE;
  return toastCount.toString();
}

export const toast = ({
  title,
  description,
  variant = 'default',
  duration = 5000,
  ...props
}: Omit<Toast, 'id'>) => {
  const id = genId();

  const newToast: Toast = {
    id,
    title,
    description,
    variant,
    duration,
    ...props,
  };

  dispatch({
    type: 'ADD_TOAST',
    toast: newToast,
  });

  // Auto dismiss after duration
  if (duration > 0) {
    setTimeout(() => {
      dispatch({
        type: 'DISMISS_TOAST',
        toastId: id,
      });
    }, duration);
  }

  return {
    id,
    dismiss: () => dispatch({ type: 'DISMISS_TOAST', toastId: id }),
    update: (toast: Partial<Toast>) =>
      dispatch({ type: 'UPDATE_TOAST', toast: { ...newToast, ...toast } }),
  };
};

export function useToast() {
  const [state, setState] = useState<ToastState>(memoryState);

  useState(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  });

  return {
    ...state,
    toast,
    dismiss: (toastId: string) => dispatch({ type: 'DISMISS_TOAST', toastId }),
  };
}
