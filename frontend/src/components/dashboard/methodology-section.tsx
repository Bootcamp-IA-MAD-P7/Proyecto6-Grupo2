import { useState } from "react"
import { ChevronDown, ShieldCheck } from "lucide-react"

import { SectionHeading } from "@/components/dashboard/section-heading"
import { cn } from "@/lib/utils"
import type {
  DashboardTranslations,
  MethodologyItem,
} from "@/types/dashboard"

interface MethodologySectionProps {
  items: MethodologyItem[]
  translations: DashboardTranslations
}

export function MethodologySection({
  items,
  translations,
}: MethodologySectionProps) {
  const [openId, setOpenId] = useState<MethodologyItem["id"] | null>(
    "prediction",
  )

  return (
    <section id="methodology" aria-labelledby="methodology-heading">
      <SectionHeading
        id="methodology-heading"
        content={translations.methodology}
      />
      <div className="mt-12 border-y border-border">
        {items.map((item) => {
          const open = openId === item.id
          const copy = translations.methodology.items[item.id]
          const panelId = `methodology-${item.id}`
          return (
            <div key={item.id} className="border-b border-border last:border-0">
              <button
                type="button"
                className="flex w-full items-center justify-between gap-5 py-5 text-left"
                aria-expanded={open}
                aria-controls={panelId}
                onClick={() => setOpenId(open ? null : item.id)}
              >
                <span className="text-sm font-semibold text-foreground">
                  {copy.title}
                </span>
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 text-muted-foreground transition-transform",
                    open && "rotate-180",
                  )}
                  aria-hidden="true"
                />
              </button>
              <div
                id={panelId}
                className={cn(
                  "accordion-grid grid transition-[grid-template-rows] duration-200",
                  open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                )}
              >
                <div className="overflow-hidden">
                  <p className="max-w-3xl pb-6 text-sm leading-7 text-muted-foreground">
                    {copy.body}
                  </p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <aside className="mt-10 flex items-start gap-4 rounded-xl border border-border bg-card p-6">
        <ShieldCheck
          className="mt-0.5 size-5 shrink-0 text-primary"
          aria-hidden="true"
        />
        <div>
          <h3 className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
            {translations.methodology.responsibleLabel}
          </h3>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-foreground">
            {translations.methodology.responsibleText}
          </p>
        </div>
      </aside>
    </section>
  )
}
