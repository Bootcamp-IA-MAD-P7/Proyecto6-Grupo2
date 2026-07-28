import { forwardRef, type HTMLAttributes } from "react"

import { cn } from "@/lib/utils"

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border border-border/90 bg-card text-card-foreground shadow-[0_1px_2px_rgba(15,35,60,0.025),0_10px_30px_rgba(15,35,60,0.04)]",
        className,
      )}
      {...props}
    />
  ),
)

Card.displayName = "Card"

export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("p-5 sm:p-6", className)} {...props} />
}

export function CardContent({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("px-5 pb-5 sm:px-6 sm:pb-6", className)} {...props} />
}
