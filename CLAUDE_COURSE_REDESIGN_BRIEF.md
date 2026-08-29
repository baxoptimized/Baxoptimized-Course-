# Baxoptimized Course — redesign & launch-readiness brief for Claude Code

Paste this whole file as your first message to Claude Code, working inside this
repo (`Baxoptimized course`). It was written after a live audit of the
deployed app at baxoptimized-course.vercel.app — logging in as a real test
student, querying the production database directly, and reading the full
codebase — not from guessing. Every claim below is something that was
actually observed, with the evidence next to it.

## What this project is

A custom-built Next.js 16 + Postgres (Neon) + Stripe LMS that teaches
complete beginners to design, build, and launch real websites using an
AI-assisted workflow (Claude Design → VS Code + Claude Code → GitHub →
Vercel), then turn that into paid client work. 19 modules, ~130 lessons,
gated by quizzes and a manually-reviewed capstone project, ending in a
certificate. Ads are about to start running to this. **Nobody outside the
owner has ever been through it end to end** — the only row in the `users`
table is the admin account.

## Do not rebuild this from scratch

The instinct on seeing "this isn't good enough yet" is often to start over.
Don't. The backend is genuinely solid: real bcrypt+JWT auth, Stripe
purchase-gated signup, a sequential module/quiz/checkpoint gating engine, an
admin review queue for checkpoint submissions, a capstone + certificate flow,
Resend transactional email. The curriculum itself is specific and
well-written — real prompt templates, a consistent worked example business,
clear "what unlocks next" structure. The job here is **fix the real bugs,
finish what's half-built, and reskin it to actually look like Baxoptimized**
— not a greenfield rewrite.

## Part 1 — Fix these before a single dollar of ad spend runs

These aren't opinions. They were reproduced against the live production app.

### 1a. Module unlock sequencing is broken — students can already skip to the end

In `app/course/page.tsx`, `buildModules()` computes `isLocked` by checking
**only the immediately-preceding module's own gate** (`prevQuizBlocks` /
`prevCheckpointBlocks`). It never checks whether that preceding module was
itself reachable. Result: any module whose predecessor has no quiz of its
own inherits "unlocked" regardless of what the student has actually done.

Verified live with a fresh signup (zero lessons completed): **Module 4, 5,
7, 13, and Module 15 — the final Capstone — were all clickable and open**,
while the modules directly before each of them were correctly shown locked.
A brand-new student can currently click straight from signup into "The
Capstone: Build a Site Solo."

Root cause is that 7 of the 19 modules (`module-03.5`, `module-04`,
`module-06`, `module-12`, `module-14`, `module-15`) have zero rows in
`quiz_questions`, so `has_quiz` is false for them and the lock check for the
*next* module short-circuits to unlocked.

Fix the lock computation so "locked" propagates down the whole chain (a
module is locked if *any* earlier module in the sequence is incomplete —
not just the one directly before it), independent of which modules happen
to have quizzes. Decide separately whether every module should have a real
quiz/gate, or whether some are intentionally ungated — but the sequencing
bug needs fixing regardless of that decision.

### 1b. Clicking into a lesson hangs the page

Reproduced and isolated: a **hard/direct page load** of a lesson URL
(`/course/module-00-welcome/start-here`) renders and screenshots fine. But
**clicking the module card link from the dashboard** to reach that exact
same URL hangs the tab — even a raw CDP screenshot command never returns.
Chromium logs `Transition was skipped` in the console when this happens.

The prime suspect is the sitewide

```css
@view-transition { navigation: auto; }
```

in `app/globals.css`, which turns every same-origin `<a>` navigation
(including the plain `<a href>` in `ModuleCard.tsx`) into a cross-document
View Transition. This is a newer, still-flaky browser feature. This was
only confirmed in headless Chromium — **verify it in real desktop Chrome,
Safari, and a real phone before doing anything else**, since this is
literally the first click every paying student makes right after logging
in. If it reproduces, remove or scope that CSS rule rather than shipping a
course where lesson 1 might freeze the tab.

### 1c. Reconcile purchases vs. users

The `purchases` table has 2 rows with `claimed_at` set, but `users` has only
1 account. Every claimed purchase should have produced exactly one linked
user. Find out what happened to the second one — a real customer whose
account didn't get created after paying is a support fire waiting to
happen, not a hypothetical.

### 1d. Run one real end-to-end pass before launch

Nobody has ever gone: pay → get the email → sign up with that email → land
in Module 0 → complete lessons → pass a quiz → hit a hard-gated checkpoint
→ get approved → reach the Capstone → submit it → get a certificate. Do
that whole loop for real (a real Stripe test-mode purchase, not a
DB-inserted user) and fix whatever breaks. This something-you-can-verify
matters more than any visual polish below.

## Part 2 — Brand: make it actually look like Baxoptimized

The LMS currently uses its own invented palette — navy `#080f1e` background,
electric blue `#4f7cf7` accent, gold `#f0a843` highlight, plain Inter
throughout (see `app/globals.css`). That shares **zero colors** with either
real Baxoptimized brand:

- The main business site (baxoptimized.com.au): cream canvas `#f4efe6`,
  near-black ink `#0a0908`, burnt-orange accent `#c84a1f`, sage `#6b7d5e`,
  Inter body + **Instrument Serif** for display type, a subtle grain
  texture overlay, pill-shaped buttons.
- This course's own marketing/checkout site: near-black `#0a0a0b`, a
  brighter orange accent `#e8641a`, off-white text `#f4f1ec`, **Clash
  Display** for headings.

Someone buys from a dark, orange-accented sales page and logs into
something with an unrelated blue-and-gold color scheme. Fix that. Adopt one
coherent system across the LMS that's clearly the same brand as the
marketing site it's sold from — dark canvas (keep the near-black feel, it
suits a "serious tool" course), the burnt-orange/`#e8641a`-family accent
instead of the blue, and pair Inter body copy with a real display font
(Instrument Serif or Clash Display — pick one and use it for H1/H2 and the
"MODULE" numerals) instead of everything being the same weight of Inter.
Keep the gold as a secondary "achievement" color (certificates, completed
badges) if you want a second accent — just don't let it be the *primary*
brand color the way it currently is.

## Part 3 — The real content gap (not what you'd assume)

This is **not** "the course should have video." Module 0, Lesson 1 tells
students directly: *"That's it for video intros. Everything else in this
course is built to be read, looked at, and tried — not watched as a
lecture."* That's a deliberate design choice already stated to the
customer, not an oversight — don't reverse it without the site owner
explicitly asking for that.

The actual gap: the "**looked at**" half of that promise is never
delivered. Two MDX components exist purpose-built for exactly this —
`components/mdx/MediaPlaceholder.tsx` and `DiagramPlaceholder.tsx` — and
across all 130 lessons in `source-content/`, **neither is used once**.
Lessons walking through Claude Design's UI, VS Code, GitHub, or the Vercel
dashboard are pure prose asking a total beginner to picture an interface
they've never seen. That's the highest-leverage content fix available:
go through the lessons that describe using a specific tool's UI and add
real screenshots/annotated images (using the existing placeholder
components as the slot, then swapping in real captures) at the moments
where a beginner would otherwise be lost.

## Part 4 — Structure, layout, and features worth stealing

The site owner has a course they personally subscribed to and admires the
production quality of (screenshots were shared separately — a
Kajabi-hosted fitness-CE course with polished module dashboards, a
persistent lesson sidebar, and a floating in-context AI assistant). Don't
clone it feature-for-feature, but these specific things are worth adapting:

- **Fill the frame on desktop.** The current dashboard (`app/course/page.tsx`)
  centers a ~700px-wide column of module cards inside the full viewport —
  at 1440px wide that's a huge flat dead zone on both sides with nothing in
  it. Either constrain the whole page to a sensibly-centered, styled shell
  (not just the content column floating in empty dark space) or use the
  width for something: a right-rail with next-lesson preview, overall
  streak/stats, or a hero banner per module.
- **A floating "ask about this lesson" assistant** — even a simple one
  (canned FAQ + a mailto/contact fallback, or a real LLM-backed widget if
  you want to build it) reduces the "I'm stuck and there's no one to ask"
  drop-off point that text-only self-paced courses are most vulnerable to.
- **Lesson-level bookmarking/favorites** so students can flag a lesson to
  revisit — cheap to build, meaningfully improves the course-as-reference
  use case (a lot of students will want to come back to specific lessons
  once they're doing real client work).
- **A proper welcome/orientation screen** the very first time someone logs
  in — right now login → `/course` drops straight into the module list. A
  short "here's how this works, here's what you'll have built by the end"
  moment (this can literally reuse Module 0's own content) sets
  expectations before the wall of modules.

## Part 5 — Testing bar before ads go live

Because real budget is about to be spent driving cold traffic here, treat
this as a genuine pre-launch QA pass, not a code review:

- A real Stripe test-mode purchase → signup → login → Module 0 → at least
  one full module including its quiz → a hard-gated checkpoint submission
  → admin approval in `/admin` → capstone submission → certificate issued.
- The lock/unlock logic re-verified module by module for a fresh account —
  confirm nothing is reachable early anymore.
- The lesson-navigation hang from Part 1b, specifically re-tested in real
  Chrome, Safari, and on an actual phone, not just headless automation.
- Mobile pass on the dashboard, a lesson page, the quiz, and checkpoint
  submission forms.
- Confirm the Stripe webhook (`app/api/stripe/webhook/route.ts`) correctly
  creates a claimable `purchases` row for a real checkout, matching what
  Part 1c found was inconsistent.

## What "done" looks like

A student pays, gets in, cannot skip ahead, never hits a frozen page,
recognizes the brand as the same one they just bought from, can actually
see what the tools they're learning look like at the moments text alone
would leave them guessing, and the dashboard looks like a considered,
premium product on a real monitor — not a centered column of cards in an
otherwise empty dark page. Report back what you changed, what you tested,
and anything from this brief you deliberately didn't do and why.
