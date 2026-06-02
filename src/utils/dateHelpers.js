import {
  differenceInDays,
  addDays,
  parseISO,
  isValid,
  format,
  formatDistanceToNow,
  isToday,
  isYesterday,
} from 'date-fns';

/**
 * Parse a date string (ISO) or Date object safely.
 * Returns null if invalid.
 */
export function safeParseDate(dateStr) {
  if (!dateStr) return null;
  if (dateStr instanceof Date) return isValid(dateStr) ? dateStr : null;
  const parsed = parseISO(dateStr);
  return isValid(parsed) ? parsed : null;
}

/**
 * Calculate how many days until the next watering/fertilizing.
 * Negative = overdue, 0 = due today, positive = days remaining
 */
export function daysUntilDue(lastDate, frequencyDays) {
  if (!lastDate || !frequencyDays) return null;
  const last = safeParseDate(lastDate);
  if (!last) return null;
  const nextDue = addDays(last, frequencyDays);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  nextDue.setHours(0, 0, 0, 0);
  return differenceInDays(nextDue, today);
}

/**
 * Format a date for display in care history.
 */
export function formatCareDate(dateStr) {
  const date = safeParseDate(dateStr);
  if (!date) return 'Unknown';
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMM d, yyyy');
}

/**
 * Format a date for display with time.
 */
export function formatCareDateWithTime(dateStr) {
  const date = safeParseDate(dateStr);
  if (!date) return 'Unknown';
  if (isToday(date)) return `Today at ${format(date, 'h:mm a')}`;
  if (isYesterday(date)) return `Yesterday at ${format(date, 'h:mm a')}`;
  return format(date, 'MMM d, yyyy · h:mm a');
}

/**
 * Relative time string like "3 days ago"
 */
export function relativeTime(dateStr) {
  const date = safeParseDate(dateStr);
  if (!date) return 'Never';
  return formatDistanceToNow(date, { addSuffix: true });
}

/**
 * Short label like "3d ago" or "in 2d"
 */
export function shortRelativeTime(days) {
  if (days === null || days === undefined) return '—';
  if (days === 0) return 'Today';
  if (days < 0) return `${Math.abs(days)}d overdue`;
  if (days === 1) return 'Tomorrow';
  return `in ${days}d`;
}

/**
 * Format ISO date to display date (e.g., "Jun 2, 2026")
 */
export function formatDate(dateStr) {
  const date = safeParseDate(dateStr);
  if (!date) return '—';
  return format(date, 'MMM d, yyyy');
}

/**
 * Today as ISO date string (YYYY-MM-DD)
 */
export function todayISO() {
  return format(new Date(), 'yyyy-MM-dd');
}

/**
 * Now as ISO datetime string
 */
export function nowISO() {
  return new Date().toISOString();
}

/**
 * Sort care events newest first
 */
export function sortEventsByDate(events) {
  return [...events].sort((a, b) => {
    const da = safeParseDate(a.date);
    const db = safeParseDate(b.date);
    if (!da && !db) return 0;
    if (!da) return 1;
    if (!db) return -1;
    return db - da;
  });
}
