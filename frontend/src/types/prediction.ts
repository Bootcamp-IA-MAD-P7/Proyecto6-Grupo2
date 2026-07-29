export interface PredictionRequest {
  YearsCodeNum: number
  ConvertedCompYearly: number
  MainBranch: string
  Employment: string
  EdLevel: string
  Age: string
  OrgSize: string
  Country: string
}

export type PredictionLabel = "satisfied" | "not_satisfied"

export interface PredictionResponse {
  prediction: 0 | 1
  label: PredictionLabel
  probability_not_satisfied: number
  probability_satisfied: number
}

export interface PredictionResult {
  prediction: 0 | 1
  label: PredictionLabel
  probabilities: {
    notSatisfied: number
    satisfied: number
  }
}

export type PredictionFieldName = keyof PredictionRequest

export type PredictionServiceErrorCode =
  | "timeout"
  | "aborted"
  | "network"
  | "bad_request"
  | "validation"
  | "server"
  | "http_error"
  | "invalid_response"

export interface PredictionFieldError {
  field: PredictionFieldName
  message: string
  type?: string
}

export interface NormalizedPredictionError {
  code: PredictionServiceErrorCode
  message: string
  status?: number
  fieldErrors: PredictionFieldError[]
}

export interface PredictionServiceOptions {
  signal?: AbortSignal
}
