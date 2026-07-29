import { EvidencePanel } from "@/components/dashboard/evidence-panel"
import { SectionHeading } from "@/components/dashboard/section-heading"
import { PrimaryCTA } from "@/components/ui/cta"
import type {
  DashboardTranslations,
  ExecutiveInsight,
  LanguageCode,
} from "@/types/dashboard"

interface ExecutiveInsightSectionProps {
  insight: ExecutiveInsight
  language: LanguageCode
  translations: DashboardTranslations
  onExplore: () => void
}

export function ExecutiveInsightSection({
  insight,
  language,
  translations,
  onExplore,
}: ExecutiveInsightSectionProps) {
  return (
    <section aria-labelledby="executive-insight-heading">
      <SectionHeading
        id="executive-insight-heading"
        content={translations.insight}
        help={{
          label: translations.outlook.metricLabels.lowerSatisfaction,
          content: translations.insight.help,
        }}
      />
      <div className="mt-12 grid items-start gap-12 xl:grid-cols-[minmax(0,1.25fr)_380px]">
        <div className="insight-enter relative py-3 pl-7 sm:pl-10">
          <p className="font-editorial text-3xl leading-[1.25] text-foreground sm:text-4xl">
            {translations.insight.statement}
          </p>
          <p className="mt-7 max-w-2xl text-sm leading-7 text-muted-foreground">
            {translations.insight.note}
          </p>
          <PrimaryCTA className="mt-8" onClick={onExplore}>
            {translations.insight.explore}
          </PrimaryCTA>
        </div>
        <EvidencePanel
          data={insight.evidence}
          language={language}
          translations={translations}
        />
      </div>
    </section>
  )
}
