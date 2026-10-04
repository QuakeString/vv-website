# Volt & Victor

A modernized, static website for Volt & Victor — handcrafted, school-compliant
electronic projects for students in Murshidabad, West Bengal.

Rebuilt from the previous site at https://voltvictor.netlify.app, keeping its
structure and content (services, how-an-order-works, consultation booking,
membership tiers, shop, gallery, team, FAQ, contact) with a refreshed, modern
look.

## Structure

- `index.html` — all page content/sections
- `styles.css` — design tokens (incl. dark mode), layout, components
- `script.js` — theme toggle, mobile nav, scroll reveals, shop cart, WhatsApp-bound forms/links
- `assets/` — logo/favicon

## Running locally

This is a plain static site — no build step. Open `index.html` directly, or
serve the folder, e.g.:

```sh
python3 -m http.server 8000
```

Then visit http://localhost:8000.

## Notes

- All ordering/enquiry actions (cart checkout, forms, membership/subscribe
  buttons) open WhatsApp (+91 86539 84069) with a prefilled message, matching
  the original site's WhatsApp-first flow.
- Shop product list/prices and gallery/team content are placeholders pending
  the real catalog and photos — update `script.js` (`PRODUCTS`) and the
  gallery/team markup in `index.html` once available.
