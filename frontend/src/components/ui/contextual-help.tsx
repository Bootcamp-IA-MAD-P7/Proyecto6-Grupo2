import { useEffect, useId, useRef, useState } from "react"
import { CircleHelp } from "lucide-react"

interface ContextualHelpProps {
  label: string
  content: string
}

export function ContextualHelp({ label, content }: ContextualHelpProps) {
  const [open, setOpen] = useState(false)
  const descriptionId = useId()
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
        buttonRef.current?.focus()
      }
    }

    document.addEventListener("keydown", closeOnEscape)
    return () => document.removeEventListener("keydown", closeOnEscape)
  }, [open])

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        aria-describedby={open ? descriptionId : undefined}
        aria-expanded={open}
        className="grid size-5 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        onClick={() => setOpen((current) => !current)}
        onFocus={() => setOpen(true)}
      >
        <CircleHelp className="size-3.5" aria-hidden="true" />
      </button>
      {open && (
        <span
          id={descriptionId}
          role="tooltip"
          className="tooltip-enter absolute top-7 right-0 z-50 w-72 rounded-lg border border-border bg-card p-3 text-left text-xs leading-5 font-normal text-muted-foreground shadow-[0_12px_30px_rgba(17,17,17,0.1)]"
        >
          {content}
        </span>
      )}
    </span>
  )
}
