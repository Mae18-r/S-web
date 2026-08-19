# S-WEB — project rules

Public marketing site for S-WEB, a web design studio in Ottawa–Gatineau serving trades
contractors, home services, and private clinics. Bilingual FR/EN.

Full reference docs live in `docs/`. Read `docs/spec-sheet.md` for the complete design
system and `docs/prd.md` for scope, page content, and requirements. Read them when the
task calls for it — don't assume their contents from this summary.

## Stack

- Hand-coded HTML, CSS, and vanilla JS. No framework, no build step, no Tailwind.
- One stylesheet using CSS custom properties. No CSS-in-JS, no utility classes.
- Semantic HTML. Every page sets the correct `lang` attribute.
- No dependencies unless I approve them first.

## Structure

Five pages, each in FR and EN: Accueil, Services, Résultats, À propos, Réserver un appel.

## Colour — use tokens, never raw hex in components

```css
--encre:          #14161A;  /* text, dark surfaces, logo */
--blanc-casse:    #F6F5F1;  /* page background */
--blanc:          #FFFFFF;  /* card surfaces, form fields */
--gris-structure: #6B6E76;  /* secondary text, field borders */
--gris-brume:     #E8E7E2;  /* card borders, section bands */
--ambre:          #FF5A1F;  /* accent — backgrounds and graphic strokes only */
--ambre-texte:    #C23A00;  /* accent — the ONLY orange allowed on text */
```

**Hard rule:** `--ambre` fails WCAG contrast on light backgrounds (~2.9:1). It is never
text on a light surface. On light backgrounds orange appears only as a button fill with
`--encre` text, or as a stroke ≥ 2px. Orange text on light uses `--ambre-texte`.
On `--encre` backgrounds, `--ambre` text is fine (~5.9:1).

**Ratio rule:** any rendered screen is ≥ 90% ink/off-white/neutrals, ≤ 5% amber. Amber
marks an action or a number. It never decorates.

## Typography

```css
--font-display: "29LT Zaria Serif", Georgia, serif;       /* Bold 700 only, H1 + H2 */
--font-corps:   Arial, "Helvetica Neue", sans-serif;      /* body 400, buttons 500, H3 700 */
--font-mono:    "IBM Plex Mono", "Courier New", monospace; /* data, phone, meta — never a heading */
```

- Body 17px desktop / 16px mobile. Paragraphs `max-width: 65ch`.
- H1 `clamp(2.5rem, 5vw + 1rem, 4rem)`, line-height 1.05.
- H2 `clamp(1.75rem, 3vw + .5rem, 2.5rem)`, line-height 1.15.
- Eyebrow labels: mono, uppercase, 13px, letter-spacing +0.08em.
- Never set the display face below 28px. Never italic.
- Phone numbers, coordinates, stats, metadata: always mono.

## Spacing and layout

8px scale: 4, 8, 12, 16, 24, 32, 48, 64, 96, 128.
12-column grid. Container max 1200px. Margins 64px desktop / 40px tablet / 24px mobile.
Section padding-block 96px desktop, 56px mobile.

## Shape

- `border-radius: 0` everywhere. Buttons, cards, inputs, images. No exceptions.
- Borders do the work: 1px `--gris-brume` for cards, 1px `--gris-structure` for inputs.
- Default to no shadow. If something floats, one flat shadow only, never stacked.

## Components

**Buttons** — 48px tall, 24px horizontal padding, Arial 500 16px, square.
Primary: `--ambre` fill, `--encre` text; hover inverts to `--encre` fill with off-white text.
Secondary: transparent, 1px `--encre` border; hover fills with `--encre`.
One primary button visible per screen.

**Links in body text** — `--encre` text with a 2px `--ambre` underline, offset 3px.
Hover shifts text to `--ambre-texte`, underline stays.

**Header** — 72px, off-white, 1px bottom border, not sticky. Badge + wordmark left; nav
links, FR/EN switch in mono, phone in mono, and the primary CTA right. Mobile: 64px bar,
outline menu icon, full-width panel.

**Footer** — the only dark surface on the site. `--encre` background, off-white text,
white badge, contact details in mono.

**Cards** — white fill, 1px `--gris-brume` border, 32px padding, square, no shadow.
Hover (if clickable) darkens the border only. No lift, no scale.

**Stat blocks** — mono uppercase eyebrow, number in the display face in `--encre`, with
only the unit or symbol in `--ambre`. This is the canonical use of the accent.

**Forms** — 48px fields, white fill, square, 16px text minimum (smaller triggers iOS zoom).
Label above the field. Errors use `--ambre-texte` with a `×` marker — there is no red in
this palette, do not add one.

## Motion

160ms for colours and borders, 240ms for panels, `cubic-bezier(0.2, 0, 0, 1)`.
No parallax, no scroll reveals, no animated counters, no bounce, no hover transforms.
Honour `prefers-reduced-motion`.

## Accessibility floor

WCAG 2.1 AA. Visible focus ring on every interactive element (2px `--encre`, 2px offset;
off-white on dark surfaces). Full keyboard navigation. Touch targets ≥ 44px. One H1 per page.
Correct `lang` and `hreflang` on every page.

## Voice

Direct, no superlatives, no startup jargon. The brand builds sites — foundations,
structure, measurement. It does not "craft" or "create" them. Never write "excellence",
"passion", "innovative", or "solutions". Prove instead of claiming: a number beats an
adjective every time. No emoji anywhere, in copy or in code comments.

## Working style

- Build one component or one section at a time. Show me the result before moving on.
- Ask before adding a dependency, changing the structure, or inventing a token.
- If something in these rules conflicts with what I've asked for, say so instead of
  silently picking one.
