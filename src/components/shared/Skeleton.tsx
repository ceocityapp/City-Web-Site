"use client";

import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circle" | "rect" | "card";
}

export function Skeleton({ className, variant = "rect" }: SkeletonProps) {
  const base = "bg-muted skeleton-wave";

  if (variant === "text") {
    return <div className={cn(base, "h-4 w-full rounded", className)} />;
  }

  if (variant === "circle") {
    return <div className={cn(base, "rounded-full", className)} />;
  }

  if (variant === "card") {
    return (
      <div className={cn("bg-card rounded-2xl border border-border overflow-hidden", className)}>
        <div className={cn(base, "h-44 w-full rounded-none")} />
        <div className="p-4 space-y-3">
          <div className={cn(base, "h-4 w-3/4 rounded")} />
          <div className={cn(base, "h-3 w-1/2 rounded")} />
          <div className={cn(base, "h-3 w-full rounded")} />
          <div className={cn(base, "h-6 w-20 rounded-full")} />
        </div>
      </div>
    );
  }

  // variant === "rect"
  return <div className={cn(base, "rounded-xl", className)} />;
}
