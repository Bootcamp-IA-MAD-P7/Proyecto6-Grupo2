import { AlertCircle, Inbox } from "lucide-react"

import { PrimaryCTA } from "@/components/ui/cta"
import type { DashboardState, DashboardTranslations } from "@/types/dashboard"

interface DashboardStateViewProps {
  state: Exclude<DashboardState, "success">
  translations: DashboardTranslations
  onRetry?: () => void
}

export function DashboardStateView({
  state,
  translations,
  onRetry,
}: DashboardStateViewProps) {
  if (state === "loading") {
    return (
      <main
        className="min-h-screen bg-background px-6 py-16"
        aria-busy="true"
        aria-live="polite"
      >
        <div className="mx-auto max-w-5xl">
          <div className="h-3 w-52 animate-pulse rounded bg-muted" />
          <div className="mt-10 h-16 w-3/4 animate-pulse rounded bg-muted" />
          <div className="mt-5 h-6 w-1/2 animate-pulse rounded bg-muted" />
          <p className="mt-10 text-sm font-medium text-foreground">
            {translations.states.loading}
          </p>
          <p className="mt-2 text-sm text-muted-foreground">
            {translations.states.loadingDescription}
          </p>
          <div className="mt-20 grid gap-6 md:grid-cols-3">
            {[0, 1, 2].map((item) => (
              <div
                key={item}
                className="h-32 animate-pulse rounded-xl bg-muted"
              />
            ))}
          </div>
        </div>
      </main>
    )
  }

  const error = state === "error"

  return (
    <main className="grid min-h-screen place-items-center bg-background px-6 py-16">
      <div className="max-w-lg text-center" role={error ? "alert" : "status"}>
        {error ? (
          <AlertCircle
            className="mx-auto size-8 text-primary"
            aria-hidden="true"
          />
        ) : (
          <Inbox
            className="mx-auto size-8 text-muted-foreground"
            aria-hidden="true"
          />
        )}
        <h1 className="font-editorial mt-6 text-4xl text-foreground">
          {error ? translations.states.error : translations.states.empty}
        </h1>
        <p className="mt-4 text-sm leading-7 text-muted-foreground">
          {error
            ? translations.states.errorDescription
            : translations.states.emptyDescription}
        </p>
        {error && onRetry && (
          <PrimaryCTA className="mt-7" onClick={onRetry}>
            {translations.common.retry}
          </PrimaryCTA>
        )}
      </div>
    </main>
  )
}
