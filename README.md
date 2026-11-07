# remidelight.com

The website for **Transformative Success Synergies**, written by Remi DeLight.

## How to publish a new essay

1. In GitHub, open the `src/posts` folder.
2. Click **Add file → Create new file**.
3. Name it with dashes and `.md` at the end, e.g. `comfort-is-not-the-enemy.md`.
   The name becomes the web address: `remidelight.com/essays/comfort-is-not-the-enemy/`
4. Paste this at the top, fill it in, then write the essay underneath:

```
---
title: "Your essay title"
description: "One sentence that sums it up."
excerpt: "Two or three sentences shown on the home page when this is the newest essay."
category: "Learning"
date: 2026-11-21
closingQuestion: "A question for readers to think about (optional — delete this line if not needed)."
---

Your first paragraph goes here.

## A section heading

More writing. Use *italics* and **bold** like this.

> A quote or key line goes in a box like this.
```

5. Click **Commit changes**. Netlify rebuilds the site and the essay is live in about a minute.

The newest essay (by `date`) automatically becomes the featured essay on the home page.

## Changing other things

- **Site name, author, contact email, "Coming up" list:** `src/_data/site.json`
- **Email sign-up:** put your Buttondown username in `buttondownUsername` in `src/_data/site.json`. While it's empty, the sign-up box shows the contact email instead.
- **Colors and fonts:** `src/css/style.css` (the colors are at the top)
- **About page:** `src/about.njk`

## Technical notes

Built with [Eleventy](https://www.11ty.dev/). Netlify runs `npm run build` and publishes the `_site` folder (see `netlify.toml`). To preview locally: `npm install` then `npm start`.
