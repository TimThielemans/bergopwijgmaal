import { cn } from "@/lib/utils";

export function HomeAwayBadge({ isHome, className }: { isHome: boolean; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-eyebrow",
        isHome ? "bg-club/15 text-club-deep" : "bg-secondary text-muted-foreground",
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn("h-1.5 w-1.5 rounded-full", isHome ? "bg-club" : "bg-muted-foreground")}
      />
      {isHome ? "Thuis" : "Uit"}
    </span>
  );
}
