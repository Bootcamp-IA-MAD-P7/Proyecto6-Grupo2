import { SectionHeading } from "@/components/dashboard/section-heading"
import { cn } from "@/lib/utils"
import type {
  DashboardTranslations,
  LanguageCode,
  SegmentData,
  SegmentDimension,
} from "@/types/dashboard"

interface SegmentExplorationSectionProps {
  dimensions: SegmentData[]
  language: LanguageCode
  activeDimension: SegmentDimension
  onDimensionChange: (dimension: SegmentDimension) => void
  translations: DashboardTranslations
}

const integratedDimensions: SegmentDimension[] = [
  "experience",
  "education",
  "employment",
  "companySize",
]

export function SegmentExplorationSection({
  dimensions,
  language,
  activeDimension,
  onDimensionChange,
  translations,
}: SegmentExplorationSectionProps) {
  const numberFormatter = new Intl.NumberFormat(
    language === "en" ? "en-GB" : "es-ES",
    { minimumFractionDigits: 1, maximumFractionDigits: 1 },
  )
  const activeData =
    dimensions.find((item) => item.dimension === activeDimension) ??
    dimensions[0]

  return (
    <section
      id="segment-exploration"
      aria-labelledby="segment-exploration-heading"
    >
      <SectionHeading
        id="segment-exploration-heading"
        content={translations.segments}
        help={{
          label: translations.segments.selectorLabel,
          content: translations.segments.help,
        }}
      />

      <div
        className="mt-10 flex flex-wrap gap-2"
        role="group"
        aria-label={translations.segments.selectorLabel}
      >
        {dimensions.map((dimension) => {
          const enabled = integratedDimensions.includes(dimension.dimension)
          const active = activeDimension === dimension.dimension
          return (
            <button
              key={dimension.dimension}
              type="button"
              disabled={!enabled}
              aria-pressed={active}
              title={!enabled ? translations.common.comingSoon : undefined}
              className={cn(
                "rounded-full border px-4 py-2 text-sm transition-colors",
                active
                  ? "border-foreground bg-foreground text-background"
                  : enabled
                    ? "border-border bg-card text-foreground hover:bg-muted"
                    : "cursor-not-allowed border-border/60 text-muted-foreground/55",
              )}
              onClick={() => onDimensionChange(dimension.dimension)}
            >
              {translations.segments.dimensionLabels[dimension.dimension]}
              {!enabled && (
                <span className="ml-2 text-[0.625rem] uppercase">
                  {translations.common.comingSoon}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-12 border-y border-border py-10">
        <h3 className="text-sm font-semibold text-foreground">
          {translations.segments.contextTitles[activeDimension]}
        </h3>
        {activeData.status === "available" ? (
          <div className="segment-chart-enter mt-9">
            <div
              className="space-y-6"
              role="img"
              aria-label={translations.segments.contextTitles[activeDimension]}
            >
              {activeData.items.map((item) => {
                const highlighted =
                  item.id === activeData.highlightedSegmentId
                return (
                  <div
                    key={`${activeDimension}-${item.id}`}
                    className="grid gap-2 sm:grid-cols-[150px_minmax(0,1fr)_64px] sm:items-center"
                  >
                    <span className="text-sm text-foreground">
                      {translations.segments.itemLabels[item.id] ?? item.id}
                    </span>
                    <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                      <div
                        className={cn(
                          "segment-bar h-full rounded-full",
                          highlighted ? "bg-primary" : "bg-[#CFC8C1]",
                        )}
                        style={{ width: `${(item.value / 20) * 100}%` }}
                      />
                    </div>
                    <span
                      className={cn(
                        "text-sm font-semibold sm:text-right",
                        highlighted ? "text-primary" : "text-foreground",
                      )}
                    >
                      {numberFormatter.format(item.value)}%
                    </span>
                  </div>
                )
              })}
            </div>
            <p className="mt-10 max-w-3xl border-l-2 border-primary pl-5 text-sm leading-7 text-muted-foreground">
              {translations.segments.experienceInterpretation}
            </p>
          </div>
        ) : (
          <div className="mt-8 max-w-2xl rounded-xl bg-muted/65 p-6">
            <h4 className="text-sm font-semibold text-foreground">
              {translations.segments.pendingTitle}
            </h4>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {translations.segments.pendingDescription}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
