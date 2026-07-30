import { useApiClient } from "./api-client"
import type {
  NormalizedPredictionError,
  PredictionFieldError,
  PredictionFieldName,
  PredictionRequest,
  PredictionResponse,
  PredictionResult,
  PredictionServiceErrorCode,
} from "@/types/prediction"

const PREDICTION_FIELDS: ReadonlySet<PredictionFieldName> = new Set([
  "YearsCodeNum",
  "ConvertedCompYearly",
  "MainBranch",
  "Employment",
  "EdLevel",
  "Age",
  "OrgSize",
  "Country",
])

export class PredictionServiceError extends Error {
  readonly details: NormalizedPredictionError

  constructor(details: NormalizedPredictionError) {
    super(details.message)
    this.name = "PredictionServiceError"
    this.details = details
  }
}

export function usePredictionService() {
  const { apiFetch } = useApiClient()

  async function predictProfile(request: PredictionRequest): Promise<PredictionResult> {
    try {
      const body = await apiFetch("/api/v1/predict", {
        method: "POST",
        body: JSON.stringify(request),
      })
      const predictionResponse = parsePredictionResponse(body)
      return normalizePredictionResult(predictionResponse)
    } catch (error: unknown) {
      if (error instanceof PredictionServiceError) throw error
      if (error instanceof Error && error.message.includes("401")) {
        throw createServiceError("network", "Authentication required")
      }
      throw createServiceError("network", "Prediction request failed before receiving an HTTP response")
    }
  }

  return { predictProfile }
}

function parsePredictionResponse(value: unknown): PredictionResponse {
  if (!isRecord(value)) throw invalidResponse("Prediction response must be an object")

  const { prediction, label, probability_not_satisfied, probability_satisfied } = value

  if (prediction !== 0 && prediction !== 1) throw invalidResponse("Prediction must be either 0 or 1")
  if (label !== "satisfied" && label !== "not_satisfied") throw invalidResponse("Prediction label is not supported")
  if (!isProbability(probability_not_satisfied) || !isProbability(probability_satisfied)) {
    throw invalidResponse("Prediction probabilities must be finite numbers between 0 and 1")
  }

  return {
    prediction: prediction as 0 | 1,
    label: label as "satisfied" | "not_satisfied",
    probability_not_satisfied: probability_not_satisfied as number,
    probability_satisfied: probability_satisfied as number,
  }
}

function normalizePredictionResult(response: PredictionResponse): PredictionResult {
  return {
    prediction: response.prediction,
    label: response.label,
    probabilities: {
      notSatisfied: response.probability_not_satisfied,
      satisfied: response.probability_satisfied,
    },
  }
}

function parseValidationErrors(body: unknown): PredictionFieldError[] {
  if (!isRecord(body) || !Array.isArray(body.detail)) return []
  return body.detail.flatMap((issue: unknown) => {
    if (!isRecord(issue) || !Array.isArray(issue.loc)) return []
    const field = [...issue.loc].reverse().find(
      (loc): loc is PredictionFieldName =>
        typeof loc === "string" && PREDICTION_FIELDS.has(loc as PredictionFieldName),
    )
    if (!field) return []
    return [{ field, message: typeof issue.msg === "string" ? issue.msg : "Backend validation failed", type: typeof issue.type === "string" ? issue.type : undefined }]
  })
}

function invalidResponse(message: string): PredictionServiceError {
  return createServiceError("invalid_response", message)
}

function createServiceError(
  code: PredictionServiceErrorCode,
  message: string,
  status?: number,
  fieldErrors: PredictionFieldError[] = [],
): PredictionServiceError {
  return new PredictionServiceError({ code, message, status, fieldErrors })
}

function isProbability(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 1
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}
