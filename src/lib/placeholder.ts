/**
 * Content the client has not confirmed is written as "[ … ]" in content/*.json.
 * `npm run content:check` lists every one; with CONTENT_STRICT=1 it fails the build,
 * so no placeholder can ship (HANDOVER.md §6).
 */
export const PLACEHOLDER = /\[[^\]]*\]/

export const isPlaceholder = (value: string | null | undefined) =>
  typeof value === 'string' && PLACEHOLDER.test(value)
