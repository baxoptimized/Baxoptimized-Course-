# MODULE 6 — Building the Site in Claude Design

**Format:** Short chunks + prompt cards
**Unlocks:** Module 7
**Gate to pass:** Practical — submit your generated homepage

> 🎯 **From here, you build the exact same thing Baxter builds.** Pause, do the step, then resume.

---

## 📋 From brief to build plan

Before any prompt goes to Claude Design, know your plan:

> **The plan for Smith Building Co:**
> - **Palette:** navy + charcoal, warm neutral
> - **Pages:** Home, Services, About, Work, Contact (5 pages)
> - **Direction:** photography-led, minimal decoration

> 💡 Load the brief into your Claude Project (from Module 4) once — every conversation from here already has the context.

---

## 🏗️ The master build prompt

**🤖 PROMPT CARD — Homepage generation:**
```
You're an experienced web designer who specialises in websites for trade
and service businesses in Australia.

CONTEXT:
[Business name] is a [type of business] based in [location], serving
[service area]. [One sentence on their situation/goal]. Their main
competitors are [competitor description]. They want the site to feel
[design direction].

TASK:
Build a homepage with, in this order:
1. Header — logo placeholder, nav (Home, Services, About, Work, Contact),
   visible clickable phone number
2. Hero — headline, one supporting sentence, one primary CTA, space for
   a hero photo
3. 3-4 trust signals / credibility points
4. Services overview — 3-4 service cards
5. Featured work teaser — space for 2-3 project photos
6. Closing CTA section
7. Footer — ABN placeholder, secondary links, contact details

CONSTRAINTS:
- Australian English spelling throughout
- No generic stock-photo language ("synergy," "best-in-class")
- Mobile-first
- Palette: [your palette]
- Minimal decoration — let photography and whitespace do the work

FORMAT:
Single Next.js page component, Tailwind CSS.

EXAMPLE OF THE FEEL:
[Describe a reference — e.g. "Clean, confident, like a well-established
local builder's site — NOT like a generic template with stock photos."]
```

> 💡 Notice: zero adjectives without a number or constraint attached. Every decision is specific — that's Module 3's anatomy, applied for real.

---

## 📄 Building each page

**🤖 PROMPT CARD — Services page:**
```
Using the same business context and design direction as the homepage,
build the Services page.

- Intro section on the business's overall approach
- Each service ([list services]) with a short description + what's included
- Closing CTA matching the homepage

Same constraints as the homepage.
```

**🤖 PROMPT CARD — About page:**
```
Using the same context, build the About page.

- The business's story — [2-3 real details: how long established,
  specialism, local connection]
- Why this business vs competitors
- Team section placeholder
- Closing CTA

Same constraints as the homepage.
```

**🤖 PROMPT CARD — Work/Portfolio page:**
```
Using the same context, build the Work page.

- Grid layout, space for a caption per project (location, type)
- Slot in [number] placeholder projects
- Closing CTA

Same constraints as the homepage.
```

**🤖 PROMPT CARD — Contact page:**
```
Using the same context, build the Contact page.

- Form fields: name, email, phone, message, enquiry type dropdown
- Clickable phone + email, visible without filling the form
- Service area info
- Map embed placeholder

Same constraints. Note: form isn't wired to send emails yet — that's
Module 8. Just build the visual form.
```

> 🔁 Every prompt reuses the same Project context — you never re-explain the brief, palette, or voice.

---

## 🔁 Iterating well

| ❌ Weak | ✅ Good |
|---|---|
| "Make it better" | "Keep the structure and colours. Reduce hero copy to one sentence, increase headline and CTA size." |
| "I don't like the services section" | "Keep the card layout, add more padding, reduce to 3 cards instead of 4." |

> 🔁 Real building = a good first prompt + 2-3 precise iteration rounds. Not one perfect prompt, not scrapping and restarting.

---

## ✍️ Writing the copy with AI

**🤖 PROMPT CARD — Website copywriting:**
```
Write the copy for [page name] for [business name], a [business type]
in [location].

VOICE: Direct and practical, no corporate buzzwords. Confident, not
arrogant. Plain language. Australian English.

CONTENT TO COVER: [specific points from the brief]

LENGTH: [e.g. "headline under 10 words, each service description 2-3
sentences"]

No placeholder phrases, no unbacked claims ("award-winning" unless real).
```

**🤖 PROMPT CARD — AHPRA-safe variant** *(health practitioner clients only)*:
```
[Same prompt above, PLUS:]

ADDITIONAL CONSTRAINTS (AHPRA — regulated health practitioner):
- No testimonials or claims about clinical outcomes
- No comparative/superlative claims ("best," "leading," "#1")
- No cure-rate or guaranteed-outcome claims
- Safe language: focus on experience and approach, never outcome promises
```

> ⚠️ Always use the AHPRA-safe variant for health practitioner clients. Smith Building Co doesn't need it — flag this every time the client type changes.

---

## 📁 Downloading and organising files

1. Download all generated pages from Claude Design
2. Move into `~/clients/smith-building/`
3. Organise:
```
~/clients/smith-building/
├── index.html (or Next.js app/page structure)
├── services/  ├── about/  ├── work/  ├── contact/
├── css/ or styles/
├── images/
```

---

## ✅ PROVE IT — Module 6 Practical Checkpoint

**Submit:**
- [ ] Screenshot of your generated homepage
- [ ] Screenshot of at least one other page
- [ ] A note on one iteration you made and why
- [ ] Screenshot of your organised clients folder

**Self-check:**
- [ ] No placeholder text remains
- [ ] AU English, no buzzwords
- [ ] Mobile width checked, not just desktop

**Next: Module 7 — Refining in VS Code with Claude Code →**
