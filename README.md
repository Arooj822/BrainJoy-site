# BrainJoy — Deployment Guide

This is a plain HTML/CSS site — no build step, no framework. You can host it for free and connect your existing domain.

## Files
- `index.html` — homepage
- `post-phd-crisis.html`, `post-plastic-to-hydrogen.html` — sample blog posts
- `about.html`, `contact.html`
- `styles.css` — shared styling

To add a new post: duplicate one of the post HTML files, change the title/content, then add a card for it in `index.html`'s `.grid` section.

## Option A: Netlify (easiest)
1. Go to https://app.netlify.com and sign up free.
2. Drag and drop this whole folder onto the Netlify dashboard ("Deploy manually").
3. Your site goes live instantly on a netlify.app URL.
4. Go to **Site settings → Domain management → Add a custom domain**, enter your domain.
5. Netlify will show you DNS records to add. Log into wherever you bought your domain (e.g. Hostinger) and add those records under DNS settings.
6. Wait 15 minutes–24 hours for DNS to propagate. Free SSL (https) is automatic.

## Option B: GitHub Pages
1. Create a free GitHub account and a new repository (e.g. `brainjoy-site`).
2. Upload all the files in this folder to the repository.
3. Go to **Settings → Pages**, set source to the `main` branch, root folder.
4. Under **Settings → Pages → Custom domain**, enter your domain and save (this creates a `CNAME` file automatically).
5. At your domain registrar, add a CNAME record pointing to `yourusername.github.io`, or the A records GitHub provides for apex domains.
6. Enable "Enforce HTTPS" once DNS is verified.

## Then: Google AdSense
Once your site is live on your own domain with a few real posts, an About page, and a Contact page (all included here):
1. Go to https://adsense.google.com and sign up with your domain.
2. Add the AdSense verification snippet to the `<head>` of each HTML page when they give it to you.
3. Wait for review — approval depends on original content and a working site, not on how you're hosting it.

## Your details (already set up in this version)
- Domain: brainjoy.site
- Contact email: info@brainjoy.site
- Logo: `logo.png` is already wired in as both the nav logo and the site favicon.

## Notes
- Keep adding real, original posts regularly — AdSense and search traffic both reward consistency far more than volume.
- When you add a new post file, make sure it also includes the `<link rel="icon" href="logo.png" ...>` line in the head, and the same nav/footer block, so the branding stays consistent site-wide. Easiest way: always start from `post-template.html`.
