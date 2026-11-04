# Grader Media: website

First-draft homepage for **Grader Media Pty Ltd**, corporate and B2B video and photography in Perth, WA.

Grader Media runs and operates out of Nevverland Studios, Landsdale (https://nevverlandstudios.com); the brands are kept visually separate.

Plain static HTML/CSS with a few lines of vanilla JS. No build step, no dependencies. Same set-up as nevverlandstudios.com (static files on Netlify).

## Structure

```
index.html            Homepage (all sections)
404.html              Not-found page (Netlify serves it automatically)
favicon.svg           Split-G favicon (plus favicon-32.png, apple-touch-icon.png)
robots.txt            Points to sitemap
sitemap.xml           One URL for now; add pages as they're built
netlify.toml          Publish dir ".", no build, security + cache headers
assets/css/styles.css All styles (palette + fonts documented at the top)
assets/js/main.js     Mobile menu toggle + footer year
assets/img/og-home.png 1200x630 social share card with the logo
assets/img/gm-*.svg   Logo files (master set in ../brand/)
```

## Run locally

Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8080
```

## Deploy (Netlify)

1. Push this folder to a GitHub repo (this folder as the repo root).
2. Netlify: Add new site > Import from Git > choose the repo.
3. Build command: leave empty. Publish directory: `.` (already set in `netlify.toml`).
4. Add the custom domain under Domain management once it's registered.

## Design

- Palette: Navy `#0B1220` (base), Graphite `#111A2E`, Steel `#18233B`, Line `#22304D`, Paper `#F2F5FA`, grey-blue `#8FA3BF`, brand blue `#2F6BFF`.
- Contrast (WCAG AA): white on `#2F6BFF` is 4.50:1, just under AA, so buttons use `#2B62F0` (5.1:1), hover `#2152D6`. Small blue text on navy uses `#5B8CFF` (5.9:1). Brand `#2F6BFF` is kept for the logo, fills, bullets and borders.
- Type: **Archivo** (headings, semi-expanded width 112–125%) and **IBM Plex Sans** (body), via Google Fonts.
- Deliberately different from austingrader.com (weddings) and nevverlandstudios.com (navy/cream, Bricolage Grotesque).

## Outstanding TODOs

Search the code for `TODO` to find each one.

- **Quote form:** posts to Formspree (form "Grader Media Quote", endpoint `https://formspree.io/f/xdeeynwr`, account hello@austingrader.com, free plan, 50 submissions/month). Submissions email hello@austingrader.com. `main.js` submits with fetch and shows the inline success message; without JS Formspree shows its own thank-you page. Honeypot field is `_gotcha`; `_subject` sets the email subject. Netlify Forms is no longer used.
- **Domain:** canonical, Open Graph URLs, `robots.txt` and `sitemap.xml` assume `https://www.gradermedia.com.au`.
- **Logos:** the client strip is text; swap in monochrome logo files (with permission).
- **Hero video:** `assets/video/hero-loop.webm` / `.mp4` (13.4 s muted loop, 1600×900, no audio) with `assets/img/hero-poster.webp` / `.jpg` (the reel's first frame). The loop is seven hard-cut snippets from different jobs (playground aerial, industrial training, junior football, early learning, commercial property, client function, school sport) with a light shared grade and no on-screen text. Reduced-motion visitors see the poster only.
- **Featured work images:** real stills in `assets/img/work/` (WebP + JPG fallback). Confirm each client is happy to be shown, and link cards to case studies once written. The two `grid-*` cards are agency work via The Grid: keep end clients unnamed and only use frames with no end-client logos, badges or signage. The grid is 4 columns on desktop, 2 on tablet and 1 on mobile, so keep the card count a multiple of 4 (or 2 at minimum).
- **Logo:** done (split G, Archivo Expanded ExtraBold outlined to paths).
- **OG image (optional):** `assets/img/og-home.png` is a logo card; a frame from real work would do better.
- **Socials:** LinkedIn, Instagram, YouTube and Vimeo icons link to `#`.
- **Phone / Calendly / ABN:** not shown yet; slots marked in the contact section and footer.
- **Street address (optional):** JSON-LD lists Landsdale WA 6065 (Nevverland Studios); add the street address if wanted.
- **Copy to confirm:** "fixed quote", "one round of feedback" and white-label agency work.
