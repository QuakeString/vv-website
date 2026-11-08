# Disabled pages

`admin.html` is parked here so it is no longer served at `/admin.html`.
To bring the shop admin back, move it to the site root:

    git mv disabled/admin.html admin.html

Note: its relative links (`assets/favicon.svg`, `index.html`, `styles.css`, scripts) assume the site root, so it must live there to work.
