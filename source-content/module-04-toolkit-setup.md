# MODULE 4 — Setting Up Your Toolkit

**Format:** Short chunks + step-by-step screenshots
**Unlocks:** Module 5
**Gate to pass:** HARD GATE — every account/tool must work before continuing

> ⚠️ **This is a hard gate.** Every later module assumes this plumbing already works. Go slowly, especially the Git/SSH step.

---

## 🗺️ The full pipeline, at a glance

> 🖼️ **DIAGRAM PLACEHOLDER:** Claude Design → VS Code (+ Claude Code) → GitHub → Vercel → Live Site, left to right, with logos.

You're setting up every account in this chain, **once.** Every future client project reuses it.

**Checklist for this whole module:**
- [ ] VS Code + Claude Code + Live Server + Prettier
- [ ] GitHub account, Git, SSH set up
- [ ] Vercel account connected to GitHub
- [ ] Claude account + Project created
- [ ] Clients folder structure
- [ ] Resend account + verified sending domain

---

## 💻 Installing VS Code + extensions

**Steps:**
1. **code.visualstudio.com** → download → install with defaults
2. Extensions icon (4 squares) → install **Claude Code**, **Live Server**, **Prettier**
3. Open terminal (`` Ctrl+` `` / `` Cmd+` ``):
```bash
mkdir -p ~/clients
```

> 📁 Every client project lives inside `~/clients/` from here on.

---

## 🐙 GitHub, Git & SSH — the careful one

**Steps:**
1. Sign up at **github.com**
2. Check Git: `git --version` (Mac usually has it; Windows → git-scm.com)
3. Configure identity:
```bash
git config --global user.name "Your Name"
git config --global user.email "your@email.com"
```
4. Generate an SSH key:
```bash
ssh-keygen -t ed25519 -C "your@email.com"
```
5. Copy the public key:
```bash
# Mac
cat ~/.ssh/id_ed25519.pub | pbcopy
# Windows
cat ~/.ssh/id_ed25519.pub | clip
```
6. GitHub → **Settings → SSH and GPG keys → New SSH key** → paste → save
7. Test it:
```bash
ssh -T git@github.com
```
   ✅ You should see: *"Hi [username]! You've successfully authenticated..."*

> 🔑 An SSH key just proves to GitHub it's really you, without typing a password every time. One-time setup, forever.

---

## ▲ Creating a Vercel account

**Steps:**
1. **vercel.com** → **"Continue with GitHub"** (not a separate login)
2. Authorise the connection

> 🔗 Signing up via GitHub is what makes every future deployment automatic.

---

## 🤖 Setting up Claude accounts

**Steps:**
1. Sign up/log in at **claude.ai**
2. Create a new **Project** named "Smith Building Co"

> 💡 Claude Design and Claude Code aren't separate logins — they're modes within the same account.

---

## 📂 The clients folder structure

```
~/clients/
├── smith-building/
├── bayside-physio/
├── coastal-electrical/
```

> 📁 **Naming rule:** lowercase, hyphens. `smith-building`, never `Smith Building Co`.

---

## 📧 Setting up Resend (your email engine)

**Steps:**
1. Sign up at **resend.com** with a dedicated business email
2. **Domains → Add Domain** — use a subdomain (e.g. `send.yourbusiness.com.au`)
3. Copy the DNS records Resend generates (DKIM, SPF, sometimes DMARC)
4. Add those records at your domain registrar *(full DNS explanation in Module 11)*
5. Wait for **Verified** status (minutes to a few hours)
6. **API Keys → Create** → copy immediately (starts with `re_`), store in a password manager

> 🔑 This is one-time setup. Every future client's contact form reuses this same account — the per-client setup (Module 8) is much shorter.

---

## ✅ PROVE IT — Module 4 Practical Checkpoint (HARD GATE)

**Submit proof for each — do not proceed until all six are ticked:**

- [ ] VS Code opens, Claude Code/Live Server/Prettier all visible in Extensions
- [ ] `~/clients` folder exists (screenshot)
- [ ] `ssh -T git@github.com` returns "successfully authenticated" (screenshot)
- [ ] Vercel shows connected to your GitHub account
- [ ] Claude Project "Smith Building Co" exists
- [ ] Resend shows a sending domain as **Verified**, API key generated

**Next: Module 5 — Design That Converts →**
