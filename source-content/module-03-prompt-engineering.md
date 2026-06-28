# MODULE 3 — Talking to AI: Prompt Engineering Mastery

**Format:** Short chunks + real prompt examples
**Unlocks:** Module 4
**Gate to pass:** Module 3 quiz (80%) + practical (fix 3 bad prompts)

> 🎯 **The most important module in the course.** Everything from here on, you do *through* AI. How well you talk to it determines how good your sites are.

---

## 🧠 How AI actually works (just enough)

AI predicts, piece by piece, what a useful response looks like, based on everything you've given it.

> 🧠 **Fact 1: Specificity narrows the guess.** Clearer prompt = more accurate result.
> 🧠 **Fact 2: Confident doesn't mean correct.** AI can sound certain and still be wrong. Always check.

Every technique in this module exists because of these two facts.

---

## 🔬 The anatomy of a great prompt

> 🖼️ **DIAGRAM PLACEHOLDER:** A real prompt, colour-coded by section — six highlight colours over Role / Context / Task / Constraints / Format / Examples.

| Part | Answers | Example fragment |
|---|---|---|
| **Role** | Who should AI act as? | "An experienced web designer who specialises in trade businesses..." |
| **Context** | What's the situation? | "Smith Building Co is a custom home builder in Wollongong..." |
| **Task** | What exactly do you want? | "Build a homepage with a hero, 3 service highlights, a contact CTA" |
| **Constraints** | What must it avoid? | "AU English. No stock-photo clichés." |
| **Format** | How should output look? | "Output as a single Next.js page component" |
| **Examples** | Show, don't just tell | A reference site, a "don't do this" example |

> 💡 Not every prompt needs all six — a quick question doesn't need a "role." But for anything substantial, hitting most of these is what gets it right the first time.

---

## ⭐ The 5 Baxoptimized prompting principles

1. **Be specific, not vague.** "Make it professional" → "Clean two-column layout, navy and white, photography-led"
2. **Give positive AND negative examples.** "Like a modern builder site — NOT like a generic stock-photo template"
3. **Encourage step-by-step reasoning.** "Walk me through what's causing this error before fixing it"
4. **Request specific output formats.** Tell it exactly what shape you want the answer in
5. **Iterate, don't restart.** "Keep everything, but make the CTA bigger" — not throwing away an 80%-right result

> 🔁 You'll use every one of these for the rest of this course — and the rest of your career.

---

## 🤖 Claude Projects vs Design vs Code

> 🖼️ **SCREENSHOT PLACEHOLDER:** Side-by-side of Claude Projects, Claude Design, and Claude Code interfaces, each labelled.

| Tool | For | When |
|---|---|---|
| **Claude Projects** | Persistent context across chats | Set up per client, used throughout |
| **Claude Design** | Generating from a blank description | Module 6 — building from scratch |
| **Claude Code** | Editing existing project files | Module 7 onward — every refinement |

> 🎯 **Rule of thumb: Claude Design to create from blank. Claude Code to refine what exists.**

---

## 🐛 Debugging with AI

**Three rules:**
1. **Paste the exact error message**, word for word — never summarise
2. **Describe expected vs. actual behaviour** — "I expected X, instead Y happened"
3. **Ask it to explain before fixing anything**

**🤖 PROMPT CARD:**
```
I expected [what should happen] when [the action].
Instead, [what actually happened].

Here's the exact error message:
[paste the full error text]

Before you fix anything, explain what you think is causing this.
```

---

## 📚 How to use this course's Prompt Library

- Every prompt has `[bracketed placeholders]` — always fill them in
- Every prompt has an annotation explaining *why* it's built that way — read these
- Some prompts have **AHPRA-safe variants**, clearly flagged — use the right one for health practitioner clients

---

## 🚫 What NOT to do

- ❌ **Blindly trusting output** — confident ≠ correct
- ❌ **Vague prompts** — specificity is your job, not AI's
- ❌ **Accepting code you don't understand** — if you can't explain it, ask before using it

> ⚠️ Direct well AND check the work. Skip either half and you ship things you can't stand behind.

---

## ✅ PROVE IT — Module 3 Quiz + Graded Practical

### Quiz (10 questions, 80% to pass)

1. Why does AI sometimes confidently state something incorrect?
   - a) It's deliberately lying
   - b) It's predicting a plausible answer — plausible isn't always correct ✅
   - c) Only old models do this
   - d) It never happens

2. The six parts of a prompt's anatomy?
   - a) Role, Context, Task, Constraints, Format, Examples ✅
   - b) Title, Body, Footer, Header, Style, Length
   - c) Intro, Detail, Summary, Action, Tone, Length
   - d) Subject, Verb, Object, Adjective, Adverb, Noun

3. True or False: every prompt needs all six parts.
   - True
   - False ✅

4. Value of a negative example ("NOT like a generic template")?
   - a) Confuses the AI
   - b) Narrows the result by ruling out a direction ✅
   - c) Should never be used
   - d) No effect

5. Tool to generate a brand-new page from blank?
   - a) Claude Code
   - b) Claude Design ✅
   - c) Claude Projects
   - d) None

6. Tool to refine an existing project?
   - a) Claude Design
   - b) Claude Code ✅
   - c) Claude Projects
   - d) None

7. Most important thing to include when debugging?
   - a) "It's not working"
   - b) The exact, word-for-word error message ✅
   - c) Your guess, no error
   - d) Nothing

8. Why ask AI to explain before fixing?
   - a) Wastes time
   - b) Catches a wrong diagnosis early, teaches you what was wrong ✅
   - c) Only for advanced devs
   - d) AI can't explain reasoning

9. What to do with `[bracketed placeholders]`?
   - a) Leave as is
   - b) Delete, leave blank
   - c) Replace with real details before sending ✅
   - d) Decoration only

10. The most damaging mistake from this module?
    - a) Using AI at all
    - b) Shipping code you don't understand and can't explain ✅
    - c) Asking too many questions
    - d) Using Claude Design instead of Code

### Graded Practical — Fix 3 Bad Prompts

Rewrite each using the anatomy + at least 2 principles:
1. *"Make a website for a builder."*
2. *"Fix my contact form, it's broken."*
3. *"Write some content for my homepage."*

**Self-check for each rewrite:**
- [ ] Specific context included
- [ ] A concrete, specific task
- [ ] At least one constraint or format instruction
- [ ] A stranger reading it would know exactly what output to expect

**Next: Module 4 — Setting Up Your Toolkit →**
