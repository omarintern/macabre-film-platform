/**
 * Native utility function to combine class names (architecture compliant)
 * Pure implementation without external dependencies
 */
export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs
    .filter(Boolean)
    .join(' ')
    .trim();
}

