import { useEffect, useRef, useState } from "react"

import { AppShell } from "@/components/layout/app-shell"
import { PredictionErrorView } from "@/components/prediction/prediction-error"
import { PredictionForm } from "@/components/prediction/prediction-form"
import { PredictionResultView } from "@/components/prediction/prediction-result"
import { dashboardMock } from "@/data/dashboard"
import { translations } from "@/i18n"
import {
  PredictionServiceError,
  usePredictionService,
} from "@/services/prediction-service"
import type {
  NormalizedPredictionError,
  PredictionRequest,
  PredictionResult,
} from "@/types/prediction"
import type { LanguageCode } from "@/types/dashboard"

const LANGUAGE_STORAGE_KEY = "talentcare-language"

type AssessmentState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; result: PredictionResult }
  | { status: "error"; error: NormalizedPredictionError }

function getInitialLanguage(): LanguageCode {
  return window.localStorage.getItem(LANGUAGE_STORAGE_KEY) === "es"
    ? "es"
    : "en"
}

function normalizeUnexpectedError(error: unknown): NormalizedPredictionError {
  if (error instanceof PredictionServiceError) {
    return error.details
  }

  return {
    code: "invalid_response",
    message: "Unexpected prediction workflow error",
    fieldErrors: [],
  }
}

export function AssessmentPage() {
  const [language, setLanguage] =
    useState<LanguageCode>(getInitialLanguage)
  const [state, setState] = useState<AssessmentState>({ status: "idle" })
  const { predictProfile } = usePredictionService()
  const requestInFlightRef = useRef(false)
  const lastRequestRef = useRef<PredictionRequest | null>(null)
  const requestControllerRef = useRef<AbortController | null>(null)
  const resultRef = useRef<HTMLDivElement>(null)
  const errorRef = useRef<HTMLDivElement>(null)
  const copy = translations[language]

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  useEffect(
    () => () => {
      requestControllerRef.current?.abort()
    },
    [],
  )

  useEffect(() => {
    if (state.status === "success") {
      resultRef.current?.focus()
    }

    if (state.status === "error") {
      errorRef.current?.focus()
    }
  }, [state])

  const changeLanguage = (nextLanguage: LanguageCode) => {
    setLanguage(nextLanguage)
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage)
  }

  const runAssessment = async (request: PredictionRequest): Promise<void> => {
    if (requestInFlightRef.current) {
      return
    }

    requestInFlightRef.current = true
    lastRequestRef.current = request
    requestControllerRef.current = new AbortController()
    setState({ status: "loading" })

    try {
      const result = await predictProfile(request, {
        signal: requestControllerRef.current.signal,
      })
      setState({ status: "success", result })
    } catch (error: unknown) {
      setState({ status: "error", error: normalizeUnexpectedError(error) })
    } finally {
      requestInFlightRef.current = false
      requestControllerRef.current = null
    }
  }

  const retryAssessment = () => {
    requestInFlightRef.current = false
    if (lastRequestRef.current) {
      void runAssessment(lastRequestRef.current)
    }
  }

  const startNewAssessment = () => {
    lastRequestRef.current = null
    setState({ status: "idle" })
  }

  if (state.status === "success") {
    return (
      <AppShell
        language={language}
        onLanguageChange={changeLanguage}
        profile={dashboardMock.profile}
        translations={copy}
      >
        <main
          id="assessment"
          className="px-5 py-10 sm:px-8 lg:px-12 xl:px-16"
        >
          <div className="mx-auto max-w-[1180px]">
            <PredictionResultView
              ref={resultRef}
              result={state.result}
              translations={copy.assessment.result}
              onNewAssessment={startNewAssessment}
            />
          </div>
        </main>
      </AppShell>
    )
  }

  const serviceError = state.status === "error" ? state.error : undefined

  return (
    <AppShell
      language={language}
      onLanguageChange={changeLanguage}
      profile={dashboardMock.profile}
      translations={copy}
    >
      <main
        id="assessment"
        className="px-5 py-10 sm:px-8 lg:px-12 xl:px-16"
      >
        <div className="mx-auto max-w-[1180px]">
          <div className="min-h-20">
            {state.status === "loading" && (
              <div
                role="status"
                aria-live="polite"
                className="mx-auto mb-6 flex w-full max-w-5xl items-start gap-3 rounded-lg border border-border bg-secondary/60 px-5 py-4"
              >
                <span
                  className="mt-1 size-2.5 shrink-0 animate-pulse rounded-full bg-primary"
                  aria-hidden="true"
                />
                <span>
                  <span className="block text-sm font-semibold text-foreground">
                    {copy.assessment.loading.title}
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-muted-foreground">
                    {copy.assessment.loading.description}
                  </span>
                </span>
              </div>
            )}

            {serviceError && (
              <PredictionErrorView
                ref={errorRef}
                error={serviceError}
                translations={copy.assessment.error}
                onRetry={retryAssessment}
              />
            )}
          </div>

          <PredictionForm
            isSubmitting={state.status === "loading"}
            onSubmit={(request) => void runAssessment(request)}
            translations={copy.assessment.form}
            options={copy.assessment.options}
            backendFieldErrors={serviceError?.fieldErrors}
          />
        </div>
      </main>
    </AppShell>
  )
}
