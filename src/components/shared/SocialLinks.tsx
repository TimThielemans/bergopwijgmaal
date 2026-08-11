import { Facebook, Instagram, Mail, Phone } from "lucide-react";
import type { SocialLink } from "@/content/types";
import { cn } from "@/lib/utils";

const ICONS = {
  facebook: Facebook,
  instagram: Instagram,
  email: Mail,
  phone: Phone,
} as const;

export function SocialLinks({
  socials,
  variant = "icon",
  className,
}: {
  socials: SocialLink[];
  variant?: "icon" | "list";
  className?: string;
}) {
  if (variant === "list") {
    return (
      <ul className={cn("space-y-2", className)}>
        {socials.map((social) => {
          const Icon = ICONS[social.platform];
          return (
            <li key={social.platform}>
              <a
                href={social.url}
                target={social.url.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer noopener"
                className="inline-flex min-h-11 items-center gap-3 text-sm transition-colors hover:text-club-deep"
              >
                <Icon aria-hidden="true" className="h-4 w-4 shrink-0 text-club-deep" />
                <span className="min-w-0 truncate">{social.label}</span>
              </a>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {socials.map((social) => {
        const Icon = ICONS[social.platform];
        return (
          <a
            key={social.platform}
            href={social.url}
            aria-label={social.label}
            target={social.url.startsWith("http") ? "_blank" : undefined}
            rel="noreferrer noopener"
            className="grid h-11 w-11 place-items-center rounded-full border border-border transition-colors hover:border-club hover:bg-club/10"
          >
            <Icon aria-hidden="true" className="h-4 w-4" />
          </a>
        );
      })}
    </div>
  );
}
