import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  text?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6", 
  lg: "h-8 w-8"
};

export function Spinner({ size = "md", className, text }: SpinnerProps) {
  return (
    <div className="flex items-center justify-center">
      <div className="bg-white/90 rounded-full p-4 shadow-lg">
        <Loader2 className={cn(sizeClasses[size], "animate-spin text-gray-700", className)} />
      </div>
      {text && (
        <span className="ml-2 text-sm text-gray-600">{text}</span>
      )}
    </div>
  );
}

// Spinner pour overlay (bannière, logo, etc.)
export function SpinnerOverlay({ size = "md", className }: Omit<SpinnerProps, "text">) {
  return (
    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
      <div className="bg-white/90 rounded-full p-4">
        <Loader2 className={cn(sizeClasses[size], "animate-spin text-gray-700", className)} />
      </div>
    </div>
  );
}

// Spinner pour chargement de page
export function PageSpinner({ text = "Chargement..." }: { text?: string }) {
  return (
    <div className="flex items-center justify-center h-64">
      <Loader2 className="h-8 w-8 animate-spin mr-2" />
      <span className="text-gray-600">{text}</span>
    </div>
  );
}
