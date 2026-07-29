import { forwardRef } from "react"
import { CheckCircle2, ShieldCheck } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import type { PredictionResult } from "@/types/prediction"
import type { PredictionResultTranslations } from "@/types/prediction-form"

interface PredictionResultProps {
  result: PredictionResult
  translations: PredictionResultTranslations
  onNewAssessment: () => void
}

function formatProbability(value: number): string {
  return new Intl.NumberFormat(undefined, {
    style: "percent",
    maximumFractionDigits: 1,
  }).format(value)
}

export const PredictionResultView = forwardRef<
  HTMLDivElement,
  PredictionResultProps
>(({ result, translations, onNewAssessment }, ref) => {
  const content = translations.labels[result.label]
  const favourable = result.label === "satisfied"

  return (
    <div ref={ref} tabIndex={-1} className="outline-none">
      <Card className="mx-auto w-full max-w-5xl shadow-sm">
        <CardHeader className="border-b border-border">
          <div className="flex flex-wrap items-center gap-3">
            <p className="text-xs font-semibold tracking-[0.14em] text-primary uppercase">
              {translations.eyebrow}
            </p>
            <Badge variant={favourable ? "success" : "warning"}>
              {content.badge}
            </Badge>
          </div>
          <h1 className="font-editorial mt-4 max-w-3xl text-3xl tracking-[-0.025em] text-foreground sm:text-4xl">
            {content.title}
          </h1>
          <div className="mt-5 max-w-3xl">
            <h2 className="text-sm font-semibold text-foreground">
              {translations.summaryTitle}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
              {content.description}
            </p>
          </div>
        </CardHeader>

        <CardContent className="pt-6">
          <section
            className="rounded-lg border border-border bg-secondary/60 p-5"
            aria-labelledby="assessment-recommendation"
          >
            <h2
              id="assessment-recommendation"
              className="text-sm font-semibold text-foreground"
            >
              {translations.recommendationTitle}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {content.recommendation}
            </p>
          </section>

          <section aria-labelledby="assessment-probabilities">
            <div className="mt-7 flex items-center gap-2">
              <CheckCircle2
                className="size-5 text-primary"
                aria-hidden="true"
              />
              <h2
                id="assessment-probabilities"
                className="text-sm font-semibold text-foreground"
              >
                {translations.probabilityTitle}
              </h2>
            </div>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted-foreground">
              {translations.probabilityDescription}
            </p>
            <dl className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-border bg-muted/40 p-4">
                <dt className="text-sm text-muted-foreground">
                  {translations.satisfiedProbability}
                </dt>
                <dd className="mt-2 text-2xl font-semibold text-foreground">
                  {formatProbability(result.probabilities.satisfied)}
                </dd>
              </div>
              <div className="rounded-lg border border-border bg-muted/40 p-4">
                <dt className="text-sm text-muted-foreground">
                  {translations.notSatisfiedProbability}
                </dt>
                <dd className="mt-2 text-2xl font-semibold text-foreground">
                  {formatProbability(result.probabilities.notSatisfied)}
                </dd>
              </div>
            </dl>
          </section>

          <section
            className="mt-6 rounded-lg border border-border bg-secondary/60 p-5"
            aria-labelledby="human-review-title"
          >
            <div className="flex items-start gap-3">
              <ShieldCheck
                className="mt-0.5 size-5 shrink-0 text-primary"
                aria-hidden="true"
              />
              <div>
                <h2
                  id="human-review-title"
                  className="text-sm font-semibold text-foreground"
                >
                  {translations.humanReviewTitle}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {translations.humanReviewDescription}
                </p>
              </div>
            </div>
          </section>

          <div className="mt-8 flex justify-end border-t border-border pt-6">
            <Button onClick={onNewAssessment}>
              {translations.newAssessment}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
})

PredictionResultView.displayName = "PredictionResultView"
