# MODULE 7.5 — Making It Look Like a $50k Site

**Format:** Short chunks. Read, look, copy, try.
**Unlocks:** Module 8
**Gate to pass:** Practical — add 3 effects from this module to your Smith Building Co site

---

## 💡 Why this module matters

This module is one thing: **the visual layer that separates "a website" from "a $10k website."** Everything before this taught you how to build a correct, fast, working site. This module teaches you how to make it feel expensive.

---

## 💡 The big idea

A flat site and a site with this layer have **identical content.** Same words, same structure, same information. The difference is entirely in *how it moves and reacts.*

| Flat site | This module's site |
|---|---|
| Text just appears on load | Text reveals as you scroll, staggered |
| Static background | Ambient WebGL light or particles drifting |
| Click = instant page jump | Smooth scroll, eased transitions |
| Flat 2D shapes | Subtle 3D depth, parallax |
| Static hero image | Looping video or interactive 3D scene |

**This is exactly what that reference prompt at the start of this lesson was doing** — the looping video background, the custom fade logic, the liquid-glass blur effect on the nav. That's this entire module, distilled into one component.

---

## 🧰 The five tools — what each one is actually for

> 🖼️ **DIAGRAM PLACEHOLDER:** Five icons in a row — Three.js, WebGL, GSAP, Spline, Motion — each with a one-line label underneath matching the table below.

| Tool | What it actually does | When you reach for it |
|---|---|---|
| **Three.js** | Renders real 3D scenes in the browser (shapes, lighting, cameras) | A 3D object, scene, or environment on the page |
| **WebGL (raw/shaders)** | The lower-level engine Three.js sits on top of — used directly for custom visual effects like glow, light, distortion | Ambient lighting effects, custom shader backgrounds, point-light glow |
| **GSAP** | Animates anything — scroll-triggered reveals, timelines, sequencing | Text/element reveals on scroll, orchestrated multi-step animations |
| **Spline** | A visual tool (no code) for designing 3D scenes, then exporting them to drop into React | You want a custom 3D object/scene but don't want to hand-code Three.js geometry |
| **Motion** (formerly Framer Motion) | Simple, declarative animation for React components | Hover effects, page transitions, simpler reveals — the "easy 80%" |

**Rule of thumb:** Motion for simple stuff, GSAP for anything scroll-driven or sequenced, Three.js/Spline for actual 3D, raw WebGL for ambient light/shader effects. Most sites use **2 or 3 of these together**, not all five.

---

## 🌊 Effect 1 — Scroll-Triggered Reveals (GSAP)

> 🖼️ **SCREENSHOT/GIF PLACEHOLDER:** A section fading and rising into view as the page scrolls past it — before/after scroll position shown as two frames.

This is the single highest-impact, lowest-effort effect in this whole module. Elements don't just appear — they fade up, slide in, or scale in **exactly when they enter the viewport.**

**🤖 PROMPT CARD:**
```
Add scroll-triggered reveal animations using GSAP and ScrollTrigger to
[component/section name].

SPECIFICATIONS:
- Each direct child of the section should fade in and rise 24px on scroll,
  staggered by 0.08s per child
- Animation triggers when the element is 80% into the viewport (not when
  it first appears at the very bottom)
- Duration: 0.6s, ease: "power3.out"
- Animation should only play once per element (no re-triggering on
  scroll-up then scroll-down again)
- Respect prefers-reduced-motion — if set, skip the animation and show
  elements at full opacity immediately
- Use useEffect + useRef in React, register ScrollTrigger plugin once at
  the top of the component file
```

**Why this prompt is built this way:** specific trigger point (80%, not "when visible" — vague), specific easing curve (not "smooth" — meaningless to AI), explicit accessibility constraint (`prefers-reduced-motion`), and explicit "only once" behaviour — without that constraint, GSAP will happily replay the animation every time you scroll past it, which looks janky, not premium.

---

## ✨ Effect 2 — Ambient WebGL Point Light / Glow Background

> 🖼️ **SCREENSHOT/GIF PLACEHOLDER:** A dark hero section with a soft moving glow/light source drifting subtly behind the content — like the cinematic glow effect in the reference prompt's video background, but generated rather than filmed.

This is what makes a dark hero section feel alive instead of just... dark. A soft, slowly-moving point of light, rendered live in WebGL, sitting behind your content.

**🤖 PROMPT CARD:**
```
Add an ambient WebGL point-light background effect to the hero section,
using Three.js and react-three-fiber.

SPECIFICATIONS:
- A single soft point light (warm white, #FFF8E7) that drifts slowly in
  a large, slow figure-8 path behind the hero content
- Rendered on a full-bleed <Canvas> positioned absolutely behind the
  hero text, z-index below the content
- Use a basic plane or sphere mesh with a custom shader (or
  MeshStandardMaterial if simplicity is preferred) to catch the light
  glow softly — no hard edges
- The whole effect should feel slow and ambient, not energetic — full
  loop should take 20-30 seconds
- Cap the frame rate impact: this must not noticeably affect scroll
  performance. Use low poly counts and avoid recalculating geometry
  every frame
- Fallback: if WebGL isn't supported, render a static radial gradient
  in the same warm tone instead
```

**Why this prompt is built this way:** "slow figure-8, 20-30 second loop" gives AI a concrete motion pattern instead of "make it move nicely." The performance constraint is critical — WebGL effects are the #1 way beginners accidentally tank their PageSpeed score (remember Module 12). The fallback constraint means the effect degrades gracefully instead of breaking on unsupported browsers.

---

> 🖼️ **SCREENSHOT PLACEHOLDER:** The actual liquid-glass hero from the reference prompt — full-bleed video, frosted nav bar, "Built for the curious" headline.

This is exactly the technique in the prompt you provided at the top of this module. Worth breaking down because it's a genuinely excellent example of prompt density — every visual decision is a number, not a vibe.

**🤖 PROMPT CARD (the seamless video loop fade pattern, generalised):**
```
Implement a seamless looping background video with a custom JavaScript
fade system (no CSS transitions):

- 500ms requestAnimationFrame-based fade-in when the video starts/loops
- 500ms fade-out triggered when 0.55 seconds remain before the video ends
- A boolean ref (e.g. fadingOutRef) prevents the fade-out firing multiple
  times from repeated timeupdate events
- On the video's "ended" event: set opacity to 0, wait 100ms, reset
  currentTime to 0, call play(), then fade back in
- Each new fade must cancel any currently running animation frame, so
  competing fades never run simultaneously
- Fades should resume from whatever the current opacity actually is,
  not snap to a starting value
```

**Why this is a genuinely great prompt (study this pattern):** notice there's no adjective in the whole thing — no "smooth," no "nice," no "professional." Every single requirement is a number, an event name, or a specific behaviour. "500ms," "0.55 seconds remain," "100ms," "a boolean ref." This is **the exact pattern Module 3 taught you** — specificity over vibes — pushed to its logical extreme. This is what a senior prompt looks like.

---

## 🪟 Effect 4 — Liquid Glass / Frosted UI

> 🖼️ **SCREENSHOT PLACEHOLDER:** Close-up of a frosted glass nav bar or button, showing the subtle gradient border and blur, content visible blurred behind it.

The "liquid glass" look — semi-transparent panels with blur and a soft gradient border — is one of the most reused premium UI patterns right now (you'll see it constantly in 2025-26 product sites). Here's the reusable CSS pattern.

**🤖 PROMPT CARD:**
```
Create a reusable .liquid-glass utility class with these exact properties:

- background: rgba(255, 255, 255, 0.01), background-blend-mode: luminosity
- backdrop-filter: blur(4px) and -webkit-backdrop-filter: blur(4px)
- border: none
- box-shadow: inset 0 1px 1px rgba(255, 255, 255, 0.1)
- position: relative, overflow: hidden

Add a ::before pseudo-element for the border effect:
- position: absolute, inset: 0, border-radius: inherit, padding: 1.4px
- background: linear-gradient(180deg, rgba(255,255,255,0.45) 0%,
  rgba(255,255,255,0.15) 20%, rgba(255,255,255,0) 40%,
  rgba(255,255,255,0) 60%, rgba(255,255,255,0.15) 80%,
  rgba(255,255,255,0.45) 100%)
- Use the mask trick so only the border renders, not the fill:
  -webkit-mask: linear-gradient(#fff 0 0) content-box,
  linear-gradient(#fff 0 0); -webkit-mask-composite: xor;
  mask-composite: exclude
- pointer-events: none on the pseudo-element

Apply this class to [nav bar / buttons / cards — name the elements].
```

**Callout box:**
> 💡 **Save this one.** This exact CSS pattern is reusable across every future client site that wants a premium, dark, modern feel — paste it once into your starter template and reuse forever.

---

## 🧊 Effect 5 — Custom 3D Scene with Spline (No-Code 3D)

> 🖼️ **SCREENSHOT PLACEHOLDER:** The Spline editor interface showing a simple 3D object scene, next to the same scene embedded live on a webpage.

If you want an actual 3D object — a product, an abstract shape, a logo in 3D — without hand-coding Three.js geometry, Spline is the answer. It's a free, visual, drag-and-drop 3D design tool that exports directly to React.

**The workflow, in short steps:**
1. Go to **spline.design**, create a free account
2. Design or pick a template scene (shapes, lighting, camera angle — all visual, no code)
3. Click **Export → React**, copy the generated embed code
4. Paste the embed into your project

**🤖 PROMPT CARD (once you have a Spline export):**
```
Integrate this Spline 3D scene export into [section name] as the
background/hero visual:

[paste the Spline export code]

SPECIFICATIONS:
- The scene should sit behind the text content, not block clicks on
  buttons or links (pointer-events should pass through to content
  below where there's no 3D object directly under the cursor)
- Lazy-load the Spline scene so it doesn't block the initial page
  render — show a simple gradient placeholder until it's loaded
- On mobile, either simplify to a static image fallback or confirm
  performance is acceptable — Spline scenes can be heavy on phones
```

**Callout box:**
> ⚠️ **Mobile performance is the real risk with Spline.** Always test on an actual phone, not just desktop dev tools. A gorgeous 3D scene that makes a phone lag is a worse experience than no 3D scene at all — remember Module 5's mobile-first rule.

---

## 🪄 Effect 6 — Simple Motion (Framer Motion) for Everything Else

> 🖼️ **GIF PLACEHOLDER:** A button subtly scaling on hover, a card lifting slightly on hover — small, simple, satisfying micro-interactions.

Not everything needs GSAP or Three.js. For simple hover states, button presses, and page transitions, **Motion** is faster to write and just as effective.

**🤖 PROMPT CARD:**
```
Using Motion (Framer Motion) for React, add these micro-interactions:

- All buttons: scale to 1.03 on hover, 0.97 on tap, with a spring
  transition (stiffness: 400, damping: 17)
- All cards in [section]: lift with a translateY(-4px) and a subtle
  shadow increase on hover, 200ms ease-out
- Page load: the hero content should fade in and rise 16px over 0.5s,
  starting 0.1s after mount

Keep everything subtle — these are micro-interactions, not the main
visual statement of the page.
```

---

## ⚖️ When to use which — decision flow

> 🖼️ **DIAGRAM PLACEHOLDER:** A simple decision-tree flowchart matching the table below.

| You want... | Use this |
|---|---|
| Text/sections to reveal on scroll | GSAP + ScrollTrigger |
| A subtle moving glow/light in the background | Raw WebGL / Three.js point light |
| The exact "looping video with custom fade" look | The custom JS fade pattern (Effect 3) |
| A frosted/blurred glass UI panel | The `.liquid-glass` CSS class (Effect 4) |
| An actual 3D object or scene | Spline (no-code) or Three.js (code) |
| Simple hover/tap/page-load polish | Motion |

**The most common mistake:** using all six effects on one site. **Don't.** Pick 2-3 that suit the brand. A builder client (Smith Building Co) probably wants restrained scroll reveals and maybe a subtle ambient effect — NOT a liquid-glass nav and a full 3D hero. A creative agency or SaaS product client might want the full liquid-glass + WebGL treatment. Match the effect intensity to the brand, exactly like Module 5 taught you with colour and type.

---

## ⚠️ The performance trap

> 🖼️ **SCREENSHOT PLACEHOLDER:** A PageSpeed Insights result showing a poor score caused by heavy JS, annotated with an arrow pointing at the culprit.

Every effect in this module costs something in load time and performance. Remember Module 12's 90+ PageSpeed target — that target doesn't go away just because you've added Three.js.

**The non-negotiable checklist before shipping any visual effect:**
- [ ] Lazy-load anything 3D or video-based — it shouldn't block initial page render
- [ ] Test PageSpeed Insights again after adding effects — re-check the score, don't assume
- [ ] Test on an actual phone, not just desktop dev tools
- [ ] Respect `prefers-reduced-motion` for accessibility — some visitors have this set deliberately
- [ ] If a single effect tanks the score by more than ~10 points, scale it back or simplify it

**🤖 PROMPT CARD — ask Claude to check this for you:**
```
Review [the component/file] for performance issues related to the visual
effects added. Specifically check: is anything heavy loading on initial
render that could be lazy-loaded instead? Are there any animation loops
that could cause memory leaks if the component unmounts? Does the code
respect prefers-reduced-motion? Flag anything before I deploy this.
```

---

## ✅ PROVE IT — Practical Checkpoint

**Task:** Add at least **3 effects from this module** to your Smith Building Co site. Recommended combination for a builder brand: scroll-triggered reveals (Effect 1) + one ambient or glass touch (Effect 2 or 4) + simple Motion polish (Effect 6).

**Submit:**
- [ ] A short screen-recording (15-30 sec) of your site scrolling, showing the effects in action
- [ ] Your PageSpeed Insights score AFTER adding the effects (still needs to be 90+ — go back and optimise if not)
- [ ] A one-line note on which 3 effects you chose and why they fit Smith Building Co's brand

**Quiz (8 questions, 80% to pass):**

1. Which tool is best for simple hover/tap micro-interactions on a button?
   - a) Three.js
   - b) Raw WebGL shaders
   - c) Motion ✅
   - d) Spline

2. Which tool would you use for an actual 3D object/scene without hand-coding geometry?
   - a) GSAP
   - b) Spline ✅
   - c) Motion
   - d) CSS only

3. In the scroll-reveal prompt, why specify "triggers at 80% into viewport" instead of "when visible"?
   - a) It doesn't matter, both are the same
   - b) "When visible" is vague — AI needs an exact trigger point, same Module 3 specificity principle ✅
   - c) 80% is a hard technical requirement of GSAP
   - d) It only works at exactly 80%

4. Why does the video-loop prompt include "0.55 seconds remain" rather than "fade out near the end"?
   - a) It's an arbitrary number with no real reason
   - b) Specific numbers remove guesswork — this is the same prompting principle from Module 3, pushed further ✅
   - c) CSS requires this exact number
   - d) It only works with whole numbers

5. What's the single most common mistake described in this module?
   - a) Not using enough effects
   - b) Using all the effects on one site instead of picking 2-3 that fit the brand ✅
   - c) Always using Three.js
   - d) Never using CSS

6. Why must you re-check PageSpeed Insights after adding visual effects?
   - a) It's not actually necessary
   - b) Visual effects cost real performance — the 90+ target from Module 12 still applies ✅
   - c) PageSpeed doesn't measure JS-heavy pages
   - d) Only mobile scores matter, not desktop

7. What does `prefers-reduced-motion` relate to?
   - a) A performance setting only
   - b) An accessibility setting some visitors deliberately enable, which effects should respect ✅
   - c) A deprecated CSS property
   - d) A Three.js-only feature

8. For Smith Building Co (a trustworthy, established builder brand), what's the most appropriate effect combination?
   - a) Full liquid-glass UI + 3D hero scene + heavy WebGL
   - b) Restrained scroll reveals + maybe one subtle ambient touch ✅
   - c) No effects at all, ever
   - d) As many effects as technically possible
