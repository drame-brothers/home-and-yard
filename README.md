# Drame Brothers Home & Yard — Website

## File Structure

```
/
├── index.html           Landing page (hero, about, services, footer)
├── home-cleaning.html   Home cleaning estimate form (full pricing logic)
├── small-business.html  Small business cleaning inquiry (placeholder)
├── yard-garden.html     Yard & garden inquiry (placeholder)
├── style.css            Shared styles — colors, fonts, layout for all pages
├── images/              Your photos go here
│   ├── hero.jpg              Landing page background (1600px+ wide recommended)
│   ├── home-cleaning.jpg     Service card photo (portrait orientation)
│   ├── small-business.jpg    Service card photo (portrait orientation)
│   └── yard-garden.jpg       Service card photo (portrait orientation)
└── README.md            This file
```

---

## Adding Your Photos

Photos are referenced in `index.html` in the `<style>` block near the top.
Replace the placeholder filenames with your own:

```css
.hero          { background-image: url('images/hero.jpg'); }
.scard-cleaning { background-image: url('images/home-cleaning.jpg'); }
.scard-business { background-image: url('images/small-business.jpg'); }
.scard-yard    { background-image: url('images/yard-garden.jpg'); }
```

Until you add photos, the service cards will show the dark olive color as a placeholder
— no broken images, no errors.

---

## Changing Colors or Fonts

Open `style.css`. At the very top is the `:root` block with every color variable.
Change values there and the update applies across the entire site automatically.

```css
:root {
  --olive:   #3d4228;  /* dark background, buttons */
  --gold:    #c8b560;  /* accent color, highlights  */
  --cream:   #f2ead8;  /* text on dark backgrounds  */
  /* etc. */
}
```

---

## Updating Your Apps Script URL

When you deploy (or redeploy) your Google Apps Script, you get a new URL.
That URL needs to be updated in **three places** — one per service page:

- `home-cleaning.html` — search for `YOUR_APPS_SCRIPT_URL_HERE`
- `small-business.html` — same
- `yard-garden.html` — same

Replace the placeholder string with your URL in all three files.

---

## Updating Contact Info

Contact details (email, phone) appear in two places on each page:
- The page header / hero area
- The footer

Search for `929-274-2102` or `drame.home.yard@gmail.com` across all files to find and update them.

---

## Deploying to GitHub Pages

1. Create a repository on GitHub (e.g. `drame-brothers-site`)
2. Upload all files — keep the folder structure exactly as shown above
3. Go to Settings → Pages → Source: main branch, / (root) → Save
4. Your site will be live at `https://yourusername.github.io/drame-brothers-site/`

## Adding a Custom Domain Later

1. Buy a domain (e.g. `dramebrothers.com`) from Namecheap or similar (~$12/year)
2. In GitHub: Settings → Pages → Custom domain → enter your domain → Save
3. At your domain registrar, add these DNS records:
   ```
   A    @    185.199.108.153
   A    @    185.199.109.153
   A    @    185.199.110.153
   A    @    185.199.111.153
   ```
4. GitHub handles HTTPS automatically — wait up to 24 hours for it to activate

---

## Building Out the Remaining Service Pages

When you're ready to add full pricing logic to `small-business.html` or
`yard-garden.html`, the process is the same as the home cleaning page:

1. Define the pricing factors and add-ons
2. Build the form fields in HTML
3. Add the `calcPrice()` function in JavaScript
4. Connect it to the Apps Script (already set up)

The shared stylesheet (`style.css`) already has all the form field styles,
so new pages will match automatically.
