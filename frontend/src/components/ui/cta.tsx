import { ArrowRight } from "lucide-react"
import type { ButtonHTMLAttributes } from "react"

import { cn } from "@/lib/utils"

type CtaProps = ButtonHTMLAttributes<HTMLButtonElement>

const baseStyles =
  "group inline-flex h-11 items-center justify-center gap-2 rounded-lg px-5 text-sm font-medium transition duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring disabled:pointer-events-none disabled:opacity-50 motion-safe:hover:-translate-y-px"

export function PrimaryCTA({ className, children, ...props }: CtaProps) {
  return (
    <button
      type="button"
      className={cn(
        baseStyles,
        "bg-foreground text-background shadow-[0_4px_12px_rgba(17,17,17,0.12)] hover:shadow-[0_6px_16px_rgba(17,17,17,0.15)]",
        className,
      )}
      {...props}
    >
      {children}
      <ArrowRight
        className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </button>
  )
}

export function SecondaryCTA({ className, children, ...props }: CtaProps) {
  return (
    <button
      type="button"
      className={cn(
        baseStyles,
        "border border-border bg-transparent text-foreground hover:bg-muted",
        className,
      )}
      {...props}
    >
      {children}
      <ArrowRight
        className="size-4 transition-transform duration-200 group-hover:translate-x-0.5"
        aria-hidden="true"
      />
    </button>
  )
}
