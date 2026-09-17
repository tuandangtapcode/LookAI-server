const SENSITIVE_KEY_PATTERN = /password|token|secret|otp|cvv|card(number)?|checksum|api[-_]?key|authorization/i

const REDACTED = '***REDACTED***'

export const scrubSensitiveData = (value: unknown, depth = 0): unknown => {
  if (depth > 5 || value === null || value === undefined) return value

  if (Array.isArray(value)) {
    return value.map((item) => scrubSensitiveData(item, depth + 1))
  }

  if (typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, val]) => [
        key,
        SENSITIVE_KEY_PATTERN.test(key) ? REDACTED : scrubSensitiveData(val, depth + 1)
      ])
    )
  }

  return value
}
