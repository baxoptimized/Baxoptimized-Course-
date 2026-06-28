# MODULE 13 — On-Page SEO & the Google Stack

**Format:** Short chunks + prompt cards
**Unlocks:** Module 14
**Gate to pass:** Module 13 quiz (80%) + practical (GA4 + GSC screenshots)

---

## 📊 Setting up Google Analytics 4

**Steps:**
1. **analytics.google.com** → Admin → Create → Account (business name)
2. Create a **Property** — AEST/Sydney timezone, AUD currency
3. Choose **Web**, enter the live site URL
4. Copy the **Measurement ID** (`G-...`)
5. Add the snippet to every page (shared layout for Next.js):
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```
6. Set up a **conversion event** for the contact form
7. Add the client — **Editor** for full handover, **Viewer** for ongoing-managed

---

## 🔍 Setting up Google Search Console

1. **search.google.com/search-console** → Add property → **URL prefix**
2. Verify via **HTML tag** or **DNS TXT record** (DNS is more reliable long-term)
3. **Sitemaps** → submit `[yourdomain]/sitemap.xml`

**🤖 PROMPT CARD — Generate a sitemap:**
```
Generate a sitemap.xml file for this Next.js project, including every
page currently in the site. Use [yourdomain] as the base URL.
```

---

## 📍 Google Business Profile — the full setup

**The complete checklist:**
- [ ] Claim/create at **business.google.com**
- [ ] Business name — exact, matching NAP everywhere
- [ ] Primary category — specific ("Home builder," not "Contractor")
- [ ] Address/service area, phone, website URL, hours
- [ ] Description (≤750 chars, natural language, location included)
- [ ] 5+ photos — logo, cover, real work
- [ ] **Q&A pre-populated** — 5-10 questions answered by you as the owner

**🤖 PROMPT CARD — GBP description writer:**
```
Write a Google Business Profile description for [business name], a
[business type] in [location], serving [service area]. Max 750
characters. Natural language, not keyword-stuffed. Include the location
naturally. Match this voice: [brand voice rules].
```

> 💬 Business-owner Q&A answers carry more weight than random user answers — and stop a stranger posting a wrong one first.

---

## 🏷️ LocalBusiness schema markup

**🤖 PROMPT CARD:**
```
Generate LocalBusiness schema markup (JSON-LD) for [business name], a
[business type] in [suburb], [state]. Address: [full address/service
area]. Phone: [phone]. Website: [URL]. Hours: [days/times]. Social:
[Instagram/Facebook URLs]. Output as a single
<script type="application/ld+json"> block for the homepage's <head>.
```

> 🤖 Invisible to visitors, valuable to Google — tells search engines exactly what kind of business this is, machine-readable.

---

## 🔑 Finding keyword clusters

> Cluster for Smith Building Co: "custom home builder Wollongong" + "new home builder Illawarra" + "building companies Wollongong" + "home builders south coast NSW" — one topic, multiple related terms.

**Free ways to find them:** Google the service + location (check autocomplete, "People also ask"), check competitor sites, Google Keyword Planner (free).

> 🔗 Connects to Module 2's Relevance factor. A cluster covers a topic comprehensively, ranking for hundreds of related searches.

---

## 📇 Local citations — the full directory list

**General Australian:** Google Business Profile *(done above)*, Yellow Pages Australia, TrueLocal, Yelp Australia, Hotfrog, StartLocal, Local Business Guide, Aussie Web, Bing Places, Apple Maps Connect.

**Industry-specific:**
| Industry | Directories |
|---|---|
| Builders/trades | HiPages, Oneflare, ServiceSeeking, Houzz, Master Builders Association |
| Health practitioners | HealthEngine, HotDoc, BookPhysio |
| Hospitality | Zomato, TripAdvisor, Broadsheet |

> 🔒 NAP consistency applies to every listing, no exceptions. Vary the description text — don't copy-paste identically.

---

## ⭐ Setting up a review request system

GBP → **"Ask for reviews"** generates a short link.

> Send after every completed job:
>
> "Hi [name], thanks for choosing [business] for your [project]. We'd love a quick Google review — it makes a huge difference for a small business. [LINK]. Takes 30 seconds. Thanks heaps! [Owner]"

> 🚫 **Never incentivise reviews.** Violates Google's policies, risks suspension.

---

## ✅ PROVE IT — Module 13 Quiz + Practical

### Quiz (10 questions, 80% to pass)

1. Should GA4 be set up for every tier?
   - a) Only Growth
   - b) Every tier ✅
   - c) Only if requested
   - d) Never

2. Access level for a full-handover client on GA4?
   - a) Viewer
   - b) Editor ✅
   - c) No access
   - d) Owner of the whole Google account

3. More reliable long-term GSC verification?
   - a) HTML tag
   - b) DNS TXT record ✅
   - c) No difference
   - d) Phone verification

4. Why pre-populate GBP Q&A yourself?
   - a) Required by Google
   - b) Owner answers carry more weight, stop wrong answers first ✅
   - c) No real benefit
   - d) Random answers are better

5. What does schema markup do?
   - a) Changes visual appearance
   - b) Tells search engines what kind of business, machine-readable ✅
   - c) Speeds up the site
   - d) Replaces GBP

6. What's a keyword cluster?
   - a) A single exact phrase
   - b) A group of related search terms around one topic ✅
   - c) A competitor list
   - d) A type of schema

7. The single most important citation rule?
   - a) Max photos
   - b) NAP consistency ✅
   - c) Different name each time
   - d) Google only, skip the rest

8. Acceptable way to ask for a review?
   - a) "Review for 10% off"
   - b) A genuine, free request after a completed job ✅
   - c) Discount for 5 stars
   - d) Write them yourself

9. True or False: citation descriptions should be identical everywhere.
   - True
   - False ✅ *(NAP identical, descriptions vary)*

10. Typical time for the initial citation push?
    - a) 15 min
    - b) 3-4 hours ✅
    - c) A full week
    - d) One-click automated

### Practical Checkpoint

**Submit:**
- [ ] GA4 installed/tracking screenshot
- [ ] GSC verified screenshot
- [ ] Your generated schema markup code
- [ ] One keyword cluster for Smith Building Co

**Next: Module 14 — Editing & Maintaining a Live Site →**
