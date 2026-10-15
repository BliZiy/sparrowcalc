#!/usr/bin/env python3
"""Assemble SparrowCalc pages: shared header/footer + per-page body in parts/.
Run: python3 tools/build.py   (writes *.html in the site root)"""
import pathlib, html
ROOT = pathlib.Path(__file__).resolve().parent.parent
PARTS = ROOT / "tools" / "parts"
BASE = "https://bliziy.github.io/sparrowcalc/"
STORE = "https://payhip.com/Sheetsparrow"
FREE = "https://payhip.com/b/QioZp"

PAGES = [
  # file, nav label, title, description
  ("index.html", "All tools", "SparrowCalc — Free paycheck money tools",
   "Free, private paycheck budgeting calculators: 1st & 15th bill planner, biweekly 3-paycheck month finder, and debt snowball vs avalanche. Runs in your browser."),
  ("semi-monthly.html", "1st & 15th planner", "Semi-Monthly Paycheck Bill Planner (1st & 15th) — SparrowCalc",
   "Free semi-monthly budget calculator. Enter your net pay and bills with due dates; see which bills come out of the 1st vs the 15th paycheck and what's left over."),
  ("three-paycheck.html", "3-paycheck months", "Biweekly 3-Paycheck Month Calculator — SparrowCalc",
   "Free biweekly payday calculator. Enter one payday and a year to list every payday and spot the months with three paychecks."),
  ("debt-compare.html", "Snowball vs avalanche", "Debt Snowball vs Avalanche Calculator — SparrowCalc",
   "Free debt payoff calculator. Compare the snowball and avalanche methods for up to 5 debts: months to debt-free and total interest."),
]

LOGO = ('<svg class="brand-mark" viewBox="0 0 64 64" aria-hidden="true">'
        '<circle cx="32" cy="32" r="30" fill="#8FA98F"/>'
        '<path d="M14 38c6-14 20-20 32-16 4 1 6 4 6 4l-6 2c-2 9-12 15-24 13l-8 7 2-8c-1-1-2-1-2-2z" fill="#1F3A5F"/>'
        '<path d="M24 36c6-1 12-5 15-10-2 8-8 13-17 14z" fill="#D9A441"/>'
        '<circle cx="45" cy="27" r="1.8" fill="#FAF6EC"/></svg>')

FAVICON = ("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E"
           "%3Ccircle cx='32' cy='32' r='30' fill='%238FA98F'/%3E"
           "%3Cpath d='M14 38c6-14 20-20 32-16 4 1 6 4 6 4l-6 2c-2 9-12 15-24 13l-8 7 2-8c-1-1-2-1-2-2z' fill='%231F3A5F'/%3E%3C/svg%3E")

def header(current, title, desc):
    cur = ' aria-current="page"'
    nav = "".join(
        f'<a href="{f}"{cur if f == current else ""}>{label}</a>'
        for f, label, _, _ in PAGES)
    canon = BASE + ("" if current == "index.html" else current)
    return f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{html.escape(title)}</title>
<meta name="description" content="{html.escape(desc)}">
<link rel="canonical" href="{canon}">
<meta property="og:type" content="website">
<meta property="og:site_name" content="SparrowCalc">
<meta property="og:title" content="{html.escape(title)}">
<meta property="og:description" content="{html.escape(desc)}">
<meta property="og:url" content="{canon}">
<meta name="theme-color" content="#1F3A5F">
<link rel="icon" href="{FAVICON}">
<link rel="stylesheet" href="styles.css">
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<header class="site-header">
  <div class="wrap">
    <a class="brand" href="index.html">{LOGO}<span><span class="brand-name">SparrowCalc</span><span class="brand-tag">Free paycheck money tools</span></span></a>
    <nav class="nav" aria-label="Tools">{nav}</nav>
  </div>
</header>
"""

FOOTER = f"""
<footer class="site-footer">
  <div class="wrap">
    <p class="disclaimer"><strong>Please note:</strong> SparrowCalc is for personal budgeting only. It is not financial, tax, or legal advice, and results are estimates based on what you enter. Check important numbers with your lender, employer, or a qualified professional. Designed with the help of AI tools.</p>
    <div class="links">
      <a href="index.html">All tools</a>
      <a href="{STORE}" rel="noopener">Sheetsparrow spreadsheet store</a>
      <a href="{FREE}" rel="noopener">Free simple monthly budget</a>
    </div>
    <p>Private by design: everything is calculated in your browser. Nothing you type is sent or stored anywhere. No ads, no tracking.</p>
    <p>&copy; <span id="year">2026</span> SparrowCalc by Sheetsparrow.</p>
  </div>
</footer>
<script src="common.js"></script>
"""

def build():
    for f, _, title, desc in PAGES:
        body = (PARTS / f).read_text()
        (ROOT / f).write_text(header(f, title, desc) + body + FOOTER + "</body>\n</html>\n")
        print("wrote", f)
    urls = "".join(f"  <url><loc>{BASE}{'' if f=='index.html' else f}</loc></url>\n" for f, *_ in PAGES)
    (ROOT / "sitemap.xml").write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' + urls + "</urlset>\n")
    (ROOT / "robots.txt").write_text(f"User-agent: *\nAllow: /\nSitemap: {BASE}sitemap.xml\n")
    print("wrote sitemap.xml robots.txt")

if __name__ == "__main__":
    build()
