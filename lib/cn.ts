// Tiny class-name joiner. Falsy values are dropped so conditionals read naturally.
export function cn(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}
