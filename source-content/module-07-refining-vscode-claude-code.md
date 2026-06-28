# MODULE 7 — Refining in VS Code with Claude Code

**Format:** Short chunks + prompt cards
**Unlocks:** Module 7.5
**Gate to pass:** Module 7 quiz (80%) + practical (refined site, mobile + desktop)

---

## 🖥️ Opening the project + previewing

```bash
code ~/clients/smith-building
```

Right-click your homepage file → **"Open with Live Server"** — auto-refreshes on every save.

> 🔄 Keep Live Server open throughout the build — it's how you see changes in real time.

---

## 🤖 Real refinements with Claude Code

**🤖 PROMPT CARDS — common refinements:**

```
Make the navigation bar sticky, so it stays visible at the top as the
visitor scrolls down.
```

```
On mobile only, increase the padding inside the [section] cards, and
increase the gap between them — they currently feel cramped on a
narrow screen.
```

```
Add a subtle fade-in-and-rise animation to [the specific element] when
the page loads. Keep it under half a second, nothing flashy.
```

```
Review the [reference page]'s spacing, font sizes, and button styles,
and apply the exact same patterns to [target page] so they feel like
the same site.
```

> 🎯 Every one is specific — exact element, exact change, exact constraint. Module 3's anatomy, applied.

---

## 🛠️ Manual tweaks without fear

Not every change needs AI:
- Swapping an image file path
- Changing a piece of copy
- Adjusting a number you can already see

> 🛠️ As you get comfortable, you'll do more manual edits and save Claude Code for bigger structural changes. Both are valid.

---

## 🖼️ Image optimisation checklist

Before any image goes in the project:
- [ ] Compressed via **TinyPNG** or **Squoosh** — under 500KB, ideally much less
- [ ] Renamed descriptively — `kitchen-renovation-thirroul.jpg`, not `IMG_4392.jpg`
- [ ] Has alt text in the code

> 🔗 This connects directly to Module 2 (SEO) and Module 12 (PageSpeed).

---

## ✅ The pre-push checklist

Run this before every push, forever:
- [ ] Every page on **desktop**
- [ ] Every page on **mobile**
- [ ] Every link clicked — nothing broken
- [ ] No placeholder text ("Lorem ipsum," "TODO," leftover brackets)
- [ ] Images optimised and loading

---

## ✅ PROVE IT — Module 7 Quiz + Practical

### Quiz (8 questions, 80% to pass)

1. Difference between Claude Design and Claude Code?
   - a) Identical
   - b) Claude Code edits actual project files; Claude Design generates from blank ✅
   - c) Design is for bug fixes only
   - d) Code can't make visual changes

2. What does Live Server do?
   - a) Deploys to the internet
   - b) Previews locally, auto-refreshing on save ✅
   - c) Compresses images
   - d) Hosts permanently

3. True or False: every change needs an AI prompt.
   - True
   - False ✅

4. Recommended max image file size?
   - a) 5MB
   - b) Under 500KB, ideally less ✅
   - c) No limit
   - d) Exactly 1MB

5. Why rename images descriptively?
   - a) No real benefit
   - b) Helps SEO and finding files later ✅
   - c) Required by Vercel
   - d) Makes the file smaller

6. NOT part of the pre-push checklist?
   - a) Mobile check
   - b) Clicking every link
   - c) Searching for placeholder text
   - d) Posting to social media ✅

7. "On mobile only, increase padding inside services cards" — which principle?
   - a) Vagueness
   - b) Specificity ✅
   - c) Negative examples
   - d) None — weak prompt

8. Why compress images before adding them?
   - a) Purely cosmetic
   - b) Image size is a huge factor in page speed, affecting SEO and conversion ✅
   - c) Looks better compressed
   - d) Not necessary

### Practical Checkpoint

**Submit:**
- [ ] Screenshot of refined site on desktop
- [ ] Screenshot of refined site on mobile
- [ ] A note on 3 refinements you made

**Next: Module 7.5 — Making It Look Like a $50k Site →**
