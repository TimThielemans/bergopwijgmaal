import { CLUB_INFO, VENUES } from "@/content";

interface MetaInput {
  title: string;
  description: string;
  image?: string;
}

/** Builds a consistent meta array for a route head(). */
export function pageMeta({ title, description, image }: MetaInput) {
  const meta: Array<Record<string, string>> = [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
  ];
  if (image) {
    meta.push({ property: "og:image", content: image });
    meta.push({ name: "twitter:image", content: image });
  }
  return meta;
}

const hall = VENUES[0]!;

export const sportsClubJsonLd = {
  "@context": "https://schema.org",
  "@type": "SportsClub",
  name: CLUB_INFO.name,
  sport: "Volleyball",
  foundingDate: String(CLUB_INFO.foundingYear),
  email: CLUB_INFO.email,
  telephone: CLUB_INFO.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: hall.street,
    postalCode: hall.postalCode,
    addressLocality: hall.city,
    addressCountry: "BE",
  },
  sameAs: CLUB_INFO.socials
    .filter((social) => social.url.startsWith("http"))
    .map((social) => social.url),
};

export function sportsTeamJsonLd(name: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "SportsTeam",
    name,
    description,
    sport: "Volleyball",
    memberOf: { "@type": "SportsClub", name: CLUB_INFO.name },
  };
}

export function jsonLdScript(data: unknown) {
  return { type: "application/ld+json", children: JSON.stringify(data) };
}
