# MODULE 11 — Linking the Domain & Email

**Format:** Short chunks + step-by-step screenshots
**Unlocks:** Module 12
**Gate to pass:** Module 11 quiz (80%)

---

## 🔁 Domains and DNS, revisited

> 🔗 Nothing about your code changes in this module. This is purely DNS — pointing a real domain at the Vercel project you already deployed.

---

## 🛒 Buying a .com.au domain

- **Requires an ABN** (eligibility rule for `.au`)
- Registrars: **VentraIP, Crazy Domains**
- Cost: ~$20-30/year
- Optionally grab the matching `.com` too (~$15-20/year)

---

## ➕ Adding the domain in Vercel

1. Vercel → project → **Settings → Domains**
2. Enter the domain — add **both** root and `www` versions
3. Vercel displays the exact DNS records needed

> ⚠️ **Always copy DNS values directly from Vercel's current screen** — never from memory or an old document, including this course. These values can change over time.

---

## 📝 Adding A and CNAME records

**Root domain:**
| Field | Value |
|---|---|
| Type | A |
| Name | `@` (or blank) |
| Value | The IP shown on Vercel's **current** screen |

**www subdomain:**
| Field | Value |
|---|---|
| Type | CNAME |
| Name | `www` |
| Value | The CNAME shown on Vercel's **current** screen |

> ⏳ **DNS propagation:** usually under an hour for `.com.au`, occasionally up to 48 hours.
> 🔒 **SSL provisions automatically** once DNS correctly points at Vercel — no separate action.

---

## ↪️ Handling a secondary .com domain

> 🎯 **Always redirect a secondary domain — never run two separate live sites.** Splitting traffic splits SEO value too.

1. Vercel: add the `.com` + `www.`.com`, set to **redirect** to the `.com.au`
2. At the `.com`'s registrar: same A/CNAME records, pointing at Vercel
3. Redirect runs automatically once DNS resolves

---

## 📧 Professional email vs. the Resend sending domain

Two completely different systems on the same domain:

| | Client's real inbox | Resend sending domain |
|---|---|---|
| What | Normal business email (`info@business.com.au`) | Automated, one-way notification sender |
| Via | Google Workspace, Zoho Mail | Resend (Module 4 + 8) |
| Who uses it | The client, daily | Nobody — it's automated |
| Connects to | `LEAD_TO_EMAIL` from Module 8 | Sends `from` your agency's verified domain |

> 🔑 Don't confuse these when explaining to a client — one's their real inbox, one's the invisible automated system sending them lead notifications.

---

## ⏳ DNS propagation & SSL — what to tell a client

> **The script when a client asks "why isn't it showing yet":**
> "DNS changes are propagating — completely normal, usually resolves within an hour, sometimes up to 48 hours. I'll let you know the moment it's fully live."

> 🔒 SSL is automatic — no separate config, no extra cost.

---

## ✅ PROVE IT — Module 11 Quiz

*(10 questions, 80% to pass — practical work folds into Module 12 due to propagation timing)*

1. What does a `.com.au` domain require?
   - a) A passport
   - b) An ABN ✅
   - c) A US address
   - d) Nothing special

2. Record type for the root domain?
   - a) CNAME
   - b) A record ✅
   - c) MX record
   - d) TXT record

3. Record type for the www version?
   - a) A record
   - b) CNAME ✅
   - c) MX record
   - d) SPF record

4. Where should you always copy DNS values from?
   - a) Memory or an old doc
   - b) Vercel's current screen, at the time ✅
   - c) Any online tutorial
   - d) The client's previous developer

5. How should a secondary `.com` be set up?
   - a) As a second live site
   - b) As a redirect to the primary domain ✅
   - c) Cancelled
   - d) Pointed elsewhere

6. Why redirect instead of two live sites?
   - a) Not necessary
   - b) Splitting traffic splits SEO value too ✅
   - c) Vercel doesn't allow two domains
   - d) Google penalises two-domain businesses

7. True or False: the everyday business inbox and the Resend sending domain are the same system.
   - True
   - False ✅

8. What does `LEAD_TO_EMAIL` point to for a real client?
   - a) The Resend sending domain
   - b) The client's real, everyday inbox ✅
   - c) A placeholder
   - d) Nothing real

9. Typical DNS propagation time for `.com.au`?
   - a) Instant
   - b) Usually under an hour, up to 48 ✅
   - c) Always exactly 48 hours
   - d) Several weeks

10. Does SSL need separate setup once DNS correctly resolves?
    - a) Yes, purchased separately
    - b) No — automatic ✅
    - c) Only on paid plans
    - d) Only if requested

**Next: Module 12 — Pre-Launch QA & Going Live →**
