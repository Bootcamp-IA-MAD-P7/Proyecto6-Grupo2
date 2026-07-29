import { forwardRef } from "react"
import { AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import type { NormalizedPredictionError } from "@/types/prediction"
import type { PredictionErrorTranslations } from "@/types/prediction-form"

interface PredictionErrorProps {
  error: NormalizedPredictionError
  translations: PredictionErrorTranslations
  onRetry: () => void
}

function getErrorMessage(
  error: NormalizedPredictionError,
  translations: PredictionErrorTranslations,
): string {
  if (error.code === "validation" || error.code === "bad_request") {
    return translations.messages.validation
  }

  if (error.code === "timeout") {
    return translations.messages.timeout
  }

  if (error.code === "network") {
    return translations.messages.network
  }

  if (error.code === "server" || error.code === "http_error") {
    return translations.messages.server
  }

  return translations.messages.generic
}

export const PredictionErrorView = forwardRef<
  HTMLDivElement,
  PredictionErrorProps
>(({ error, translations, onRetry }, ref) => (
  <div
    ref={ref}
    role="alert"
    tabIndex={-1}
    className="mx-auto mb-6 flex w-full max-w-5xl flex-col gap-5 rounded-xl border border-destructive/30 bg-card p-5 outline-none focus-visible:ring-2 focus-visible:ring-ring sm:flex-row sm:items-center sm:justify-between sm:p-6"
  >
    <div className="flex items-start gap-3">
      <AlertCircle
        className="mt-0.5 size-5 shrink-0 text-primary"
        aria-hidden="true"
      />
      <div>
        <p className="text-sm font-semibold text-foreground">
          {translations.title}
        </p>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
          {getErrorMessage(error, translations)}
        </p>
      </div>
    </div>
    <Button variant="outline" onClick={onRetry} className="shrink-0">
      {translations.retry}
    </Button>
  </div>
))

PredictionErrorView.displayName = "PredictionErrorView"
