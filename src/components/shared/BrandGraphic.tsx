import { cn } from "@/lib/utils";

/**
 * Abstract brand graphic built from the club logo's language: sweeping stroke,
 * the blue dot, generous space. Pure SVG so it never depends on photography.
 */
export function BrandGraphic({
  className,
  variant = "stroke",
}: {
  className?: string;
  variant?: "stroke" | "grid" | "dots";
}) {
  return (
    <svg
      viewBox="0 0 600 600"
      aria-hidden="true"
      className={cn("pointer-events-none select-none", className)}
    >
      {variant === "stroke" && (
        <>
          <path
            d="M40 300c60-150 130-40 165 60 30 86 60 96 95-20 30-100 90-190 150-230"
            fill="none"
            stroke="currentColor"
            strokeWidth="46"
            strokeLinecap="round"
            opacity="0.14"
          />
          <path
            d="M90 430c50-120 110-30 140 45 26 66 52 74 82-14 26-78 76-146 128-176"
            fill="none"
            stroke="currentColor"
            strokeWidth="14"
            strokeLinecap="round"
            opacity="0.22"
          />
          <circle cx="500" cy="96" r="46" fill="currentColor" opacity="0.35" />
        </>
      )}
      {variant === "grid" && (
        <>
          {Array.from({ length: 9 }).map((_, index) => (
            <line
              key={`v-${index}`}
              x1={index * 75}
              y1="0"
              x2={index * 75}
              y2="600"
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.12"
            />
          ))}
          {Array.from({ length: 9 }).map((_, index) => (
            <line
              key={`h-${index}`}
              x1="0"
              y1={index * 75}
              x2="600"
              y2={index * 75}
              stroke="currentColor"
              strokeWidth="1"
              opacity="0.12"
            />
          ))}
          <circle cx="450" cy="150" r="60" fill="currentColor" opacity="0.14" />
        </>
      )}
      {variant === "dots" && (
        <>
          {Array.from({ length: 8 }).map((_, row) =>
            Array.from({ length: 8 }).map((__, col) => (
              <circle
                key={`${row}-${col}`}
                cx={40 + col * 74}
                cy={40 + row * 74}
                r={3 + ((row + col) % 4)}
                fill="currentColor"
                opacity="0.18"
              />
            )),
          )}
        </>
      )}
    </svg>
  );
}

/** Branded tile used wherever a photo is missing — layouts stay strong without imagery. */
export function BrandTile({
  label,
  caption,
  className,
}: {
  label: string;
  caption?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative isolate flex items-end overflow-hidden bg-navy text-ink-foreground",
        className,
      )}
    >
      <BrandGraphic
        variant="stroke"
        className="absolute -right-16 -top-10 h-[130%] w-auto text-club"
      />
      <div className="relative z-10 p-5 sm:p-6">
        <span className="font-display text-4xl font-bold leading-none text-club sm:text-5xl">
          {label}
        </span>
        {caption ? (
          <span className="mt-2 block text-sm text-ink-foreground/70">{caption}</span>
        ) : null}
      </div>
    </div>
  );
}
