# MODULE 9 — Version Control & Pushing to GitHub

**Format:** Short chunks + real commands
**Unlocks:** Module 10
**Gate to pass:** HARD GATE — submit your GitHub repo link with the site pushed

---

## 🎮 What Git and GitHub actually are

> 🖼️ **DIAGRAM PLACEHOLDER:** A timeline of commits, like video game save points, one highlighted as "roll back to here if something breaks."

> 🎮 **Git = save points in a video game. GitHub = where those save points live online.** Every commit is a snapshot of your whole project, with a message describing what changed.

This is real insurance — if you break something, roll back to the last good save point.

---

## 🔒 Creating a private repo

**Steps:**
1. **github.com** → "+" → **"New repository"**
2. Name `smith-building` (lowercase, hyphens)
3. Set to **Private**
4. Don't tick "Add a README file"
5. Create → copy the **SSH** URL (not HTTPS)

> 🔒 Always Private for client work.

---

## 🚀 The first push

```bash
# Initialise Git
git init

# Stage all files
git add .

# Create the first commit (save point)
git commit -m "Initial site build"

# Set the main branch
git branch -M main

# Connect to your GitHub repo (use the SSH URL)
git remote add origin git@github.com:yourusername/smith-building.git

# Push everything up
git push -u origin main
```

> 🖱️ **Prefer clicking?** VS Code's Source Control panel (branch icon, left sidebar) does the same thing through buttons.

---

## ✍️ Good commit messages

| ✅ Good | ❌ Bad |
|---|---|
| "Added new project: harbour renovation" | "Updates" |
| "Fixed contact form email address" | "Stuff" |
| "Updated hero section copy" | "asdfasdf" |

> ⏱️ A good message costs ten seconds, saves real time later.

---

## 🆘 When it goes wrong

**Common error — "rejected, remote contains work you don't have":**
```bash
git pull origin main
git push
```

**🤖 PROMPT CARD — Git error debugging:**
```
I got this exact error when running [the command you ran]:

[paste the full error text]

Before you tell me the fix, explain what's actually causing this.
```

> 🔗 Same debugging principle as Module 3 — paste the exact error, ask for an explanation before a fix.

---

## ✅ PROVE IT — Module 9 Practical Checkpoint (HARD GATE)

**Submit:**
- [ ] Link to your GitHub repository
- [ ] Confirm it's **Private**
- [ ] Screenshot of all project files present in the repo
- [ ] At least 2 commits with proper messages (screenshot of `git log --oneline`)

**Quiz (6 questions, 80% to pass):**

1. What is a Git commit?
   - a) Permanently deletes files
   - b) A snapshot of the whole project, with a message ✅
   - c) A type of hosting
   - d) An error message

2. What does `git add .` do?
   - a) Adds a file to the internet
   - b) Stages all changed files for the next commit ✅
   - c) Deletes everything
   - d) Pushes directly to GitHub

3. Client repos should be?
   - a) Public
   - b) Private ✅
   - c) Doesn't matter
   - d) Public after launch

4. Which is a good commit message?
   - a) "Stuff"
   - b) "Fixed contact form email address" ✅
   - c) "Updates"
   - d) "asdfasdf"

5. Fix for "rejected, remote contains work you don't have"?
   - a) Delete the repo and restart
   - b) `git pull origin main`, then push again ✅
   - c) Ignore it
   - d) Create a new repo

6. What should you do with an unfamiliar Git error?
   - a) Guess randomly
   - b) Paste it into Claude Code, ask for an explanation first ✅
   - c) Restart your computer
   - d) Delete the project

**Next: Module 10 — Deploying to Vercel →**
