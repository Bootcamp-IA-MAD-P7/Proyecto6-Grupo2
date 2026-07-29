import type {
  NormalizedPredictionError,
  PredictionFieldError,
  PredictionFieldName,
  PredictionRequest,
  PredictionResponse,
  PredictionResult,
  PredictionServiceErrorCode,
  PredictionServiceOptions,
} from "@/types/prediction"

const FALLBACK_API_URL = "https://talentcare-back.onrender.com"
const PREDICTION_PATH = "/api/v1/predict"
const REQUEST_TIMEOUT_MS = 90_000

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

export async function predictProfile(
  request: PredictionRequest,
  options: PredictionServiceOptions = {},
): Promise<PredictionResult> {
  const controller = new AbortController()
  let timedOut = false

  const abortFromExternalSignal = () => {
    controller.abort(options.signal?.reason)
  }

  if (options.signal?.aborted) {
    abortFromExternalSignal()
  } else {
    options.signal?.addEventListener("abort", abortFromExternalSignal, {
      once: true,
    })
  }

  const timeoutId = window.setTimeout(() => {
    timedOut = true
    controller.abort()
  }, REQUEST_TIMEOUT_MS)

  try {
    const response = await fetch(buildPredictionUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(request),
      signal: controller.signal,
    })

    const body = await readJson(response)

    if (!response.ok) {
      throw createHttpError(response.status, body)
    }

    const predictionResponse = parsePredictionResponse(body)
    return normalizePredictionResult(predictionResponse)
  } catch (error: unknown) {
    if (error instanceof PredictionServiceError) {
      throw error
    }

    if (timedOut) {
      throw createServiceError(
        "timeout",
        "Prediction request exceeded the 90000ms timeout",
      )
    }

    if (options.signal?.aborted) {
      throw createServiceError(
        "aborted",
        "Prediction request was aborted by the caller",
      )
    }

    throw createServiceError(
      "network",
      "Prediction request failed before receiving an HTTP response",
    )
  } finally {
    window.clearTimeout(timeoutId)
    options.signal?.removeEventListener("abort", abortFromExternalSignal)
  }
}

function buildPredictionUrl(): string {
  const configuredUrl = import.meta.env.VITE_API_URL?.trim()
  const baseUrl = configuredUrl || FALLBACK_API_URL
  return `${baseUrl.replace(/\/+$/, "")}${PREDICTION_PATH}`
}

async function readJson(response: Response): Promise<unknown> {
  try {
    return (await response.json()) as unknown
  } catch {
    if (response.ok) {
      throw createServiceError(
        "invalid_response",
        "Prediction API returned a non-JSON success response",
        response.status,
      )
    }

    return null
  }
}

function parsePredictionResponse(value: unknown): PredictionResponse {
  if (!isRecord(value)) {
    throw invalidResponse("Prediction response must be an object")
  }

  const prediction = value.prediction
  const label = value.label
  const probabilityNotSatisfied = value.probability_not_satisfied
  const probabilitySatisfied = value.probability_satisfied

  if (prediction !== 0 && prediction !== 1) {
    throw invalidResponse("Prediction must be either 0 or 1")
  }

  if (label !== "satisfied" && label !== "not_satisfied") {
    throw invalidResponse("Prediction label is not supported")
  }

  if (
    !isProbability(probabilityNotSatisfied) ||
    !isProbability(probabilitySatisfied)
  ) {
    throw invalidResponse(
      "Prediction probabilities must be finite numbers between 0 and 1",
    )
  }

  if (
    (prediction === 0 && label !== "not_satisfied") ||
    (prediction === 1 && label !== "satisfied")
  ) {
    throw invalidResponse("Prediction and label are inconsistent")
  }

  return {
    prediction,
    label,
    probability_not_satisfied: probabilityNotSatisfied,
    probability_satisfied: probabilitySatisfied,
  }
}

function normalizePredictionResult(
  response: PredictionResponse,
): PredictionResult {
  return {
    prediction: response.prediction,
    label: response.label,
    probabilities: {
      notSatisfied: response.probability_not_satisfied,
      satisfied: response.probability_satisfied,
    },
  }
}

function createHttpError(status: number, body: unknown): PredictionServiceError {
  if (status === 400) {
    return createServiceError(
      "bad_request",
      "Prediction API rejected the request",
      status,
    )
  }

  if (status === 422) {
    return createServiceError(
      "validation",
      "Prediction API validation failed",
      status,
      parseValidationErrors(body),
    )
  }

  if (status === 500) {
    return createServiceError(
      "server",
      "Prediction API returned an internal server error",
      status,
    )
  }

  return createServiceError(
    "http_error",
    `Prediction API returned HTTP ${status}`,
    status,
  )
}

function parseValidationErrors(body: unknown): PredictionFieldError[] {
  if (!isRecord(body) || !Array.isArray(body.detail)) {
    return []
  }

  return body.detail.flatMap((issue: unknown) => {
    if (!isRecord(issue) || !Array.isArray(issue.loc)) {
      return []
    }

    const field = [...issue.loc]
      .reverse()
      .find(
        (location): location is PredictionFieldName =>
          typeof location === "string" &&
          PREDICTION_FIELDS.has(location as PredictionFieldName),
      )

    if (!field) {
      return []
    }

    return [
      {
        field,
        message:
          typeof issue.msg === "string"
            ? issue.msg
            : "Backend validation failed",
        type: typeof issue.type === "string" ? issue.type : undefined,
      },
    ]
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
  return new PredictionServiceError({
    code,
    message,
    status,
    fieldErrors,
  })
}

function isProbability(value: unknown): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= 0 &&
    value <= 1
  )
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}
