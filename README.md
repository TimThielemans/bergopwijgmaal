# Bergop Connect

Before generating any code, create a detailed implementation plan.

The plan should contain:

- Site architecture

- Page hierarchy

- Component hierarchy

- Suggested folder structure

- Data models that can later be connected to Sanity CMS

- Future integration approach for volleyball rankings and match schedules

- Mobile-first design strategy

- SEO strategy

Do not generate code yet.

Do not create backend services.

Do not generate any database schema.

I want to review and approve the architecture first



TASK:

Create a modern premium website for volleybal club Berg-Op Wijgmaal (Based in Leuven, Dutch language).

IMPORTANT:

Use the uploaded club logo as the basis for the visual identity, branding and color palette. Make it smooth/modern.

The website must be generated as a standard portable Next.js + TypeScript + Tailwind CSS application.

Do NOT use:

- Supabase

- Lovable Database

- Authentication

- Login systems (only admin)

- User accounts

- Backend services

- Server-side business logic

- Vendor-specific features

The generated project must remain fully portable and runnable from GitHub and deployable on Vercel without depending on Lovable services.

Use realistic placeholder/mock data.

The architecture should be CMS-ready so that Sanity CMS can be integrated later.

First goal is to get beautiful front-end, back-end follows later.

--------------------------------------------------

CLUB IDENTITY

--------------------------------------------------

Bergop Wijgmaal is a family-oriented adult volleyball club with sporting ambition.

The club has:

- Competitive teams

- Recreational teams

The atmosphere should feel:

- welcoming

- community-driven

- modern

- dynamic

- ambitious

- trustworthy

Avoid:

- outdated amateur association websites

- municipal website styling

- federation-style layouts

- crowded pages

The design should feel like a modern sports organization. Sleek transitions, easy navigation, highlight correct items, premium feel.

--------------------------------------------------

DESIGN REQUIREMENTS

--------------------------------------------------

- Mobile-first

- Excellent readability

- Premium sports club aesthetic

- Large whitespace

- Strong typography

- Smooth scrolling

- Subtle animations

- Responsive on all devices

- Accessible design

- Fast loading

Use large visual sections.

Do not depend heavily on photography because lack of material

Create strong layouts even when only a few or non club photos are available.

--------------------------------------------------

SITE STRUCTURE

--------------------------------------------------

Pages:

1. Home

2. Teams

3. Club

4. Contact

--------------------------------------------------

HOME PAGE

--------------------------------------------------

Section 1:

Hero

Large visual hero.

Headline similar to:

"Familiale volleybalclub met sportieve ambitie"

Primary buttons:

- Onze ploegen

- Volgende wedstrijden

--------------------------------------------------

Section 2:

Upcoming Matches

This is one of the most important sections.

Display:

- next matches

- home/away indicator

- date

- location

Use realistic placeholder data.

Design this section so that an external match parser can be connected later.

--------------------------------------------------

Section 3:

Rankings Snapshot

Show ranking number of competitive teams with winstreak visualisation of 5 last matches.

Use placeholder data.

Design the component so external ranking data can be integrated later.

On click -> go to the detailed team page of that team

--------------------------------------------------

Section 4:

Club Activities

Display upcoming activities.

Examples:

- Clubweekend

- Sinterklaasactie

- Pastaverkoop

Use activity cards.

--------------------------------------------------

Section 5:

Teams Overview

Display all teams as cards with teamname + competition level (e.g. Nat 3, Promo 1)

Use example data.

The number of teams must NOT be hardcoded.

Design this section as a dynamic collection that can later be provided through a CMS.

Teams can be added or removed without changing the code structure.

--------------------------------------------------

Section 6:

About Bergop Wijgmaal

Short introduction.

Focus on:

- family atmosphere

- sporting ambition

- club culture

--------------------------------------------------

Section 7:

Sponsors

Simple logo wall.

Sponsor logos link to sponsor websites.

Keep this section compact.

--------------------------------------------------

Section 8:

Contact

Address

Sports hall information

Social links

Map placeholder

--------------------------------------------------

TEAMS PAGE

--------------------------------------------------

Create a team overview page.

Display:

- Competitive teams

- Recreational teams

Team cards:

- Team photo

- Team name

- Short description (competition level)

--------------------------------------------------

Create a Team Detail Page template.

Include:

- Team photo

- Team description (including current competition level)

- Coach

- Training schedule

- Squad section

- Ranking section

- Upcoming matches

- Match calendar

Use placeholder data.

All team pages must be data-driven and suitable for future CMS integration.

--------------------------------------------------

CLUB PAGE

--------------------------------------------------

Include:

- Club story

- Club values

- Board members

- Sports hall information

- Family atmosphere

- Sporting ambitions

Use card-based modern layouts.

--------------------------------------------------

CONTACT PAGE

--------------------------------------------------

Include:

- Contact information

- Sports hall address

- Social media links

- Map section

--------------------------------------------------

TECHNICAL ARCHITECTURE

--------------------------------------------------

Assume future integrations:

- Sanity CMS

- Volleyball match parser

- Ranking parser

Build reusable components.

Use mock content now, but keep the structure ready for future APIs and CMS content.

Generate clean TypeScript and maintainable component structure.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://bergopwijgmaal.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/5f6b531a-2957-485a-9c39-f12d85c72766).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
