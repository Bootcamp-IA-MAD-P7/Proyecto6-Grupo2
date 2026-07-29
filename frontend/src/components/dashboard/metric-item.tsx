import { useEffect, useState } from "react"

import { ContextualHelp } from "@/components/ui/contextual-help"
import { useReducedMotion } from "@/hooks/use-reduced-motion"
import { cn } from "@/lib/utils"
import type {
  DashboardTranslations,
  LanguageCode,
  WorkforceMetric,
} from "@/types/dashboard"

interface MetricItemProps {
  metric: WorkforceMetric
  language: LanguageCode
  translations: DashboardTranslations
  index: number
}

export function MetricItem({
  metric,
  language,
  translations,
  index,
}: MetricItemProps) {
  const reducedMotion = useReducedMotion()
  const [displayValue, setDisplayValue] = useState(
    reducedMotion ? metric.value : 0,
  )

  useEffect(() => {
    if (reducedMotion) {
      setDisplayValue(metric.value)
      return
    }

    const duration = 500
    const start = performance.now()
    let frame = 0

    const animate = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      setDisplayValue(metric.value * progress)
      if (progress < 1) frame = requestAnimationFrame(animate)
    }

    frame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frame)
  }, [metric.value, reducedMotion])

  const formatter = new Intl.NumberFormat(language === "en" ? "en-GB" : "es-ES", {
    maximumFractionDigits: metric.format === "percentage" ? 1 : 0,
    minimumFractionDigits: metric.format === "percentage" ? 1 : 0,
  })
  const help = translations.outlook.metricHelp[metric.id]

  return (
    <article
      className="metric-enter border-t border-border pt-6 lg:border-t-0 lg:border-l lg:pl-7 lg:first:border-l-0 lg:first:pl-0"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <p
        className={cn(
          "text-4xl font-semibold tracking-[-0.045em] text-foreground",
          metric.highlighted && "text-primary",
        )}
      >
        {formatter.format(displayValue)}
        {metric.format === "percentage" && "%"}
      </p>
      <div className="mt-3 flex items-center gap-1.5">
        <h3 className="text-sm leading-5 text-muted-foreground">
          {translations.outlook.metricLabels[metric.id]}
        </h3>
        {help && (
          <ContextualHelp
            label={translations.outlook.metricLabels[metric.id]}
            content={help}
          />
        )}
      </div>
    </article>
  )
}
