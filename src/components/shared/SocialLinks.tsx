import { Facebook, Globe, Instagram, Mail, Phone } from "lucide-react";
import type { SocialLink } from "@/content/types";
import { list, safeUrl, text } from "@/lib/safe";
import { cn } from "@/lib/utils";

const ICONS = {
  facebook: Facebook,
  instagram: Instagram,
  email: Mail,
  phone: Phone,
} as const;

type Platform = keyof typeof ICONS;

function iconFor(platform: string | null | undefined) {
  const key = text(platform).toLowerCase() as Platform;
  return ICONS[key] ?? Globe;
}

export function SocialLinks({
  socials,
  variant = "icon",
  className,
}: {
  socials?: SocialLink[] | null;
  variant?: "icon" | "list";
  className?: string;
}) {
  const items = list(socials)
    .map((social, index) => ({
      key: text(social?.platform, `social-${index}`),
      url: safeUrl(social?.url),
      label: text(social?.label, text(social?.platform, "Link")),
      Icon: iconFor(social?.platform),
    }))
    .filter((item) => item.url !== null);

  if (items.length === 0) return null;

  if (variant === "list") {
    return (
      <ul className={cn("space-y-2", className)}>
        {items.map(({ key, url, label, Icon }) => (
          <li key={key}>
            <a
              href={url!}
              {...(url!.startsWith("http") ? { target: "_blank" } : {})}
              rel="noreferrer noopener"
              className="inline-flex min-h-11 items-center gap-3 text-sm transition-colors hover:text-club-deep"
            >
              <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-club-deep" />
              <span className="min-w-0 truncate">{label}</span>
            </a>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {items.map(({ key, url, label, Icon }) => (
        <a
          key={key}
          href={url!}
          aria-label={label}
          {...(url!.startsWith("http") ? { target: "_blank" } : {})}
          rel="noreferrer noopener"
          className="grid h-11 w-11 place-items-center rounded-full border border-border transition-colors hover:border-club hover:bg-club/10"
        >
          <Icon aria-hidden="true" className="h-4 w-4" />
        </a>
      ))}
    </div>
  );
}
