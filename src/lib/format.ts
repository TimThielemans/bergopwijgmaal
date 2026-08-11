/** Dutch (nl-BE) formatting helpers. */

const DAY = new Intl.DateTimeFormat("nl-BE", { weekday: "short" });
const DATE_SHORT = new Intl.DateTimeFormat("nl-BE", { day: "numeric", month: "short" });
const DATE_LONG = new Intl.DateTimeFormat("nl-BE", { day: "numeric", month: "long", year: "numeric" });
const TIME = new Intl.DateTimeFormat("nl-BE", { hour: "2-digit", minute: "2-digit" });

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

export function formatDateRange(start: string, end?: string): string {
  if (!end) return formatDateLong(start);
  const a = toDate(start);
  const b = toDate(end);
  if (a.getMonth() === b.getMonth()) {
    return `${a.getDate()}-${b.getDate()} ${new Intl.DateTimeFormat("nl-BE", { month: "long", year: "numeric" }).format(b)}`;
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
