# MODULE 12 — Pre-Launch QA & Going Live

**Format:** Short chunks + checklist
**Unlocks:** Module 13
**Gate to pass:** Practical — run the full checklist against your live site

---

## 📋 The full pre-launch checklist

Run this before ANY site goes live, every time, no exceptions:

- [ ] Every page loads on desktop and mobile
- [ ] All links work — no broken links or placeholder URLs
- [ ] Contact form sends to the correct email (tested live, not just locally)
- [ ] Phone number clickable on mobile (`tel:` links)
- [ ] Images optimised (under 500KB each)
- [ ] All images have descriptive alt text
- [ ] Meta titles set, every page (under 60 chars)
- [ ] Meta descriptions set, every page (under 155 chars)
- [ ] GA4 tracking on every page *(Module 13)*
- [ ] Search Console verified *(Module 13)*
- [ ] Sitemap.xml exists and submitted *(Module 13)*
- [ ] Favicon set
- [ ] robots.txt exists, doesn't block anything important
- [ ] SSL working — `https://` with no warnings
- [ ] PageSpeed Insights 90+ on mobile
- [ ] ABN/business details in footer (if wanted)
- [ ] Privacy policy page (optional, increasingly expected)

> 📋 **This exact checklist becomes your capstone rubric (Module 15).** Get comfortable with it now.

---

## ⚡ Running PageSpeed Insights and fixing what it flags

**Most common culprits, in order:**
1. An unoptimised image that slipped through (Module 7)
2. A slow third-party script
3. Render-blocking resources

> 🎯 The workflow: run it, read what's actually flagged, fix that specific thing, re-test. Don't guess.

---

## 🚀 The launch sequence

1. Confirm the domain (Module 11) is fully connected
2. Run the checklist one more time — **on the real domain**, not `.vercel.app`
3. Test the contact form one final time on the live domain

**The handover email:**
> Subject: Your website is live!
>
> "Your site is live — here's the link: [domain]. Have a look and let me know if you spot anything."

> ✉️ Keep it simple. The site speaks for itself.

---

## 🔑 Handover vs. ongoing management

> 🔧 The technical build is identical either way. What changes is purely who holds the keys afterward — a business decision, covered in Operator-level training, not a technical skill this course needs to teach differently.

---

## ✅ PROVE IT — Module 12 Practical Checkpoint

**Submit:**
- [ ] Completed checklist, every applicable item ticked
- [ ] Screenshot of PageSpeed mobile score (must be 90+)
- [ ] Confirmation the contact form was tested on the live domain

> If your score is below 90: identify the specific flagged issue, fix it, re-test before submitting.

**Next: Module 13 — On-Page SEO & the Google Stack →**
