/**
 * Utility function to conditionally join classNames
 * Similar to clsx but simplified for our needs
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}