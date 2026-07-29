import type {
  PredictionFieldError,
  PredictionFieldName,
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
  fields: Record<PredictionFieldName, PredictionFormFieldTranslations>
  validation: PredictionValidationMessages
  errorSummaryTitle: string
  submit: string
  submitting: string
}

export interface PredictionFormProps {
  initialValues?: Partial<PredictionFormValues>
  isSubmitting?: boolean
  onSubmit: (request: PredictionRequest) => void
  translations: PredictionFormTranslations
  options?: PredictionFormOptions
  backendFieldErrors?: readonly PredictionFieldError[]
}

