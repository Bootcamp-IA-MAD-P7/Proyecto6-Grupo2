import type {
  PredictionFieldError,
  PredictionFieldName,
  PredictionLabel,
  PredictionRequest,
} from "@/types/prediction"

export type PredictionFormValues = Record<PredictionFieldName, string>

export type PredictionFormErrors = Partial<
  Record<PredictionFieldName, string>
>

export type PredictionCategoricalFieldName = Exclude<
  PredictionFieldName,
  "YearsCodeNum" | "ConvertedCompYearly"
>

export interface PredictionFormOption {
  value: string
  label: string
}

export type PredictionFormOptions = Record<
  PredictionCategoricalFieldName,
  readonly PredictionFormOption[]
>

export interface PredictionValidationMessages {
  required: string
  invalidNumber: string
  minimum: (minimum: number) => string
  maximum: (maximum: number) => string
}

export interface PredictionFormFieldTranslations {
  label: string
  description?: string
  placeholder?: string
}

export interface PredictionFormTranslations {
  title: string
  description: string
  intro: {
    purpose: string
    estimatedTime: string
  }
  fields: Record<PredictionFieldName, PredictionFormFieldTranslations>
  validation: PredictionValidationMessages
  errorSummaryTitle: string
  submit: string
  submitting: string
  responsibleUse: {
    title: string
    items: readonly string[]
  }
  privacy: {
    title: string
    noIdentifiers: string
    assessmentUse: string
  }
}

export interface PredictionFormProps {
  initialValues?: Partial<PredictionFormValues>
  isSubmitting?: boolean
  onSubmit: (request: PredictionRequest) => void
  translations: PredictionFormTranslations
  options?: PredictionFormOptions
  backendFieldErrors?: readonly PredictionFieldError[]
}

export interface PredictionResultTranslations {
  eyebrow: string
  labels: Record<
    PredictionLabel,
    {
      badge: string
      title: string
      description: string
      recommendation: string
    }
  >
  summaryTitle: string
  recommendationTitle: string
  probabilityTitle: string
  probabilityDescription: string
  satisfiedProbability: string
  notSatisfiedProbability: string
  humanReviewTitle: string
  humanReviewDescription: string
  newAssessment: string
}

export interface PredictionErrorTranslations {
  title: string
  messages: {
    validation: string
    timeout: string
    network: string
    server: string
    generic: string
  }
  retry: string
}

export interface AssessmentTranslations {
  form: PredictionFormTranslations
  options: PredictionFormOptions
  loading: {
    title: string
    description: string
  }
  result: PredictionResultTranslations
  error: PredictionErrorTranslations
}

