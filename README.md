# Email Agent (2.0) - demo replica (local, private)

Contains REAL merchant data from the two Case Report files (approved by Samir Khan for a local demo). Do not share, publish or commit. **Delete this whole folder after the demo.**

## Run
- Easiest: `cd` into this folder and run `python3 -m http.server 8765`, then open http://localhost:8765/index.html . (Double-clicking index.html also works.)
- Needs internet for two things: the ECharts library (cdnjs, version 5.5.0) and the Inter font. Without internet the charts show a notice.

## Files
- `index.html`, `styles.css`, `app.js` (shell, Overview, Analytics), `pages2.js` (Review Queue, Case Explorer, Agent Performance, Reports & Monitoring, Live Feed, File Upload), `data.js` (generated, 6.4 MB).
- Rebuild the data: `python3 ../tools/build_data.py` (reads `../prototype-data-from-user/*.xlsx`; the flag `REAL = True` keeps real values).

## What is real and what is calibrated
- Real rows: 6,788 cases from the 2 to 12 Nov Case Report (12 Nov file wins on overlaps). Case Explorer, Reports, Review Queue, drawers and Review Activity use them. Times are shown in IST.
- Calibrated to the screenshots (not computed from the files): Overview KPIs, hourly volume, circuit breakers; all Analytics cards and charts for the default period (13 Oct to 12 Nov); Review Queue tiles per date range; Agent Performance numbers; Reports tiles for Today (647 cases etc.).
- Analytics filters and the Daily/Weekly/Monthly toggle re-scale the calibrated series. They are plausible, not exact.
- Per-case pipeline timings: exact for cases 129963653, 129964057 and 129897462 (from the screenshots); other cases get derived timings that add up to their processing time.
- Raw email bodies: only the three pending cases (from the screenshots). Other cases show a note, since the export has no email body.

## Not in the screenshots (made up, simple)
Live Feed, File Upload, and the Real-Time Monitoring, Exception, Daily and Weekly tabs of Reports. Modify Response, Park to SF and Approve & Send only change the local demo state and show a toast. Downloads export CSV.

## Demo clock
The page clock starts at 12 Nov 2026 23:17:00 IST (like the first screenshot) and then runs in real time, so "waiting" times and "Updated" match the screenshots.
