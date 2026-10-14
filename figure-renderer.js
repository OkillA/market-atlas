/* Shared SVG renderer for the browser edition and portable manuscript figures. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.AtlasFigures = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[character]));
  const palettes = {
    light: { paper: '#fffefa', ink: '#263831', muted: '#586057', grid: '#e2e6dd', series: ['#234d3d', '#a6523e', '#927b38', '#586057'] },
    dynamic: { paper: 'var(--surface,#fffefa)', ink: 'var(--ink,#263831)', muted: 'var(--muted,#586057)', grid: 'var(--grid,#e2e6dd)', series: ['var(--green,#234d3d)', 'var(--rust,#a6523e)', 'var(--gold,#927b38)', 'var(--muted,#586057)'] }
  };
  // Round tick steps (1, 2 or 5 × 10ⁿ) so readers can locate stated values.
  function ticks(low, high) {
    if (low === high) high = low + 1;
    // The largest 1/2/5 step that still gives at least four ticks.
    const magnitude = 10 ** Math.floor(Math.log10((high - low) / 4));
    const count = step => Math.floor(high / step + 1e-9) - Math.ceil(low / step - 1e-9) + 1;
    const step = [10, 5, 2, 1, .5, .2].map(m => m * magnitude).find(value => count(value) >= 4);
    const values = [];
    for (let value = Math.ceil(low / step - 1e-9) * step; value <= high + step * 1e-9; value += step) values.push(Number(value.toPrecision(12)));
    return values;
  }
  function logTicks(low, high) {
    for (const mantissas of [[1], [1, 2, 5], [1, 2, 3, 5, 7], [1, 1.5, 2, 3, 4, 5, 6, 7, 8, 9]]) {
      const values = [];
      for (let exponent = Math.floor(Math.log10(low)); exponent <= Math.ceil(Math.log10(high)); exponent++) {
        for (const mantissa of mantissas) { const value = Number((mantissa * 10 ** exponent).toPrecision(12)); if (value >= low && value <= high) values.push(value); }
      }
      if (values.length >= 3) return values;
    }
    return [low, high];
  }
  function integerTicks(low, high) {
    const step = Math.max(1, Math.round((high - low) / 4));
    const first = Math.ceil(low / step) * step;
    return Array.from({ length: Math.floor((high - first) / step) + 1 }, (_, index) => first + index * step);
  }
  function decimals(value) {
    for (let digits = 0; digits < 6; digits++) if (Math.abs(Number(value.toFixed(digits)) - value) <= 1e-9 * Math.max(1, Math.abs(value))) return digits;
    return 6;
  }
  // Show each tick with the fewest decimals that represent it exactly; money uses cents once fractional.
  function formatTicks(values, money = false) {
    const max = Math.max(...values.map(Math.abs));
    const useK = max >= 10000 && values.every(value => value % 1000 === 0);
    const scaled = values.map(value => useK ? value / 1000 : value);
    let digits = Math.max(...scaled.map(decimals));
    if (money && digits === 1) digits = 2;
    return scaled.map(value => `${value.toFixed(digits)}${useK ? 'k' : ''}`);
  }
  // Label every observation that fits; otherwise label round observation numbers.
  function xTickIndices(figure, count, spacing, size) {
    const all = Array.from({ length: count }, (_, index) => index);
    if (figure.showAllXLabels || count <= 1) return all;
    const widest = Math.max(...all.map(index => textWidth(String(observation(figure, index)), size))) + 10;
    const numeric = all.every(index => Number.isFinite(Number(observation(figure, index))));
    const step = [1, 2, 5, 10, 20, 25, 50, 100, 200, 500].find(value => value * spacing >= widest) || Math.ceil(widest / spacing);
    if (step === 1) return all;
    const chosen = all.filter(index => numeric ? Number(observation(figure, index)) % step === 0 : index % step === 0);
    const fits = (index, others) => others.every(other => Math.abs(other - index) * spacing >= widest);
    if (!chosen.includes(0) && fits(0, chosen)) chosen.unshift(0);
    if (!chosen.includes(count - 1)) {
      // A named final category (such as "Today") is often the point of the figure; keep it.
      if (!numeric) while (chosen.length > 1 && !fits(count - 1, chosen.slice(-1))) chosen.pop();
      if (fits(count - 1, chosen)) chosen.push(count - 1);
    }
    return chosen;
  }
  // Dashed, labelled horizontal reference levels (frozen thresholds, stops, targets).
  // A label that would cover data moves to a key under the chart instead (`keyed`).
  function referenceLevels(figure, bounds, y, colors, data, reserved, keyed) {
    let markup = ''; const boxes = [], unplaced = [];
    for (const [index, reference] of (figure.references || []).entries()) {
      const yy = y(reference.value), label = reference.label, w = textWidth(label, 12) + 8, h = 16;
      markup += `<line x1="${bounds.left}" y1="${yy}" x2="${bounds.right}" y2="${yy}" stroke="${colors.ink}" stroke-width="1.1" stroke-dasharray="6 4" opacity=".75"><title>${escape(label)}</title></line>`;
      if (keyed.has(index)) continue;
      // Prefer the right end, then any position along the line, just above or below it.
      const candidates = [];
      for (let x = bounds.right - w; x >= bounds.left; x -= 4) for (const top of [yy - h - 3, yy + 4]) candidates.push({ x, y: Math.min(bounds.bottom - h, Math.max(bounds.top, top)), w, h });
      const blocked = box => [...reserved, ...boxes].some(item => rectangleOverlap(box, item, 2));
      const box = candidates.find(item => !blocked(item) && !data.count(item));
      if (!box) { unplaced.push(index); continue; }
      boxes.push(box);
      markup += `<rect x="${box.x}" y="${box.y}" width="${box.w}" height="${box.h}" fill="${colors.paper}" opacity=".92"/>` + text(box.x + 4, box.y + 12, label, { color: colors.ink, size: 12, weight: 500 });
    }
    return { markup, boxes, unplaced };
  }
  function referenceKey(references, keyed, x, y, width, colors) {
    let markup = '', yy = y;
    for (const index of [...keyed].sort((a, b) => a - b)) {
      markup += `<line x1="${x}" x2="${x + 26}" y1="${yy - 4}" y2="${yy - 4}" stroke="${colors.ink}" stroke-width="1.1" stroke-dasharray="6 4"/>`;
      const lines = wrapPixels(references[index].label, width - 35, 12);
      markup += multiText(x + 35, yy, lines, { color: colors.ink, size: 12 }); yy += lines.length * 19 + 5;
    }
    return markup;
  }
  function keyHeight(references, keyed, width) { return [...keyed].reduce((sum, index) => sum + wrapPixels(references[index].label, width - 35, 12).length * 19 + 5, 0); }
  function observation(figure, index) { return figure.xLabels?.[index] ?? index + (figure.xStart ?? 1); }
  function annotationValue(figure, annotation) {
    if (Number.isFinite(annotation.value)) return annotation.value;
    return figure.series?.[annotation.seriesIndex ?? 0]?.values[annotation.index];
  }
  function wrap(value, maximum) {
    const words = String(value ?? '').split(/\s+/), lines = [];
    let line = '';
    for (const word of words) {
      if (line && (line + ' ' + word).length > maximum) { lines.push(line); line = word; }
      else line += `${line ? ' ' : ''}${word}`;
    }
    if (line) lines.push(line);
    return lines.length ? lines : [''];
  }
  let measuringContext;
  const metricCache = new Map();
  function textWidth(value, size, weight = 400) {
    const key = `${size}/${weight}/${value}`;
    if (metricCache.has(key)) return metricCache.get(key);
    if (typeof document !== 'undefined') {
      measuringContext ||= document.createElement('canvas').getContext('2d');
      measuringContext.font = `${weight} ${size}px Arial`;
      const width = measuringContext.measureText(String(value)).width; metricCache.set(key, width); return width;
    }
    // Conservative portable fallback; browser QA checks the actual glyph bounds.
    return [...String(value)].reduce((sum, char) => sum + (/[ilI.,:;!'|]/.test(char) ? .30 : /[MW@%]/.test(char) ? .91 : char === ' ' ? .30 : /[A-Z0-9]/.test(char) ? .67 : .57), 0) * size * (weight >= 500 ? 1.04 : 1);
  }
  function wrapPixels(value, width, size = 13, weight = 400) {
    const lines = []; let line = '';
    for (const word of String(value ?? '').split(/\s+/)) {
      if (line && textWidth(`${line} ${word}`, size, weight) > width) { lines.push(line); line = ''; }
      if (textWidth(word, size, weight) <= width) { line += `${line ? ' ' : ''}${word}`; continue; }
      // Split a long token rather than letting an identifier escape the figure.
      for (const char of `${line ? ' ' : ''}${word}`) {
        if (textWidth(line + char, size, weight) > width && line) { lines.push(line); line = ''; }
        line += char;
      }
    }
    if (line) lines.push(line);
    return lines.length ? lines : [''];
  }
  const seriesDash = ['', '8 4', '2 4', '8 3 2 3'];
  function text(x, y, value, options = {}) {
    const { anchor = 'start', color, size = 13, weight = 400 } = options;
    return `<text class="af-text" x="${x}" y="${y}" text-anchor="${anchor}" style="font-size:${size}px;font-weight:${weight};${color ? `fill:${color};` : ''}">${escape(value)}</text>`;
  }
  function multiText(x, y, lines, options = {}) {
    return lines.map((line, index) => text(x, y + index * 19, line, options)).join('');
  }
  function rectangleOverlap(a, b, gap = 4) { return a.x < b.x + b.w + gap && a.x + a.w + gap > b.x && a.y < b.y + b.h + gap && a.y + a.h + gap > b.y; }
  // A coarse map of drawn data (line strokes, bars, candle bodies and wicks) so that
  // opaque label backgrounds can avoid hiding observations.
  function dataMap(width, height, cell = 2) {
    const columns = Math.ceil(width / cell) + 1, rows = Math.ceil(height / cell) + 1, filled = new Uint8Array(columns * rows);
    let sums = null;
    const mark = (x, y) => {
      const column = Math.floor(x / cell), row = Math.floor(y / cell);
      if (column >= 0 && row >= 0 && column < columns && row < rows) { filled[row * columns + column] = 1; sums = null; }
    };
    const map = {
      rect(x, y, w, h) { for (let yy = y; yy <= y + h; yy += cell / 2) for (let xx = x; xx <= x + w; xx += cell / 2) mark(xx, yy); },
      segment(x1, y1, x2, y2, radius = 1.5) {
        const steps = Math.max(1, Math.ceil(Math.hypot(x2 - x1, y2 - y1) / (cell / 2)));
        for (let i = 0; i <= steps; i++) map.rect(x1 + (x2 - x1) * i / steps - radius, y1 + (y2 - y1) * i / steps - radius, 2 * radius, 2 * radius);
      },
      count(box) {
        if (!sums) {
          sums = new Uint32Array((columns + 1) * (rows + 1));
          for (let row = 0; row < rows; row++) for (let column = 0; column < columns; column++) sums[(row + 1) * (columns + 1) + column + 1] = filled[row * columns + column] + sums[row * (columns + 1) + column + 1] + sums[(row + 1) * (columns + 1) + column] - sums[row * (columns + 1) + column];
        }
        const c1 = Math.max(0, Math.floor(box.x / cell)), r1 = Math.max(0, Math.floor(box.y / cell));
        const c2 = Math.min(columns, Math.ceil((box.x + box.w) / cell)), r2 = Math.min(rows, Math.ceil((box.y + box.h) / cell));
        if (c2 <= c1 || r2 <= r1) return 0;
        return sums[r2 * (columns + 1) + c2] - sums[r1 * (columns + 1) + c2] - sums[r2 * (columns + 1) + c1] + sums[r1 * (columns + 1) + c1];
      }
    };
    return map;
  }
  function placeLabel(px, py, w, h, bounds, placements, occupied, markers, data) {
    // Check the actual background after clamping, against every marker (including
    // annotations that have not been drawn yet) and previously placed labels.
    const background = candidate => ({ x: candidate.x - 2, y: candidate.y - 2, w: w + 4, h: h + 3 });
    const blocked = candidate => occupied.some(item => rectangleOverlap(candidate, item)) || markers.some(marker => rectangleOverlap(background(candidate), marker, 0));
    const covered = candidate => data ? data.count(background(candidate)) : 0;
    for (const [dx, dy] of placements) {
      const candidate = { x: Math.min(bounds.right - w, Math.max(bounds.left, px + dx)), y: Math.min(bounds.bottom - h, Math.max(bounds.top, py + dy)), w, h };
      if (!blocked(candidate) && !covered(candidate)) return { box: candidate, score: Math.hypot(Math.max(candidate.x - px, 0, px - candidate.x - w), Math.max(candidate.y - py, 0, py - candidate.y - h)), hidden: 0 };
    }
    // Otherwise search nearby positions. Each 2px data cell hidden costs as much as
    // moving the label 4px further from its marker, so a label stays close to its
    // observation without hiding more than a sliver of the data.
    let box, score = Infinity, hidden = 0;
    for (let yy = bounds.top; yy <= bounds.bottom - h; yy += 4) {
      for (let xx = bounds.left; xx <= bounds.right - w; xx += 4) {
        const candidate = { x: xx, y: yy, w, h };
        if (blocked(candidate)) continue;
        const nearest = Math.hypot(Math.max(xx - px, 0, px - xx - w), Math.max(yy - py, 0, py - yy - h));
        const cells = covered(candidate), nextScore = nearest + 4 * cells;
        if (nextScore < score) { box = candidate; score = nextScore; hidden = cells; }
      }
    }
    // Authoring review must simplify a figure if no free position remains.
    return box ? { box, score, hidden } : { box: { x: bounds.left, y: bounds.top, w, h }, score: Infinity, hidden: Infinity };
  }
  function layoutLabels(items, bounds, markers, data, reserved = []) {
    // Place labels in authoring order. If that hides data and the panel has only a few
    // labels, try the other orders and keep the lowest total score.
    const run = order => {
      const occupied = [...reserved], boxes = []; let score = 0, hidden = 0;
      for (const index of order) {
        const item = items[index], result = placeLabel(item.px, item.py, item.w, item.h, bounds, item.placements, occupied, markers, data);
        occupied.push(result.box); boxes[index] = result.box; score += result.score; hidden += result.hidden;
      }
      return { boxes, score, hidden };
    };
    const original = items.map((_, index) => index);
    let best = run(original);
    if (best.hidden && items.length > 1 && items.length <= 5) {
      const permute = (rest, prefix) => {
        if (!rest.length) { const next = run(prefix); if (next.score < best.score) best = next; return; }
        rest.forEach((value, index) => permute([...rest.slice(0, index), ...rest.slice(index + 1)], [...prefix, value]));
      };
      permute(original, []);
    }
    return best.boxes;
  }
  const left0 = compact => compact ? 57 : 76;
  function chart(figure, width, colors, keyed = new Set()) {
    const isBar = series => series.style === 'bar' || (figure.kind === 'bars' && !series.style);
    const compact = width < 430;
    const legendEntries = figure.series.map(series => wrapPixels(series.name, width - 100, 12));
    const legendHeight = legendEntries.reduce((sum, lines) => sum + lines.length * 19 + 5, 0) + keyHeight(figure.references, keyed, width - left0(compact));
    const axisLines = wrapPixels(figure.xLabel || 'Observation', width - 85, 12);
    const extra = Math.max(0, legendHeight - 19) + (axisLines.length - 1) * 19;
    const height = (compact ? 340 : 390) + extra;
    const left = left0(compact), right = 25, top = 46, bottom = 93 + extra;
    const count = Math.max(...figure.series.map(series => series.values.length));
    const numbers = figure.series.flatMap(series => series.values.filter(Number.isFinite));
    for (const zone of figure.zones || []) numbers.push(zone.low, zone.high);
    for (const reference of figure.references || []) numbers.push(reference.value);
    if (figure.series.some(isBar)) numbers.push(0);
    let low = Math.min(...numbers), high = Math.max(...numbers);
    const rawSpan = high - low || Math.max(1, Math.abs(high) * .02);
    const logarithmic = figure.yScale === 'log';
    if (figure.integerTicks && logarithmic) throw new Error(`Integer ticks require a linear scale: ${figure.title}`);
    if (logarithmic && low <= 0) throw new Error(`Log scale requires positive values: ${figure.title}`);
    if (logarithmic) { low /= Math.exp(.12 * Math.log(high / low || 1.1)); high *= Math.exp(.12 * Math.log(high / low || 1.1)); }
    else {
      const dataLow = low;
      low -= rawSpan * .12; high += rawSpan * .12;
      if (figure.series.some(isBar) && dataLow >= 0) low = 0;
    }
    const transform = value => logarithmic ? Math.log(value) : value;
    const hasBars = figure.series.some(isBar);
    const x = index => left + (hasBars ? (index + .5) / count : index / Math.max(1, count - 1)) * (width - left - right);
    const y = value => height - bottom - (transform(value) - transform(low)) / (transform(high) - transform(low)) * (height - top - bottom);
    const tickValues = (figure.yTicks || (logarithmic ? logTicks(low, high) : figure.integerTicks ? integerTicks(low, high) : ticks(low, high))).filter(value => value >= low && value <= high);
    const labels = figure.integerTicks ? tickValues.map(String) : formatTicks(tickValues, /\$/.test(figure.yLabel || ''));
    let markup = text(left, 19, figure.yLabel || 'Value', { color: colors.muted, size: compact ? 12 : 13 });
    tickValues.forEach((value, index) => {
      markup += `<line x1="${left}" y1="${y(value)}" x2="${width - right}" y2="${y(value)}" stroke="${colors.grid}"/>`;
      markup += text(left - 9, y(value) + 4, labels[index], { anchor: 'end', color: colors.muted, size: compact ? 12 : 13 });
    });
    const xTicks = xTickIndices(figure, count, (width - left - right) / Math.max(1, hasBars ? count : count - 1), compact ? 12 : 13);
    xTicks.forEach(index => { markup += text(x(index), height - bottom + 25, observation(figure, index), { anchor: 'middle', color: colors.muted, size: compact ? 12 : 13 }); });
    markup += multiText((left + width - right) / 2, height - bottom + 50, axisLines, { anchor: 'middle', color: colors.muted, size: 12 });
    for (const zone of figure.zones || []) {
      const from = x(zone.from ?? 0), to = x(zone.to ?? count - 1);
      markup += `<rect x="${from}" y="${y(zone.high)}" width="${to - from}" height="${y(zone.low) - y(zone.high)}" fill="${colors.series[0]}" opacity=".10"/>`;
      markup += text(from + 5, y(zone.high) + 15, zone.label, { color: colors.ink, size: 12 });
    }
    const data = dataMap(width, height);
    figure.series.forEach((series, seriesIndex) => {
      const color = colors.series[seriesIndex % 4];
      if (isBar(series)) {
        const slot = (width - left - right) / Math.max(1, count);
        const barSeries = figure.series.filter(isBar).length;
        const barIndex = figure.series.slice(0, seriesIndex).filter(isBar).length;
        const bw = Math.min(38, slot * .65 / barSeries);
        series.values.forEach((value, index) => {
          if (!Number.isFinite(value)) return;
          const bx = x(index) - bw * barSeries / 2 + barIndex * bw;
          data.rect(bx, Math.min(y(value), y(0)), bw, Math.max(1, Math.abs(y(value) - y(0))));
          markup += `<rect x="${bx}" y="${Math.min(y(value), y(0))}" width="${bw}" height="${Math.max(1, Math.abs(y(value) - y(0)))}" fill="${color}" opacity=".75"><title>${escape(`${series.name}, ${observation(figure, index)}: ${value}`)}</title></rect>`;
        });
      } else {
        let path = '', previous = null;
        series.values.forEach((value, index) => {
          if (!Number.isFinite(value)) { previous = null; return; }
          if (previous === null) path += `M${x(index).toFixed(2)},${y(value).toFixed(2)} `;
          else if (series.style === 'step') { path += `H${x(index).toFixed(2)} V${y(value).toFixed(2)} `; data.segment(x(index - 1), y(previous), x(index), y(previous)); data.segment(x(index), y(previous), x(index), y(value)); }
          else { path += `L${x(index).toFixed(2)},${y(value).toFixed(2)} `; data.segment(x(index - 1), y(previous), x(index), y(value)); }
          previous = value;
        });
        markup += `<path data-series="${seriesIndex}" d="${path}" fill="none" stroke="${color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"${seriesDash[seriesIndex % 4] ? ` stroke-dasharray="${seriesDash[seriesIndex % 4]}"` : ''}/>`;
      }
    });
    const markers = (figure.annotations || []).map(annotation => ({ px: x(annotation.index), py: y(annotationValue(figure, annotation)) })).filter(point => Number.isFinite(point.py)).map(point => ({ x: point.px - 4.35, y: point.py - 4.35, w: 8.7, h: 8.7 }));
    const references = referenceLevels(figure, { left: left + 3, right: width - right, top: top + 2, bottom: height - bottom - 2 }, y, colors, data, markers, keyed);
    if (references.unplaced.length) return chart(figure, width, colors, new Set((figure.references || []).map((_, index) => index)));
    markup += references.markup;
    for (const reference of figure.references || []) data.segment(left + 3, y(reference.value), width - right, y(reference.value), 1);
    const labelled = (figure.annotations || []).filter(annotation => Number.isFinite(annotationValue(figure, annotation))).map(annotation => {
      const value = annotationValue(figure, annotation), px = x(annotation.index), py = y(value);
      const labelLines = wrap(annotation.shortLabel || annotation.label, compact ? 17 : 27);
      const w = Math.min(width - left - right, Math.max(...labelLines.map(line => line.length)) * (compact ? 6 : 6.8) + 8), h = labelLines.length * 18;
      const placements = annotation.placement === 'below' ? [[8, 15], [-w - 8, 15], [8, -h - 8], [-w - 8, -h - 8]] : [[8, -h - 8], [-w - 8, -h - 8], [8, 15], [-w - 8, 15]];
      return { annotation, value, px, py, labelLines, w, h, placements };
    });
    const boxes = layoutLabels(labelled, { left: left + 3, right: width - right, top: top + 2, bottom: height - bottom - 2 }, markers, data, references.boxes);
    for (const [index, { annotation, value, px, py, labelLines }] of labelled.entries()) {
      const box = boxes[index];
      markup += `<line x1="${px}" y1="${py}" x2="${box.x + box.w / 2}" y2="${box.y + box.h / 2}" stroke="${colors.muted}" stroke-width=".7"/>`;
      markup += `<circle data-annotation-series="${annotation.seriesIndex ?? 0}" data-value="${value}" cx="${px}" cy="${py}" r="3.5" fill="${colors.paper}" stroke="${colors.series[(annotation.seriesIndex ?? 0) % 4]}" stroke-width="1.7"><title>${escape(annotation.label)}</title></circle>`;
      markup += `<rect x="${box.x - 2}" y="${box.y - 2}" width="${box.w + 4}" height="${box.h + 3}" fill="${colors.paper}" opacity=".92"/>`;
      markup += multiText(box.x + 2, box.y + 12, labelLines, { color: colors.ink, size: 12 });
    }
    let legendY = height - legendHeight + 2;
    legendEntries.forEach((lines, index) => {
      const color = colors.series[index % 4];
      markup += isBar(figure.series[index]) ? `<rect x="${left}" y="${legendY - 10}" width="26" height="9" fill="${color}"/>` : `<line x1="${left}" x2="${left + 26}" y1="${legendY - 4}" y2="${legendY - 4}" stroke="${color}" stroke-width="2.4" ${seriesDash[index % 4] ? `stroke-dasharray="${seriesDash[index % 4]}"` : ''}/>`;
      markup += multiText(left + 35, legendY, lines, { color: colors.ink, size: 12 });
      legendY += lines.length * 19 + 5;
    });
    markup += referenceKey(figure.references, keyed, left, legendY, width - left, colors);
    return { markup, height };
  }
  function candles(figure, width, colors, keyed = new Set()) {
    const compact = width < 430;
    const data = figure.candles;
    const candleDetails = figure.showOHLC ? (data.length > 1 && compact ? data.flatMap((candle, index) => wrapPixels(`${candle.label || index + 1}: O $${candle.open}, H $${candle.high}, L $${candle.low}, C $${candle.close}`, width - 24, 12)) : data.length === 1 ? wrapPixels(`Body: $${Math.abs(data[0].close - data[0].open).toFixed(2)}. Upper shadow: $${(data[0].high - Math.max(data[0].open, data[0].close)).toFixed(2)}. Lower shadow: $${(Math.min(data[0].open, data[0].close) - data[0].low).toFixed(2)}.`, width - 24, 12) : []) : [];
    const footerExtra = Math.max(0, candleDetails.length * 19 - 37);
    const key = keyHeight(figure.references, keyed, width - 24);
    const base = (figure.showOHLC ? 400 : 340) + footerExtra, height = base + key;
    const left = compact ? 52 : 70, right = 26, top = 39, bottom = (figure.showOHLC ? 126 : 66) + footerExtra + key;
    const levels = (figure.references || []).map(reference => reference.value);
    let low = Math.min(...data.map(candle => candle.low), ...levels), high = Math.max(...data.map(candle => candle.high), ...levels);
    const span = high - low || 1; low -= span * .15; high += span * .15;
    const x = index => data.length === 1 ? width * (compact ? .44 : .34) : left + (index + .5) / data.length * (width - left - right);
    const y = value => height - bottom - (value - low) / (high - low) * (height - top - bottom);
    const axisTicks = (figure.yTicks || ticks(low, high)).filter(value => value >= low && value <= high), axisLabels = formatTicks(axisTicks, true);
    let markup = text(left, 18, figure.yLabel || 'Price ($)', { color: colors.muted, size: 12 });
    axisTicks.forEach((value, index) => { markup += `<line x1="${left}" y1="${y(value)}" x2="${width - right}" y2="${y(value)}" stroke="${colors.grid}"/>` + text(left - 8, y(value) + 4, axisLabels[index], { anchor: 'end', color: colors.muted, size: compact ? 12 : 13 }); });
    const bodyWidth = Math.min(36, (width - left - right) / data.length * .42);
    const drawn = dataMap(width, height), reserved = [];
    data.forEach((candle, index) => {
      const color = candle.close >= candle.open ? colors.series[0] : colors.series[1];
      const xx = x(index);
      drawn.segment(xx, y(candle.high), xx, y(candle.low), 1.2);
      drawn.rect(xx - bodyWidth / 2, Math.min(y(candle.open), y(candle.close)), bodyWidth, Math.max(2, Math.abs(y(candle.open) - y(candle.close))));
      markup += `<line x1="${xx}" y1="${y(candle.high)}" x2="${xx}" y2="${y(candle.low)}" stroke="${color}" stroke-width="1.8"/><rect x="${xx - bodyWidth / 2}" y="${Math.min(y(candle.open), y(candle.close))}" width="${bodyWidth}" height="${Math.max(2, Math.abs(y(candle.open) - y(candle.close)))}" fill="${color}"/><title>${escape(`${candle.label || index + 1}: O ${candle.open}, H ${candle.high}, L ${candle.low}, C ${candle.close}`)}</title>`;
      const label = candle.label || String(index + (figure.xStart ?? 1));
      markup += multiText(xx, base - bottom + key + 24, wrapPixels(label, Math.max(38, (width - left - right) / data.length - 5), 12), { anchor: 'middle', color: colors.muted, size: 12 });
      if (figure.showOHLC && data.length > 1 && !compact) markup += multiText(xx, base - 60, [`O ${candle.open}  H ${candle.high}`, `L ${candle.low}  C ${candle.close}`], { anchor: 'middle', size: 12, color: colors.muted });
    });
    if (data.length === 1) {
      const candle = data[0], labelX = x(0) + bodyWidth / 2 + 25;
      const fixedLabels = [{ value: candle.high, label: `High $${candle.high}`, offset: -5 }, { value: candle.low, label: `Low $${candle.low}`, offset: 14 }, { value: candle.open, label: `Open $${candle.open}`, offset: 15 }, { value: candle.close, label: `Close $${candle.close}`, offset: -5 }];
      if (candle.open === candle.close) fixedLabels.splice(2, 2, { value: candle.open, label: `Open / close $${candle.open}`, offset: -5 });
      fixedLabels.forEach(item => { markup += `<line x1="${x(0) + bodyWidth / 2 + 2}" y1="${y(item.value)}" x2="${labelX - 4}" y2="${y(item.value) + item.offset - 4}" stroke="${colors.muted}" stroke-width=".7"/>` + text(labelX, y(item.value) + item.offset, item.label, { color: colors.ink, size: compact ? 12 : 13 }); });
      fixedLabels.forEach(item => reserved.push({ x: labelX, y: y(item.value) + item.offset - 13, w: textWidth(item.label, compact ? 12 : 13), h: 16 }));
      for (const annotation of figure.annotations || []) {
        const lines = wrapPixels(annotation.shortLabel || annotation.label, x(0) - bodyWidth / 2 - 14 - (left + 3), 12);
        reserved.push({ x: left + 3, y: y(annotation.value ?? candle.close) - 20 - (lines.length - 1) * 19, w: Math.max(...lines.map(line => textWidth(line, 12))), h: lines.length * 19 });
      }
      reserved.push({ x: x(0) - bodyWidth / 2, y: y(candle.high), w: bodyWidth, h: y(candle.low) - y(candle.high) });
    }
    const markers = (figure.annotations || []).filter(annotation => data[annotation.index]).map(annotation => ({ x: x(annotation.index) - 3, y: y(annotation.value ?? data[annotation.index].close) - 3, w: 6, h: 6 }));
    const references = referenceLevels(figure, { left: left + 3, right: width - right, top: top + 2, bottom: height - bottom - 2 }, y, colors, drawn, [...reserved, ...markers], keyed);
    if (references.unplaced.length) return candles(figure, width, colors, new Set((figure.references || []).map((_, index) => index)));
    markup += references.markup;
    for (const reference of figure.references || []) drawn.segment(left + 3, y(reference.value), width - right, y(reference.value), 1);
    const labelled = data.length === 1 ? [] : (figure.annotations || []).filter(annotation => data[annotation.index]).map(annotation => {
      const px = x(annotation.index), py = y(annotation.value ?? data[annotation.index].close);
      const lines = wrapPixels(annotation.shortLabel || annotation.label, Math.min(width - left - right - 10, compact ? 95 : 180), 12);
      const w = Math.max(...lines.map(line => textWidth(line, 12))) + 8, h = lines.length * 19;
      const above = [[8, -h - 8], [-w - 8, -h - 8], [8, 12], [-w - 8, 12]];
      return { annotation, px, py, lines, w, h, placements: annotation.placement === 'below' ? [...above.slice(2), ...above.slice(0, 2)] : above };
    });
    const boxes = layoutLabels(labelled, { left: left + 3, right: width - right, top: top + 2, bottom: height - bottom - 2 }, markers, drawn, references.boxes);
    for (const annotation of figure.annotations || []) {
      const candle = data[annotation.index]; if (!candle) continue;
      const value = annotation.value ?? candle.close;
      const label = annotation.shortLabel || annotation.label;
      if (data.length === 1) {
        const labelX = left + 3, lines = wrapPixels(label, x(0) - bodyWidth / 2 - 14 - labelX, 12), labelY = y(value) - 7 - (lines.length - 1) * 19;
        const labelWidth = Math.max(...lines.map(line => textWidth(line, 12)));
        markup += `<line x1="${labelX + labelWidth + 3}" y1="${y(value) - 10}" x2="${x(0) - bodyWidth / 2 - 3}" y2="${y(value)}" stroke="${colors.muted}" stroke-width=".7"/>`;
        markup += `<rect x="${labelX - 2}" y="${labelY - 13}" width="${labelWidth + 4}" height="${lines.length * 19}" fill="${colors.paper}" opacity=".92"/>` + multiText(labelX, labelY, lines, { size: 12 });
      } else {
        const item = labelled.find(entry => entry.annotation === annotation), box = boxes[labelled.indexOf(item)];
        const { px, py, lines, w: bw, h: bh } = item;
        markup += `<line x1="${px}" y1="${py}" x2="${box.x+bw/2}" y2="${box.y+bh/2}" stroke="${colors.muted}" stroke-width=".7"/><circle cx="${px}" cy="${py}" r="2.5" fill="${colors.paper}" stroke="${colors.series[0]}"/><rect x="${box.x-2}" y="${box.y-2}" width="${bw+4}" height="${bh+3}" fill="${colors.paper}" opacity=".95"/>`;
        markup += multiText(box.x+2,box.y+12,lines,{size:12});
      }
    }
    if (candleDetails.length) markup += multiText(12, base - 30 - (candleDetails.length - 1) * 19, candleDetails, { color: colors.muted, size: 12 });
    markup += text((left + width - right) / 2, base - 8, figure.xLabel || 'Interval', { anchor: 'middle', color: colors.muted, size: 12 });
    markup += referenceKey(figure.references, keyed, 12, base + 14, width - 12, colors);
    return { markup, height };
  }
  function table(figure, width, colors) {
    const compact = width < 500;
    let markup = '', yy = 22;
    if (compact && figure.columns.length > 2) {
      figure.rows.forEach((row, index) => {
        markup += text(12, yy, `Record ${index + 1}`, { color: colors.series[0], weight: 500 }); yy += 24;
        row.forEach((cell, column) => { const lines = wrap(`${figure.columns[column]}: ${cell}`, Math.floor((width - 30) / 6.8)); markup += multiText(12, yy, lines, { color: colors.ink, size: 12 }); yy += lines.length * 19 + 7; });
        markup += `<line x1="12" y1="${yy}" x2="${width - 12}" y2="${yy}" stroke="${colors.grid}"/>`; yy += 28;
      });
    } else {
      const columnWidth = (width - 24) / figure.columns.length;
      const maximum = Math.max(9, Math.floor((columnWidth - 14) / 6.7));
      const headerLines = figure.columns.map(column => wrap(column, maximum));
      const headerHeight = Math.max(...headerLines.map(lines => lines.length)) * 19 + 16;
      headerLines.forEach((lines, column) => { markup += multiText(12 + column * columnWidth, yy, lines, { color: colors.series[0], size: 12, weight: 500 }); });
      yy += headerHeight;
      for (const row of figure.rows) {
        const cells = row.map(cell => wrap(cell, maximum));
        const rowHeight = Math.max(...cells.map(lines => lines.length)) * 19 + 20;
        markup += `<line x1="12" y1="${yy - 10}" x2="${width - 12}" y2="${yy - 10}" stroke="${colors.grid}"/>`;
        cells.forEach((lines, column) => { markup += multiText(12 + column * columnWidth, yy + 8, lines, { color: colors.ink, size: 12 }); });
        yy += rowHeight;
      }
    }
    return { markup, height: Math.max(90, yy + 12) };
  }
  function flow(figure, width, colors) {
    let markup = '', yy = 25;
    figure.steps.forEach((step, index) => {
      const titleLines = wrapPixels(`${index + 1}. ${step.title}`, width - 30, 14, 500);
      markup += multiText(15, yy, titleLines, { color: colors.series[0], weight: 500, size: 14 }); yy += titleLines.length * 19 + 10;
      const lines = wrapPixels(step.text, width - 30, 13);
      markup += multiText(15, yy, lines, { color: colors.ink, size: 13 }); yy += lines.length * 19 + 20;
      if (index < figure.steps.length - 1) { markup += text(20, yy, '↓', { color: colors.muted, size: 20 }); yy += 32; }
    });
    return { markup, height: yy + 5 };
  }
  function profile(figure, width, colors) {
    const left = 74, right = 24, top = 35, rowHeight = 37, height = top + figure.levels.length * rowHeight + 50;
    const max = Math.max(...figure.levels.map(level => level.volume));
    let markup = text(left, 17, figure.yLabel || 'Price ($)', { color: colors.muted, size: 12 });
    // Higher prices sit higher, matching every price chart.
    [...figure.levels].sort((a, b) => b.price - a.price).forEach((level, index) => {
      const yy = top + index * rowHeight;
      markup += text(left - 10, yy + 17, Number(level.price).toFixed(2), { anchor: 'end', color: colors.muted, size: 12 });
      const barWidth = level.volume / max * (width - left - right - 52);
      markup += `<rect x="${left}" y="${yy}" width="${barWidth}" height="23" fill="${colors.series[0]}" opacity=".7"/>`;
      markup += text(left + barWidth + 7, yy + 17, level.volume, { size: 12 });
    });
    markup += text(left, height - 12, figure.xLabel || 'Volume (shares)', { color: colors.muted, size: 12 });
    return { markup, height };
  }
  function piece(figure, width, colors) {
    switch (figure.kind || 'line') {
      case 'panels': {
        let markup = '', offset = 12;
        for (const panel of figure.panels) {
          const titleLines = wrapPixels(panel.title, width - 24, 14, 500);
          markup += multiText(10, offset + 15, titleLines, { color: colors.ink, weight: 500, size: 14 }); offset += titleLines.length * 20 + 18;
          const result = piece(panel, width, colors);
          markup += `<g transform="translate(0 ${offset})">${result.markup}</g>`; offset += result.height;
          if (panel.caption) { const lines = wrap(panel.caption, Math.floor((width - 28) / 6.7)); markup += multiText(12, offset + 17, lines, { color: colors.muted, size: 12 }); offset += lines.length * 19 + 28; }
          else offset += 25;
        }
        return { markup, height: offset };
      }
      case 'candles': return candles(figure, width, colors);
      case 'table': return table(figure, width, colors);
      case 'flow': return flow(figure, width, colors);
      case 'profile': return profile(figure, width, colors);
      case 'line': case 'bars': return chart(figure, width, colors);
      default: throw new Error(`Unsupported figure kind: ${figure.kind}`);
    }
  }
  function render(figure, options = {}) {
    const width = Math.max(220, Math.round(options.width || 760));
    const colors = palettes[options.theme || 'light'];
    const result = piece(figure, width, colors);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${result.height}" role="img" aria-label="${escape(figure.title)}"><title>${escape(figure.title)}</title><desc>${escape(figure.caption || '')}</desc><style>.af-text{font-family:Arial,sans-serif;fill:${colors.ink}}</style><rect width="${width}" height="${result.height}" fill="${colors.paper}"/>${result.markup}</svg>`;
  }
  function flatten(figure) { return figure.kind === 'panels' ? figure.panels.flatMap(flatten) : [figure]; }
  return Object.freeze({ render, flatten, observation, annotationValue, formatTicks });
});
