# MODULE 4: Setting Up Your Toolkit

**Format:** Short chunks + step-by-step screenshots
**Unlocks:** Module 5
**Gate to pass:** HARD GATE: every account/tool must work before continuing

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

Then open a terminal (`` Ctrl+` `` / `` Cmd+` ``) and create your working folder:

<Terminal label="terminal">
$ mkdir -p ~/clients
</Terminal>

> 📁 Every client project lives inside `~/clients/` from here on.

---

## 🐙 GitHub, Git & SSH: the careful one

Sign up at **github.com**, then check Git is installed: `git --version` (Mac usually has it; Windows → git-scm.com).

Configure your identity and generate an SSH key:

<Terminal label="terminal">
$ git config --global user.name "Your Name"
$ git config --global user.email "your@email.com"
$ ssh-keygen -t ed25519 -C "your@email.com"
Generating public/private ed25519 key pair.
Enter file in which to save the key (/Users/you/.ssh/id_ed25519):
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in /Users/you/.ssh/id_ed25519
Your public key has been saved in /Users/you/.ssh/id_ed25519.pub
</Terminal>

Copy the public key to your clipboard. On Mac:

<Terminal label="terminal">
$ cat ~/.ssh/id_ed25519.pub | pbcopy
</Terminal>

On Windows:

<Terminal label="terminal">
$ cat ~/.ssh/id_ed25519.pub | clip
</Terminal>

Paste it into GitHub: **Settings → SSH and GPG keys → New SSH key** → paste → save.

Test the connection:

<Terminal label="terminal">
$ ssh -T git@github.com
Hi yourusername! You've successfully authenticated, but GitHub does not provide shell access.
</Terminal>

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

> 💡 Claude Design and Claude Code aren't separate logins; they're modes within the same account.

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
2. **Domains → Add Domain**: use a subdomain (e.g. `send.yourbusiness.com.au`)
3. Copy the DNS records Resend generates (DKIM, SPF, sometimes DMARC)
4. Add those records at your domain registrar *(full DNS explanation in Module 11)*
5. Wait for **Verified** status (minutes to a few hours)
6. **API Keys → Create** → copy immediately (starts with `re_`), store in a password manager

> 🔑 This is one-time setup. Every future client's contact form reuses this same account; the per-client setup (Module 8) is much shorter.

---

## ✅ PROVE IT: Module 4 Practical Checkpoint (HARD GATE)

**Submit proof for each; do not proceed until all six are ticked:**

- [ ] VS Code opens, Claude Code/Live Server/Prettier all visible in Extensions
- [ ] `~/clients` folder exists (screenshot)
- [ ] `ssh -T git@github.com` returns "successfully authenticated" (screenshot)
- [ ] Vercel shows connected to your GitHub account
- [ ] Claude Project "Smith Building Co" exists
- [ ] Resend shows a sending domain as **Verified**, API key generated

**Next: Module 5: Design That Converts →**
