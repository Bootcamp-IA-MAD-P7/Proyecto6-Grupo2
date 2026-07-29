import { SectionHeading } from "@/components/dashboard/section-heading"
import type {
  AssociatedFactor,
  DashboardTranslations,
} from "@/types/dashboard"

interface AssociatedFactorsSectionProps {
  factors: AssociatedFactor[]
  translations: DashboardTranslations
}

export function AssociatedFactorsSection({
  factors,
  translations,
}: AssociatedFactorsSectionProps) {
  return (
    <section
      id="associated-factors"
      aria-labelledby="associated-factors-heading"
    >
      <SectionHeading
        id="associated-factors-heading"
        content={translations.factors}
        help={{
          label: translations.factors.helpLabel,
          content: translations.factors.help,
        }}
      />
      <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1.4fr)_minmax(280px,0.8fr)]">
        <ul className="space-y-5">
          {factors.map((factor, index) => (
            <li key={factor.id}>
              <div className="mb-2 flex items-center justify-between gap-4">
                <span className="text-sm text-foreground">
                  {translations.factors.labels[factor.id]}
                </span>
                <span className="text-sm font-medium text-foreground">
                  {factor.value}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="factor-bar h-full rounded-full bg-primary"
                  style={{
                    width: `${(factor.value / 30) * 100}%`,
                    animationDelay: `${index * 45}ms`,
                  }}
                />
              </div>
            </li>
          ))}
        </ul>
        <p className="border-l border-border pl-6 text-sm leading-7 text-muted-foreground">
          {translations.factors.interpretation}
        </p>
      </div>
    </section>
  )
}
