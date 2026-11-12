/* Email Agent (2.0) - demo replica. Review Queue, Case Explorer, Agent Performance, Reports, Live Feed, File Upload. */
(function () {
'use strict';
const A = window.APP, D = A.D, R = A.R, I = A.I, esc = A.esc, nf = A.nf, $ = A.$, $$ = A.$$, P = A.P;
const { clock, created, dmyhms, isoDay, dayStart, ago, fsec, cap1, now, pad, MON } = A;

const qOf = c => {
  c = c || '';
  if (/Transaction|Settlement|Report Request|Payment/i.test(c)) return 'Transaction & Settlement';
  if (/VAS|EMI/i.test(c)) return 'VAS & EMI Activation';
  if (/Hardware|Connectivity/i.test(c)) return 'Hardware & Connectivity';
  if (/Configuration|Integration|Software|EDC Machine/i.test(c)) return 'Configuration & Integration';
  if (/Pine One|User ID|Credential/i.test(c)) return 'Pine One & Credentials';
  if (/Paper/i.test(c)) return 'Paper Roll';
  if (/Account|Install/i.test(c)) return 'Account & De-Installation';
  return 'General / Other';
};
const QUEUES = ['Transaction & Settlement', 'VAS & EMI Activation', 'Hardware & Connectivity', 'Configuration & Integration', 'Pine One & Credentials', 'Paper Roll', 'Account & De-Installation', 'General / Other'];
const disp = r => r.mn || r.me || '—';
const STATS = { 'Today': [97, 1, 49, 8, 2, 83], 'Yesterday': [113, 1, 50, 11, 1, 88], 'Last 7 Days': [778, 18, 370, 104, 8, 733], 'Last 30 Days': [3035, 135, 1225, 315, 37, 2480], 'All Time': [9064, 214, 3385, 2292, 769, 9444] };
const rq = { q: 'All Queues', range: 'Today' };

/* ---------- Review Queue ---------- */
const stile = (cls, l, v, c, extra) => `<div class="st ${cls}"><div class="l">${l}</div><div class="v">${v}</div><div class="c">${c || ''}</div>${extra || ''}</div>`;
A.pages['review-queue'] = {
  title: 'Review Queue',
  render() {
    const pend = A.pendingRows(); const oldest = pend.slice().sort((a, b) => a.ts - b.ts)[0];
    const s = STATS[rq.range]; const rows = pend.filter(r => rq.q === 'All Queues' || qOf(r.k) === rq.q).sort((a, b) => a.ts - b.ts || b.c - a.c);
    const cnt = q => pend.filter(r => qOf(r.k) === q).length;
    return `<div style="display:flex;justify-content:space-between;align-items:flex-start"><div><div style="display:flex;align-items:center;gap:10px;color:#2563eb">${I('inbox', 22)}<h1 style="margin:0;font-size:24px;color:#0f172a">Review Queue</h1></div><div style="color:#6b7280;font-size:13px;margin-top:6px">Review AI-generated responses before sending to merchants. Select a queue to filter by category, or view all.</div></div><button class="btn" id="rq-ref">${I('refresh', 16)} Refresh</button></div>
    <div class="card qtabs" style="margin-top:16px"><button class="qt ${rq.q === 'All Queues' ? 'on' : ''}" data-q="All Queues">All Queues <b>${pend.length}</b></button>${QUEUES.map(q => `<button class="qt ${rq.q === q ? 'on' : ''}" data-q="${q}">${q}${cnt(q) ? ` <b>${cnt(q)}</b>` : ''}</button>`).join('')}</div>
    <div class="rng" id="rq-rng" style="margin-top:14px">${['Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days', 'All Time', 'Custom Range'].map(x => `<button class="${x === rq.range ? 'on' : ''}">${x}</button>`).join('')}</div>
    <div class="stl">${stile('s-grn', 'Auto Resolved', s[0], 'Sent automatically')}${stile('s-cy', 'HITL Bypassed', s[1], 'Allowlisted &amp; sent', `<div style="font-size:11px;margin-top:6px;color:#0e7490;cursor:pointer">View cases ${I('arrow', 12)}</div>`)}${stile('s-or', 'Pending Review', pend.length, oldest ? 'Oldest: ' + clock(oldest.ts + 40000) : '')}${stile('s-gr2', 'Approved &amp; Sent', s[2], '')}${stile('s-bl', 'Modified &amp; Sent', s[3], '')}${stile('s-rd', 'Parked - Issue', s[4], '')}${stile('s-wh', 'Total Reviewed', s[5], rq.range)}</div>
    <div class="card"><table class="t"><thead><tr><th>Case #</th><th>Category</th><th>Subcategory</th><th>Merchant</th><th>Subject</th><th>Child Cases</th><th>Waiting</th></tr></thead><tbody>${rows.map(r => `<tr class="rqr" data-c="${r.c}" style="cursor:pointer"><td><a class="mono">${r.c}</a></td><td>${esc(r.k)}</td><td style="color:#4b5563">${esc(r.u)}</td><td>${esc(disp(r))}</td><td style="max-width:300px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#4b5563">${esc(r.s)}</td><td style="color:#9ca3af">-</td><td style="color:#6b7280">${ago(now() - r.ts)}</td></tr>`).join('') || '<tr><td colspan="7" class="empty">No cases waiting for review</td></tr>'}</tbody></table><div style="display:flex;justify-content:space-between;padding:14px 18px;font-size:13px;color:#6b7280;border-top:1px solid #f1f5f9"><span>Showing ${rows.length ? '1–' + rows.length : 0} of ${rows.length}</span><span>Previous &nbsp;&nbsp;&nbsp; Next</span></div></div>`;
  },
  mount() {
    $$('.qt').forEach(b => b.onclick = () => { rq.q = b.dataset.q; A.route(); });
    $$('#rq-rng button').forEach(b => b.onclick = () => { if (STATS[b.textContent]) { rq.range = b.textContent; A.route(); } });
    $('#rq-ref').onclick = () => A.route();
    $$('.rqr').forEach(tr => tr.onmouseenter = () => tr.style.background = '#eff6ff');
    $$('.rqr').forEach(tr => tr.onmouseleave = () => tr.style.background = '');
    $$('.rqr').forEach(tr => tr.onclick = () => openReview(tr.dataset.c));
  }
};
const BODY = {
  '129867801': `External Email: Do not click any links or open any attachments unless you trust the sender and know the content is safe. Please treat hyperlinks, attachments and instructions in this email with extreme caution.
Dear sir/madam,
Please send us our username and password for the EMI World Application as
early as possible.
Our pinMerchant Details are as follows
Merchant ID :- 101189
POS ID :- 447810
Store ID :- 270249
--

Thanks & Regards,
Parag Panvalkar / Omkar Phadke
Partner,
*COMPTEL SYSTEMS*
Mobile: 9422050603 / 9422050762 | Tel : 02352-221926
Arogyamandir, Ratnagiri, 415639.| comptelratnagiri@gmail.com |

*Please Do not print this mail unless it's absolute must. Go Paperless....
Conserve Jungles.... Save Earth .....*`,
  '129964057': `External Email: Do not click any links or open any attachments unless you trust the sender and know the content is safe. Please treat hyperlinks, attachments and instructions in this email with extreme caution.
TID- RP091687
TID- RP091690
TID- RP091684
TID- RP091685
TID- RP091688
TID- RP091691
TID- RP091686
TID- RP091693
TID- RP091689
TID- RP091692`,
  '129963653': `External Email: Do not click any links or open any attachments unless you trust the sender and know the content is safe. Please treat hyperlinks, attachments and instructions in this email with extreme caution.
Dear Team,



Please provide the full transaction details for the day* 12/11/2026* for
the below mentioned EDC machine.



*S/N- 1491563128*

*MID- 0790172A0211564*



*Regards,*

*Auulee Saha Mondal*

Fabindia,

Shop no:- 308,

3rd floor,
Forum Courtyard Mall

10/3 Elgin road

Kolkata - 700020

Landline - 033 4023 5048`
};
const SENT = {
  '129867801': 'Merchant is politely requesting EMI World Application credentials and expects an early response.',
  '129963653': 'The merchant is making a polite and formal request for transaction details for a specific date.'
};
const FOOT = `\n\nIf you require any additional information or have further queries, please feel free to reach out to us via:\n\nPhone: 0120-4033600/18002586609\nEmail: Plutus.support@pinelabs.com\n\nWe are always happy to assist you.\n\nBest Regards,\nTeam Pine Labs\nWe're available 24*7 on:\nWhatsApp: https://bit.ly/3qUaZy9\nPine Labs One Download : https://pinelabsone.app.link/cCKZF8REiCb\nHow to use Pine Labs One: https://www.youtube.com/watch?v=LjLIffN1KjQ`;
const respOf = r => r.fn || r.or || `Dear Merchant Partner,\n\nThank you for writing to us. Your request under case number ${r.c} has been noted and assigned to ${r.m || 'our support team'}.` + FOOT;
const col = (id, t, body, open) => `<div class="sec-w"><div class="sechd" data-t="${id}"><span>${t}</span>${I(open ? 'up' : 'down', 16)}</div><div id="${id}" style="${open ? '' : 'display:none'}">${body}</div></div>`;
function openReview(c) {
  const r = R.find(x => x.c === c); if (!r) return;
  const age = now() - r.ts; const stale = age > 7200000;
  const kv = `<div class="kv"><div><span>Category:</span>${esc(r.k)}</div><div><span>Subcategory:</span>${esc(r.u)}</div><div><span>Intent:</span>${esc(r.i)}</div><div><span>Case Type:</span>${esc(r.y)}</div><div><span>Manual Case Owner:</span>${esc(r.m)}</div><div><span>Owner Bucket:</span>-</div><div><span>Status:</span><span class="chip" style="background:#f1f5f9;color:#475569;margin:0">Click Verify on SF</span></div><div><span>Resolution Tool:</span>${esc(r.tl || '-')}</div><div><span>POS ID${r.pos && r.pos.length > 1 ? 's' : ''}:</span><span class="mono" style="font-size:13px">${esc((r.pos || []).join(', '))}</span>${r.tid && r.tid.length ? `<span style="margin-top:10px">TIDs:</span><span class="mono" style="font-size:13px">${esc(r.tid.join(', '))}</span>` : ''}</div><div><span>Contact:</span>${esc(r.me || '')}</div></div>`;
  const rep = r.tl === 'resolve_transaction_report' ? `<div class="amb"><b><span style="display:flex;gap:8px;align-items:center">${I('warn', 16)} Response mentions a report, but no report_id stored</span><button class="btn">${I('search', 13)} Try to fetch report</button></b><div style="font-size:11.5px;margin-top:4px">If fetch fails, modify the response to replace the placeholder with the actual link, or park the case.</div></div>` : '';
  const html = `<div class="dh"><div><h2>Review Case</h2><div style="font-size:13px;color:#6b7280;margin-top:4px">Case #${r.c} · ${esc(r.k)} <span style="color:#dc2626;font-size:12px;margin-left:6px">(${ago(age).replace(' ago', '')} ago)</span></div></div><div style="display:flex;gap:10px"><button class="btn sm" id="rv-sf">${I('refresh', 14)} Refresh SF</button><button class="btn sm" style="border:0;padding:0 6px" id="rv-x">${I('x', 20)}</button></div></div>
  <div class="db">${stale ? `<div class="warn"><b>${I('warn', 16)} Stale Data — ${ago(age).replace(' ago', '')} old</b>Transaction/settlement data may have changed since this case was processed. Consider refreshing before approving.</div>` : ''}${SENT[r.c] ? `<div style="margin-bottom:10px"><span class="chip">polite</span><i style="font-size:12px;color:#6b7280">${SENT[r.c]}</i></div>` : ''}
  ${col('s1', "MERCHANT'S EMAIL", `<div style="font-size:14px;margin-bottom:10px">${esc(r.me || '')}</div><div class="raw">${esc(BODY[r.c] || 'Subject: ' + (r.s || '—') + '\n\n(The raw email body is not part of the Case Report export.)')}</div>`, true)}
  ${col('s2', 'MERCHANT INFO', `<div class="kv" style="padding-bottom:10px"><div><span>Name</span>${esc(r.mn || '—')}</div><div><span>Email</span>${esc(r.me || '—')}</div><div><span>POS count</span>${(r.pos || []).length}</div><div><span>Team</span>${esc(r.m || '—')}</div></div>`, false)}
  <div class="sec-w"><div class="sechd" data-t="s3"><span>CASE CONTEXT</span>${I('up', 16)}</div><div id="s3"><div style="text-align:right;font-size:12px;color:#2563eb;margin-bottom:8px">${I('pencil', 12)} Edit Fields</div>${kv}${rep}</div></div>
  ${col('s4', `<span style="display:flex;gap:8px;align-items:center">${I('cloud', 16)} SALESFORCE VERIFICATION</span>`, `<div class="kv" style="padding-bottom:10px"><div><span>SF Status at Review</span>${esc(r.sf || '—')}</div><div><span>SF Owner</span>${esc(r.m || '—')}</div></div>`, false)}
  <div style="font-size:13.5px;padding:10px 0;border-top:1px solid #f1f5f9"><span style="color:#6b7280">Subject:</span>&nbsp; ${esc(r.s || '—')}</div>
  ${col('s5', 'AI-GENERATED RESPONSE', `<div class="resp" id="rv-resp">${esc(respOf(r))}</div>`, true)}</div>
  <div class="df"><div style="display:flex;gap:10px"><button class="btn pr" id="rv-mod">${I('pencil', 15)} Modify Response</button><button class="btn or" id="rv-park">${I('upload', 15)} Park to SF</button></div><button class="btn gn" id="rv-ok">${I('checkc', 16)} Approve &amp; Send</button></div>`;
  A.openDrawer(html, 710);
  $$('.sechd').forEach(h => h.onclick = () => { const b = $('#' + h.dataset.t); const open = b.style.display === 'none'; b.style.display = open ? '' : 'none'; h.lastElementChild.outerHTML = I(open ? 'up' : 'down', 16); });
  $('#rv-x').onclick = A.closeDrawer;
  $('#rv-sf').onclick = () => A.toast('Refreshed from Salesforce (demo)');
  $('#rv-mod').onclick = () => { const e = $('#rv-resp'); const on = e.contentEditable !== 'true'; e.contentEditable = on; e.style.outline = on ? '2px solid #3b82f6' : ''; $('#rv-mod').lastChild.textContent = on ? ' Done Editing' : ' Modify Response'; if (on) e.focus(); };
  const done = (msg, patch) => { Object.assign(r, patch); A.toast(msg); A.closeDrawer(); const n = $('#navpend'); if (n) n.textContent = A.pendingRows().length + ' Pending'; setTimeout(A.route, 300); };
  $('#rv-ok').onclick = () => done('Approved and sent (demo)', { r: 'approved', l: 'Approved & Sent', w: 'completed', e: 1 });
  $('#rv-park').onclick = () => done('Parked to Salesforce (demo)', { r: 'parked', l: 'Parked - Issue in Resolution', q: 'issue_in_resolution' });
}

/* ---------- Case Explorer ---------- */
const cx = { q: '', intent: '', cat: '', team: '', status: '', ra: '', from: '', to: '', page: 1 };
const PAGE = 20;
const raPill = r => ({ pending_review: ['#ffedd5', '#c2410c', 'clock', 'Pending Review'], approved: ['#d1fae5', '#047857', 'checkc', 'Approved & Sent'], modified: ['#dbeafe', '#1d4ed8', 'pencil', 'Modified & Sent'], parked: ['#fef9c3', '#a16207', 'upload', 'Parked'], expired: ['#f1f5f9', '#475569', 'clock', 'Expired'], superseded: ['#f1f5f9', '#475569', 'refresh', 'Superseded'] }[r]);
const rpHtml = r => { const p = raPill(r); return p ? `<span style="display:inline-flex;align-items:center;gap:6px;background:${p[0]};color:${p[1]};border-radius:999px;padding:5px 12px;font-size:12px;line-height:1.1">${I(p[2], 15)}<span style="white-space:nowrap">${p[3].replace('&', '&amp;').replace('Pending Review', 'Pending<br>Review')}</span></span>` : '<span style="color:#9ca3af">—</span>'; };
const uniqK = k => [...new Set(R.map(r => r[k]).filter(Boolean))].sort();
const selx = (id, l, o, v) => `<div><label style="font-size:12px;color:#6b7280;display:block;margin-bottom:6px">${l}</label><select class="inp sel" id="${id}"><option value="">All</option>${o.map(x => `<option${x === v ? ' selected' : ''}>${esc(x)}</option>`).join('')}</select></div>`;
function cxRows() {
  const a = cx.from ? dayStart(cx.from) : -1e15, b = cx.to ? dayStart(cx.to) + 86400000 : 1e15; const q = cx.q.toLowerCase();
  return R.filter(r => r.ts >= a && r.ts < b && (!cx.intent || r.i === cx.intent) && (!cx.cat || r.k === cx.cat) && (!cx.team || r.m === cx.team) && (!cx.status || r.w === cx.status) && (!cx.ra || r.r === cx.ra) && (!q || (r.c + ' ' + (r.me || '') + ' ' + (r.s || '') + ' ' + (r.mn || '')).toLowerCase().includes(q)));
}
A.pages.cases = {
  title: 'Case Explorer',
  render() {
    return `<div style="display:flex;justify-content:space-between;align-items:center;height:56px"><h2 style="margin:0;font-size:22px;color:#eef2f9;font-weight:600">Case Explorer</h2><button class="btn sk" id="cx-dl">${I('download', 16)} Download Report</button></div>
    <div class="card pad" style="margin:4px 0 20px;padding:16px 16px"><div style="display:grid;grid-template-columns:2.3fr 1fr 1fr 1fr 1fr 1fr 1.2fr 1.2fr auto;gap:12px;align-items:end"><div><label style="font-size:12px;color:#6b7280;display:block;margin-bottom:6px">Search</label><input class="inp" id="cx-q" placeholder="Case #, email, or subject..." value="${esc(cx.q)}"></div>${selx('cx-intent', 'Intent', uniqK('i'), cx.intent)}${selx('cx-cat', 'Category', uniqK('k'), cx.cat)}${selx('cx-team', 'Team', uniqK('m'), cx.team)}${selx('cx-status', 'Status', uniqK('w'), cx.status)}${selx('cx-ra', 'Review Action', ['pending_review', 'approved', 'modified', 'parked', 'expired', 'superseded'], cx.ra)}<div><label style="font-size:12px;color:#6b7280;display:block;margin-bottom:6px">From</label><input class="inp" type="date" id="cx-from" value="${cx.from}"></div><div><label style="font-size:12px;color:#6b7280;display:block;margin-bottom:6px">To</label><input class="inp" type="date" id="cx-to" value="${cx.to}"></div><button class="btn" id="cx-reset" style="color:#6b7280">${I('filter', 14)} Reset</button></div></div>
    <div class="card" id="cx-card"></div>`;
  },
  mount() {
    const draw = () => {
      const rows = cxRows(); const pages = Math.max(1, Math.ceil(rows.length / PAGE)); cx.page = Math.min(cx.page, pages);
      const sl = rows.slice((cx.page - 1) * PAGE, cx.page * PAGE); const st = Math.max(1, Math.min(cx.page - 2, pages - 4)); const nums = []; for (let i = st; i < st + 5 && i <= pages; i++) nums.push(i);
      $('#cx-card').innerHTML = `<table class="t cx"><thead><tr><th>Case #</th><th>Subject</th><th>Intent</th><th>Category</th><th>Team</th><th>Auto</th><th>Review Action</th><th>Time</th><th>Created</th></tr></thead><tbody>${sl.map(r => `<tr><td><a class="mono" data-c="${r.c}" style="cursor:pointer;font-size:13.5px">${r.c}</a></td><td style="max-width:620px">${esc(r.s || '—')}</td><td style="font-size:13px;letter-spacing:.2px">${esc(r.i)}</td><td style="max-width:150px">${esc(r.k)}</td><td>${esc(r.m)}</td><td>${r.a ? `<span style="color:#10b981">${I('checkc', 19)}</span>` : `<span style="color:#d1d5db">${I('minus', 19)}</span>`}</td><td>${rpHtml(r.r)}</td><td style="color:#6b7280">${fsec(r.t)}</td><td style="color:#6b7280;font-size:12px;width:90px">${created(r.ts)}</td></tr>`).join('') || '<tr><td colspan="9" class="empty">No cases match these filters</td></tr>'}</tbody></table>
      <div class="pg"><button data-p="1">${I('dleft', 16)}</button><button data-p="${Math.max(1, cx.page - 1)}">${I('left', 16)}</button>${nums.map(n => `<button data-p="${n}" class="${n === cx.page ? 'on' : ''}">${n}</button>`).join('')}<button data-p="${Math.min(pages, cx.page + 1)}">${I('right', 16)}</button><button data-p="${pages}">${I('dright', 16)}</button></div><div style="text-align:center;font-size:12px;color:#9ca3af;padding-bottom:12px">${nf(rows.length)} cases</div>`;
      $$('#cx-card [data-p]').forEach(b => b.onclick = () => { cx.page = +b.dataset.p; draw(); });
      $$('#cx-card [data-c]').forEach(a => a.onclick = () => A.openCaseDetail(a.dataset.c));
    };
    const bind = (id, k) => { const e = $('#' + id); e.onchange = e.oninput = () => { cx[k] = e.value; cx.page = 1; draw(); }; };
    bind('cx-q', 'q'); bind('cx-intent', 'intent'); bind('cx-cat', 'cat'); bind('cx-team', 'team'); bind('cx-status', 'status'); bind('cx-ra', 'ra'); bind('cx-from', 'from'); bind('cx-to', 'to');
    $('#cx-reset').onclick = () => { Object.assign(cx, { q: '', intent: '', cat: '', team: '', status: '', ra: '', from: '', to: '', page: 1 }); A.route(); };
    $('#cx-dl').onclick = () => A.csv('cases.csv', [['case', 'created', 'subject', 'intent', 'category', 'subcategory', 'team', 'auto', 'review_action', 'time_ms'], ...cxRows().map(r => [r.c, r.d, r.s, r.i, r.k, r.u, r.m, r.a, r.r, r.t])]);
    draw();
  }
};
const PIPEN = ['Input Processing', 'Intent Classification', 'Category Classification', 'Subcategory Classification', 'Data Enrichment', 'Resolution', 'Team Assignment', 'Case Management', 'Response Generation', 'Email Dispatch'];
const PIPEX = { '129963653': [12700, 1, 2600, 0, 469, 1600, 1, 2200, 29200, 1600], '129964057': [27500, 1, 4900, 0, 1400, 1, 1, 11600, 2, 2100], '129897462': [17100, 1, 8500, 1, 734, 9200, 1, 2900, 12000, 1300] };
function pipeFor(r) {
  if (PIPEX[r.c]) return PIPEX[r.c];
  let h = 0; for (const ch of r.c) h = (h * 31 + ch.charCodeAt(0)) >>> 0; const u = i => ((h >>> (i * 3)) % 100) / 100; const T = r.t || 20000; const tool = !!r.tl; const resp = !!(r.or || r.fn);
  return [T * (.3 + .25 * u(1)), 1, T * (.05 + .1 * u(2)), 0, T * (.01 + .03 * u(3)), tool ? T * (.03 + .15 * u(4)) : 1, 1, T * (.04 + .12 * u(5)), resp && tool ? T * (.12 + .25 * u(6)) : 2, T * (.03 + .04 * u(7))].map(Math.round);
}
const pcls = ms => ms < 1000 ? 'p-g' : ms <= 3000 ? 'p-a' : 'p-r';
A.openCaseDetail = function (c) {
  const r = R.find(x => x.c === c); if (!r) return;
  const pi = pipeFor(r);
  const f = (k, v, extra) => `<div><span style="color:#9ca3af;font-size:13px;display:block;margin-bottom:2px">${k}</span><span ${extra || ''}>${v}</span></div>`;
  const html = `<div class="dh" style="padding-top:20px"><h2 style="font-size:23px">Case Detail</h2><button class="btn sm" style="border:0;padding:0 6px" id="cd-x">${I('x', 20)}</button></div><div class="db">
  <div style="font-size:17px;font-weight:700;margin:6px 0 4px">Case ${r.c}</div><div style="color:#6b7280;font-size:13.5px;margin-bottom:14px">${esc(r.s || '—')}</div>
  <div class="dc"><div class="hd">CLASSIFICATION</div><div class="kv">${f('Intent', esc(r.i))}${f('Category', esc(r.k))}${f('Subcategory', esc(r.u))}${f('Case Type', esc(r.y))}</div></div>
  <div class="dc"><div class="hd">RESOLUTION</div><div class="kv">${f('Status', `<span class="sp sp-${r.w}" style="font-size:11px">${r.w}</span>`)}${f('Auto-Resolved', r.a ? 'Yes' : 'No', r.a ? 'style="color:#16a34a;font-weight:500"' : '')}${f('MCP Tool', esc(r.tl || '—'))}${f('Processing Time', fsec(r.t))}${f('Team', esc(r.m || '—'))}${f('Priority', esc(r.p || '—'))}</div></div>
  <div class="dc"><div class="hd">REVIEW</div><div class="kv">${f('Review Status', r.r ? cap1(r.r) : '—')}${f('Reviewed By', esc(r.rb || '—'))}${f('Reviewed At', r.rt ? dmyhms(A.toMs(r.rt) + 30000) : '—')}</div></div>
  <div class="dc"><div class="hd">MERCHANT</div><div class="kv">${f('Email', esc(r.me || '—'))}${f('Name', esc(r.mn || '—'))}</div><div style="margin-top:10px;font-size:13.5px"><span style="color:#9ca3af">POS IDs:</span> <span class="mono">${esc((r.pos || []).join(', ') || '—')}</span></div></div>
  <div class="dc"><div class="hd">AGENT PIPELINE</div>${PIPEN.map((n, i) => `<div class="pipe"><i>${i + 1}</i><div class="${pcls(pi[i])}"><span>${n}</span><span class="mono">${fsec(pi[i])}</span></div></div>`).join('')}</div>
  <div class="dc"><div class="hd">GENERATED RESPONSE</div><div class="resp" style="max-height:300px">${esc(respOf(r))}</div></div></div>`;
  A.openDrawer(html, 555); $('#cd-x').onclick = A.closeDrawer;
};

/* ---------- Agent Performance ---------- */
const AVG = [22881, 34, 4700, 1, 1300, 2700, 1, 3800, 7300, 3300], P95 = [38353.8, 1, 10900, 1, 2300, 12000, 2, 9300, 29200, 6500];
A.pages.agents = {
  title: 'Agent Performance',
  render() {
    const bc = ms => ms < 1000 ? 'pb-g' : ms <= 3000 ? 'pb-a' : 'pb-r';
    return `<div class="card pad" style="margin-bottom:24px"><h3 style="font-size:14px">Agent Pipeline</h3><div class="sub">Average processing time per agent node</div><div class="pstrip" style="margin-top:14px">${PIPEN.map((n, i) => `<div class="pbox ${bc(AVG[i])}">${n.toUpperCase()}<b>${fsec(AVG[i])}</b></div>${i < 9 ? `<span style="color:#cbd5e1">${I('arrow', 16)}</span>` : ''}`).join('')}</div></div>
    <div class="row11"><div class="card pad"><h3 style="font-size:14px">Agent Timing</h3><div class="sub">Average vs P95 latency</div><div class="chart" id="c-ag" style="height:360px;margin-top:6px"></div></div>
    <div class="card pad"><h3 style="font-size:14px">Agent Stats</h3><div class="sub">Total pipeline avg: 46.1s</div><table class="t" style="margin-top:14px"><thead><tr><th>Agent</th><th style="text-align:right">Calls</th><th style="text-align:right">Avg</th><th style="text-align:right">P95</th></tr></thead><tbody>${PIPEN.map((n, i) => `<tr><td style="font-size:13px">${n}</td><td class="mono" style="text-align:right;color:#475569;font-size:12.5px">200</td><td class="mono" style="text-align:right;color:#475569;font-size:12.5px">${fsec(AVG[i])}</td><td class="mono" style="text-align:right;color:#475569;font-size:12.5px">${fsec(P95[i])}</td></tr>`).join('')}</tbody></table></div></div>`;
  },
  mount() {
    A.APP = A; const fm = v => v >= 1000 ? (v / 1000).toFixed(1) + 's' : '0ms';
    A.chart($('#c-ag'), { grid: { left: 150, right: 20, top: 12, bottom: 50 }, legend: { bottom: 0, itemWidth: 22, itemHeight: 10, textStyle: { fontSize: 10 } }, tooltip: Object.assign({ trigger: 'axis', axisPointer: { type: 'shadow' }, formatter: p => `<b>${p[0].axisValue}</b>` + p.map(s => `<div>${A.dotc(s.color)}${s.seriesName} &nbsp; <b>${nf(s.value)}</b></div>`).join('') }, A.TT), xAxis: { type: 'value', max: 40000, interval: 10000, axisLabel: { color: '#9ca3af', fontSize: 10, formatter: v => v === 0 ? '0ms' : (v / 1000).toFixed(1) + 's' }, splitLine: A.SL }, yAxis: { type: 'category', inverse: true, data: PIPEN, axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: '#6b7280', fontSize: 9 } }, series: [{ name: 'Avg', type: 'bar', barWidth: 7, itemStyle: { color: '#3b82f6' }, data: AVG }, { name: 'P95', type: 'bar', barWidth: 7, itemStyle: { color: '#f59e0b' }, data: P95 }] });
  }
};

/* ---------- Reports & Monitoring ---------- */
const rp = { tab: 'ops', range: 'Today', from: '2026-11-12', to: '2026-11-12', open: new Set(), queue: 'All Queues' };
const TABS = [['ops', 'Operations Report', 'list'], ['rt', 'Real-Time Monitoring', 'activity'], ['ex', 'Exception Report', 'warn'], ['dr', 'Daily Report', 'cal2'], ['wr', 'Weekly Report', 'bars'], ['ra', 'Review Activity', 'pencil']];
const OVR = { total: 647, auto: 97, hitl: 1, defl: 21, issue: 2, oos: 3, approved: 49, modified: 8, pending: 3, reviewed: 83 };
function rangeRows() { const a = dayStart(rp.from), b = dayStart(rp.to) + 86400000; return R.filter(r => r.ts >= a && r.ts < b); }
function tiles() {
  const rows = rangeRows(); const today = rp.from === '2026-11-12' && rp.to === '2026-11-12';
  const c = f => rows.filter(f).length;
  const o = { total: rows.filter(r => !r.g && r.o !== 'No Action Required').length, approved: c(r => r.r === 'approved'), modified: c(r => r.r === 'modified'), auto: c(r => r.e && !r.r && !r.g && !r.q), hitl: c(r => r.o === 'HITL Bypass'), defl: c(r => r.l === 'Parked - Deflection'), issue: c(r => r.l === 'Parked - Issue in Resolution'), oos: c(r => r.l === 'Parked - Out of Scope'), pending: c(r => r.r === 'pending_review') };
  const v = today ? OVR : o; v.reviewed = today ? 83 : o.approved + o.modified + o.defl + o.issue + o.oos; return v;
}
const rt = (cls, l, v, c, col) => `<div class="rtile" style="background:${cls[0]};border-color:${cls[1]};color:${col}"><div class="l">${l}</div><div class="v">${v}</div><div class="c">${c || ''}</div></div>`;
const PR = { deflection: 'Deflection', missing_identifier: 'Missing Identifier', issue_in_resolution: 'Issue In Resolution', manual_routing: 'Manual Routing', child_case_manual_routing: 'child_case_manual_routing' };
const prTxt = q => q ? (PR[q] || q.split('_').map(cap1).join(' ')) : '-';
const laCell = l => { if (!l) return '-'; if (/pending/i.test(l)) return '<span class="la la-pending">Pending</span>'; if (/^Approved/.test(l)) return '<span class="la la-approved">Approved &amp;<br>Sent</span>'; if (/^Parked/.test(l)) return '<span class="la la-parked">Parked</span>'; if (/^Modified/.test(l)) return '<span class="la la-mod">Modified &amp; Sent</span>'; if (/Sent/.test(l)) return '<span class="la la-grey">Sent</span>'; return `<span class="la la-grey">${esc(l)}</span>`; };
function tabsHtml() { return `<div class="card tabs">${TABS.map(t => `<button class="tab ${rp.tab === t[0] ? 'on' : ''}" data-t="${t[0]}">${I(t[2], 16)} ${t[1]}${t[0] === 'rt' ? '<span class="bd">1</span>' : ''}</button>`).join('')}</div>`; }
function filtersHtml(withRange) {
  return `<div class="fl" style="align-items:center">${withRange ? `<select class="inp sel" id="rp-range" style="width:126px;height:36px"><option>Today</option><option>Yesterday</option><option>Last 7 Days</option><option>This Month</option><option>Custom</option></select>` : ''}<span style="color:#9ca3af;font-size:12px">From</span><input class="inp" type="date" id="rp-from" value="${rp.from}" style="width:150px;height:36px"><span style="color:#9ca3af;font-size:12px">To</span><input class="inp" type="date" id="rp-to" value="${rp.to}" style="width:150px;height:36px">${rp.tab === 'ra' ? `<select class="inp sel" style="width:200px;height:36px"><option>All Queues</option>${QUEUES.map(q => `<option>${q}</option>`).join('')}</select>` : ''}<button class="btn pr sm" id="rp-load" style="height:36px">${I('refresh', 14)} Load Report</button><button class="btn gn sm" id="rp-dl" style="height:36px">${I('download', 14)} Download Excel</button>${withRange ? `<span style="color:#6b7280;font-size:12px;display:flex;align-items:center;gap:4px">${I('cal', 14)} ${rp.to}</span>` : ''}</div>`;
}
function opsBody() {
  const v = tiles(); const rows = rangeRows().slice(0, 700);
  const T = [[['#fff', '#e5e7eb'], 'Total Cases', v.total, '', '#0f172a'], [['#ecfdf5', '#d1fae5'], 'Approved &amp; Sent', v.approved, '', '#059669'], [['#eff6ff', '#dbeafe'], 'Modified &amp; Sent', v.modified, '', '#2563eb'], [['#ecfdf5', '#d1fae5'], 'Auto Resolved', v.auto, '', '#059669'], [['#ecfeff', '#cffafe'], 'HITL Bypassed', v.hitl, 'Allowlisted &amp; sent', '#0891b2'], [['#ecfdf5', '#d1fae5'], 'No Action Required - Deflection', v.defl, '', '#059669'], [['#fef2f2', '#fee2e2'], 'Parked - Issue', v.issue, '', '#dc2626'], [['#ecfdf5', '#d1fae5'], 'No Action Required - Out of Scope', v.oos, '', '#059669'], [['#fefce8', '#fef08a'], 'Pending Review', v.pending, '', '#ca8a04'], [['#eef2ff', '#e0e7ff'], 'QA Pass Rate', '98%', '', '#4f46e5']];
  const tc = ['#0f172a', '#137735', '#224eb8', '#05714d', '#176c7f', '#18793b', '#922823', '#0f6c4f', '#915e0d', '#3f36a7'];
  return `<div style="display:grid;grid-template-columns:repeat(10,1fr);gap:10px;margin-bottom:14px">${T.map((t, i) => `<div class="rtile" style="background:${t[0][0]};border-color:${t[0][1]};color:${t[4]}"><div class="l" style="min-height:30px">${t[1]}</div><div class="v" style="color:${tc[i]}">${t[2]}</div><div class="c">${t[3]}</div></div>`).join('')}</div>
  <div class="card"><table class="t rp"><thead><tr><th>Case #</th><th>Category</th><th>Subcategory</th><th>Team</th><th>Intent</th><th>Last Action</th><th>Review<br>Routing</th><th>Park Reason</th><th>Modified<br>Fields</th><th>Response</th><th>Reviewed<br>By</th></tr></thead><tbody>${rows.map(r => { const has = r.fn || r.or; const o = rp.open.has(r.c); return `<tr><td class="m">${r.c}</td><td>${esc(r.k)}</td><td>${esc(r.u)}</td><td>${esc(r.m)}</td><td>${esc(r.i)}</td><td>${laCell(r.l)}</td><td style="color:#d1d5db">-</td><td>${prTxt(r.q)}</td><td style="color:#d1d5db">${r.mf ? '<span style="color:#475569">response_text</span>' : '-'}</td><td>${has ? `<button class="vw" data-v="${r.c}">${I(o ? 'down' : 'right', 14)} View</button>` : ''}</td><td>Business</td></tr>${o ? `<tr><td colspan="11" style="padding:0;border:0"><div class="rs"><div class="hd">RESPONSE SENT</div><pre>${esc(respOf(r))}</pre></div></td></tr>` : ''}`; }).join('') || '<tr><td colspan="11" class="empty">No cases in this range</td></tr>'}</tbody></table></div>`;
}
function wordDiff(a, b) {
  const ta = a.split(/(\s+)/).filter(x => x !== ''), tb = b.split(/(\s+)/).filter(x => x !== '');
  if (ta.length * tb.length > 2500000) return `<span class="del">${esc(a)}</span> <span class="ins">${esc(b)}</span>`;
  const n = ta.length, m = tb.length; const L = Array.from({ length: n + 1 }, () => new Uint16Array(m + 1));
  for (let i = n - 1; i >= 0; i--) for (let j = m - 1; j >= 0; j--) L[i][j] = ta[i] === tb[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  let i = 0, j = 0, out = '', dl = '', ins = ''; const flush = () => { if (dl) out += `<span class="del">${esc(dl)}</span>`; if (ins) out += `<span class="ins">${esc(ins)}</span>`; dl = ins = ''; };
  while (i < n && j < m) { if (ta[i] === tb[j]) { flush(); out += esc(ta[i]); i++; j++; } else if (L[i + 1][j] >= L[i][j + 1]) { dl += ta[i++]; } else { ins += tb[j++]; } }
  while (i < n) dl += ta[i++]; while (j < m) ins += tb[j++]; flush(); return out;
}
function raBody() {
  const v = tiles(); const a = dayStart(rp.from), b = dayStart(rp.to) + 86400000;
  const mods = R.filter(r => r.r === 'modified' && r.rt && A.toMs(r.rt) >= a && A.toMs(r.rt) < b).sort((x, y) => A.toMs(x.rt) - A.toMs(y.rt));
  const T = [[['#fff7ed', '#ffedd5'], 'Pending', v.pending, '', '#c2410c', '#ea580c'], [['#ecfdf5', '#d1fae5'], 'Approved &amp; Sent', v.approved, '', '#15803d', '#16a34a'], [['#eff6ff', '#dbeafe'], 'Modified &amp; Sent', mods.length || v.modified, '', '#1d4ed8', '#2563eb'], [['#ecfdf5', '#d1fae5'], 'Auto Resolved', v.auto, '', '#047857', '#059669'], [['#ecfeff', '#cffafe'], 'HITL Bypassed', v.hitl, 'Allowlisted &amp; sent', '#0e7490', '#0891b2'], [['#ecfdf5', '#d1fae5'], 'No Action Required - Deflection', v.defl, '', '#15803d', '#16a34a'], [['#fef2f2', '#fee2e2'], 'Parked - Issue', v.issue, '', '#b91c1c', '#dc2626'], [['#fff', '#e5e7eb'], 'Total Reviewed', v.reviewed, 'human actions only', '#0f172a', '#374151']];
  return `<div style="display:grid;grid-template-columns:repeat(8,1fr);gap:12px;margin:6px 0 20px">${T.map(t => `<div class="rtile" style="background:${t[0][0]};border-color:${t[0][1]};color:${t[5]}"><div class="l">${t[1]}</div><div class="v" style="color:${t[4]}">${t[2]}</div><div class="c" style="${t[1] === 'Total Reviewed' ? 'color:#9ca3af' : ''}">${t[3]}</div></div>`).join('')}</div>
  <div class="card pad" style="margin-bottom:16px"><h3 style="font-size:14px">Field Modifications Summary</h3><div style="margin-top:12px"><span class="chip" style="font-size:11px;background:#dbeafe">response_text: ${mods.length}x</span></div></div>
  <div class="card pad"><h3 style="color:#314f97;font-size:14px;display:flex;align-items:center;gap:8px">${I('pencil', 15)} Modified &amp; Sent (${mods.length})</h3><div style="margin-top:14px">${mods.map(r => { const o = r.or || '', f = r.fn || o; return `<div class="diffbox"><h4>${r.c}</h4><div class="rt">${esc(r.rb || '')} · ${clock(A.toMs(r.rt) + 30000)}</div><div style="font-size:12px;color:#6b7280;margin:6px 0 10px">${esc(r.k)} / ${esc(r.u)}</div><div style="font-size:12px;line-height:1.5;border:1px solid #f1f5f9;border-radius:6px;padding:10px 12px;word-break:break-all;max-height:140px;overflow:auto"><b>response_text:</b>${wordDiff(o, f)}</div><div class="pn"><div class="o"><h5>Original Response</h5><pre>${esc(o)}</pre></div><div class="m"><h5>Modified Response</h5><pre>${esc(f)}</pre></div></div></div>`; }).join('') || '<div class="empty">No modified responses in this range</div>'}</div></div>`;
}
function rtBody() { const pend = A.pendingRows().length; return `<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin-bottom:16px">${[['In-flight', 0, '#eff6ff'], ['Queue Depth', 2, '#fff7ed'], ['Pending Review', pend, '#fefce8'], ['Alerts', 1, '#fef2f2']].map(x => `<div class="rtile" style="background:${x[2]};border-color:#e5e7eb"><div class="l">${x[0]}</div><div class="v">${x[1]}</div></div>`).join('')}</div><div class="card pad"><h3 style="font-size:14px">Active alert</h3><div class="amb" style="margin-top:10px"><b>${I('warn', 16)} Circuit breakers are Half-Open for Azure Openai, Salesforce and Pineone</b></div><div class="sub">Not captured in the screenshots; shown for completeness.</div></div>`; }
function exBody() { const rows = R.filter(r => ['issue_in_resolution', 'report_generation_failed', 'pos_not_active', 'child_case_manual_routing'].includes(r.q) || /Issue in Resolution/.test(r.l || '')).slice(0, 200); return `<div class="card"><table class="t rp"><thead><tr><th>Case #</th><th>Category</th><th>Subcategory</th><th>Team</th><th>Park Reason</th><th>Created</th></tr></thead><tbody>${rows.map(r => `<tr><td class="m">${r.c}</td><td>${esc(r.k)}</td><td>${esc(r.u)}</td><td>${esc(r.m)}</td><td>${prTxt(r.q)}</td><td>${created(r.ts)}</td></tr>`).join('')}</tbody></table></div>`; }
function drBody(wk) {
  const rows = wk ? (() => { const map = new Map(); D.daily.forEach(x => { const d = new Date(x.d + 'T00:00:00Z'); const s = new Date(d - ((d.getUTCDay() + 6) % 7) * 864e5).toISOString().slice(0, 10); const o = map.get(s) || { d: s, vol: 0, def: 0, c: 0, e: 0 }; o.vol += x.vol; o.def += x.def; o.c += x.vol * x.con; o.e += x.vol * x.esc; map.set(s, o); }); return [...map.values()].map(o => ({ d: 'Week of ' + o.d, vol: o.vol, con: +(o.c / o.vol).toFixed(1), esc: +(o.e / o.vol).toFixed(1), def: o.def })); })() : D.daily.slice().reverse();
  return `<div class="card"><table class="t rp"><thead><tr><th>${wk ? 'Week' : 'Date'}</th><th>Volume</th><th>Containment</th><th>Escalation</th><th>Successful deflections</th></tr></thead><tbody>${rows.map(x => `<tr><td>${x.d}</td><td>${nf(x.vol)}</td><td>${x.con}%</td><td>${x.esc}%</td><td>${x.def}</td></tr>`).join('')}</tbody></table></div>`;
}
A.pages.reports = {
  title: 'Reports & Monitoring',
  render() {
    const body = { ops: opsBody, rt: rtBody, ex: exBody, dr: () => drBody(false), wr: () => drBody(true), ra: raBody }[rp.tab]();
    return `<div style="display:flex;align-items:center;gap:10px;color:#2563eb;margin-top:4px">${I('file', 22)}<h1 style="margin:0;font-size:24px;color:#0f172a">Reports &amp; Monitoring</h1></div><div style="color:#6b7280;font-size:13px;margin:6px 0 14px">Operational reports, real-time system health, and downloadable summaries.</div>${tabsHtml()}${rp.tab === 'ops' || rp.tab === 'ra' ? filtersHtml(rp.tab === 'ops') : ''}${body}`;
  },
  mount() {
    $$('.tab').forEach(b => b.onclick = () => { rp.tab = b.dataset.t; A.route(); });
    const rg = $('#rp-range'); if (rg) { rg.value = rp.range; rg.onchange = () => { const e = '2026-11-12'; const m = { 'Today': [e, e], 'Yesterday': ['2026-11-11', '2026-11-11'], 'Last 7 Days': ['2026-11-06', e], 'This Month': ['2026-11-01', e], 'Custom': [rp.from, rp.to] }; rp.range = rg.value; [rp.from, rp.to] = m[rg.value]; A.route(); }; }
    ['from', 'to'].forEach(k => { const e = $('#rp-' + k); if (e) e.onchange = () => { rp[k] = e.value; rp.range = 'Custom'; }; });
    const ld = $('#rp-load'); if (ld) ld.onclick = () => A.route();
    const dl = $('#rp-dl'); if (dl) dl.onclick = () => A.csv('operations_report.csv', [['case', 'category', 'subcategory', 'team', 'intent', 'last_action', 'park_reason'], ...rangeRows().map(r => [r.c, r.k, r.u, r.m, r.i, r.l, r.q])]);
    $$('.vw').forEach(b => b.onclick = () => { const c = b.dataset.v; rp.open.has(c) ? rp.open.delete(c) : rp.open.add(c); const y = $('#content').scrollTop; A.route(); $('#content').scrollTop = y; });
  }
};

/* ---------- Live Feed, File Upload (not in the screenshots: simple placeholders) ---------- */
A.pages.live = { title: 'Live Feed', render() { return `<div class="card pad"><h3>Live Feed</h3><div class="sub">Latest processed emails (this page was not captured; shown as a simple list)</div>${R.slice(0, 25).map(r => `<div style="display:flex;gap:14px;padding:12px 0;border-top:1px solid #f1f5f9;font-size:13px;align-items:center"><span style="width:8px;height:8px;border-radius:50%;background:${r.w === 'completed' ? '#10b981' : r.w === 'pending_review' ? '#f59e0b' : '#3b82f6'}"></span><span class="mono" style="color:#6b7280;width:70px">${clock(r.ts)}</span><a class="mono">${r.c}</a><span style="flex:1">${esc(r.s || '—')}</span><span style="color:#6b7280">${esc(r.i)}</span>${A.statusPill(r.w)}</div>`).join('')}</div>`; } };
A.pages.upload = { title: 'File Upload', render() { return `<div class="upl">${I('cloudup', 40)}<div style="margin-top:12px;font-size:15px;font-weight:600;color:#334155">Drop email files here to process them</div><div style="font-size:13px;margin-top:6px">This page was not captured in the screenshots; shown as a placeholder.</div></div>`; } };

A.start();
})();
