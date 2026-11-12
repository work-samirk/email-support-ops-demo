/* Email Agent (2.0) - demo replica. Core, Overview, Analytics. Local demo only. */
(function () {
'use strict';
const D = window.DATA || { rows: [], daily: [], heatmap: [], categoryDistribution: [] };
const APP = window.APP = { pages: {}, charts: [] };

const ICONS = {
  home:'<path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  bars:'<path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/>',
  inbox:'<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11L2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  list:'<line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/>',
  zap:'<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  activity:'<polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>',
  file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="M9 15h6"/><path d="m12 12 3 3-3 3" />',
  cloudup:'<polyline points="16 16 12 12 8 16"/><line x1="12" y1="12" x2="12" y2="21"/><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"/>',
  mail:'<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-10 6L2 7"/>',
  checkc:'<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>',
  clock:'<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  trend:'<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>',
  loader:'<path d="M21 12a9 9 0 1 1-6.219-8.56"/>',
  download:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  search:'<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
  cal:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  refresh:'<path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/>',
  down:'<path d="m6 9 6 6 6-6"/>', up:'<path d="m18 15-6-6-6 6"/>', right:'<path d="m9 18 6-6-6-6"/>', left:'<path d="m15 18-6-6 6-6"/>',
  dleft:'<path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/>', dright:'<path d="m13 17 5-5-5-5"/><path d="m6 17 5-5-5-5"/>',
  x:'<path d="M18 6 6 18M6 6l12 12"/>',
  filter:'<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
  pencil:'<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>',
  warn:'<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3"/><path d="M12 9v4M12 17h.01"/>',
  cloud:'<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
  logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
  minus:'<circle cx="12" cy="12" r="10"/><path d="M8 12h8"/>',
  shield:'<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/>',
  send:'<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  msg:'<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z"/>',
  upright:'<path d="M7 7h10v10"/><path d="M7 17 17 7"/>',
  ban:'<circle cx="12" cy="12" r="10"/><path d="m4.9 4.9 14.2 14.2"/>',
  rot:'<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>',
  xc:'<circle cx="12" cy="12" r="10"/><path d="m15 9-6 6M9 9l6 6"/>',
  checksq:'<polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
  timer:'<line x1="10" y1="2" x2="14" y2="2"/><line x1="12" y1="14" x2="15" y2="11"/><circle cx="12" cy="14" r="8"/>',
  upload:'<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
  check:'<polyline points="20 6 9 17 4 12"/>',
  arrow:'<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  cal2:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/><path d="M8 14h.01M12 14h.01M16 14h.01"/>'
};
const I = (n, s = 20, extra = '') => `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ${extra}>${ICONS[n] || ''}</svg>`;
const esc = s => String(s == null ? '' : s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const nf = n => Number(n).toLocaleString('en-US');
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const pad = n => String(n).padStart(2, '0');

/* ---- time (IST). The demo clock starts at 12 Nov 2026 23:17:00 IST ---- */
const T0 = Date.UTC(2026, 10, 12, 17, 47, 0), W0 = Date.now();
const now = () => T0 + (Date.now() - W0);
const toMs = iso => { const [d, t] = iso.split('T'); const [y, m, dd] = d.split('-').map(Number); const [h, mi] = t.split(':').map(Number); return Date.UTC(y, m - 1, dd, h, mi) - 19800000; };
const P = ms => { const x = new Date(ms + 19800000); return { y: x.getUTCFullYear(), mo: x.getUTCMonth(), d: x.getUTCDate(), h: x.getUTCHours(), mi: x.getUTCMinutes(), s: x.getUTCSeconds(), wd: x.getUTCDay() }; };
const clock = ms => { const p = P(ms); return `${pad(p.h)}:${pad(p.mi)}:${pad(p.s)}`; };
const created = ms => { const p = P(ms); const h12 = p.h % 12 || 12; return `${p.d} ${MON[p.mo]}, ${pad(h12)}:${pad(p.mi)} ${p.h >= 12 ? 'pm' : 'am'}`; };
const dmyhms = ms => { const p = P(ms); return `${pad(p.d)}/${pad(p.mo + 1)}/${p.y}, ${pad(p.h)}:${pad(p.mi)}:${pad(p.s)}`; };
const isoDay = ms => { const p = P(ms); return `${p.y}-${pad(p.mo + 1)}-${pad(p.d)}`; };
const dayStart = iso => { const [y, m, d] = iso.split('-').map(Number); return Date.UTC(y, m - 1, d) - 19800000; };
const ago = ms => { const m = Math.floor(ms / 60000); if (m < 1) return 'just now'; if (m < 60) return m + 'm ago'; const h = Math.floor(m / 60); if (h < 24) return h + 'h ' + (m % 60) + 'm ago'; return Math.floor(h / 24) + 'd ' + (h % 24) + 'h ago'; };
const fsec = ms => ms < 1000 ? Math.round(ms) + 'ms' : (ms / 1000).toFixed(1) + 's';
const cap1 = s => s ? s.charAt(0).toUpperCase() + s.slice(1) : s;

const R = D.rows; R.forEach(r => { r.ts = toMs(r.d); });
Object.assign(APP, { D, R, I, esc, nf, $, $$, P, clock, created, dmyhms, isoDay, dayStart, ago, fsec, cap1, now, toMs, MON, DAYS, pad });

/* ---- helpers ---- */
const toast = m => { const t = document.createElement('div'); t.className = 'toast'; t.textContent = m; document.body.appendChild(t); setTimeout(() => t.remove(), 2200); };
APP.toast = toast;
APP.chart = (el, opt) => { if (!window.echarts || !el) { if (el) el.innerHTML = '<div class="empty">Chart library not loaded (needs internet)</div>'; return null; } const c = echarts.init(el, null, { renderer: 'canvas' }); c.setOption(opt); APP.charts.push(c); return c; };
window.addEventListener('resize', () => APP.charts.forEach(c => { try { c.resize(); } catch (e) {} }));
const TT = { backgroundColor: '#fff', borderColor: '#e5e7eb', borderWidth: 1, padding: [8, 12], textStyle: { color: '#111827', fontSize: 12 }, extraCssText: 'box-shadow:0 4px 14px rgba(0,0,0,.12);border-radius:8px' };
const dotc = c => `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${c};margin-right:6px"></span>`;
const AX = { axisLine: { lineStyle: { color: '#e5e7eb' } }, axisTick: { show: false }, axisLabel: { color: '#9ca3af', fontSize: 10 } };
const SL = { lineStyle: { color: '#f1f5f9' } };
APP.TT = TT; APP.dotc = dotc; APP.AX = AX; APP.SL = SL;

/* ---- shell ---- */
const NAV = [['overview', 'Overview', 'home'], ['analytics', 'Analytics', 'bars'], ['review-queue', 'Review Queue', 'inbox'], ['cases', 'Case Explorer', 'list'], ['agents', 'Agent Performance', 'zap'], ['live', 'Live Feed', 'activity'], ['reports', 'Reports & Monitoring', 'file'], ['upload', 'File Upload', 'cloudup']];
const LOGO = '<img src="assets/logo-mark.png" alt="Pine Labs" width="38" height="38" style="margin-left:-6px">';
const pendingRows = () => R.filter(r => r.r === 'pending_review');
APP.pendingRows = pendingRows;
function shell() {
  $('#sidebar').innerHTML = `<div class="logo">${LOGO}<div><b>Pine Labs</b><small>Email Agent (2.0)</small></div></div><nav class="nav">` +
    NAV.map(n => `<a tabindex="0" data-r="${n[0]}">${I(n[2])}<span class="lbl">${n[1]}</span>${n[0] === 'review-queue' ? `<span class="pill" id="navpend">${pendingRows().length} Pending</span>` : ''}${n[0] === 'live' ? '<span class="dot"></span>' : ''}</a>`).join('') +
    `</nav><div class="sfoot">Pine Labs · Email Agent v2.0<i>Powered by Agentic AI</i></div>`;
  $$('#sidebar .nav a').forEach(a => { a.onclick = () => { location.hash = '#/' + a.dataset.r; }; a.onkeydown = e => { if (e.key === 'Enter') a.click(); }; });
}
function topbar(title) {
  $('#topbar').innerHTML = `<h1>${title}</h1><div class="status"><span class="g"><i></i>System Healthy</span><span class="g live"><i></i>Live</span><span class="upd" id="upd">Updated ${clock(now())}</span><div class="user"><div><b>Business Head</b><small>Business_head</small></div>${I('logout', 18)}</div></div>`;
}
setInterval(() => { const u = $('#upd'); if (u) u.textContent = 'Updated ' + clock(now()); }, 30000);
function route() {
  const id = (location.hash.replace('#/', '') || 'overview');
  const pg = APP.pages[id] || APP.pages.overview;
  APP.charts.forEach(c => { try { c.dispose(); } catch (e) {} }); APP.charts = [];
  closeDrawer();
  $$('#sidebar .nav a').forEach(a => a.classList.toggle('active', a.dataset.r === id));
  topbar(pg.title);
  const c = $('#content'); c.innerHTML = pg.render(); c.scrollTop = 0;
  if (pg.mount) pg.mount();
}
window.addEventListener('hashchange', route);

/* ---- drawer ---- */
function openDrawer(html, w) { const d = $('#drawer'); d.style.width = w + 'px'; d.innerHTML = html; $('#ovl').classList.add('show'); requestAnimationFrame(() => d.classList.add('show')); }
function closeDrawer() { $('#drawer').classList.remove('show'); $('#ovl').classList.remove('show'); }
$('#ovl').onclick = closeDrawer;
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeDrawer(); });
APP.openDrawer = openDrawer; APP.closeDrawer = closeDrawer;

/* ---- Overview ---- */
const HOURLY = [7, 5, 5, 1, 7, 2, 1, 2, 6, 10, 12, 56, 49, 57, 44, 74, 66, 97, 71, 48, 44, 19, 3];
const HLAB = ['23:00', ...Array.from({ length: 22 }, (_, i) => pad(i) + ':00')];
const kpi = (l, v, ic, t) => `<div class="card kpi"><div><div class="l">${l}</div><div class="v">${v}</div></div><div class="tile t-${t}">${I(ic, 20)}</div></div>`;
const statusPill = w => `<span class="sp sp-${w}">${w}</span>`;
APP.statusPill = statusPill;
APP.pages.overview = {
  title: 'Overview',
  render() {
    const rec = R.slice(0, 10);
    return `<div class="kpis">${kpi('Emails Processed', 77946, 'mail', 'blue')}${kpi('Success Rate', '99.8%', 'checkc', 'green')}${kpi('Avg Time', '40.9s', 'clock', 'yellow')}${kpi('P95 Time', '85.3s', 'trend', 'purple')}${kpi('In-flight', 0, 'loader', 'sky')}${kpi('Queue Depth', 2, 'inbox', 'orange')}</div>
    <div class="row2"><div class="card pad"><h3>Hourly Processing Volume</h3><div class="sub">Last 24 hours</div><div class="chart" id="c-hour" style="height:300px;margin-top:6px"></div></div>
    <div class="card pad"><h3>Circuit Breakers</h3><div class="sub">Service health</div>${['Azure Openai', 'Salesforce', 'Pineone'].map(s => `<div class="cb"><div class="a"><span><i></i>${s}</span><span>Half-Open</span></div><div class="b"><span>Failures:</span><span>Trips: 0</span></div></div>`).join('')}</div></div>
    <div class="row11"><div class="card pad"><h3>Recent Cases</h3><div class="sub">Latest 10 processed emails</div><table class="t" style="margin-top:10px"><thead><tr><th>Case</th><th>Intent</th><th>Status</th><th style="text-align:right">Time</th></tr></thead><tbody>${rec.map(r => `<tr><td><a data-case="${r.c}" style="cursor:pointer">${r.c}</a></td><td>${esc(r.i)}</td><td>${statusPill(r.w)}</td><td style="text-align:right;color:#6b7280">${fsec(r.t)}</td></tr>`).join('')}</tbody></table></div>
    <div class="card pad"><h3>Category Distribution</h3><div class="sub">Email categories</div><div class="chart" id="c-cat" style="height:360px"></div></div></div>`;
  },
  mount() {
    APP.chart($('#c-hour'), {
      grid: { left: 44, right: 20, top: 16, bottom: 30 },
      tooltip: Object.assign({ trigger: 'axis', axisPointer: { type: 'line', lineStyle: { type: 'dashed', color: '#9ca3af' } }, formatter: p => `<div>${p[0].axisValue}</div><div>${dotc('#3b82f6')}<b>${p[0].value}</b></div>` }, TT),
      xAxis: Object.assign({ type: 'category', data: HLAB, boundaryGap: false }, AX), yAxis: { type: 'value', max: 100, interval: 20, axisLabel: { color: '#9ca3af', fontSize: 10 }, splitLine: SL },
      series: [{ type: 'line', smooth: true, data: HOURLY, symbol: 'circle', symbolSize: 5, lineStyle: { color: '#3b82f6', width: 2 }, itemStyle: { color: '#3b82f6' }, areaStyle: { color: 'rgba(59,130,246,.08)' } }]
    });
    const COL = ['#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#f97316', '#14b8a6', '#6366f1', '#3b82f6'];
    APP.chart($('#c-cat'), {
      color: COL, tooltip: Object.assign({ trigger: 'item', formatter: p => `${p.name}: ${nf(p.value)} (${p.percent}%)` }, TT),
      legend: { type: 'scroll', bottom: 0, itemWidth: 10, itemHeight: 10, icon: 'rect', textStyle: { fontSize: 10, color: '#4b5563' }, pageIconSize: 10 },
      series: [{ type: 'pie', radius: ['54%', '78%'], center: ['50%', '42%'], itemStyle: { borderRadius: 4, borderColor: '#fff', borderWidth: 2 }, label: { show: false }, labelLine: { show: false }, emphasis: { scale: true, label: { show: true, position: 'outside', fontWeight: 'bold', fontSize: 12, color: '#111827' }, labelLine: { show: true } }, data: D.categoryDistribution.map(a => ({ name: a[0], value: a[1] })) }]
    });
    $$('#content [data-case]').forEach(a => a.onclick = () => APP.openCaseDetail && APP.openCaseDetail(a.dataset.case));
  }
};

/* ---- Analytics ---- */
const AN = { from: '2026-10-13', to: '2026-11-12', cat: '', team: '', sub: '', typ: '', gran: 'Daily' };
const TOPCAT = [['Other', 2981, 0, '#6366f1'], ['Hardware Issue', 2570, 340, '#10b981'], ['De- Installation Request', 2413, 840, '#f59e0b'], ['Transaction Related Query', 1330, 540, '#ef4444'], ['EDC Machine Related Issue', 1100, 72, '#8b5cf6']];
const TEAMS = [['Plutus Support', 1126, 38, 657], ['RTT', 0, 359, 737], ['FinOps', 0, 38, 275], ['Deinstallation', 0, 1263, 1046], ['VRM 1', 370, 24, 145], ['Stock', 0, 490, 388], ['TOPS – ACCOUNT CHA...', 0, 0, 38], ['Email Agent', 14, 20, 96], ['No Action Required', 0, 0, 0], ['BPCL RTT', 53, 175, 206]];
const ESC = [['Deinstallation', 1263, '#ef4444'], ['Stock', 490, '#f97316'], ['RTT', 359, '#fb923c'], ['BPCL RTT', 175, '#eab308'], ['FinOps', 38, '#84cc16'], ['CS VAS', 28, '#22c55e'], ['Plutus Support', 38, '#14b8a6'], ['Email Agent', 20, '#06b6d4'], ['VRM 1', 24, '#3b82f6'], ['UPI Hub - Merchant', 12, '#6366f1']];
const TOPSUB = [['Other', 2981, 0], ['Deinstallation', 2208, 705], ['EDC Machine not Working', 1044, 72], ['Paper Roll Reactive Request', 853, 247], ['Transaction/ Settlement report shared', 815, 431]];
const uniq = k => [...new Set(R.map(r => r[k]).filter(Boolean))].sort();
function anRange() {
  const a = dayStart(AN.from), b = dayStart(AN.to) + 86400000;
  let days = D.daily.filter(x => { const t = dayStart(x.d); return t >= a && t < b; });
  let f = 1;
  const m = R.filter(r => (!AN.cat || r.k === AN.cat) && (!AN.team || r.m === AN.team) && (!AN.sub || r.u === AN.sub) && (!AN.typ || r.y === AN.typ));
  if (AN.cat || AN.team || AN.sub || AN.typ) f = Math.max(m.length, 1) / R.length;
  return { days, f, full: !AN.cat && !AN.team && !AN.sub && !AN.typ && AN.from === '2026-10-13' && AN.to === '2026-11-12' };
}
function group(days, g) {
  if (g === 'Daily') return days.map(x => ({ k: x.d.slice(5).replace('-', '/'), vol: x.vol, con: x.con, esc: x.esc, def: x.def }));
  const map = new Map();
  days.forEach(x => { const d = new Date(x.d + 'T00:00:00Z'); let key; if (g === 'Weekly') { const wd = (d.getUTCDay() + 6) % 7; const s = new Date(d.getTime() - wd * 86400000); key = pad(s.getUTCMonth() + 1) + '/' + pad(s.getUTCDate()); } else key = MON[d.getUTCMonth()]; if (!map.has(key)) map.set(key, { k: key, vol: 0, c: 0, e: 0, def: 0 }); const o = map.get(key); o.vol += x.vol; o.c += x.vol * x.con; o.e += x.vol * x.esc; o.def += x.def; });
  return [...map.values()].map(o => ({ k: o.k, vol: o.vol, con: +(o.c / o.vol).toFixed(1), esc: +(o.e / o.vol).toFixed(1), def: o.def }));
}
const mcard = (l, v, c, ic, t) => `<div class="card mc"><div><div class="l">${l}</div><div class="v">${v}</div><div class="c">${c}</div></div><div class="tile t-${t}">${I(ic, 18)}</div></div>`;
function anKpis() {
  const { days, f, full } = anRange();
  const tot = Math.round(days.reduce((s, x) => s + x.vol, 0) * f);
  const inter = full ? 19140 : Math.round(tot * 19140 / 19511);
  const auto = full ? 3170 : Math.round(days.reduce((s, x) => s + x.vol * x.con / 100, 0) * f);
  const fcr = tot ? (full ? 16.3 : +(auto / tot * 100).toFixed(1)) : 0;
  const defl = full ? 1735 : Math.round(days.reduce((s, x) => s + x.def, 0) * f);
  const escr = tot ? (full ? 12.5 : +(days.reduce((s, x) => s + x.vol * x.esc, 0) / days.reduce((s, x) => s + x.vol, 0)).toFixed(1)) : 0;
  const inM = [mcard('Coverage Volume', tot, inter + ' interactions', 'inbox', 'blue'), mcard('Interaction Vol.', inter, 'Excl. no-action', 'msg', 'indigo'), mcard('Auto Resolve', fcr + '%', auto + ' resolved', 'shield', 'green'), mcard('Deflections', defl, (tot ? (defl / tot * 100).toFixed(1) : 0) + '% successful', 'send', 'cyan'), mcard('Response Time (P95)', '137.5s', 'P90: 86.6s', 'clock', 'yellow'), mcard('Flow Completion', '50.3%', 'Completed / Total', 'checkc', 'teal'), mcard('Avg QRCs / Interaction', '1.02', 'Queries per session', 'list', 'purple')];
  const outM = [mcard('Containment (FCR)', fcr + '%', 'First Contact Resolution', 'checkc', 'red'), mcard('Avg Handling Time', '60.8s', 'Completed cases', 'timer', 'sky'), mcard('Escalation Rate', escr + '%', 'Requires human agent', 'upright', 'green'), mcard('Fallback Rate', '0.0%', 'SOP fallback used', 'warn', 'green'), mcard('Case Accuracy', '90.4%', 'Correctly tagged cases', 'checksq', 'green'), mcard('Drop-off Rate', '0.0%', 'Pipeline errors', 'xc', 'green'), mcard('Repeat Rate', '0.0%', 'Same POS within 7 days', 'rot', 'orange'), mcard('No-Action Rate', '1.9%', 'Auto-generated emails', 'ban', 'grey')];
  return { tot, html: `<div class="sec">INPUT METRICS</div><div class="mrow" style="grid-template-columns:repeat(7,1fr)">${inM.join('')}</div><div class="sec">OUTPUT METRICS</div><div class="mrow" style="grid-template-columns:repeat(8,1fr)">${outM.join('')}</div>` };
}
function sel(id, label, opts, val) { return `<select class="inp sel" id="${id}" style="width:auto;min-width:130px"><option value="">${label}</option>${opts.map(o => `<option${o === val ? ' selected' : ''}>${esc(o)}</option>`).join('')}</select>`; }
APP.pages.analytics = {
  title: 'Analytics',
  render() {
    return `<div style="display:flex;justify-content:space-between;align-items:flex-start"><div><h1 style="margin:0;font-size:22px">Business Analytics</h1><div style="color:#6b7280;font-size:13px;margin-top:2px">Support Bot KPIs · Email Channel <span id="an-total">(19,511 total cases)</span></div></div><button class="btn" id="an-exp">${I('download', 16)} Export ${I('down', 14)}</button></div>
    <div class="card pad" style="margin:16px 0"><div style="display:flex;align-items:center;gap:10px;flex-wrap:wrap"><span style="font-size:11px;letter-spacing:.07em;color:#9ca3af">PERIOD</span>${['Today', '7 Days', '30 Days', 'MTD'].map(b => `<button class="btn sm" data-p="${b}" style="background:#f3f4f6;border-color:#f3f4f6;font-size:12px">${b}</button>`).join('')}<input class="inp" type="date" id="an-from" value="${AN.from}" style="width:160px"><span style="color:#9ca3af">to</span><input class="inp" type="date" id="an-to" value="${AN.to}" style="width:160px"></div>
    <div style="display:flex;align-items:center;gap:12px;margin-top:14px;flex-wrap:wrap">${sel('an-ch', 'Email', ['Email'], '')}${sel('an-typ', 'Case Type', uniq('y'), AN.typ)}${sel('an-cat', 'Category', uniq('k'), AN.cat)}${sel('an-sub', 'Subcategory', uniq('u'), AN.sub)}${sel('an-team', 'Team', uniq('m'), AN.team)}<span style="flex:1"></span><div class="seg" id="an-gran">${['Daily', 'Weekly', 'Monthly'].map(g => `<button class="${g === AN.gran ? 'on' : ''}">${g}</button>`).join('')}</div><button class="btn" id="an-ref" style="width:40px;padding:0;justify-content:center">${I('refresh', 16)}</button></div></div>
    <div id="an-kpi"></div>
    <div class="row2" style="margin:20px 0 24px"><div class="card pad"><h3>Containment &amp; Escalation Trend</h3><div class="sub" id="an-subt">${AN.gran.toLowerCase()} view</div><div class="chart" id="c-trend" style="height:340px"></div></div><div class="card pad"><h3>Response Latency</h3><div class="sub">Percentile distribution</div><div class="chart" id="c-lat" style="height:340px"></div></div></div>
    <div class="row11"><div class="card pad"><h3>Top Categories by FCR</h3><div class="sub">Category resolution breakdown</div><div class="chart" id="c-topcat" style="height:330px"></div></div><div class="card pad"><h3>Team Distribution</h3><div class="sub">Assignment &amp; resolution by team</div><div class="chart" id="c-team" style="height:330px"></div></div></div>
    <div class="card pad" style="margin-bottom:24px"><h3>Peak Hour Analysis</h3><div class="sub">7-day hourly volume heatmap</div><div style="margin:12px 0"><span style="background:#fee2e2;color:#b91c1c;border-radius:999px;padding:5px 14px;font-size:12.5px">${I('zap', 14)} Peak: Wednesday 16:00 (502 cases)</span></div><div class="chart" id="c-heat" style="height:290px"></div></div>
    <div class="row11"><div class="card pad"><h3>Escalation Breakdown</h3><div class="sub">Cases requiring human agent, by team</div><div style="font-size:12px;color:#6b7280;margin-top:10px">Total escalated: <b style="color:#111">2447</b> across 10 teams</div><div class="chart" id="c-esc" style="height:260px"></div></div><div class="card pad"><h3>Top Subcategories by FCR</h3><div class="sub">First Contact Resolution rates</div><div id="an-subs"></div></div></div>`;
  },
  mount() {
    const draw = () => {
      const k = anKpis(); $('#an-kpi').innerHTML = k.html; $('#an-total').textContent = `(${nf(k.tot)} total cases)`; $('#an-subt').textContent = AN.gran.toLowerCase() + ' view';
      const { days, f } = anRange(); const g = group(days, AN.gran);
      APP.charts = APP.charts.filter(c => { try { c.dispose(); } catch (e) {} return false; });
      const ser = (name, key, color, extra) => Object.assign({ name, type: 'line', smooth: true, symbol: 'circle', symbolSize: 4, data: g.map(x => key === 'vol' ? Math.round(x.vol * f) : key === 'def' ? Math.round(x.def * f) : x[key]), lineStyle: { color, width: 2 }, itemStyle: { color } }, extra || {});
      APP.chart($('#c-trend'), {
        grid: { left: 50, right: 50, top: 40, bottom: 56 }, legend: { top: 4, data: ['Containment Rate', 'Escalation Rate', 'Successful Deflections', 'Volume'], textStyle: { fontSize: 11, color: '#4b5563' }, itemWidth: 22, itemHeight: 8 },
        tooltip: Object.assign({ trigger: 'axis', axisPointer: { type: 'line', lineStyle: { type: 'dashed', color: '#9ca3af' } }, formatter: p => `<b>${p[0].axisValue}</b>` + p.map(s => `<div>${dotc(s.color)}${s.seriesName}: <b>${s.seriesName.includes('Rate') ? s.value + '%' : s.value}</b></div>`).join('') }, TT),
        xAxis: Object.assign({ type: 'category', data: g.map(x => x.k), boundaryGap: false }, AX, { axisLabel: { color: '#9ca3af', fontSize: 10, rotate: 45 } }),
        yAxis: [{ type: 'value', name: 'Rate', min: 0, max: 100, interval: 20, axisLabel: { color: '#9ca3af', fontSize: 10, formatter: '{value}%' }, splitLine: SL, nameTextStyle: { color: '#6b7280', align: 'left' } }, { type: 'value', name: 'Volume', nameTextStyle: { color: '#6b7280', align: 'right' }, splitLine: { show: false }, axisLabel: { color: '#9ca3af', fontSize: 10 } }],
        series: [ser('Containment Rate', 'con', '#10b981', { areaStyle: { color: 'rgba(16,185,129,.08)' } }), ser('Escalation Rate', 'esc', '#ef4444'), ser('Successful Deflections', 'def', '#06b6d4', { yAxisIndex: 1, symbol: 'none' }), ser('Volume', 'vol', '#9ca3af', { yAxisIndex: 1, symbol: 'none', lineStyle: { color: '#9ca3af', width: 1.5, type: 'dashed' } })].map(s => s)
      });
      APP.chart($('#c-lat'), { grid: { left: 52, right: 16, top: 24, bottom: 30 }, tooltip: Object.assign({ trigger: 'axis' }, TT), xAxis: Object.assign({ type: 'category', data: ['P90', 'P95', 'P99'] }, AX, { axisLabel: { color: '#374151', fontSize: 11, fontWeight: 600 } }), yAxis: { type: 'value', max: 350, interval: 50, axisLabel: { color: '#9ca3af', fontSize: 10, formatter: v => v === 0 ? '0ms' : v + '.0s' }, splitLine: SL }, series: [{ type: 'bar', barWidth: 46, label: { show: true, position: 'top', formatter: p => p.value + 's', color: '#6b7280', fontSize: 10 }, data: [{ value: 86.6, itemStyle: { color: '#3b82f6' } }, { value: 137.5, itemStyle: { color: '#f59e0b' } }, { value: 341.4, itemStyle: { color: '#ef4444' } }] }] });
      const sc = v => Math.round(v * (k.tot / 19511));
      const cs = TOPCAT;
      APP.chart($('#c-topcat'), {
        grid: { left: 48, right: 10, top: 36, bottom: 70 }, tooltip: Object.assign({ trigger: 'axis', axisPointer: { type: 'line', lineStyle: { type: 'dashed' } }, formatter: p => `<b>${p[0].axisValue}</b><div>${dotc('#f59e0b')}Total: <b>${p[0].value}</b></div><div>${dotc('#f59e0b')}FCR: <b>${p[1].value}</b></div>` }, TT),
        legend: { top: 0, data: ['Total', 'FCR'], itemWidth: 24, itemHeight: 10, textStyle: { fontSize: 10 } },
        xAxis: Object.assign({ type: 'category', data: cs.map(c => c[0].replace('Transaction Related Query', 'Transaction Relate...').replace('EDC Machine Related Issue', 'EDC Machine Relate...')) }, AX, { axisLabel: { color: '#9ca3af', fontSize: 10, rotate: 30 } }), yAxis: { type: 'value', max: 3000, interval: 500, axisLabel: { color: '#9ca3af', fontSize: 10 }, splitLine: SL },
        series: [{ name: 'Total', type: 'bar', barWidth: 28, barGap: '-10%', data: cs.map(c => ({ value: sc(c[1]), itemStyle: { color: c[3], opacity: .3 } })), itemStyle: { color: '#5470c6' } }, { name: 'FCR', type: 'bar', barWidth: 28, data: cs.map(c => ({ value: sc(c[2]), itemStyle: { color: c[3] } })), itemStyle: { color: '#91cc75' } }]
      });
      const tm = TEAMS.slice().reverse();
      APP.chart($('#c-team'), {
        grid: { left: 130, right: 20, top: 30, bottom: 10 }, legend: { top: 0, data: ['Auto-Resolved', 'Escalated', 'Deflected'], itemWidth: 22, itemHeight: 10, textStyle: { fontSize: 10 } },
        tooltip: Object.assign({ trigger: 'axis', axisPointer: { type: 'shadow', shadowStyle: { color: 'rgba(0,0,0,.05)' } }, formatter: p => `<b>${p[0].axisValue}</b>` + p.map(s => `<div>${dotc(s.color)}${s.seriesName}: <b>${s.value}</b></div>`).join('') }, TT),
        xAxis: { type: 'value', show: false }, yAxis: { type: 'category', data: tm.map(t => t[0]), axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: '#6b7280', fontSize: 10 } },
        series: [['Auto-Resolved', 1, '#10b981'], ['Escalated', 2, '#f59e0b'], ['Deflected', 3, '#06b6d4']].map(s => ({ name: s[0], type: 'bar', stack: 't', barWidth: 14, itemStyle: { color: s[2] }, data: tm.map(t => sc(t[s[1]])) }))
      });
      const hh = D.heatmap; const max = 502;
      APP.chart($('#c-heat'), { grid: { left: 70, right: 70, top: 6, bottom: 44 }, tooltip: Object.assign({ position: 'top', formatter: p => `<b>${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][p.value[1]]} ${pad(p.value[0])}:00</b><div>Volume: <b>${p.value[2]}</b></div>` }, TT), xAxis: { type: 'category', data: Array.from({ length: 24 }, (_, i) => pad(i) + ':00'), splitArea: { show: false }, axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: '#9ca3af', fontSize: 9, rotate: 45, interval: 1 } }, yAxis: { type: 'category', data: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: '#6b7280', fontSize: 10 } }, visualMap: { min: 0, max, calculable: true, orient: 'vertical', right: 8, top: 'center', itemHeight: 190, itemWidth: 12, inRange: { color: ['#eef0ff', '#c7d2fe', '#6366f1', '#4338ca', '#2e1f9c'] }, textStyle: { color: '#9ca3af', fontSize: 9 } }, series: [{ type: 'heatmap', data: hh, itemStyle: { borderColor: '#fff', borderWidth: 1 } }] });
      APP.chart($('#c-esc'), { color: ESC.map(e => e[2]), tooltip: Object.assign({ trigger: 'item', formatter: p => `<b>${p.name}</b><div>Escalated: ${p.value} (${p.percent}%)</div>` }, TT), legend: { orient: 'vertical', right: 20, top: 'center', icon: 'rect', itemWidth: 12, itemHeight: 10, textStyle: { fontSize: 10, color: '#4b5563' } }, series: [{ type: 'pie', radius: ['48%', '75%'], center: ['28%', '55%'], itemStyle: { borderColor: '#fff', borderWidth: 2 }, label: { show: false }, labelLine: { show: false }, emphasis: { label: { show: true, position: 'outside', fontWeight: 'bold', fontSize: 12 }, labelLine: { show: true } }, data: ESC.map(e => ({ name: e[0], value: sc(e[1]) })) }] });
      $('#an-subs').innerHTML = `<table class="t" style="margin-top:10px"><thead><tr><th>Subcategory</th><th style="text-align:right">Total</th><th style="text-align:right">FCR</th><th style="text-align:right">Rate</th></tr></thead><tbody>${TOPSUB.map(s => { const tt = sc(s[1]), ff = sc(s[2]); const r = tt ? ff / tt * 100 : 0; const cls = r < 40 ? (r < 35 || r === 0 ? 'r-red' : 'r-yel') : (r < 60 ? 'r-yel' : 'r-grn'); return `<tr><td>${s[0]}</td><td style="text-align:right">${tt}</td><td style="text-align:right;color:#15803d">${ff}</td><td style="text-align:right"><span class="rate ${r > 50 ? 'r-yel' : 'r-red'}">${r.toFixed(1)}%</span></td></tr>`; }).join('')}</tbody></table>`;
    };
    const bind = (id, key) => { const e = $('#' + id); if (e) e.onchange = () => { AN[key] = e.value; draw(); }; };
    bind('an-from', 'from'); bind('an-to', 'to'); bind('an-cat', 'cat'); bind('an-team', 'team'); bind('an-sub', 'sub'); bind('an-typ', 'typ');
    $$('#an-gran button').forEach(b => b.onclick = () => { AN.gran = b.textContent; $$('#an-gran button').forEach(x => x.classList.toggle('on', x === b)); draw(); });
    $$('[data-p]').forEach(b => b.onclick = () => { const e = '2026-11-12'; const m = { 'Today': e, '7 Days': '2026-11-06', '30 Days': '2026-10-14', 'MTD': '2026-11-01' }; AN.from = m[b.dataset.p]; AN.to = e; $('#an-from').value = AN.from; $('#an-to').value = AN.to; draw(); });
    $('#an-ref').onclick = () => { Object.assign(AN, { from: '2026-10-13', to: '2026-11-12', cat: '', team: '', sub: '', typ: '', gran: 'Daily' }); APP.pages.analytics && route(); };
    $('#an-exp').onclick = () => { const { days } = anRange(); APP.csv('analytics_daily.csv', [['date', 'volume', 'containment_pct', 'escalation_pct', 'deflections'], ...days.map(x => [x.d, x.vol, x.con, x.esc, x.def])]); };
    draw();
  }
};
APP.csv = (name, rows) => { const b = new Blob([rows.map(r => r.map(v => '"' + String(v == null ? '' : v).replace(/"/g, '""') + '"').join(',')).join('\n')], { type: 'text/csv' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = name; a.click(); };

APP.start = () => { shell(); if (!location.hash) location.hash = '#/overview'; route(); };
APP.route = route;
})();
