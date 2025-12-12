"use client";

import { Hammer } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface TopArtisanBadgeProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  variant?: "default" | "compact";
}

export default function TopArtisanBadge({ 
  className = "", 
  size = "md",
  variant = "default"
}: TopArtisanBadgeProps) {
  
  const sizeClasses = {
    sm: "text-xs px-2 py-1",
    md: "text-sm px-3 py-1.5", 
    lg: "text-base px-4 py-2"
  };

  const iconSizes = {
    sm: "h-3 w-3",
    md: "h-4 w-4",
    lg: "h-5 w-5"
  };

  if (variant === "compact") {
    return (
      <div className={`inline-flex items-center gap-1 ${className}`}>
        <Hammer className={`${iconSizes[size]} text-yellow-500`} />
        {size !== "sm" && (
          <span className="text-yellow-600 font-semibold text-xs">TOP ARTISAN</span>
        )}
      </div>
    );
  }

  return (
    <Badge 
      className={`
        bg-gradient-to-r from-yellow-400 to-yellow-500 
        text-white 
        border-yellow-300 
        shadow-md 
        font-semibold 
        ${sizeClasses[size]} 
        ${className}
      `}
    >
      <Hammer className={`${iconSizes[size]} mr-1`} />
      Top Artisan
    </Badge>
  );
}
