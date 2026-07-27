// Wraps a Gemini API call with retry-with-backoff for failures
// (rate limits, temporary overload) so a single busy moment doesn't surface
// a raw stack trace to the user.

const MAX_ATTEMPTS = 3
const BASE_DELAY_MS = 1000

function isRetryableError(error: unknown): boolean {
  const message = error instanceof Error ? error.message : String(error)
  return (
    message.includes("429") ||
    message.includes("Too Many Requests") ||
    message.includes("quota") ||
    message.includes("503") ||
    message.includes("overloaded")
  )
}

// If the API returned a suggested retry delay (e.g. "Please retry in 31.5s"),
// use it. Otherwise fall back to exponential backoff.
function getRetryDelayMs(error: unknown, attempt: number): number {
  const message = error instanceof Error ? error.message : String(error)
  const match = message.match(/retry in (\d+(?:\.\d+)?)s/i)
  if (match) {
    return Math.ceil(parseFloat(match[1]) * 1000)
  }
  return BASE_DELAY_MS * 2 ** attempt
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export async function generateContentWithRetry<T>(call: () => Promise<T>): Promise<T> {
  let lastError: unknown

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    try {
      return await call()
    } catch (error) {
      lastError = error

      if (!isRetryableError(error) || attempt === MAX_ATTEMPTS - 1) {
        throw error
      }

      const delay = getRetryDelayMs(error, attempt)
      console.warn(`Gemini call failed (attempt ${attempt + 1}/${MAX_ATTEMPTS}), retrying in ${delay}ms`)
      await sleep(delay)
    }
  }

  throw lastError
}

// Maps a raw Gemini error into a short, user-facing message instead of
// exposing quota internals or a raw provider stack trace.
export function friendlyGeminiErrorMessage(error: unknown): { message: string; status: number } {
  if (isRetryableError(error)) {
    return {
      message: "The AI service is busy right now. Please wait a few seconds and try again.",
      status: 429,
    }
  }
  return {
    message: "Something went wrong while processing your syllabus with AI. Please try again.",
    status: 500,
  }
}