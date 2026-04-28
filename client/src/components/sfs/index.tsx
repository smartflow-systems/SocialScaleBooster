import { forwardRef, type ComponentPropsWithoutRef, type ElementType } from "react";
import { cn } from "@/lib/utils";

export const GlassCard = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("glass-card", className)} {...props} />
  ),
);
GlassCard.displayName = "GlassCard";

export const SfsContainer = forwardRef<HTMLDivElement, ComponentPropsWithoutRef<"div">>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("container", className)} {...props} />
  ),
);
SfsContainer.displayName = "SfsContainer";

export const SfsSection = forwardRef<HTMLElement, ComponentPropsWithoutRef<"section">>(
  ({ className, ...props }, ref) => (
    <section ref={ref} className={cn("section", className)} {...props} />
  ),
);
SfsSection.displayName = "SfsSection";

type ButtonProps = ComponentPropsWithoutRef<"button">;

export const GoldButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, type = "button", ...props }, ref) => (
    <button ref={ref} type={type} className={cn("btn btn-gold", className)} {...props} />
  ),
);
GoldButton.displayName = "GoldButton";

export const GhostButton = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, type = "button", ...props }, ref) => (
    <button ref={ref} type={type} className={cn("btn btn-ghost", className)} {...props} />
  ),
);
GhostButton.displayName = "GhostButton";

type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;

export interface GoldHeadingProps extends ComponentPropsWithoutRef<"h2"> {
  level?: HeadingLevel;
}

export const GoldHeading = forwardRef<HTMLHeadingElement, GoldHeadingProps>(
  ({ level = 2, className, ...props }, ref) => {
    const Tag = `h${level}` as ElementType;
    return <Tag ref={ref} className={cn("text-gold-gradient", className)} {...props} />;
  },
);
GoldHeading.displayName = "GoldHeading";

export const GoldText = forwardRef<HTMLSpanElement, ComponentPropsWithoutRef<"span">>(
  ({ className, ...props }, ref) => (
    <span ref={ref} className={cn("text-gold", className)} {...props} />
  ),
);
GoldText.displayName = "GoldText";

export type FadeStagger = 1 | 2 | 3 | 4 | 5 | 6;

export interface FadeInUpProps extends ComponentPropsWithoutRef<"div"> {
  stagger?: FadeStagger;
}

export const FadeInUp = forwardRef<HTMLDivElement, FadeInUpProps>(
  ({ stagger, className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("fade-in-up", stagger ? `stagger-${stagger}` : undefined, className)}
      {...props}
    />
  ),
);
FadeInUp.displayName = "FadeInUp";
