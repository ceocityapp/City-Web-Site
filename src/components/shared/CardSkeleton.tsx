"use client";

import { cn } from "@/lib/utils";

interface CardSkeletonProps {
  className?: string;
}

/**
 * Card-shaped skeleton for loading states.
 * Drop-in replacement for ShopCard, EventCard, etc. during loading.
 */
export function CardSkeleton({ className }: CardSkeletonProps) {
  const pulse = "bg-muted skeleton-wave";

  return (
    <div className={cn("bg-card rounded-2xl border border-border overflow-hidden", className)}>
      {/* Image placeholder */}
      <div className={cn(pulse, "h-44 w-full rounded-t-2xl rounded-b-none")} />

      {/* Text lines */}
      <div className="p-4 space-y-3">
        <div className={cn(pulse, "h-4 w-3/4 rounded")} />
        <div className={cn(pulse, "h-3 w-1/2 rounded")} />
        <div className={cn(pulse, "h-3 w-full rounded")} />

        {/* Badge placeholder */}
        <div className={cn(pulse, "h-6 w-24 rounded-full")} />
      </div>
    </div>
  );
}
