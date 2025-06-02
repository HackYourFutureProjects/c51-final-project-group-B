// this function converts a comma-separated string into an array of strings

export function arrayFromString(str) {
  return str
    ? str
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
}
