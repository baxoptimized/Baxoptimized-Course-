# MODULE 1: How the Internet and Websites Actually Work

**Format:** Short chunks + diagrams
**Unlocks:** Module 2
**Gate to pass:** Module 1 quiz, 80%

---

## 🌐 What a website actually is

A website is not magic. It's just **files** (HTML, CSS, JavaScript, and images) sitting on a computer that never turns off. That computer is called a **server**.

<URLBar url="smithbuildingco.com.au" label="What a visitor types into their browser" />

Behind that simple address bar, five things happen every single time someone visits a page, always in the same order:

1. You type a domain into your browser.
2. The browser asks **DNS** (think of it as the internet's phone book) "where does this domain actually live?"
3. DNS replies with an **IP address**, the numeric location of the server that hosts the site.
4. The browser asks that server for its files.
5. The server sends the files back, and the browser assembles them into the page you see on screen.

> 🖼️ **DIAGRAM PLACEHOLDER:** The request-response loop, five steps in a circle: Browser asks DNS → DNS replies with IP → Browser requests files → Server sends files → Browser renders page

> 💡 Once this loop actually clicks, nothing later in the course feels like magic. DNS, hosting, and deployment are all just this same five-step loop happening under the hood.

---

## 🧱 The four moving parts

Every website, no matter how simple or complex, is built from exactly four pieces. Learn these four, and you can diagnose almost any "my site is broken" problem in under a minute.

> 🖼️ **DIAGRAM PLACEHOLDER:** The four moving parts in sequence: Domain → DNS records → Hosting → Code

| Part | What it actually is | Real example |
|---|---|---|
| **Domain** | The human-readable address people type into the browser | `smithbuildingco.com.au` |
| **DNS records** | The instructions that point a domain at a host | An A record, a CNAME record |
| **Hosting** | The server that stores and serves the files | Vercel |
| **Code** | The actual HTML, CSS, and JavaScript | What you'll build in this course |

> 🛠️ **Troubleshooting rule:** if a site is broken, the cause is always one of these four things. Check them in this exact order (domain, then DNS, then hosting, then code) and you'll find the problem almost every time.

---

## 🦴 Front-end vs back-end

Think of a website like a body. Three layers stack on top of each other to build what you see and interact with:

> 🖼️ **DIAGRAM PLACEHOLDER:** Three layers stacked: Skeleton, HTML → Skin and clothes, CSS → Muscles, JavaScript

| Language | Analogy | What it actually does |
|---|---|---|
| **HTML** | Skeleton | Structure: headings, paragraphs, buttons. The bones of the page. |
| **CSS** | Skin & clothes | Colour, fonts, spacing, layout. Everything that makes it look good. |
| **JavaScript** | Muscles | Interactivity: anything that moves, reacts, or responds to a click. |

Everything in that table runs in the visitor's own browser. That's why it's called the **front-end**.

The **back-end** is different: it's code that runs on a server, not in the visitor's browser, and the visitor never sees it directly. A good example is sending an email when someone submits a contact form. A browser can *display* that form, but it physically cannot send an email by itself: something on a server has to do that part. You'll build exactly this in Module 8.

---

## ☁️ "The cloud," servers, and CDNs: demystified

> ☁️ **"The cloud" is just someone else's computer that you're renting space on.** There's no magic involved. It's a physical machine sitting in a data centre somewhere, doing the same job your own laptop could do if it never switched off and had a permanent internet connection.

A **CDN** (Content Delivery Network) solves one specific problem: if your server lives in one city, a visitor on the other side of the world has to wait for data to travel that whole distance before the page can load. A CDN copies your site's files to servers in many cities around the world, so every visitor gets served from whichever copy is physically closest to *them*.

> 🖼️ **DIAGRAM PLACEHOLDER:** CDN routing in sequence: Visitor in Sydney → Nearest CDN node, Sydney → Fast page load

Vercel, the hosting platform this course is built on, does this automatically. Zero setup, on every site, every single time.

---

## ⚔️ Why this stack beats WordPress on shared hosting

| | WordPress + shared hosting | Next.js → GitHub → Vercel |
|---|---|---|
| Security | Plugins create constant vulnerabilities | Minimal attack surface: far less that can go wrong |
| Backups | Manual, and often forgotten | Every Git commit is automatically a backup point |
| Speed | Shared server resources, often slow | Global CDN, fast by default |
| Breaking changes | A single plugin update can break the whole site | Tested code with easy rollback to any earlier version |
| SSL (the padlock / https) | Often needs manual setup | Automatic and free |

> 🗣️ **The client question you'll get:** "Why not just use WordPress?" Now you have a real, structural answer instead of just a preference.

---

## ⚡ Next.js vs plain HTML/CSS/JS

| | Plain HTML/CSS/JS | Next.js |
|---|---|---|
| Best for | A single simple page, or a quick mockup | Real, multi-page client sites |
| SEO performance | Requires manual work | Strong by default |
| Works with Vercel | Only with manual setup | Built by the same company that makes Vercel |
| **This course's default** | Used only in this module, to understand the basics | **Used from Module 6 onward** |

> ✅ From Module 6 onward, every project in this course is built in Next.js. That's the professional standard you're working toward.

---

## ✅ PROVE IT: Module 1 Quiz

You've now covered the five-step request loop, the four moving parts of any website, front-end vs back-end, what "the cloud" and CDNs really are, and why this course's stack beats WordPress on shared hosting. This quiz checks that it's actually stuck: you need 80% to move on to Module 2.

1. Put the loop in order: [Server sends files] [Browser asks DNS] [Browser requests files] [DNS replies with IP] [Browser renders page]
   - Correct: Browser asks DNS → DNS replies with IP → Browser requests files → Server sends files → Browser renders page

2. What is DNS?
   - a) A type of server hardware
   - b) The internet's phone book: matches domains to IP addresses ✅
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

**Next: Module 2, How Websites Get Found →**
