import {
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react"
import { Clock3, LockKeyhole, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  DEFAULT_PREDICTION_FORM_VALUES,
  toPredictionRequest,
  validatePredictionFormValues,
} from "@/lib/prediction-validation"
import type { PredictionFieldName } from "@/types/prediction"
import type {
  PredictionCategoricalFieldName,
  PredictionFormErrors,
  PredictionFormOptions,
  PredictionFormProps,
  PredictionFormValues,
} from "@/types/prediction-form"

const FIELD_ORDER: readonly PredictionFieldName[] = [
  "YearsCodeNum",
  "ConvertedCompYearly",
  "MainBranch",
  "Employment",
  "EdLevel",
  "Age",
  "OrgSize",
  "Country",
]

const CATEGORICAL_FIELDS: readonly PredictionCategoricalFieldName[] = [
  "MainBranch",
  "Employment",
  "EdLevel",
  "Age",
  "OrgSize",
  "Country",
]

/**
 * Temporary confirmed subset of backend-compatible values.
 * Replace or extend this data when the complete catalog is available;
 * validation and rendering do not depend on the number of options.
 */
export const TEMPORARY_PREDICTION_OPTIONS: PredictionFormOptions = {
  MainBranch: [
    {
      value: "I am a developer by profession",
      label: "I am a developer by profession",
    },
  ],
  Employment: [
    {
      value: "Employed, full-time",
      label: "Employed, full-time",
    },
  ],
  EdLevel: [
    {
      value: "Bachelor's degree",
      label: "Bachelor's degree",
    },
  ],
  Age: [
    {
      value: "25-34 years old",
      label: "25-34 years old",
    },
  ],
  OrgSize: [
    {
      value: "100 to 499 employees",
      label: "100 to 499 employees",
    },
  ],
  Country: [{ value: "Spain", label: "Spain" }],
}

function createInitialValues(
  initialValues?: Partial<PredictionFormValues>,
): PredictionFormValues {
  return {
    ...DEFAULT_PREDICTION_FORM_VALUES,
    ...initialValues,
  }
}

function mapBackendErrors(
  backendFieldErrors: PredictionFormProps["backendFieldErrors"],
): PredictionFormErrors {
  if (!backendFieldErrors) {
    return {}
  }

  return backendFieldErrors.reduce<PredictionFormErrors>(
    (errors, fieldError) => {
      if (!errors[fieldError.field]) {
        errors[fieldError.field] = fieldError.message
      }
      return errors
    },
    {},
  )
}

export function PredictionForm({
  initialValues,
  isSubmitting = false,
  onSubmit,
  translations,
  options = TEMPORARY_PREDICTION_OPTIONS,
  backendFieldErrors,
}: PredictionFormProps) {
  const formId = useId()
  const errorSummaryRef = useRef<HTMLDivElement>(null)
  const [values, setValues] = useState<PredictionFormValues>(() =>
    createInitialValues(initialValues),
  )
  const [validationErrors, setValidationErrors] =
    useState<PredictionFormErrors>({})
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const backendErrors = mapBackendErrors(backendFieldErrors)
  const displayedErrors: PredictionFormErrors = {
    ...backendErrors,
    ...validationErrors,
  }
  const errorsInOrder = FIELD_ORDER.flatMap((field) => {
    const message = displayedErrors[field]
    return message ? [{ field, message }] : []
  })

  const updateField = (field: PredictionFieldName, value: string) => {
    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }))

    setValidationErrors((currentErrors) => {
      if (!currentErrors[field]) {
        return currentErrors
      }

      const nextErrors = { ...currentErrors }
      delete nextErrors[field]
      return nextErrors
    })
  }

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    updateField(event.currentTarget.name as PredictionFieldName, event.currentTarget.value)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (isSubmitting) {
      return
    }

    const nextErrors = validatePredictionFormValues(
      values,
      translations.validation,
    )

    setHasSubmitted(true)
    setValidationErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      window.requestAnimationFrame(() => errorSummaryRef.current?.focus())
      return
    }

    onSubmit(toPredictionRequest(values))
  }

  const describedBy = (
    field: PredictionFieldName,
    hasDescription: boolean,
  ): string | undefined => {
    const ids = [
      hasDescription ? `${formId}-${field}-description` : undefined,
      displayedErrors[field] ? `${formId}-${field}-error` : undefined,
    ].filter((id): id is string => Boolean(id))

    return ids.length > 0 ? ids.join(" ") : undefined
  }

  return (
    <Card className="mx-auto w-full max-w-5xl shadow-sm">
      <CardHeader className="border-b border-border">
        <h1 className="font-editorial text-3xl tracking-[-0.025em] text-foreground sm:text-4xl">
          {translations.title}
        </h1>
        <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground sm:text-base">
          {translations.description}
        </p>
        <div className="mt-5 flex max-w-3xl flex-col gap-3 rounded-lg bg-muted/70 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
          <p className="text-sm leading-6 text-foreground">
            {translations.intro.purpose}
          </p>
          <p className="flex shrink-0 items-center gap-2 text-xs font-medium text-muted-foreground">
            <Clock3 className="size-4 text-primary" aria-hidden="true" />
            {translations.intro.estimatedTime}
          </p>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <form noValidate onSubmit={handleSubmit} aria-busy={isSubmitting}>
          {hasSubmitted && errorsInOrder.length > 0 && (
            <div
              ref={errorSummaryRef}
              role="alert"
              tabIndex={-1}
              className="mb-6 rounded-lg border border-destructive/30 bg-destructive/5 p-4 outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <p className="text-sm font-semibold text-foreground">
                {translations.errorSummaryTitle}
              </p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-muted-foreground">
                {errorsInOrder.map(({ field, message }) => (
                  <li key={field}>
                    <a
                      href={`#${formId}-${field}`}
                      className="underline decoration-border underline-offset-4 hover:text-foreground"
                    >
                      {translations.fields[field].label}: {message}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="grid gap-x-6 gap-y-5 md:grid-cols-2">
            {(["YearsCodeNum", "ConvertedCompYearly"] as const).map(
              (field) => {
                const copy = translations.fields[field]
                const error = displayedErrors[field]
                const isYearsField = field === "YearsCodeNum"

                return (
                  <div key={field}>
                    <label
                      htmlFor={`${formId}-${field}`}
                      className="text-sm font-medium text-foreground"
                    >
                      {copy.label}
                    </label>
                    {copy.description && (
                      <p
                        id={`${formId}-${field}-description`}
                        className="mt-1 text-xs leading-5 text-muted-foreground"
                      >
                        {copy.description}
                      </p>
                    )}
                    <input
                      id={`${formId}-${field}`}
                      name={field}
                      type="number"
                      min={0}
                      max={isYearsField ? 80 : 10_000_000}
                      step={isYearsField ? 1 : 0.01}
                      inputMode="decimal"
                      placeholder={copy.placeholder}
                      value={values[field]}
                      onChange={handleInputChange}
                      aria-invalid={Boolean(error)}
                      aria-describedby={describedBy(
                        field,
                        Boolean(copy.description),
                      )}
                      className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:bg-primary/5 focus:ring-2 focus:ring-ring/20"
                    />
                    {error && (
                      <p
                        id={`${formId}-${field}-error`}
                        className="mt-2 text-sm text-destructive"
                      >
                        {error}
                      </p>
                    )}
                  </div>
                )
              },
            )}

            {CATEGORICAL_FIELDS.map((field) => {
              const copy = translations.fields[field]
              const error = displayedErrors[field]

              return (
                <div key={field}>
                  <label
                    htmlFor={`${formId}-${field}`}
                    className="text-sm font-medium text-foreground"
                  >
                    {copy.label}
                  </label>
                  {copy.description && (
                    <p
                      id={`${formId}-${field}-description`}
                      className="mt-1 text-xs leading-5 text-muted-foreground"
                    >
                      {copy.description}
                    </p>
                  )}
                  <select
                    id={`${formId}-${field}`}
                    name={field}
                    value={values[field]}
                    onChange={handleInputChange}
                    aria-invalid={Boolean(error)}
                    aria-describedby={describedBy(
                      field,
                      Boolean(copy.description),
                    )}
                    className="mt-2 h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground outline-none transition-colors focus:border-primary focus:bg-primary/5 focus:ring-2 focus:ring-ring/20"
                  >
                    <option value="">{copy.placeholder}</option>
                    {options[field].map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {error && (
                    <p
                      id={`${formId}-${field}-error`}
                      className="mt-2 text-sm text-destructive"
                    >
                      {error}
                    </p>
                  )}
                </div>
              )
            })}
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-2">
            <section
              className="rounded-lg border border-primary/20 bg-primary/5 p-5"
              aria-labelledby={`${formId}-responsible-use`}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck
                  className="size-4.5 text-primary"
                  aria-hidden="true"
                />
                <h2
                  id={`${formId}-responsible-use`}
                  className="text-sm font-semibold text-foreground"
                >
                  {translations.responsibleUse.title}
                </h2>
              </div>
              <ul className="mt-3 space-y-2 text-xs leading-5 text-muted-foreground">
                {translations.responsibleUse.items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="text-primary" aria-hidden="true">
                      •
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </section>

            <section
              className="rounded-lg border border-primary/20 bg-primary/5 p-5"
              aria-labelledby={`${formId}-privacy`}
            >
              <div className="flex items-center gap-2">
                <LockKeyhole
                  className="size-4.5 text-primary"
                  aria-hidden="true"
                />
                <h2
                  id={`${formId}-privacy`}
                  className="text-sm font-semibold text-foreground"
                >
                  {translations.privacy.title}
                </h2>
              </div>
              <p className="mt-3 text-xs leading-5 text-muted-foreground">
                {translations.privacy.noIdentifiers}
              </p>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                {translations.privacy.assessmentUse}
              </p>
            </section>
          </div>

          <div className="mt-8 flex justify-end border-t border-border pt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-40 shadow-sm shadow-primary/20"
            >
              {isSubmitting ? translations.submitting : translations.submit}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
