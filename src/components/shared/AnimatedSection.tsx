"use client";
import React from "react";
import { useInView } from "@/hooks/useInView";
import { cn } from "@/lib/utils";

type Animation = "fade-up" | "fade-left" | "fade-right" | "scale-up" | "fade-in" | "bounce-in";

interface AnimatedSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  animation?: Animation;
}

const hiddenTransform: Record<Animation, string> = {
  "fade-up":    "translate-y-8",
  "fade-left":  "-translate-x-8",
  "fade-right": "translate-x-8",
  "scale-up":   "scale-95",
  "fade-in":    "",
  "bounce-in":  "",
};

export function AnimatedSection({
  children,
  className,
  delay = 0,
  animation = "fade-up",
}: AnimatedSectionProps) {
  const { ref, inView } = useInView();

  // bounce-in uses a CSS animation class instead of CSS transitions
  if (animation === "bounce-in") {
    return (
      <div
        ref={ref}
        style={{ animationDelay: `${delay}ms` }}
        className={cn(
          inView ? "bounce-in-up" : "opacity-0",
          className
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={cn(
        "transition-all duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)]",
        inView
          ? "opacity-100 translate-y-0 translate-x-0 scale-100"
          : cn("opacity-0", hiddenTransform[animation]),
        className
      )}
    >
      {children}
    </div>
  );
}
