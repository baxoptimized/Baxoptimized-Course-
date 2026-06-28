# MODULE 14 — Editing & Maintaining a Live Site

**Format:** Short chunks + prompt cards
**Unlocks:** Module 15 (the capstone)
**Gate to pass:** Practical — make 3 specified edits and push them live

---

## 🔁 The edit workflow — the cycle you'll use forever

1. **Pull** latest: `git pull origin main`
2. **Edit** (manually or with Claude Code)
3. **Preview** locally with Live Server
4. **Commit and push:**
```bash
git add .
git commit -m "Updated phone number on contact page"
git push
```
5. **Verify** on the live site (30-60 sec after push)
6. **Confirm** to the client: "Done — have a look and let me know."

> 🔁 This exact cycle handles every edit request, forever — for the rest of your career.

---

## 🤖 Common edits with Claude Code

**🤖 PROMPT CARDS:**

```
Update the phone number on [page] to [new number].
```

```
Add a new project card to the Work page. The project is [type] in
[location] — use [the image filename you just added], with the caption
"[Project Type] — [Location]."
```

```
Change the [specific element] to: [new text]. Keep everything else
about [that section] exactly as it is.
```

> 🎯 Specific about exactly what to change AND what to leave alone — every time, even for tiny edits.

---

## 🛡️ Working safely

- ✅ **Always preview locally before pushing** — even for tiny edits
- ✅ **Hard refresh after checking live** — `Cmd+Shift+R` / `Ctrl+Shift+R`, to avoid a cached view
- ✅ **Quick before-push checklist:** desktop + mobile checked, links work, no placeholder text, images load

> ⚠️ Complacency on "small" edits is exactly when something unexpected breaks.

---

## 💾 Backing up and rolling back

```bash
# See recent changes
git log --oneline

# Roll back a specific file to a previous commit
git checkout abc1234 -- filename.html

# Or safely undo the most recent commit
git revert HEAD
```

> 🛡️ GitHub IS your backup. Every version, forever. You never lose work — you go back to the last point everything worked.

---

## ✅ PROVE IT — Module 14 Practical Checkpoint

**Task:** Make 3 edits, following the cycle above:
1. Change the contact phone number
2. Add a placeholder project photo + caption to the Work page
3. Update the homepage hero headline

**Submit:**
- [ ] Screenshot of the site **before**
- [ ] Screenshot of the site **after**, live
- [ ] Your 3 commit messages (`git log --oneline`)

**Self-check:**
- [ ] Each edit previewed locally before pushing
- [ ] Hard refresh done to confirm live changes
- [ ] Commit messages are specific, not "updates"

**Next: Module 15 — The Capstone →**
