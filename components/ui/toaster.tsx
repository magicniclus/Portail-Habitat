"use client";

import { useToast } from "@/hooks/useToast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { X, CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:bottom-0 sm:right-0 sm:top-auto sm:flex-col md:max-w-[420px]">
      {toasts.map((toast) => {
        const Icon = toast.variant === 'success' ? CheckCircle : 
                   toast.variant === 'destructive' ? XCircle : AlertCircle;
        
        return (
          <Alert
            key={toast.id}
            className={cn(
              "relative mb-2 w-full rounded-lg border p-4 shadow-lg transition-all duration-300 ease-in-out",
              "animate-in slide-in-from-right-full",
              {
                "border-red-200 bg-red-50 text-red-900": toast.variant === 'destructive',
                "border-green-200 bg-green-50 text-green-900": toast.variant === 'success',
                "border-blue-200 bg-blue-50 text-blue-900": toast.variant === 'default',
              }
            )}
          >
            <div className="flex items-start gap-3">
              <Icon className={cn(
                "h-5 w-5 mt-0.5 flex-shrink-0",
                {
                  "text-red-600": toast.variant === 'destructive',
                  "text-green-600": toast.variant === 'success',
                  "text-blue-600": toast.variant === 'default',
                }
              )} />
              
              <div className="flex-1 space-y-1">
                {toast.title && (
                  <AlertTitle className="text-sm font-medium">
                    {toast.title}
                  </AlertTitle>
                )}
                <AlertDescription className="text-sm opacity-90">
                  {toast.description}
                </AlertDescription>
              </div>
              
              <button
                onClick={() => dismiss(toast.id)}
                className={cn(
                  "rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
                  "ml-auto h-4 w-4 flex-shrink-0"
                )}
              >
                <X className="h-4 w-4" />
                <span className="sr-only">Fermer</span>
              </button>
            </div>
          </Alert>
        );
      })}
    </div>
  );
}
