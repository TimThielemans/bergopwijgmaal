/** Dutch (nl-BE) formatting helpers. */

const TZ = "Europe/Brussels";

const DAY = new Intl.DateTimeFormat("nl-BE", { weekday: "short", timeZone: TZ });
const DATE_SHORT = new Intl.DateTimeFormat("nl-BE", { day: "numeric", month: "short", timeZone: TZ });
const DATE_LONG = new Intl.DateTimeFormat("nl-BE", { day: "numeric", month: "long", year: "numeric", timeZone: TZ });
const TIME = new Intl.DateTimeFormat("nl-BE", { hour: "2-digit", minute: "2-digit", timeZone: TZ });

function toDate(value: string): Date {
  return new Date(value);
}

export function formatWeekday(value: string): string {
  return DAY.format(toDate(value)).replace(".", "");
}

export function formatDateShort(value: string): string {
  return DATE_SHORT.format(toDate(value));
}

export function formatDateLong(value: string): string {
  return DATE_LONG.format(toDate(value));
}

export function formatTime(value: string): string {
  return TIME.format(toDate(value));
}

/** Compact Dutch clock notation, e.g. "20u" or "20u30". */
export function formatTimeCompact(value: string): string {
  const [h, m] = formatTime(value).split(":");
  const hour = String(Number(h));
  return m && m !== "00" ? `${hour}u${m}` : `${hour}u`;
}

export function formatDateRange(start: string, end?: string): string {
  if (!end) return formatDateLong(start);
  const a = toDate(start);
  const b = toDate(end);
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
export function formatPosition(position: number): string {
  return ORDINALS[position] ?? `${position}de`;
}

export function formatRelativeUpdate(iso: string | null): string | null {
  if (!iso) return null;
  return `Laatst bijgewerkt op ${formatDateLong(iso)}`;
}
