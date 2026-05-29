---
name: Cinemateca
description: A movie discovery app that reads like a printed repertory programme.
colors:
  brick-red: "#B23A30"
  brick-red-soft: "#D98A82"
  warm-paper: "#F6F4ED"
  warm-ink: "#1C1815"
  ink-soft: "#7A7164"
  hairline: "#E4DED1"
typography:
  nameplate:
    fontFamily: "Lora_700Bold, Georgia, serif"
    fontSize: "3rem"
    fontWeight: 700
    lineHeight: 1.04
    letterSpacing: "-0.5px"
  display:
    fontFamily: "Lora_700Bold, Georgia, serif"
    fontSize: "2.25rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "normal"
  headline:
    fontFamily: "Lora_700Bold, Georgia, serif"
    fontSize: "1.875rem"
    fontWeight: 700
    lineHeight: 1.15
    letterSpacing: "normal"
  title:
    fontFamily: "Lora_700Bold, Georgia, serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "Lora_400Regular, Georgia, serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  body-italic:
    fontFamily: "Lora_400Regular_Italic, Georgia, serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "normal"
  label:
    fontFamily: "Lora_400Regular, Georgia, serif"
    fontSize: "0.75rem"
    fontWeight: 400
    lineHeight: 1.2
    letterSpacing: "3px"
rounded:
  sm: "4px"
  md: "8px"
  lg: "12px"
  poster: "13px"
  full: "9999px"
spacing:
  gutter: "24px"
  row: "12px"
  section: "16px"
components:
  input-search:
    backgroundColor: "{colors.warm-paper}"
    textColor: "{colors.warm-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.lg}"
    padding: "8px 16px"
  input-search-focus:
    backgroundColor: "{colors.warm-paper}"
    textColor: "{colors.warm-ink}"
    rounded: "{rounded.lg}"
  chip-metadata:
    backgroundColor: "{colors.hairline}"
    textColor: "{colors.warm-ink}"
    typography: "{typography.body}"
    rounded: "{rounded.sm}"
    padding: "8px"
  section-label:
    textColor: "{colors.brick-red}"
    typography: "{typography.label}"
  list-item-result:
    backgroundColor: "{colors.warm-paper}"
    textColor: "{colors.warm-ink}"
    padding: "12px 24px"
---

# Design System: Movies App

## 1. Overview

**Creative North Star: "The Repertory Programme"**

This is an arthouse cinema's printed programme rendered as a mobile app. Warm paper stock, a single restrained ink, one heat of red reserved for headings and section tags. It is curatorial, not commercial. The interface behaves like a well-set page: posters lead, type carries the hierarchy, and the chrome recedes until you need it. Lora, a contemporary calligraphic serif, runs the entire surface. There is no sans, no system font, no second voice.

The system explicitly rejects the streaming-app reflex (Netflix, HBO, Prime, Disney+): no dark UI, no glossy gradients, no commercial busyness. It rejects the data-dump density of TMDB and IMDB, and it rejects the category-default "dark blue + teal" movie app. The answer to "movie app" here is paper and ink, not neon on black. The user is on a couch in the evening, half-attention, one thumb; the page should feel calm and decisive, never loud.

Density is low and deliberate: three curated carousels, generous gutters, hairline rules instead of boxes. Where most apps reach for a card, this one reaches for a rule and some space.

**Key Characteristics:**
- Warm paper-and-ink palette, never pure black or white
- One serif family (Lora) for everything: display, body, labels
- Brick red used sparingly, on labels and section tags only
- Hairlines and whitespace instead of cards and containers
- Flat by default; only posters carry depth

## 2. Colors

A warm, tinted palette pulled toward the brand red, anchored on bone paper and near-black ink. One accent, used like a printer's spot color.

### Primary
- **Brick Red** (#B23A30): The single accent. Appears only on section tags, carousel category labels, the home masthead rule and its folio session label, state-message icons, and loading indicators. It is the printer's spot color, never a fill for large areas.

### Secondary
- **Soft Brick** (#D98A82): A muted tint of the accent for lower-emphasis metadata that still belongs to the accent family (the release year under a search result). Used sparingly so the full Brick Red keeps its impact.

### Neutral
- **Warm Paper** (#F6F4ED): The bone background everywhere. The "stock" the programme is printed on.
- **Warm Ink** (#1C1815): A warm near-black for primary text and the poster shadow color. Never #000.
- **Ink Soft** (#7A7164): Secondary text, metadata, captions, the carousel counter, placeholder text.
- **Hairline** (#E4DED1): 1px rules, input borders, dividers, and the resting fill behind loading posters and chips.

### Named Rules
**The Spot-Color Rule.** Brick Red is ink applied by a single pass of the press. It marks labels and rules, never fills a button, card, or bar. If red covers more than roughly 10% of a screen, it has stopped being a spot color.

**The No-Pure-Tone Rule.** Every neutral is tinted toward the brick hue. Pure #000 and #fff are forbidden; the page is paper, and paper is warm.

## 3. Typography

**Display Font:** Lora 700 Bold (with Georgia, serif fallback)
**Body Font:** Lora 400 Regular (with Georgia, serif fallback)
**Italic:** Lora 400 Regular Italic, for taglines only

**Character:** A contemporary calligraphic serif with clean on-screen metrics. One family carries the entire system. The personality is editorial and literary, the feel of a curated programme note rather than a UI. The app holds the splash screen until Lora loads to avoid any flash of system font in the masthead.

### Hierarchy
- **Nameplate** (700, 3rem/48px, line-height 1.04, letter-spacing -0.5px): The home cover masthead ("Cinemateca") only. Oversized and tracked slightly tight so it reads as a printed programme nameplate, not a screen title. One per app, on the home cover; auto-shrinks to fit on narrow screens.
- **Display** (700, 2.25rem/36px, line-height 1.1): Movie detail titles. The largest voice, used once per screen.
- **Headline** (700, 1.875rem/30px, line-height 1.15): The home masthead ("Cinemateca") and detail section headings ("Sinopsis").
- **Title** (700, 1.125rem/18px, line-height 1.3): Search-result titles and movie-card names.
- **Body** (400, 1rem/16px, line-height 1.5): Overviews, synopsis prose, descriptions. Cap measured prose at 65 to 75 characters.
- **Body Italic** (400, italic): The system's only italic. Taglines under detail titles (1rem), and the home cover standfirst — a short curatorial line under the masthead rule (0.875rem, Ink Soft, lowercase).
- **Label** (400, 0.75rem/12px, letter-spacing 3px, UPPERCASE): Carousel category tags, section eyebrows ("Producción", "Idiomas"). Always Brick Red, always tracked wide.

### Named Rules
**The One Voice Rule.** Lora is the only typeface. No sans, no system stack, no monospace. Numeric counters use `font-variant: tabular-nums` so figures stay aligned, but they stay in Lora.

**The Tracked-Label Rule.** Every label-tier element is uppercase with 3px letter-spacing and set in Brick Red. This is the system's signature; a lowercase or black label is wrong.

## 4. Elevation

Flat paper, posters lift. The entire interface is flat ink-on-paper: no shadows on chrome, no elevated panels, no card stacks. Depth is reserved exclusively for content. A poster carries a single soft, warm-ink shadow and rises about 4% on press; that is the only elevation in the system, and it exists to make the imagery feel like a physical object you can pick up.

### Shadow Vocabulary
- **Poster rest** (`shadowColor: #1C1815, offset 0/6, opacity 0.15, radius 12, elevation 6`): The resting lift under every poster.
- **Poster press** (interpolates to `opacity 0.30, radius 18, elevation 12` with a 1.04 scale): The momentary rise on touch, paired with a light haptic. Springs back (damping 14, stiffness 220).

### Named Rules
**The Flat-Chrome Rule.** Chrome is printed flat. Search bars, headers, chips, list rows, and nav all sit at zero elevation. The poster shadow is a deliberate, single exception, not a system of layers. If a non-poster surface casts a shadow, it is wrong.

## 5. Components

### Inputs / Fields
- **Search bar:** Paper fill with a 1px Hairline border, 12px radius (`rounded.lg`), 16px horizontal padding. A leading search icon and a trailing clear button (appears only when text is present).
- **Focus:** Border and icon shift from Hairline to Brick Red. No glow, no shadow; the color shift alone signals focus.
- **Placeholder:** Ink Soft, Lora regular.

### Chips
- **Metadata chip:** Hairline fill, Warm Ink text, 4px radius (`rounded.sm`), 8px padding. Used for runtime, year, status, and languages on the detail screen.
- **State:** Static; these are read-only metadata, not filters.

### Cards / Containers
- **Posters** are the only true "card." Corner radius 13px (`rounded.poster`), Hairline resting fill behind the image, 1px Hairline border, image clipped to the radius. They carry the system's only shadow.
- **Movie card:** A poster plus left-aligned Title (movie name) and an Ink-Soft year beneath. No container, no border around the text.
- **Avoid wrapping content in boxes.** Search results are hairline-separated rows, not cards.

### List Items
- **Search result row:** A 60px-wide poster thumbnail (8px radius) beside Title, a Soft Brick year, and a two-line Ink-Soft overview. Separated by a 1px bottom Hairline, 12px vertical padding, 24px gutter. Presses scale to 0.97 on a tight spring.

### Loading States
- **Skeletons, not spinners, for content rows.** Search loading shows Hairline-filled skeleton rows that pulse opacity 0.45 to 0.85 on an 800ms loop. Section-level and pagination loads use a Brick Red `ActivityIndicator`.

### Empty / Error States
- Centered, generous padding. A 40px Brick Red outline icon, a tracked Brick Red label, then an Ink-Soft sentence of body. Error and empty share one layout, differing only in icon and copy.

### Signature Component: The Carousel Section Header
- A Brick Red tracked label (category name) on the left, a tabular-nums Ink-Soft counter (`01 / 12`) on the right, both on the gutter baseline, with a 1px Hairline rule beneath. This masthead-and-rule device is the editorial heart of the home feed.

### The Home Cover Masthead
- The home screen opens like a programme cover, stacked in the gutter and revealed with a staggered fade-in (respecting reduce-motion):
  1. **Folio row** — a Brick Red tracked session label (`MATINÉ` / `SESIÓN DE TARDE` / `SESIÓN DE NOCHE`, chosen by time of day) on the left, the full date (`28 mayo 2026`, Ink Soft, tabular-nums) on the right, closed by a 1px Hairline.
  2. **Nameplate** — "Cinemateca" in the oversized Nameplate tier (48px), the cover's single dominant voice.
  3. **Masthead rule** — a short, heavy Brick Red rule (3px tall, 64px wide). The spot-color signature of the cover.
  4. **Standfirst** — one lowercase Body-Italic curatorial line in Ink Soft ("una sala de repertorio").
- The whole block is one accessibility node (role `header`); the search bar follows, the entire header closed by a Hairline. No box, no fill, no shadow — type, rule, and space carry it.

### Navigation
- **Headers are hidden** at the Stack level; each screen sets its own type-led masthead. The detail screen's only nav is a circular back button (44px, translucent dark fill) floating over the hero image, the one place a dark control is allowed because it sits on imagery, not paper.

## 6. Do's and Don'ts

### Do:
- **Do** keep Brick Red on labels, section tags, the masthead rule, and state icons only, never as a fill (The Spot-Color Rule).
- **Do** set every label uppercase in Lora with 3px tracking and Brick Red color (The Tracked-Label Rule).
- **Do** tint all neutrals warm; use Warm Paper (#F6F4ED) and Warm Ink (#1C1815), never #fff or #000.
- **Do** separate rows and sections with 1px Hairline rules and whitespace instead of cards or boxes.
- **Do** reserve depth for posters; let everything else sit flat (The Flat-Chrome Rule).
- **Do** use skeleton rows for content loading and a Brick Red indicator for pagination.
- **Do** keep the 24px gutter consistent across home, search, and detail.

### Don't:
- **Don't** make this look like a streaming app (Netflix, HBO, Prime, Disney+): no dark UI, no glossy gradients, no commercial chrome.
- **Don't** drift toward the TMDB / IMDB data-dump: no dense tables, no cluttered metadata grids.
- **Don't** fall into the category-default dark-blue-plus-teal movie app. The answer is paper and ink.
- **Don't** introduce a second typeface. Lora carries display, body, and labels (The One Voice Rule).
- **Don't** put a shadow on any chrome surface (search bar, header, chip, row). Only posters lift.
- **Don't** use a `border-left` or `border-right` colored stripe as an accent on rows or cards. Use full Hairline borders or nothing.
- **Don't** fill buttons, bars, or large areas with Brick Red; its rarity is the point.
- **Don't** wrap text content in cards when a rule and spacing will do.
