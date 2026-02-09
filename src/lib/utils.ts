import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

/**
 * Merge Tailwind CSS classes safely using clsx and tailwind-merge.
 * Deduplicates and resolves conflicting Tailwind classes.
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

/**
 * Format a date as "MMM dd, yyyy" (e.g., "Jan 30, 2024").
 */
export function formatDate(date: Date | string | number): string {
  const d = date instanceof Date ? date : new Date(date);
  return format(d, "MMM dd, yyyy");
}

/**
 * Convert text to a URL-friendly slug.
 * Lowercase, replace spaces and special chars with hyphens, remove leading/trailing hyphens.
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s\W_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Truncate text with ellipsis if longer than maxLength.
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "…";
}

/**
 * Estimate reading time for content (200 words per minute).
 */
export function estimateReadingTime(content: string): string {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);

  if (minutes === 1) return "1 min read";
  return `${minutes} min read`;
}
