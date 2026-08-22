"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function PostCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl border border-border p-5">
      <div className="flex items-center gap-3 mb-3">
        <Skeleton className="w-10 h-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-2 w-16" />
        </div>
      </div>
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-3/4 mb-4" />
      <Skeleton className="h-48 w-full rounded-xl mb-3" />
      <div className="flex gap-2">
        <Skeleton className="h-7 w-16 rounded-lg" />
        <Skeleton className="h-7 w-16 rounded-lg" />
      </div>
    </div>
  );
}

export function ShopCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <Skeleton className="h-44 w-full" />
      <div className="p-4 space-y-2">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-5 w-20 mt-2" />
      </div>
    </div>
  );
}

export function CommunityCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl border border-border p-5">
      <div className="flex items-start gap-4 mb-3">
        <Skeleton className="w-12 h-12 rounded-xl" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-20" />
        </div>
      </div>
      <Skeleton className="h-3 w-full mb-2" />
      <Skeleton className="h-3 w-3/4" />
    </div>
  );
}

export function FeedSkeleton() {
  return (
    <div className="space-y-4">
      <PostCardSkeleton />
      <PostCardSkeleton />
      <PostCardSkeleton />
    </div>
  );
}

export function MarketplaceSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {[...Array(6)].map((_, i) => <ShopCardSkeleton key={i} />)}
    </div>
  );
}

export function JobCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl border border-border p-5">
      <div className="flex items-start gap-4">
        <Skeleton className="w-11 h-11 rounded-full shrink-0" />
        <div className="flex-1 min-w-0 space-y-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-3 w-1/3" />
          <Skeleton className="h-3 w-full mt-2" />
          <Skeleton className="h-3 w-2/3" />
          <div className="flex flex-wrap gap-2 mt-3">
            <Skeleton className="h-5 w-20 rounded-full" />
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-5 w-24 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-3 w-12 shrink-0" />
      </div>
    </div>
  );
}

export function EventCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden">
      <div className="flex flex-col sm:flex-row">
        <Skeleton className="sm:w-56 h-40 sm:h-auto shrink-0 rounded-none" />
        <div className="flex-1 p-5 space-y-3">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
          <div className="flex flex-wrap gap-3 pt-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-3 w-20" />
          </div>
          <Skeleton className="h-8 w-24 rounded-full mt-2" />
        </div>
      </div>
    </div>
  );
}

export function CategoryPillsSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
      {[...Array(count)].map((_, i) => (
        <Skeleton key={i} className="h-9 w-24 rounded-full shrink-0" />
      ))}
    </div>
  );
}

export function SearchResultRowSkeleton() {
  return (
    <div className="bg-card rounded-xl border border-border p-3 flex items-center gap-3">
      <Skeleton className="w-10 h-10 rounded-xl shrink-0" />
      <div className="flex-1 min-w-0 space-y-2">
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}
