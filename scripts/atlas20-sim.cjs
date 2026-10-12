#!/usr/bin/env node
/*
 * Atlas-20 v1.0 teaching scenario simulator (fictional data).
 * Processes the supplied opening state, bars, and screen log under the
 * chapter-26 rule sheet and prints/returns the full ledger. All money is
 * handled in integer cents to avoid floating-point drift.
 *
 * Run: node scripts/atlas20-sim.cjs          (prints ledger + assertions)
 *      require('./atlas20-sim.cjs').run(overrides)              (used by the chapter builder)
 */
'use strict';

const RULES = {
  maxPositions: 5,            // open positions (including halted) + new orders
  notionalCap: 0.10,          // of equity at the decision close, valued at the limit price
  riskBudget: 0.005,          // of equity at the decision close
  stopDistance: 200,          // cents below the actual fill
  targetDistance: 400,        // cents above the actual fill
  timeLimit: 10,              // holding sessions; entry session = 1
  limitMarkup: 0.01,          // limit = floor_to_cent(signal close x 1.01)
  participation: 0.01,        // entry fill <= floor(1% of entry-session volume)
  costPerFill: 250,           // cents per executed fill
  minADV: 2000000_00,         // cents: 20-session mean dollar volume through decision close
  priceBand: [20_00, 100_00], // cents: decision-close price band
  earningsWindow: 10,         // no scheduled earnings in sessions t+1 .. t+10
};

const c = x => Math.round(x * 100); // dollars -> cents for literal data
const $ = cents => (cents < 0 ? '−' : '') + '$' + (Math.abs(cents) / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const bar = (o, h, l, cl, v) => ({ o: c(o), h: c(h), l: c(l), c: c(cl), v });

// ---- Supplied data -------------------------------------------------------
const SESSIONS = [0, 1, 2, 3, 4, 5, 6, 7];
const STOCKS = ['Alder', 'Birch', 'Cedar', 'Dogwood', 'Elm', 'Fir', 'Ginkgo', 'Hazel'];
// null = no bar exists for that stock-session (halt or vendor gap). Undefined = not needed / not supplied.
const BARS = {
  Alder:   { 0: bar(31.10, 32.05, 31.00, 31.96), 1: bar(32.10, 32.60, 31.70, 32.45, 410000), 2: bar(32.50, 33.40, 32.20, 33.20), 3: bar(33.30, 34.10, 33.00, 33.90), 4: bar(33.80, 34.70, 33.50, 34.40), 5: bar(34.50, 35.60, 34.30, 35.40), 6: bar(35.50, 36.40, 35.20, 35.50) },
  Birch:   { 0: bar(70.40, 71.90, 70.10, 71.75), 1: bar(72.20, 73.10, 71.60, 72.80, 11800), 2: bar(72.90, 73.60, 72.10, 73.30), 3: bar(73.20, 74.00, 72.60, 73.10), 4: bar(73.00, 73.50, 72.20, 72.90), 5: bar(72.90, 76.60, 70.00, 71.20) },
  Cedar:   { 0: bar(40.10, 41.60, 40.00, 40.80), 1: bar(41.60, 41.95, 41.20, 41.50, 240000), 2: bar(41.70, 42.40, 41.40, 42.30), 3: bar(43.00, 43.40, 42.50, 43.10, 260000), 4: bar(43.20, 43.90, 42.80, 43.60), 5: bar(43.50, 44.20, 43.10, 43.30), 6: bar(43.40, 44.00, 42.70, 43.80), 7: bar(43.90, 44.60, 43.50, 44.30) },
  Dogwood: { 0: bar(60.30, 61.50, 60.10, 61.20), 1: bar(61.40, 62.60, 61.20, 62.40), 2: bar(62.80, 63.30, 62.10, 62.90, 520000), 3: bar(62.70, 63.20, 61.90, 62.20), 4: bar(62.30, 63.80, 62.00, 63.50), 5: bar(63.40, 64.10, 62.60, 62.90), 6: bar(62.80, 63.40, 61.70, 62.10), 7: bar(62.20, 63.60, 61.90, 63.30) },
  Elm:     { 0: bar(54.20, 55.60, 54.00, 55.40), 6: bar(57.00, 59.20, 56.80, 58.90), 7: bar(59.10, 59.90, 58.70, 59.60, 300000) },
  Fir:     { 0: bar(35.90, 36.20, 35.40, 35.80), 1: bar(35.70, 35.95, 34.60, 34.90), 2: bar(34.80, 35.30, 34.40, 35.10), 3: null, 4: bar(33.10, 33.60, 32.40, 33.20) },
  Ginkgo:  { 0: bar(24.00, 24.70, 23.90, 24.60), 3: null, 5: bar(25.00, 25.50, 24.90, 25.40) },
  Hazel:   { 0: bar(48.20, 48.90, 47.90, 48.60), 1: bar(48.70, 49.40, 48.30, 49.10), 2: bar(49.20, 49.80, 48.90, 49.30), 3: bar(49.60, 51.95, 49.50, 51.80) },
};
// Opening state at the session-0 close (positions entered before the scenario; no exit occurred before session 1).
const OPENING = {
  cash: c(81330.00),
  positions: [
    { stock: 'Hazel', qty: 200, fill: c(47.00), entrySession: -7, entryCost: 250 },
    { stock: 'Fir', qty: 250, fill: c(36.00), entrySession: -2, entryCost: 250 },
  ],
};
// Screen log: every non-held stock whose decision-day close exceeded its prior-20 high (sessions t-20..t-1).
// Other non-held stock/decision-close pairs: close <= prior-20 high (no signal). Held stocks are excluded.
// Fields are computed only from
// data available at the decision close: h20 = highest high of the 20 prior completed sessions; adv = mean of
// close x volume over sessions t-19..t; earnings = next scheduled earnings session in the calendar snapshot;
// complete = all bars t-20..t present and valid.
const SCREEN = {
  0: [
    { stock: 'Alder', h20: c(31.00), adv: c(9800000), earnings: 31, complete: true },
    { stock: 'Birch', h20: c(70.00), adv: c(2300000), earnings: 40, complete: true },
    { stock: 'Cedar', h20: c(40.00), adv: c(6400000), earnings: 25, complete: true },
    { stock: 'Dogwood', h20: c(60.00), adv: c(14100000), earnings: 35, complete: true },
    { stock: 'Elm', h20: c(54.00), adv: c(11700000), earnings: 6, complete: true },
    { stock: 'Ginkgo', h20: c(24.10), adv: c(1600000), earnings: 44, complete: true },
  ],
  1: [{ stock: 'Dogwood', h20: c(61.50), adv: c(14300000), earnings: 35, complete: true }],
  2: [{ stock: 'Cedar', h20: c(41.95), adv: c(6600000), earnings: 25, complete: true }],
  3: [{ stock: 'Hazel', h20: c(50.90), adv: c(5200000), earnings: 38, complete: true }],
  4: [],
  5: [{ stock: 'Ginkgo', h20: c(25.00), adv: null, earnings: 44, complete: false }],
  6: [{ stock: 'Elm', h20: c(56.30), adv: c(13900000), earnings: 68, complete: true }],
  7: [],
};

// ---- Simulation ----------------------------------------------------------
function run(over = {}) {
  const R = { ...RULES, ...(over.rules || {}) };
  const opening = over.opening || OPENING;
  const lastSession = over.lastSession ?? 7;
  const rankKey = over.rankKey || (e => e.marginBp);    // larger first
  let cash = opening.cash;
  const positions = opening.positions.map(p => ({ ...p, stop: p.fill - R.stopDistance, target: p.fill + R.targetDistance, oneR: p.qty * R.stopDistance, lastClose: BARS[p.stock][0].c }));
  let pending = [];
  const trades = [], log = [], decisions = [], ledger = [];
  const fee = R.costPerFill;

  function decide(t) {
    const equity = cash + positions.reduce((s, p) => s + p.qty * p.lastClose, 0);
    const held = new Set(positions.map(p => p.stock));
    const screened = [];
    for (const s of SCREEN[t] || []) {
      const b = BARS[s.stock][t];
      const rec = { session: t, stock: s.stock, close: b ? b.c : null, h20: s.h20, adv: s.adv, earnings: s.earnings, complete: s.complete };
      if (held.has(s.stock)) { rec.status = 'held — not screened'; screened.push(rec); continue; }
      if (!s.complete || !b) { rec.status = 'ineligible: incomplete 21-session record'; screened.push(rec); continue; }
      if (!(b.c > s.h20)) throw new Error(`screen log lists non-signal ${s.stock}@${t}`);
      rec.marginBp = Math.round((b.c - s.h20) * 10000 / s.h20); // basis points = 0.01 percentage point
      if (b.c < R.priceBand[0] || b.c > R.priceBand[1]) rec.status = 'ineligible: price band';
      else if (s.adv < R.minADV) rec.status = 'ineligible: liquidity';
      else if (s.earnings >= t + 1 && s.earnings <= t + R.earningsWindow) rec.status = 'ineligible: earnings in window';
      else rec.status = 'eligible';
      screened.push(rec);
    }
    const eligible = screened.filter(r => r.status === 'eligible')
      .sort((a, b) => (rankKey(b) - rankKey(a)) || a.stock.localeCompare(b.stock));
    let slots = R.maxPositions - positions.length;
    let reserved = 0;
    const orders = [];
    eligible.forEach((r, i) => {
      r.rank = i + 1;
      const L = Math.floor(r.close * (1 + R.limitMarkup) + 1e-9); // floor to cent
      r.limit = L;
      r.riskQty = Math.floor(R.riskBudget * equity / R.stopDistance + 1e-9);
      r.notionalQty = Math.floor(R.notionalCap * equity / L + 1e-9);
      r.cashBefore = cash - reserved;
      r.cashQty = Math.max(0, Math.floor((cash - reserved - fee) / L));
      if (slots <= 0) { r.status = 'eligible — no free slot'; r.qty = 0; return; }
      r.qty = Math.min(r.riskQty, r.notionalQty, r.cashQty);
      r.binding = ['risk', 'notional', 'cash'].filter((k, j) => [r.riskQty, r.notionalQty, r.cashQty][j] === r.qty);
      if (r.qty < 1) { r.status = 'eligible — size below 1 share'; return; }
      r.reserve = r.qty * L + fee;
      reserved += r.reserve; slots -= 1;
      r.status = 'order placed';
      orders.push({ stock: r.stock, qty: r.qty, limit: L, placed: t, reserve: r.reserve });
    });
    decisions.push({ session: t, equity, screened, freeSlotsBefore: R.maxPositions - positions.length });
    pending = orders;
    return { equity, reserved };
  }

  function exitPosition(p, t, price, reason) {
    cash += p.qty * price - fee;
    const gross = p.qty * (price - p.fill);
    const net = gross - p.entryCost - fee;
    trades.push({ stock: p.stock, qty: p.qty, entrySession: p.entrySession, fill: p.fill, stop: p.stop, target: p.target, oneR: p.oneR, exitSession: t, exit: price, reason, gross, costs: p.entryCost + fee, net, netR: net / p.oneR });
    log.push({ session: t, event: `${p.stock} exit ${p.qty} @ ${$(price)} (${reason})`, cashFlow: p.qty * price - fee, cost: fee });
    positions.splice(positions.indexOf(p), 1);
  }

  // D0 decision (no session processing at session 0: the opening state is the session-0 close).
  let d = decide(0);
  ledger.push(snapshot(0, d));

  for (let t = 1; t <= lastSession; t++) {
    // 1. Exits for positions held before this session.
    for (const p of [...positions]) {
      const b = BARS[p.stock][t];
      if (b === undefined) throw new Error(`missing data for held ${p.stock}@${t}`);
      if (b === null) { p.stale = true; log.push({ session: t, event: `${p.stock} halted: no bar; marked at last close ${$(p.lastClose)}`, cashFlow: 0, cost: 0 }); continue; }
      p.stale = false;
      const hs = t - p.entrySession + 1;
      if (b.o <= p.stop) exitPosition(p, t, b.o, 'gap through stop, exit at open');
      else if (b.o >= p.target) exitPosition(p, t, b.o, 'gap through target, exit at open');
      else if (hs > R.timeLimit) exitPosition(p, t, b.o, `overdue time exit at resumed open (holding session ${hs})`);
      else if (b.l <= p.stop && b.h > p.target) exitPosition(p, t, p.stop, 'stop and target in one bar: stop assumed first');
      else if (b.l <= p.stop) exitPosition(p, t, p.stop, 'stop');
      else if (b.h > p.target) exitPosition(p, t, p.target, 'target');
      else if (hs >= R.timeLimit) exitPosition(p, t, b.c, `time exit at close (holding session ${hs})`);
      else p.lastClose = b.c;
    }
    // 2. Entries for orders placed at the previous close (day limit orders; unfilled remainder cancels).
    for (const o of pending) {
      const b = BARS[o.stock][t];
      if (!b) { log.push({ session: t, event: `${o.stock} no bar: order cancels`, cashFlow: 0, cost: 0 }); o.result = 'no bar'; continue; }
      let price = null, intraday = false;
      if (b.o <= o.limit) price = b.o; else if (b.l < o.limit) { price = o.limit; intraday = true; }
      if (price === null) { o.result = `no fill (open ${$(b.o)} > limit; low ${$(b.l)} did not trade below)`; log.push({ session: t, event: `${o.stock} buy ${o.qty} @ limit ${$(o.limit)}: no fill; ${$(o.reserve)} released`, cashFlow: 0, cost: 0 }); continue; }
      if (!Number.isFinite(b.v)) throw new Error(`entry volume needed for ${o.stock}@${t}`);
      const cap = Math.floor(R.participation * b.v + 1e-9);
      const qty = Math.min(o.qty, cap);
      if (qty < 1) { o.result = 'volume cap below one share: no fill'; log.push({ session: t, event: `${o.stock} volume cap below one share: order cancels`, cashFlow: 0, cost: 0 }); continue; }
      cash -= qty * price + fee;
      o.result = { qty, price, intraday, cap };
      const p = { stock: o.stock, qty, fill: price, entrySession: t, entryCost: fee, stop: price - R.stopDistance, target: price + R.targetDistance, oneR: qty * R.stopDistance, lastClose: b.c, ordered: o.qty };
      positions.push(p);
      log.push({ session: t, event: `${o.stock} buy ${qty}${qty < o.qty ? ` of ${o.qty} (partial: cap ${cap})` : ''} @ ${$(price)}${intraday ? ' (intraday limit fill)' : ' (open)'}; stop ${$(p.stop)}, target ${$(p.target)}`, cashFlow: -(qty * price + fee), cost: fee });
      // Entry-bar exit check.
      if (!intraday) {
        if (b.l <= p.stop && b.h > p.target) exitPosition(p, t, p.stop, 'entry bar: stop assumed first');
        else if (b.l <= p.stop) exitPosition(p, t, p.stop, 'entry-bar stop');
        else if (b.h > p.target) exitPosition(p, t, p.target, 'entry-bar target');
      } else if (b.l <= p.stop) exitPosition(p, t, p.stop, 'entry-bar stop (intraday fill)');
    }
    pending = [];
    d = decide(t);
    ledger.push(snapshot(t, d));
  }

  function snapshot(t, d) {
    const holdings = positions.map(p => ({ stock: p.stock, qty: p.qty, close: p.lastClose, value: p.qty * p.lastClose, stale: !!p.stale }));
    const value = holdings.reduce((s, h) => s + h.value, 0);
    return { session: t, cash, holdings, positionsValue: value, equity: cash + value, positions: positions.length, orders: pending.map(o => `${o.stock} ${o.qty} @ ${$(o.limit)}`), reserved: d.reserved, available: cash - d.reserved, invested: value / (cash + value), sessionCosts: log.filter(e => e.session === t).reduce((s, e) => s + e.cost, 0), sessionEvents: log.filter(e => e.session === t).map(e => e.event) };
  }

  return { rules: R, ledger, trades, decisions, log, openPositions: positions.map(p => ({ ...p })) };
}

module.exports = { run, RULES, BARS, SCREEN, OPENING, STOCKS, SESSIONS, fmt: $ };

if (require.main === module) {
  const assert = require('node:assert/strict');
  const res = run();
  console.log('=== Decisions');
  for (const d of res.decisions) {
    console.log(`D${d.session}: equity ${$(d.equity)}, free slots ${d.freeSlotsBefore}`);
    for (const r of d.screened) console.log('   ', r.stock, r.close && $(r.close), 'h20', $(r.h20), 'margin%', r.marginBp != null ? (r.marginBp / 100).toFixed(2) : '-', r.status, r.rank ? `rank ${r.rank} L ${$(r.limit)} risk ${r.riskQty} notional ${r.notionalQty} cash ${r.cashQty} -> ${r.qty} reserve ${r.reserve != null ? $(r.reserve) : '-'} binding ${r.binding || '-'}` : '');
  }
  console.log('=== Ledger');
  for (const l of res.ledger) {
    console.log(`S${l.session}: cash ${$(l.cash)} pos ${$(l.positionsValue)} equity ${$(l.equity)} n=${l.positions} invested ${(100 * l.invested).toFixed(1)}% reserved ${$(l.reserved)} avail ${$(l.available)} costs ${$(l.sessionCosts)}`);
    l.sessionEvents.forEach(e => console.log('     ', e));
    console.log('      holdings:', l.holdings.map(h => `${h.stock} ${h.qty}×${$(h.close)}=${$(h.value)}${h.stale ? ' (stale)' : ''}`).join('; '));
    console.log('      orders:', l.orders.join('; ') || 'none');
  }
  console.log('=== Trades');
  for (const t of res.trades) console.log(`${t.stock} ${t.qty} in S${t.entrySession} @ ${$(t.fill)} out S${t.exitSession} @ ${$(t.exit)} [${t.reason}] gross ${$(t.gross)} costs ${$(t.costs)} net ${$(t.net)} 1R ${$(t.oneR)} netR ${t.netR.toFixed(4)}`);
  console.log('=== Open at end');
  for (const p of res.openPositions) console.log(`${p.stock} ${p.qty} @ ${$(p.fill)} stop ${$(p.stop)} target ${$(p.target)} 1R ${$(p.oneR)} close ${$(p.lastClose)} unrealized gross ${$(p.qty * (p.lastClose - p.fill))}`);

  // ---- Reconciliation assertions ----
  const L = res.ledger;
  for (const l of L) assert.equal(l.cash + l.holdings.reduce((s, h) => s + h.qty * h.close, 0), l.equity, 'cash + positions = equity');
  for (let i = 1; i < L.length; i++) {
    // Equity change = mark changes on shares held + cash effects of trades at their prices - costs.
    // Equivalent check: cash change equals the sum of logged cash flows.
    const flows = res.log.filter(e => e.session === i).reduce((s, e) => s + e.cashFlow, 0);
    assert.equal(L[i].cash - L[i - 1].cash, flows, `cash flow reconciliation S${i}`);
    assert.ok(L[i].available >= 0, 'no negative available cash');
    assert.ok(L[i].positions + L[i].orders.length <= 5, 'slot limit');
  }
  // Total P&L reconciliation: final equity - opening equity = realized changes since S0 marks + unrealized - costs.
  const E0 = L[0].equity, E7 = L[L.length - 1].equity;
  const open0 = { Hazel: c(48.60), Fir: c(35.80) };
  let pnlSince0 = 0;
  for (const t of res.trades) { const basis = t.entrySession <= 0 ? open0[t.stock] : t.fill; const entryCost = t.entrySession <= 0 ? 0 : 250; pnlSince0 += t.qty * (t.exit - basis) - 250 - entryCost; }
  for (const p of res.openPositions) pnlSince0 += p.qty * (p.lastClose - p.fill) - p.entryCost;
  assert.equal(E7 - E0, pnlSince0, 'whole-scenario P&L reconciliation');
  console.log(`\nReconciliation passed. E0 ${$(E0)} -> E7 ${$(E7)}; change ${$(E7 - E0)}; total costs paid in sessions 1-7 ${$(res.log.reduce((s, e) => s + e.cost, 0))}.`);
}
