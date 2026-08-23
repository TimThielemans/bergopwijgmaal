/**
 * Date normalisation for raw VolleyScores rows.
 *
 * The exports use `19/09/2026` + `16:30` in local Belgian time. The site renders
 * everything in `Europe/Brussels`, so the adapter writes an ISO string with the
 * correct (DST aware) offset instead of guessing UTC.
 */

/** Last Sunday of a month, 0-based month, as a UTC timestamp at the given hour. */
function lastSundayUtc(year: number, month: number, hourUtc: number): number {
  const date = new Date(Date.UTC(year, month + 1, 0, hourUtc, 0, 0));
  date.setUTCDate(date.getUTCDate() - date.getUTCDay());
  return date.getTime();
}

/** +02:00 during CEST, +01:00 during CET. */
export function brusselsOffsetMinutes(year: number, month: number, day: number, hour: number, minute: number): number {
  const guessUtc = Date.UTC(year, month - 1, day, hour - 1, minute);
  const dstStart = lastSundayUtc(year, 2, 1); // last Sunday March 01:00 UTC
  const dstEnd = lastSundayUtc(year, 9, 1); // last Sunday October 01:00 UTC
  return guessUtc >= dstStart && guessUtc < dstEnd ? 120 : 60;
}

function pad(value: number): string {
  return String(value).padStart(2, "0");
}

/**
 * `19/09/2026` + `16:30` -> `2026-09-19T16:30:00+02:00`.
 * Returns "" when the input cannot be trusted.
 */
export function toIsoDateTime(dateRaw: string, timeRaw: string): string {
  const dateMatch = /^(\d{1,2})[/-](\d{1,2})[/-](\d{2,4})$/.exec(String(dateRaw ?? "").trim());
  if (!dateMatch) return "";
  const day = Number(dateMatch[1]);
  const month = Number(dateMatch[2]);
  let year = Number(dateMatch[3]);
  if (year < 100) year += 2000;
  if (!day || !month || month > 12 || day > 31) return "";

  const timeMatch = /^(\d{1,2})[:.h](\d{2})/.exec(String(timeRaw ?? "").trim());
  const hour = timeMatch ? Number(timeMatch[1]) : 20;
  const minute = timeMatch ? Number(timeMatch[2]) : 0;
  if (hour > 23 || minute > 59) return "";

  const offset = brusselsOffsetMinutes(year, month, day, hour, minute);
  const sign = offset >= 0 ? "+" : "-";
  const absolute = Math.abs(offset);

  const iso = `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}:00${sign}${pad(
    Math.floor(absolute / 60),
  )}:${pad(absolute % 60)}`;

  return Number.isNaN(new Date(iso).getTime()) ? "" : iso;
}
