import { MetricItem } from "@/components/dashboard/metric-item"
import { SectionHeading } from "@/components/dashboard/section-heading"
import type {
  DashboardTranslations,
  LanguageCode,
  WorkforceMetric,
} from "@/types/dashboard"

interface WorkforceOutlookSectionProps {
  metrics: WorkforceMetric[]
  language: LanguageCode
  translations: DashboardTranslations
}

export function WorkforceOutlookSection({
  metrics,
  language,
  translations,
}: WorkforceOutlookSectionProps) {
  return (
    <section aria-labelledby="workforce-outlook-heading">
      <SectionHeading
        id="workforce-outlook-heading"
        content={translations.outlook}
      />
      <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
        {metrics.map((metric, index) => (
          <MetricItem
            key={metric.id}
            metric={metric}
            language={language}
            translations={translations}
            index={index}
          />
        ))}
      </div>
    </section>
  )
}
