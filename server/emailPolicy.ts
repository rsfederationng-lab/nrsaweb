export function isNrsaEmail(value: unknown): value is string {
  return typeof value === "string"
    && /^[^\s@]+@nrsa\.com\.ng$/i.test(value.trim());
}
