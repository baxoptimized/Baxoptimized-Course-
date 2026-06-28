# MODULE 1 — How the Internet and Websites Actually Work

**Format:** Short chunks + diagrams
**Unlocks:** Module 2
**Gate to pass:** Module 1 quiz, 80%

---

## 🌐 What a website actually is

A website is just **files** — HTML, CSS, JavaScript, images — sitting on a computer that's always switched on. That computer is called a **server.**

> 🖼️ **DIAGRAM PLACEHOLDER:** *The Request/Response Loop* — five labelled steps in a circle: Browser → DNS lookup → IP address returned → Request sent to server → Files sent back → Browser renders page.

**The five-step loop, every visit, every time:**
1. You type a domain into your browser
2. Browser asks **DNS** (the internet's phone book) "where does this live?"
3. DNS replies with an **IP address**
4. Browser asks that server for its files
5. Server sends the files, browser builds the page

> 💡 Once you really get this, the "magic" disappears from everything later — DNS, hosting, deployment, all of it is just this loop.

---

## 🧱 The four moving parts

> 🖼️ **DIAGRAM PLACEHOLDER:** Four boxes in sequence — Domain → DNS Records → Hosting → Code — with small icons for registrar, signpost, server, and file.

| Part | What it is | Example |
|---|---|---|
| **Domain** | The address people type | smithbuildingco.com.au |
| **DNS records** | Instructions pointing the domain at the host | An A record, a CNAME |
| **Hosting** | The server storing and serving files | Vercel |
| **Code** | The actual HTML/CSS/JS | What you build |

> 🛠️ **Troubleshooting rule:** if a site's broken, it's always one of these four. Check in order: domain → DNS → hosting → code. You'll find it almost every time.

---

## 🦴 Front-end vs back-end

> 🖼️ **DIAGRAM PLACEHOLDER:** A simple figure split into three layers — Skeleton (HTML), Skin/Clothes (CSS), Muscles (JavaScript) — next to a separate box labelled "Back-end: happens on a server, never seen directly."

| Language | Analogy | Does what |
|---|---|---|
| **HTML** | Skeleton | Structure — headings, paragraphs, buttons |
| **CSS** | Skin & clothes | Colour, fonts, spacing, layout |
| **JavaScript** | Muscles | Interactivity — anything that moves or responds |

**Front-end** = what the browser shows and runs. **Back-end** = what happens on a server the visitor never sees — like sending an email when a form is submitted (you'll see this for real in Module 8).

---

## ☁️ "The cloud," servers, and CDNs — demystified

> ☁️ **"The cloud" just means someone else's computer that you're renting space on.** No magic.

> 🖼️ **DIAGRAM PLACEHOLDER:** World map with server icons in multiple cities, showing a Sydney visitor served from a nearby node, not a distant one.

A **CDN** copies your site's files to servers worldwide, so visitors get served from whichever copy is physically closest. Vercel does this automatically — zero setup, every site, every time.

---

## ⚔️ Why this stack beats WordPress on shared hosting

| | WordPress + shared hosting | Next.js → GitHub → Vercel |
|---|---|---|
| Security | Plugins = constant vulnerabilities | Minimal attack surface |
| Backups | Manual, often forgotten | Every Git commit = a backup point |
| Speed | Shared resources, often slow | Global CDN, fast by default |
| Breaking changes | Plugin updates break things | Tested code, easy rollback |
| SSL | Often manual | Automatic, free |

> 🗣️ **The client question you'll get:** "Why not just use WordPress?" Now you've got a real, structural answer.

---

## 🆚 Next.js vs plain HTML/CSS/JS

| | Plain HTML/CSS/JS | Next.js |
|---|---|---|
| Best for | A single simple page, quick mockups | Real multi-page client sites |
| SEO performance | Manual work | Strong by default |
| Works with Vercel | Manually | Built by the same company |
| **This course's default** | Used only for understanding basics | **Used from Module 6 onward** |

> ✅ From Module 6 on, everything is built in Next.js. That's the real standard.

---

## ✅ PROVE IT — Module 1 Quiz

*(10 questions, 80% to pass)*

1. Put the loop in order: [Server sends files] [Browser asks DNS] [Browser requests files] [DNS replies with IP] [Browser renders page]
   - Correct: Browser asks DNS → DNS replies with IP → Browser requests files → Server sends files → Browser renders page

2. What is DNS?
   - a) A type of server hardware
   - b) The internet's phone book — matches domains to IP addresses ✅
   - c) A programming language
   - d) A security certificate

3. Which of the four moving parts is the actual HTML/CSS/JS?
   - a) Domain
   - b) DNS records
   - c) Hosting
   - d) Code ✅

4. Correct troubleshooting order if a site won't load?
   - a) Code → hosting → DNS → domain
   - b) Domain → DNS → hosting → code ✅
   - c) Random order
   - d) Always assume code first

5. Match: HTML, CSS, JavaScript → Skeleton, Skin & clothes, Muscles
   - HTML=Skeleton, CSS=Skin&clothes, JS=Muscles ✅

6. True or False: a browser alone can send an email when a form is submitted.
   - True
   - False ✅ *(needs the back-end)*

7. What does "the cloud" actually mean?
   - a) Special wireless internet
   - b) Someone else's computer you're renting space on ✅
   - c) A backup system only
   - d) A programming language

8. What does a CDN do?
   - a) Encrypts your site automatically
   - b) Serves files from whichever server is physically closest to the visitor ✅
   - c) Writes code for you
   - d) Registers domains

9. Name one real structural reason Next.js → GitHub → Vercel is more secure than WordPress on shared hosting.
   - Sample answers: "Fewer plugins = fewer vulnerabilities," "No database to hack"

10. From which module does this course build exclusively in Next.js?
    - a) Module 1
    - b) Module 3
    - c) Module 6 ✅
    - d) Module 10

**Next: Module 2 — How Websites Get Found →**
