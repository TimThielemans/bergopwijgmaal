/**
 * Team and venue matching for raw VolleyScores rows.
 *
 * Raw rows contain club-style names ("Berg-op Wijgmaal A") while the site works
 * with its own team documents ("Heren A"). Matching therefore happens on the club
 * token plus the team suffix (A/B/C) instead of on the display name.
 */

import type { Team, Venue, VenueRef } from "@/content/types";
import { fixEncoding, normalizeKey } from "./columns";

export const CLUB_TOKENS = ["bergopwijgmaal", "bergop", "vcbergopwijgmaal"];

export function isOwnClub(name: string): boolean {
  const key = normalizeKey(name);
  if (!key) return false;
  return CLUB_TOKENS.some((token) => key.includes(token));
}

/** Trailing team letter of a name: "Berg-op Wijgmaal A" -> "a", "Heren B" -> "b". */
export function teamSuffix(name: string): string {
  const match = /(?:^|[\s-])([a-zA-Z])\s*$/.exec(String(name ?? "").trim());
  return match?.[1] ? match[1].toLowerCase() : "";
}

export interface SideMatch {
  isHome: boolean;
  opponent: string;
}

/**
 * Decides which side of a raw match row is our own team.
 * Returns null when neither side belongs to the club.
 */
export function matchSides(home: string, away: string, team: Team | undefined): SideMatch | null {
  const homeName = fixEncoding(String(home ?? "").trim());
  const awayName = fixEncoding(String(away ?? "").trim());
  const homeIsOurs = isOwnClub(homeName);
  const awayIsOurs = isOwnClub(awayName);

  if (homeIsOurs && awayIsOurs) {
    // Derby between two of our own teams: use the team suffix to pick a side.
    const wanted = teamSuffix(team?.name ?? "") || teamSuffix(team?.shortName ?? "");
    if (wanted && teamSuffix(awayName) === wanted && teamSuffix(homeName) !== wanted) {
      return { isHome: false, opponent: homeName };
    }
    return { isHome: true, opponent: awayName };
  }
  if (homeIsOurs) return { isHome: true, opponent: awayName || "Tegenstander nog niet gekend" };
  if (awayIsOurs) return { isHome: false, opponent: homeName || "Tegenstander nog niet gekend" };
  return null;
}

/** Matches the raw hall name onto a known location, with a text-only fallback. */
export function matchVenue(rawName: string, venues: Venue[]): VenueRef {
  const name = fixEncoding(String(rawName ?? "").trim());
  if (!name) return { venueId: "", name: "Locatie nog niet gekend" };

  const key = normalizeKey(name);
  const hit = venues.find((venue) => {
    const venueKey = normalizeKey(venue?.name ?? "");
    return venueKey.length > 0 && (venueKey === key || key.includes(venueKey) || venueKey.includes(key));
  });

  if (hit) {
    return {
      venueId: hit.venueId,
      name: hit.name,
      ...(hit.city ? { city: hit.city } : {}),
    };
  }
  return { venueId: "", name };
}
