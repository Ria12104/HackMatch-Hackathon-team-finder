/**
 * Returns `path` only if it is a safe, same-origin relative path.
 *
 * Guards against open-redirect via the `next` query param. A naive
 * `path.startsWith("/")` check is NOT enough: protocol-relative URLs like
 * `//evil.com` and backslash variants like `/\evil.com` also start with "/"
 * but resolve to an external origin (e.g. `new URL("//evil.com", origin)`
 * → `http://evil.com/`). Anything else falls back to `fallback`.
 */
export function safeRelativePath(
  path: string | null | undefined,
  fallback = "/"
): string {
  if (!path) return fallback;
  if (!path.startsWith("/")) return fallback;
  // Reject protocol-relative ("//host") and backslash-tricked ("/\host") paths.
  if (path.startsWith("//") || path.startsWith("/\\")) return fallback;
  return path;
}
