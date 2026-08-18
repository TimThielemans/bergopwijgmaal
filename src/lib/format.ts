/** Dutch (nl-BE) formatting helpers. Never throw on missing or invalid input. */

const TZ = "Europe/Brussels";
const DASH = "—";

const DAY = new Intl.DateTimeFormat("nl-BE", { weekday: "short", timeZone: TZ });
const DATE_SHORT = new Intl.DateTimeFormat("nl-BE", { day: "numeric", month: "short", timeZone: TZ });
const DATE_LONG = new Intl.DateTimeFormat("nl-BE", { day: "numeric", month: "long", year: "numeric", timeZone: TZ });
const TIME = new Intl.DateTimeFormat("nl-BE", { hour: "2-digit", minute: "2-digit", timeZone: TZ });

/** Parsed date, or null when the value is missing/unparsable. */
function toDate(value: string | null | undefined): Date | null {
  if (typeof value !== "string" || value.trim().length === 0) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function safeFormat(formatter: Intl.DateTimeFormat, value: string | null | undefined): string {
  const date = toDate(value);
  if (!date) return DASH;
  try {
    return formatter.format(date);
  } catch {
    return DASH;
  }
}

export function isValidDateTime(value: string | null | undefined): boolean {
  return toDate(value) !== null;
}

export function formatWeekday(value: string | null | undefined): string {
  return safeFormat(DAY, value).replace(".", "");
}

export function formatDateShort(value: string | null | undefined): string {
  return safeFormat(DATE_SHORT, value);
}

export function formatDateLong(value: string | null | undefined): string {
  return safeFormat(DATE_LONG, value);
}

export function formatTime(value: string | null | undefined): string {
  return safeFormat(TIME, value);
}

/** Compact Dutch clock notation, e.g. "20u" or "20u30". */
export function formatTimeCompact(value: string | null | undefined): string {
  const formatted = formatTime(value);
  if (formatted === DASH) return DASH;
  const [h, m] = formatted.split(":");
  const hour = String(Number(h));
  return m && m !== "00" ? `${hour}u${m}` : `${hour}u`;
}

export function formatDateRange(start: string | null | undefined, end?: string | null): string {
  const a = toDate(start);
  const b = toDate(end);
  if (!a) return DASH;
  if (!b) return formatDateLong(start);
  if (a.getMonth() === b.getMonth()) {
    return `${a.getDate()}-${b.getDate()} ${new Intl.DateTimeFormat("nl-BE", { month: "long", year: "numeric", timeZone: TZ }).format(b)}`;
  }
  return `${formatDateShort(start)} – ${formatDateLong(end)}`;
}

const ORDINALS: Record<number, string> = {
  1: "1ste",
  2: "2de",
  3: "3de",
  4: "4de",
  8: "8ste",
};

/** Dutch ordinal for a ranking position, e.g. 2 -> "2de". */
export function formatPosition(position: number | null | undefined): string {
  if (typeof position !== "number" || !Number.isFinite(position) || position <= 0) return DASH;
  return ORDINALS[position] ?? `${position}de`;
}

export function formatRelativeUpdate(iso: string | null | undefined): string | null {
  if (!toDate(iso)) return null;
  return `Laatst bijgewerkt op ${formatDateLong(iso)}`;
}
