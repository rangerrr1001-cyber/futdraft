/**
 * Get current UTC date (year-month-day) for spin tracking
 */
export function getUTCDate(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

/**
 * Get UTC midnight of the next day for countdown
 */
export function getNextUTCMidnight(): Date {
  const now = new Date();
  const tomorrow = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
    0, 0, 0, 0
  ));
  return tomorrow;
}

/**
 * Generate a unique room ID for WebSocket matches
 */
export function generateRoomId(): string {
  return `match_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if a date string is before today (UTC)
 */
export function isBeforeToday(dateString: string | null): boolean {
  if (!dateString) return true;
  const today = getUTCDate();
  return dateString < today;
}

/**
 * Random integer between min and max (inclusive)
 */
export function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Random element from array
 */
export function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Shuffle array (Fisher-Yates algorithm)
 */
export function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
