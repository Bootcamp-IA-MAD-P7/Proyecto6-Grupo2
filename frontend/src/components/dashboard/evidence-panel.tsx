import type {
  DashboardTranslations,
  EvidenceData,
  LanguageCode,
} from "@/types/dashboard"

interface EvidencePanelProps {
  data: EvidenceData
  language: LanguageCode
  translations: DashboardTranslations
}

export function EvidencePanel({
  data,
  language,
  translations,
}: EvidencePanelProps) {
  const numberFormatter = new Intl.NumberFormat(
    language === "en" ? "en-GB" : "es-ES",
    { minimumFractionDigits: 1, maximumFractionDigits: 1 },
  )

  return (
    <aside className="evidence-enter rounded-[1.125rem] border border-border bg-card p-6 shadow-[0_12px_35px_rgba(17,17,17,0.045)] sm:p-8">
      <h3 className="text-sm font-semibold text-foreground">
        {translations.insight.evidenceTitle}
      </h3>
      <div
        className="mt-8 flex h-48 items-end justify-between gap-4 border-b border-border px-1"
        role="img"
        aria-label={translations.insight.evidenceTitle}
      >
        {data.segments.map((segment, index) => (
          <div
            key={segment.id}
            className="flex h-full flex-1 flex-col items-center justify-end"
          >
            <span
              className={
                segment.highlighted
                  ? "evidence-value text-sm font-semibold text-primary"
                  : "evidence-value text-xs text-muted-foreground"
              }
              style={{ animationDelay: `${220 + index * 60}ms` }}
            >
              {numberFormatter.format(segment.value)}%
            </span>
            <div
              className={
                segment.highlighted
                  ? "evidence-bar mt-2 w-full max-w-12 origin-bottom rounded-t bg-primary"
                  : "evidence-bar mt-2 w-full max-w-12 origin-bottom rounded-t bg-[#D8D2CC]"
              }
              style={{
                height: `${(segment.value / 20) * 100}%`,
                animationDelay: `${80 + index * 60}ms`,
              }}
            />
            <span className="mt-3 whitespace-nowrap text-[0.6875rem] text-muted-foreground">
              {translations.segments.itemLabels[segment.id]}
            </span>
          </div>
        ))}
      </div>
      <dl className="mt-8 grid grid-cols-2 gap-5 border-t border-border pt-6">
        <div>
          <dd className="text-2xl font-semibold tracking-tight text-foreground">
            {numberFormatter.format(data.seniorRateMultiplier)}×
          </dd>
          <dt className="mt-1 text-xs leading-5 text-muted-foreground">
            {translations.insight.seniorRate}
          </dt>
        </div>
        <div>
          <dd className="text-2xl font-semibold tracking-tight text-foreground">
            +{numberFormatter.format(data.nextCohortDifference)} pp
          </dd>
          <dt className="mt-1 text-xs leading-5 text-muted-foreground">
            {translations.insight.nextCohort}
          </dt>
        </div>
      </dl>
    </aside>
  )
}
