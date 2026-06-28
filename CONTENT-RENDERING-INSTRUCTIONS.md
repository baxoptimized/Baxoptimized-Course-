# Content Rendering Instructions — Give This to Claude Code

**What this file is:** instructions for HOW to render the lesson content that gets ingested from your 18 markdown files. The files themselves contain the actual teaching — this document tells Claude Code how to turn that markdown into something genuinely engaging on screen, since there are no videos to lean on.

**When to use this:** paste this into Claude Code right before or right after Prompt 5 (the content ingestion script) from the main build document — it shapes how Prompt 7 (the lesson page renderer) should work.

---

## The core instruction to give Claude Code

```
The course has no videos. Every lesson is plain markdown text, but it
must NEVER feel like plain text on screen. I want it to feel modern,
visual, and genuinely engaging to read — closer to a well-designed blog
post or a Stripe/Linear-style product page than a Word document.

Build the lesson renderer (the MDX component mapping) with these rules:

═══════════════════════════════════════
1. CALLOUT BOXES — not just blockquotes
═══════════════════════════════════════
Lines in the markdown starting with "> 💡", "> ⚠️", "> 🎯", "> 🔗", "> 🛠️",
"> 📍", "> 🔒", "> 🚫", or similar emoji-prefixed blockquotes must NOT
render as plain indented quote text. Each emoji maps to a distinct,
colour-coded card component:

- 💡 (tip/insight) → soft blue background, lightbulb icon, rounded card
- ⚠️ (warning) → amber/orange background, warning icon
- 🎯 (key point) → the most visually prominent — slightly larger text,
  a highlighted border or subtle glow, this is the ONE thing to remember
- 🔗 (connects to earlier content) → a distinct card with a small
  "back-link" style icon, and if it references a specific module number,
  make that a real clickable link to that module
- 🛠️ (practical/troubleshooting) → a toolbox icon, slightly more
  technical/monospace feel
- 🚫 (don't do this) → red-tinted, clear "stop" visual signal
- 📍 (location/reference point) → a pin icon, neutral colour

Build one shared Callout component that takes a "type" prop and renders
the right colour/icon/style automatically based on which emoji it parses
from the source markdown line.

═══════════════════════════════════════
2. DIAGRAM PLACEHOLDERS — become real, generated diagrams, not gaps
═══════════════════════════════════════
Lines formatted as "> 🖼️ **DIAGRAM PLACEHOLDER:** [description]" describe
a diagram in words. Don't just render this as italic text with a missing
image. Instead:

- Parse the description text
- Generate an actual inline SVG diagram that visually represents what's
  described — e.g. "five labelled steps in a circle: Browser → DNS →
  IP → Request → Response" should become a real five-node flow diagram
  with arrows, rendered directly as SVG, styled to match the site's
  colour palette
- For simple sequential concepts (four boxes in a row, a process loop,
  a comparison), generate clean, minimal SVG diagrams automatically
  based on the description text — boxes, arrows, labels, nothing fancy,
  just clear and readable
- For anything too complex to auto-generate well (e.g. "annotated
  screenshot of a Google search result"), render a clean placeholder
  card that's honest about being a placeholder, but styled nicely (not
  a broken-image icon) — and flag it in your output so I know which
  ones still need a real screenshot dropped in later
- For "SCREENSHOT PLACEHOLDER" and "GIF PLACEHOLDER" lines specifically
  (not "DIAGRAM"), these genuinely need real screenshots I'll provide
  later — render a clearly labelled placeholder slot with the
  description as alt text, sized appropriately, ready for an image to
  be dropped in via the admin panel

═══════════════════════════════════════
3. TABLES — styled, not default browser tables
═══════════════════════════════════════
Every markdown table should render as a clean, modern styled table —
proper padding, alternating row shading or clear borders, the header
row visually distinct (background colour, bold). On mobile, tables with
more than 2 columns should become a stacked card layout per row instead
of squeezing into a tiny scrollable table, so they're still readable on
a phone.

═══════════════════════════════════════
4. PROMPT CARDS — the most important visual element in the whole course
═══════════════════════════════════════
Any fenced code block that follows a line containing "🤖 PROMPT" or
"PROMPT CARD" or "PROMPT LIBRARY" must render as a visually distinct
component, not a generic code block:

- Dark background, monospace font, syntax-highlighted where relevant
- A clear label at the top (e.g. "PROMPT — Homepage generation")
- A prominent "Copy" button that copies the exact prompt text to the
  clipboard, with a brief confirmation animation/checkmark when clicked
- If the prompt contains [bracketed placeholders], visually highlight
  those brackets in a different colour so they stand out as "things to
  fill in"
These need to feel like the single most useful, premium element on the
page — they're the actual product the student is there for.

═══════════════════════════════════════
5. CHECKLISTS — real interactive checkboxes
═══════════════════════════════════════
Markdown lines like "- [ ] Some task" must render as actual clickable
checkboxes, not static text with a box character. Clicking one should
visually mark it checked (strikethrough or faded text) and persist that
state for the student (save to their progress/notes, not just visual
only) so if they leave and come back, their ticked items are still
ticked.

═══════════════════════════════════════
6. SECTION HEADERS WITH EMOJI — give them visual weight
═══════════════════════════════════════
"## 🎯 Section title" headers should render with the emoji rendered
large and slightly offset/decorative (not just inline text-sized), with
a subtle divider or spacing rhythm between sections, so scrolling down
a lesson feels like moving through distinct visual "beats" rather than
one continuous scroll of text. Use generous whitespace between
sections — this is a deliberate design choice from the course's own
Module 5 principles (whitespace does real work, don't cram).

═══════════════════════════════════════
7. PAGE-LEVEL POLISH
═══════════════════════════════════════
Apply the same premium visual layer this course teaches in Module 7.5
to the platform itself, tastefully:
- Scroll-triggered fade/rise reveals as sections enter the viewport
  (GSAP + ScrollTrigger, exact values: rise 16-20px, 0.5s, ease
  "power2.out", staggered slightly between sections)
- A subtle progress indicator that fills as the student scrolls through
  a long lesson
- Smooth, not instant, transitions when navigating between lessons
- Respect prefers-reduced-motion throughout, exactly as the course
  itself teaches

═══════════════════════════════════════
8. CODE BLOCKS (non-prompt)
═══════════════════════════════════════
Regular code blocks (terminal commands, file contents like the route
handler) get proper syntax highlighting and a copy button too, but
styled slightly differently from PROMPT cards (e.g. a more neutral
dark grey rather than the prompt card's distinct accent colour) so
students can tell at a glance "this is a command to run" vs "this is a
prompt to send to AI."

Build this as a proper set of custom MDX components (Callout, Diagram,
PromptCard, StyledTable, InteractiveChecklist, CodeBlock) registered
in the MDX renderer configuration, not as one-off inline styling per
lesson. I want changing the look of all callout boxes everywhere to be
a one-file change, not a find-and-replace across content.
```

---

## Why this matters for your course specifically

Every one of these rules maps to something the course already teaches about good design — Module 5's whitespace and hierarchy principles, Module 7.5's premium visual layer, Module 3's "be specific with AI, not vague." Asking Claude Code to apply that same standard to the platform itself isn't just nice-to-have polish — it makes the *delivery* of the course consistent with the *content* of the course. A site that teaches "don't ship the generic AI-default look" should not itself look like a generic AI-default course platform.

---

## One practical note on sequencing

Send this **after** Prompt 5 (content ingestion) has successfully run, but **as part of, or just before,** Prompt 7 (the lesson page renderer) from the main build document. Prompt 7 already covers some of this ground at a basic level — this document goes much further on the visual execution. If Claude Code already built a simpler version of the lesson renderer from Prompt 7, tell it directly:

```
Take the lesson renderer you already built and upgrade it using the
detailed component rules I'm about to give you — don't start over, just
replace the basic markdown rendering with these specific, richer
components.
```

Then paste the numbered instructions above.
