# Volt & Victor website

Static site (plain HTML, CSS and JavaScript, no build step) for Volt & Victor,
handcrafted electronics projects and components for students in Murshidabad,
West Bengal. Every order and form opens WhatsApp with the details filled in.

## Files

- `index.html`: the whole page (hero photo wall, services, shop, portfolio, team, FAQ, contact)
- `styles.css`: design tokens plus all styles, light and dark
- `script.js`: Light/Dark/System switch, shop and portfolio filters, cart, WhatsApp links
- `images/`: the 23 project photos used in the hero wall and portfolio
- `assets/favicon.svg`

## Publish on Netlify

Add new site > Import an existing project > pick this repo > leave the build
command empty and set the publish directory to `/`. Or drag the folder onto
https://app.netlify.com/drop.

## Edit

- WhatsApp number: `WHATSAPP_NUMBER` at the top of `script.js`
- Shop prices: each `.product` card in `index.html`
- Team and FAQ: the `#about` and `#faq` sections in `index.html`
