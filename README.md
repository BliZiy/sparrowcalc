# SparrowCalc: free paycheck money tools

SparrowCalc is a small, free, static website with paycheck budgeting calculators. It's a sister site to the **Sheetsparrow** spreadsheet shop, and each tool links to the matching paid spreadsheet.

Live site: **https://bliziy.github.io/sparrowcalc/** (GitHub Pages from `main` / root, once Pages is turned on)

## Tools
| Page | What it does | Matching product |
|---|---|---|
| `index.html` | The hub: tool list, a short intro, and Sheetsparrow product links | Store |
| `semi-monthly.html` | 1st & 15th bill planner. Bills due on days 1–14 go to the 1st check and days 15–31 go to the 15th check, with a per-bill override. Shows what's left per check and for the month | [Semi-Monthly Budget, $7](https://payhip.com/b/t9Hd8) |
| `three-paycheck.html` | Biweekly payday list for any year from one known payday. Flags 3-paycheck months, 27-pay years, and the optional "extra" money | [Biweekly Budget + Bill Calendar, $7](https://payhip.com/b/NT3nH) |
| `debt-compare.html` | Snowball vs avalanche for up to 5 debts plus an extra monthly payment. Monthly interest (APR/12), minimums roll over, and a 50-year cap catches payments too small to ever pay off the debt | [Debt Snowball & Avalanche, $6](https://payhip.com/b/vD1jB) |

Also: `articles.html` (index) + 3 articles (`third-paycheck-month.html`, `snowball-vs-avalanche.html`, `budgeting-1st-and-15th.html`), and trust pages `about.html`, `privacy.html`, `contact.html` (GitHub Issues; email fallback is a TODO pending approval), `disclosure.html`.

Also linked: [Irregular Income $8](https://payhip.com/b/0X1n7), [Bundle $19](https://payhip.com/b/sR1Xy), [Free budget](https://payhip.com/b/QioZp), and the [Store](https://payhip.com/Sheetsparrow).

## Privacy and tech
- Plain HTML, CSS, and JavaScript. No build step needed to run it, no backend, no cookies, no analytics or tracking, no external fonts, scripts, or CDNs.
- Everything is calculated in the browser. Inputs are never sent or stored anywhere.
- Every page has a disclaimer: it's for personal budgeting only, it's not financial, tax, or legal advice, and it was designed with the help of AI tools.

## Open it locally
- Double-click `index.html`, which works straight from the file system (`file://`), **or**
- Run `python3 -m http.server 8000` in this folder and open http://localhost:8000/

## Editing
The shared header, footer, and SEO meta tags are generated. Edit the page bodies in `tools/parts/*.html` (or the header/footer in `tools/build.py`), then run:

```
python3 tools/build.py
```

This rewrites the root `*.html` files, `sitemap.xml`, and `robots.txt`. `styles.css` and `common.js` are edited directly.

## Deploying (GitHub Pages, $0)
Repo: `BliZiy/sparrowcalc` (public). Go to Settings → Pages → Source "Deploy from a branch" → `main` / `(root)`. `.nojekyll` is included so files are served as they are.

## Making money
- **CTAs only for now:** each tool page has one matching Sheetsparrow spreadsheet CTA plus a bundle mention, and the footer links to the store and the free budget.
- **No AdSense or ad scripts yet.** Revisit that once there's traffic, and it would need BliZi's okay (new account).
- Possible later steps: submit `sitemap.xml` to Google Search Console (needs an account), add more tools (irregular-income buffer, sinking funds, 50/30/20), and pin each tool on the Sheetsparrow Pinterest boards.
