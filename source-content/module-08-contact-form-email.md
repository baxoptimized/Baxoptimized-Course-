# MODULE 8 — The Contact Form & Email System

**Format:** Short chunks + code walkthrough
**Unlocks:** Module 9
**Gate to pass:** HARD GATE — submit proof the form sent a real email

> ⚠️ **A beautiful site with a silently-failing form is worse than no website.** This never ships broken.

---

## 🔗 How a contact form actually works

> 🖼️ **DIAGRAM PLACEHOLDER:** Five-step flow — Visitor fills form (front-end) → Submits → Route handler (back-end, Vercel) → Resend → Client's inbox (reply-to = the lead).

Form → route handler → Resend → client's inbox → client replies directly to the lead. Every site, forever, uses this exact path.

---

## ⚙️ Per-client Resend setup (the short version)

The big one-time setup happened in Module 4. This is the short, per-project repeat:

```bash
npm install resend
```

Create `.env.local`:
```
RESEND_API_KEY=re_your_key_from_module_4
LEAD_TO_EMAIL=client@theiremail.com.au
```

> 🔑 `RESEND_API_KEY` never changes per client. `LEAD_TO_EMAIL` changes every time.
> ⏭️ We'll add both again in Vercel in Module 10 — local and production both need them.

---

## 🧩 The route handler

> 🖼️ **CODE WALKTHROUGH PLACEHOLDER:** Annotated screenshot of the file below, each section colour-coded to the table.

**File: `app/api/contact/route.js`**

```js
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  try {
    const { name, email, phone, message, interest, company } = await req.json();

    // Honeypot: bots fill the hidden "company" field, humans never see it.
    if (company) return Response.json({ ok: true });

    if (!name || !email) {
      return Response.json({ ok: false, error: 'Missing name or email' }, { status: 400 });
    }

    await resend.emails.send({
      from: 'New Website Enquiry <forms@yourdomain.com.au>',
      to: [process.env.LEAD_TO_EMAIL],
      replyTo: email,
      subject: `New enquiry${interest ? ` — ${interest}` : ''} from ${name}`,
      text:
        `New website enquiry:\n\n` +
        `Name: ${name}\nEmail: ${email}\nPhone: ${phone || '-'}\n` +
        `Interest: ${interest || '-'}\n\nMessage:\n${message || '-'}\n`,
    });

    return Response.json({ ok: true });
  } catch (err) {
    console.error('Resend error:', err);
    return Response.json({ ok: false, error: 'Send failed' }, { status: 500 });
  }
}
```

| Part | Does what |
|---|---|
| `new Resend(...)` | Connects using your API key |
| `company` honeypot | Silently ignores bot submissions |
| Name/email check | Stops a broken email from sending |
| `from` | Your verified domain, never the client's |
| `to` | The client's inbox |
| `replyTo` | The lead's email — client replies straight to them |

> 🧠 You should be able to explain every line before using it. If a line doesn't make sense, ask Claude to explain it.

---

## 🔌 Wiring up the front-end form

**🤖 PROMPT CARD:**
```
Wire up the contact form on the Contact page to POST to /api/contact as
JSON. Include a hidden honeypot field named "company" — visually hidden
using CSS positioning (not type="hidden", since bots skip that), with
aria-hidden="true". On success, show a clear success message. On
failure, show an error asking them to call instead. Include an
"interest" field set to "online" so we know this lead came from the
website.
```

**The honeypot pattern (for reference):**
```html
<input type="text" name="company" tabindex="-1" autocomplete="off"
       style="position:absolute;left:-9999px" aria-hidden="true" />
<input type="hidden" name="interest" value="online" />
```

> 🤖 **Why not `type="hidden"`?** Bots specifically skip those. CSS-hiding still looks like a normal field to a script, while real visitors never see it.

---

## 🛡️ Spam protection — why it works

> 🛡️ The honeypot catches the vast majority of basic bots, free, with zero friction for real visitors. If a client's form ever gets hit harder (rare for small local business sites), **Cloudflare Turnstile** is the free next step up.

---

## 🧪 Testing it properly — the moment that matters

1. `npm run dev`
2. Fill out the form with real test details, submit
3. Confirm success message
4. Check the **`LEAD_TO_EMAIL` inbox** — including **spam** on this first test
5. Confirm sender = your verified domain, reply-to = your test email

**If it doesn't arrive — check in order:**
- [ ] Is `RESEND_API_KEY` correct?
- [ ] Is `LEAD_TO_EMAIL` set and spelled right?
- [ ] Does Resend still show **Verified**?
- [ ] Any error in the terminal?

---

## ✅ PROVE IT — Module 8 Practical Checkpoint (HARD GATE)

**Submit:**
- [ ] Screenshot of the success message
- [ ] Screenshot of the real received email (sender, subject, body visible)
- [ ] Confirmation spam folder was checked

**Quiz (6 questions, 80% to pass):**

1. What does the honeypot catch?
   - a) Slow connections
   - b) Automated bots filling forms ✅
   - c) Spelling errors
   - d) Broken images

2. Why is `replyTo` the visitor's email, not the owner's?
   - a) A mistake
   - b) Client can reply directly to the lead with one click ✅
   - c) Resend requires it
   - d) No real purpose

3. True or False: `RESEND_API_KEY` changes per client.
   - True
   - False ✅

4. What DOES change per client in Resend setup?
   - a) The API key
   - b) `LEAD_TO_EMAIL` ✅
   - c) Nothing
   - d) The sending domain

5. Why check spam on the first test?
   - a) Not necessary
   - b) New sending relationships sometimes land in spam initially ✅
   - c) Doesn't apply to business email
   - d) Resend always sends to spam first

6. If the test email never arrives, what's the right approach?
   - a) Assume Resend is broken
   - b) Check each part of the chain in order ✅
   - c) Resubmit 20 times
   - d) No way to troubleshoot

**Next: Module 9 — Version Control & Pushing to GitHub →**
