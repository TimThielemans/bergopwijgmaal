/**
 * GROQ queries.
 *
 * The website data model drives these projections: every query returns exactly
 * the fields the mappers in `src/lib/providers/sanity-cms.ts` need, so no
 * component knows about Sanity.
 */

const TEAM_PROJECTION = `{
  teamId,
  "slug": slug.current,
  name,
  shortName,
  category,
  level,
  shortDescription,
  description,
  photo,
  photoAlt,
  coach,
  assistantCoach,
  order,
  "trainings": coalesce(trainings[]{
    day, startTime, endTime,
    "venueId": venue->venueId
  }, []),
  "players": coalesce(players[]{ name, number, position }, []),
  parser
}`;

export const TEAMS_QUERY = `*[_type == "team" && defined(teamId)] | order(coalesce(order, 99) asc) ${TEAM_PROJECTION}`;

export const TEAM_BY_SLUG_QUERY = `*[_type == "team" && slug.current == $slug][0] ${TEAM_PROJECTION}`;

export const VENUES_QUERY = `*[_type == "location" && defined(venueId)] | order(name asc) {
  venueId, name, address, postalCode, city, googleMapsUrl, notes
}`;

export const ACTIVITIES_QUERY = `*[_type == "activity" && defined(activityId)] | order(date asc) {
  "id": activityId,
  "slug": slug.current,
  title, date, endDate, location, excerpt, image, ctaUrl, ctaLabel
}`;

export const SPONSORS_QUERY = `*[_type == "sponsor" && defined(sponsorId)] {
  "id": sponsorId, name, websiteUrl, tier, logo
}`;

export const BOARD_MEMBERS_QUERY = `*[_type == "boardMember" && defined(name)] | order(coalesce(order, 99) asc) {
  name, role, email, phone, order
}`;

export const CLUB_INFO_QUERY = `*[_type == "clubInfo"][0] {
  name, tagline, foundingYear, mission,
  "storyBlocks": coalesce(storyBlocks[]{ title, body }, []),
  "values": coalesce(values[]{ "id": valueId, title, description }, []),
  email, phone,
  "socials": coalesce(socials[]{ platform, label, url }, [])
}`;

/* --- VolleyDataParser ---------------------------------------------------- */

/** Parser configuration only: ids, never URLs. Filtered on parserEnabled. */
export const PARSER_TEAMS_QUERY = `*[_type == "team" && defined(teamId) && parser.parserEnabled == true] | order(coalesce(order, 99) asc) {
  teamId,
  "slug": slug.current,
  name,
  "parser": {
    "parserEnabled": parser.parserEnabled,
    "volleyClubId": parser.volleyClubId,
    "volleyTeamId": parser.volleyTeamId,
    "volleySeriesId": parser.volleySeriesId,
    "competitionCode": parser.competitionCode,
    "divisionCode": parser.divisionCode
  }
}`;

/** Last-run summary of both raw singletons (no row payload). */
export const VOLLEY_RAW_STATUS_QUERY = `{
  "matches": *[_id == "volleyMatchesRaw"][0]{
    generatedAt, teamCount, rowCount, "errorCount": count(coalesce(errors, []))
  },
  "rankings": *[_id == "volleyRankingsRaw"][0]{
    generatedAt, teamCount, rowCount, "errorCount": count(coalesce(errors, []))
  }
}`;
