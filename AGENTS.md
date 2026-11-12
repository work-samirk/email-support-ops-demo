# AGENTS.md - Email Agent (2.0) demo replica

Read this first. It is a finished, static demo (no build step). Do not rebuild from scratch; edit in place.

## Run
- `cd` into this folder, run `python3 -m http.server 8765`, open http://localhost:8765/index.html (double-clicking index.html also works).
- Needs internet for ECharts 5.5.0 (cdnjs) and the Inter font.

## Files
- `index.html`: loads echarts, `data.js`, `app.js`, `pages2.js`.
- `app.js`: icons, helpers, demo clock, shell (sidebar, top bar), hash router, drawer, Overview, Analytics.
- `pages2.js`: Review Queue + Review Case drawer, Case Explorer + Case Detail drawer, Agent Performance, Reports & Monitoring (Operations Report, Review Activity word diffs), Live Feed, File Upload. Ends with `APP.start()`.
- `styles.css`: all styles (Tailwind-like palette: slate text, blue-600 primary, emerald/amber/red status colours).
- `data.js`: generated file `window.DATA = {rows, daily, heatmap, categoryDistribution, meta}`. Row keys are short: c case, d created (IST, minute), s subject, i intent, k category, u subcategory, y case type, m team, p priority, a auto flag, r review action, l last action, w workflow status, t processing ms, q park reason, e response sent, tl tool, pos/tid lists, mn/me merchant name/email, rb/rt reviewer and reviewed-at, or/fn original and final response.
- `assets/`: logo mark and wordmark.

## Rules
- The data is REAL merchant data, approved only for a local demo. Never commit, push or publish this folder. Delete it after the demo.
- The data generator is not in this package. To change data, edit `data.js` directly (keep the keys above).
- Visual target: numbers and layout match the Ops dashboard screenshots; Overview/Analytics headline numbers are hard-coded in `app.js` (constants like HOURLY, TOPCAT, TEAMS, ESC, TOPSUB) and Review Queue tile numbers in `pages2.js` (STATS, OVR, AVG, P95).
- Demo clock starts at 12 Nov 2026 23:17 IST (`T0` in app.js). Times are IST; dates in data are IST.
- Made up (not in the screenshots): Live Feed, File Upload, Reports tabs Real-Time, Exception, Daily, Weekly.
- Keep it plain HTML/CSS/JS with no build tooling. After edits run `node --check app.js pages2.js` and open every page.
