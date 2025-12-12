"use client";

import { Crown } from "lucide-react";
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
      <Badge 
        className={`
          bg-yellow-500 
          text-white 
          border-yellow-400 
          shadow-sm 
          font-semibold 
          inline-flex items-center gap-1
          ${sizeClasses[size]} 
          ${className}
        `}
      >
        <Crown className={`${iconSizes[size]}`} />
        Top Artisan
      </Badge>
    );
  }

  return (
    <Badge 
      className={`
        bg-yellow-500 
        text-white 
        border-yellow-400 
        shadow-md 
        font-semibold 
        inline-flex items-center gap-1
        ${sizeClasses[size]} 
        ${className}
      `}
    >
      <Crown className={`${iconSizes[size]}`} />
      Top Artisan
    </Badge>
  );
}
