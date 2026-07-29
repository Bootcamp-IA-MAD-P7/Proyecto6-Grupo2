import { useState } from "react"

import { SectionHeading } from "@/components/dashboard/section-heading"
import { SecondaryCTA } from "@/components/ui/cta"
import type {
  DashboardTranslations,
  RecommendedAction,
} from "@/types/dashboard"

interface RecommendedActionsSectionProps {
  actions: RecommendedAction[]
  translations: DashboardTranslations
  onExplore: () => void
  onReviewContext: () => void
}

export function RecommendedActionsSection({
  actions,
  translations,
  onExplore,
  onReviewContext,
}: RecommendedActionsSectionProps) {
  const [showComingNext, setShowComingNext] = useState(false)

  const handleAction = (id: RecommendedAction["id"]) => {
    if (id === "earlyCareer") onExplore()
    if (id === "internalContext") onReviewContext()
    if (id === "listening") setShowComingNext(true)
  }

  return (
    <section aria-labelledby="recommended-actions-heading">
      <SectionHeading
        id="recommended-actions-heading"
        content={translations.actions}
      />
      <ol className="mt-12 border-y border-border">
        {actions.map((action, index) => {
          const copy = translations.actions.items[action.id]
          return (
            <li
              key={action.id}
              className="grid gap-5 border-b border-border py-7 last:border-b-0 md:grid-cols-[52px_130px_minmax(0,1fr)_auto] md:items-center"
            >
              <span className="text-sm font-semibold text-primary">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span className="text-xs font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                {translations.actions.priorityLabels[action.priority]}
              </span>
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  {copy.title}
                </h3>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  {copy.description}
                </p>
              </div>
              <SecondaryCTA onClick={() => handleAction(action.id)}>
                {copy.cta}
              </SecondaryCTA>
            </li>
          )
        })}
      </ol>
      {showComingNext && (
        <p
          className="mt-4 rounded-lg bg-muted px-4 py-3 text-sm text-muted-foreground"
          role="status"
        >
          {translations.actions.comingNext}
        </p>
      )}
    </section>
  )
}
