import type { PredictionRequest } from "@/types/prediction"
import type {
  PredictionFormErrors,
  PredictionFormValues,
  PredictionValidationMessages,
} from "@/types/prediction-form"

const YEARS_CODE_MINIMUM = 0
const YEARS_CODE_MAXIMUM = 80
const COMPENSATION_MINIMUM = 0
const COMPENSATION_MAXIMUM = 10_000_000

export const DEFAULT_PREDICTION_FORM_VALUES: PredictionFormValues = {
  YearsCodeNum: "",
  ConvertedCompYearly: "",
  MainBranch: "",
  Employment: "",
  EdLevel: "",
  Age: "",
  OrgSize: "",
  Country: "",
}

function validateNumber(
  value: string,
  minimum: number,
  maximum: number,
  messages: PredictionValidationMessages,
): string | undefined {
  const normalizedValue = value.trim()

  if (!normalizedValue) {
    return messages.required
  }

  const parsedValue = Number(normalizedValue)

  if (!Number.isFinite(parsedValue)) {
    return messages.invalidNumber
  }

  if (parsedValue < minimum) {
    return messages.minimum(minimum)
  }

  if (parsedValue > maximum) {
    return messages.maximum(maximum)
  }

  return undefined
}

function validateRequiredCategory(
  value: string,
  messages: PredictionValidationMessages,
): string | undefined {
  return value.trim() ? undefined : messages.required
}

export function validatePredictionFormValues(
  values: PredictionFormValues,
  messages: PredictionValidationMessages,
): PredictionFormErrors {
  const errors: PredictionFormErrors = {}

  const yearsCodeError = validateNumber(
    values.YearsCodeNum,
    YEARS_CODE_MINIMUM,
    YEARS_CODE_MAXIMUM,
    messages,
  )
  const compensationError = validateNumber(
    values.ConvertedCompYearly,
    COMPENSATION_MINIMUM,
    COMPENSATION_MAXIMUM,
    messages,
  )

  if (yearsCodeError) {
    errors.YearsCodeNum = yearsCodeError
  }

  if (compensationError) {
    errors.ConvertedCompYearly = compensationError
  }

  const categoricalErrors = {
    MainBranch: validateRequiredCategory(values.MainBranch, messages),
    Employment: validateRequiredCategory(values.Employment, messages),
    EdLevel: validateRequiredCategory(values.EdLevel, messages),
    Age: validateRequiredCategory(values.Age, messages),
    OrgSize: validateRequiredCategory(values.OrgSize, messages),
    Country: validateRequiredCategory(values.Country, messages),
  }

  for (const [field, error] of Object.entries(categoricalErrors)) {
    if (error) {
      errors[field as keyof typeof categoricalErrors] = error
    }
  }

  return errors
}

export function isPredictionFormValid(
  values: PredictionFormValues,
  messages: PredictionValidationMessages,
): boolean {
  return Object.keys(validatePredictionFormValues(values, messages)).length === 0
}

export function toPredictionRequest(
  values: PredictionFormValues,
): PredictionRequest {
  return {
    YearsCodeNum: Number(values.YearsCodeNum.trim()),
    ConvertedCompYearly: Number(values.ConvertedCompYearly.trim()),
    MainBranch: values.MainBranch.trim(),
    Employment: values.Employment.trim(),
    EdLevel: values.EdLevel.trim(),
    Age: values.Age.trim(),
    OrgSize: values.OrgSize.trim(),
    Country: values.Country.trim(),
  }
}

