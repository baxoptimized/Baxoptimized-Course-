# MODULE 10 — Deploying to Vercel

**Format:** Short chunks + step-by-step screenshots
**Unlocks:** Module 11
**Gate to pass:** HARD GATE — submit your live .vercel.app URL

---

## ⬆️ Importing the repo into Vercel

**Steps:**
1. Vercel dashboard → **"Add New..." → "Project"**
2. Find `smith-building` in your connected GitHub repos
3. **Import**

---

## ⚙️ Project settings — don't skip the env vars

| Setting | Action |
|---|---|
| Project name | Becomes your URL — leave or customise |
| Framework preset | Auto-detected as Next.js — leave it |
| Root directory | Default |
| Build settings | Default for Next.js |

**⚠️ Critical — Environment Variables.** Add the same two from `.env.local` (Module 8):
```
RESEND_API_KEY=re_your_key
LEAD_TO_EMAIL=client@theiremail.com.au
```

> 🚨 **The #1 thing beginners forget.** `.env.local` is intentionally NOT pushed to GitHub. Vercel never sees those values unless you add them manually here. Skip this and your live form silently fails.

---

## 🌍 The deploy

1. Click **Deploy** (30-60 seconds)
2. Click your live URL (`smith-building.vercel.app`)
3. **Check it on your phone too**

> 🌍 This is genuinely live on the internet right now. Anyone, anywhere.

---

## 🔁 How auto-deploy works

```bash
git add .
git commit -m "Updated homepage headline"
git push
# Vercel auto-detects this and redeploys within ~60 seconds
```

> 🔀 **Preview deployments:** pushing to a non-`main` branch creates a separate preview URL — perfect for showing a client a change before it goes live.

---

## ⏪ Rolling back when something breaks

1. Vercel → **Deployments** tab
2. Find the last working deployment
3. Three dots → **"Promote to Production"**
4. Old version is instantly live again while you fix the issue calmly

> 🔗 This is Module 9's commit history, paying off for real.

---

## ✅ PROVE IT — Module 10 Practical Checkpoint (HARD GATE)

**Submit:**
- [ ] Your live `.vercel.app` URL
- [ ] Screenshot of the site loading on a phone
- [ ] Confirmation both environment variables are set in Vercel
- [ ] Re-test the contact form on the LIVE url, screenshot the received email

**Quiz (6 questions, 80% to pass):**

1. Why doesn't Vercel automatically know your env var values?
   - a) Doesn't support them
   - b) `.env.local` is intentionally not pushed to GitHub for security ✅
   - c) Hardcoded into the code
   - d) Not needed in production

2. What triggers an auto-redeploy?
   - a) Manually clicking redeploy every time
   - b) A new push to the connected branch ✅
   - c) Refreshing the dashboard
   - d) A daily schedule

3. What's a preview deployment?
   - a) Deleted after 24 hours
   - b) A unique URL for non-main branch pushes, separate from live ✅
   - c) Testing without ever deploying
   - d) Same as production

4. Fastest fix if a deploy breaks the live site?
   - a) Delete and restart
   - b) Find the last working deployment, "Promote to Production" ✅
   - c) Wait for support
   - d) No way to undo

5. True or False: always check a new deploy from your phone too.
   - True ✅
   - False

6. The real value of Git's commit history?
   - a) None, just record-keeping
   - b) It's the actual safety net for rollbacks ✅
   - c) Only matters for big teams
   - d) Slows down deployment

**Next: Module 11 — Linking the Domain & Email →**
