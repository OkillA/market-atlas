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
  function ticks(low, high) {
    if (low === high) high = low + 1;
    return Array.from({ length: 5 }, (_, index) => low + (high - low) * index / 4);
  }
  function precision(step) { return Math.min(6, Math.max(0, Math.ceil(-Math.log10(Math.abs(step) || 1)) + 1)); }
  function formatTicks(values) {
    const step = values.length > 1 ? values[1] - values[0] : 1;
    const max = Math.max(...values.map(Math.abs));
    const useK = max >= 10000 && Math.abs(step) >= 1000;
    const digits = precision(useK ? step / 1000 : step);
    return values.map(value => `${(useK ? value / 1000 : value).toFixed(digits)}${useK ? 'k' : ''}`);
  }
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
  function rectangleOverlap(a, b) { return a.x < b.x + b.w + 4 && a.x + a.w + 4 > b.x && a.y < b.y + b.h + 4 && a.y + a.h + 4 > b.y; }
  function chart(figure, width, colors) {
    const isBar = series => series.style === 'bar' || (figure.kind === 'bars' && !series.style);
    const compact = width < 430;
    const legendEntries = figure.series.map(series => wrapPixels(series.name, width - 100, 12));
    const legendHeight = legendEntries.reduce((sum, lines) => sum + lines.length * 19 + 5, 0);
    const axisLines = wrapPixels(figure.xLabel || 'Observation', width - 85, 12);
    const extra = Math.max(0, legendHeight - 19) + (axisLines.length - 1) * 19;
    const height = (compact ? 340 : 390) + extra;
    const left = compact ? 57 : 76, right = 25, top = 46, bottom = 93 + extra;
    const count = Math.max(...figure.series.map(series => series.values.length));
    const numbers = figure.series.flatMap(series => series.values.filter(Number.isFinite));
    for (const zone of figure.zones || []) numbers.push(zone.low, zone.high);
    if (figure.series.some(isBar)) numbers.push(0);
    let low = Math.min(...numbers), high = Math.max(...numbers);
    const rawSpan = high - low || Math.max(1, Math.abs(high) * .02);
    const logarithmic = figure.yScale === 'log';
    if (logarithmic && low <= 0) throw new Error(`Log scale requires positive values: ${figure.title}`);
    if (logarithmic) { low /= Math.exp(.12 * Math.log(high / low || 1.1)); high *= Math.exp(.12 * Math.log(high / low || 1.1)); }
    else {
      const dataLow = low;
      low -= rawSpan * .12; high += rawSpan * .12;
      if (figure.series.some(isBar) && dataLow >= 0) low = 0;
    }
    const transform = value => logarithmic ? Math.log(value) : value;
    const x = index => left + index / Math.max(1, count - 1) * (width - left - right);
    const y = value => height - bottom - (transform(value) - transform(low)) / (transform(high) - transform(low)) * (height - top - bottom);
    const tickValues = logarithmic ? ticks(Math.log(low), Math.log(high)).map(Math.exp) : ticks(low, high);
    const labels = formatTicks(tickValues);
    let markup = text(left, 19, figure.yLabel || 'Value', { color: colors.muted, size: compact ? 12 : 13 });
    tickValues.forEach((value, index) => {
      markup += `<line x1="${left}" y1="${y(value)}" x2="${width - right}" y2="${y(value)}" stroke="${colors.grid}"/>`;
      markup += text(left - 9, y(value) + 4, labels[index], { anchor: 'end', color: colors.muted, size: compact ? 12 : 13 });
    });
    const xTicks = figure.showAllXLabels ? Array.from({length:count}, (_,i)=>i) : [...new Set(compact ? [0, Math.round((count - 1) / 2), count - 1] : [0, Math.round((count - 1) / 3), Math.round(2 * (count - 1) / 3), count - 1])];
    xTicks.forEach(index => { markup += text(x(index), height - bottom + 25, observation(figure, index), { anchor: 'middle', color: colors.muted, size: compact ? 12 : 13 }); });
    markup += multiText((left + width - right) / 2, height - bottom + 50, axisLines, { anchor: 'middle', color: colors.muted, size: 12 });
    for (const zone of figure.zones || []) {
      const from = x(zone.from ?? 0), to = x(zone.to ?? count - 1);
      markup += `<rect x="${from}" y="${y(zone.high)}" width="${to - from}" height="${y(zone.low) - y(zone.high)}" fill="${colors.series[0]}" opacity=".10"/>`;
      markup += text(from + 5, y(zone.high) + 15, zone.label, { color: colors.ink, size: 12 });
    }
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
          markup += `<rect x="${bx}" y="${Math.min(y(value), y(0))}" width="${bw}" height="${Math.max(1, Math.abs(y(value) - y(0)))}" fill="${color}" opacity=".75"><title>${escape(`${series.name}, ${observation(figure, index)}: ${value}`)}</title></rect>`;
        });
      } else {
        let path = '', previous = null;
        series.values.forEach((value, index) => {
          if (!Number.isFinite(value)) { previous = null; return; }
          if (previous === null) path += `M${x(index).toFixed(2)},${y(value).toFixed(2)} `;
          else if (series.style === 'step') path += `H${x(index).toFixed(2)} V${y(value).toFixed(2)} `;
          else path += `L${x(index).toFixed(2)},${y(value).toFixed(2)} `;
          previous = value;
        });
        markup += `<path data-series="${seriesIndex}" d="${path}" fill="none" stroke="${color}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"${seriesDash[seriesIndex % 4] ? ` stroke-dasharray="${seriesDash[seriesIndex % 4]}"` : ''}/>`;
      }
    });
    const occupied = [];
    for (const annotation of figure.annotations || []) {
      const value = annotationValue(figure, annotation);
      if (!Number.isFinite(value)) continue;
      const px = x(annotation.index), py = y(value);
      const label = annotation.shortLabel || annotation.label;
      const labelLines = wrap(label, compact ? 17 : 27);
      const labelWidth = Math.min(width - left - right, Math.max(...labelLines.map(line => line.length)) * (compact ? 6 : 6.8) + 8);
      const labelHeight = labelLines.length * 18;
      const candidates = annotation.placement === 'below' ? [[8, 15], [-labelWidth - 8, 15], [8, -labelHeight - 8], [-labelWidth - 8, -labelHeight - 8]] : [[8, -labelHeight - 8], [-labelWidth - 8, -labelHeight - 8], [8, 15], [-labelWidth - 8, 15]];
      let box;
      for (const [dx, dy] of candidates) {
        const candidate = { x: Math.min(width - right - labelWidth, Math.max(left + 3, px + dx)), y: Math.min(height - bottom - labelHeight - 2, Math.max(top + 2, py + dy)), w: labelWidth, h: labelHeight };
        if (!occupied.some(item => rectangleOverlap(candidate, item))) { box = candidate; break; }
      }
      if (!box) {
        let distance = Infinity;
        for (let yy = top + 2; yy <= height - bottom - labelHeight - 2; yy += 12) {
          for (let xx = left + 3; xx <= width - right - labelWidth; xx += 12) {
            const candidate = { x: xx, y: yy, w: labelWidth, h: labelHeight };
            if (occupied.some(item => rectangleOverlap(candidate, item))) continue;
            const nextDistance = (xx + labelWidth / 2 - px) ** 2 + (yy + labelHeight / 2 - py) ** 2;
            if (nextDistance < distance) { box = candidate; distance = nextDistance; }
          }
        }
        // Extremely dense charts still get a bounded label; authoring review
        // must simplify a figure if no unoccupied position remains.
        box ||= { x: left + 3, y: top + 2, w: labelWidth, h: labelHeight };
      }
      occupied.push(box);
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
    return { markup, height };
  }
  function candles(figure, width, colors) {
    const compact = width < 430;
    const data = figure.candles;
    const candleDetails = figure.showOHLC ? (data.length > 1 && compact ? data.flatMap((candle, index) => wrapPixels(`${candle.label || index + 1}: O $${candle.open}, H $${candle.high}, L $${candle.low}, C $${candle.close}`, width - 24, 12)) : data.length === 1 ? wrapPixels(`Body: $${Math.abs(data[0].close - data[0].open).toFixed(2)}. Upper shadow: $${(data[0].high - Math.max(data[0].open, data[0].close)).toFixed(2)}. Lower shadow: $${(Math.min(data[0].open, data[0].close) - data[0].low).toFixed(2)}.`, width - 24, 12) : []) : [];
    const footerExtra = Math.max(0, candleDetails.length * 19 - 45);
    const height = (figure.showOHLC ? 400 : 340) + footerExtra;
    const left = compact ? 52 : 70, right = 26, top = 39, bottom = (figure.showOHLC ? 126 : 66) + footerExtra;
    let low = Math.min(...data.map(candle => candle.low)), high = Math.max(...data.map(candle => candle.high));
    const span = high - low || 1; low -= span * .15; high += span * .15;
    const x = index => data.length === 1 ? width * (compact ? .44 : .34) : left + (index + .5) / data.length * (width - left - right);
    const y = value => height - bottom - (value - low) / (high - low) * (height - top - bottom);
    const axisTicks = ticks(low, high), axisLabels = formatTicks(axisTicks);
    let markup = text(left, 18, figure.yLabel || 'Price ($)', { color: colors.muted, size: 12 });
    axisTicks.forEach((value, index) => { markup += `<line x1="${left}" y1="${y(value)}" x2="${width - right}" y2="${y(value)}" stroke="${colors.grid}"/>` + text(left - 8, y(value) + 4, axisLabels[index], { anchor: 'end', color: colors.muted, size: compact ? 12 : 13 }); });
    const bodyWidth = Math.min(36, (width - left - right) / data.length * .42);
    data.forEach((candle, index) => {
      const color = candle.close >= candle.open ? colors.series[0] : colors.series[1];
      const xx = x(index);
      markup += `<line x1="${xx}" y1="${y(candle.high)}" x2="${xx}" y2="${y(candle.low)}" stroke="${color}" stroke-width="1.8"/><rect x="${xx - bodyWidth / 2}" y="${Math.min(y(candle.open), y(candle.close))}" width="${bodyWidth}" height="${Math.max(2, Math.abs(y(candle.open) - y(candle.close)))}" fill="${color}"/><title>${escape(`${candle.label || index + 1}: O ${candle.open}, H ${candle.high}, L ${candle.low}, C ${candle.close}`)}</title>`;
      const label = candle.label || String(index + (figure.xStart ?? 1));
      markup += multiText(xx, height - bottom + 24, wrapPixels(label, Math.max(38, (width - left - right) / data.length - 5), 12), { anchor: 'middle', color: colors.muted, size: 12 });
      if (figure.showOHLC && data.length > 1 && !compact) markup += multiText(xx, height - 60, [`O ${candle.open}  H ${candle.high}`, `L ${candle.low}  C ${candle.close}`], { anchor: 'middle', size: 12, color: colors.muted });
    });
    if (data.length === 1) {
      const candle = data[0], labelX = x(0) + bodyWidth / 2 + 25;
      const fixedLabels = [{ value: candle.high, label: `High $${candle.high}`, offset: -5 }, { value: candle.low, label: `Low $${candle.low}`, offset: 14 }, { value: candle.open, label: `Open $${candle.open}`, offset: 15 }, { value: candle.close, label: `Close $${candle.close}`, offset: -5 }];
      if (candle.open === candle.close) fixedLabels.splice(2, 2, { value: candle.open, label: `Open / close $${candle.open}`, offset: -5 });
      fixedLabels.forEach(item => { markup += `<line x1="${x(0) + bodyWidth / 2 + 2}" y1="${y(item.value)}" x2="${labelX - 4}" y2="${y(item.value) + item.offset - 4}" stroke="${colors.muted}" stroke-width=".7"/>` + text(labelX, y(item.value) + item.offset, item.label, { color: colors.ink, size: compact ? 12 : 13 }); });

    }
    const occupied = [];
    for (const annotation of figure.annotations || []) {
      const candle = data[annotation.index]; if (!candle) continue;
      const value = annotation.value ?? candle.close;
      const label = annotation.shortLabel || annotation.label;
      if (data.length === 1) {
        const labelX = left + 3, labelY = y(value) - 7;
        markup += text(labelX, labelY, label, { size: 12 });
        markup += `<line x1="${labelX + label.length * (compact ? 5 : 6) + 3}" y1="${labelY - 3}" x2="${x(0) - bodyWidth / 2 - 3}" y2="${y(value)}" stroke="${colors.muted}" stroke-width=".7"/>`;
      } else {
        const px = x(annotation.index), py = y(value);
        const lines = wrapPixels(label, Math.min(width - left - right - 10, compact ? 95 : 180), 12);
        const bw = Math.max(...lines.map(line => textWidth(line, 12))) + 8;
        const bh = lines.length * 19;
        const above = [[8,-bh-8],[-bw-8,-bh-8],[8,12],[-bw-8,12]];
        const candidates = annotation.placement === 'below' ? [...above.slice(2),...above.slice(0,2)] : above;
        let box;
        for (const [dx,dy] of candidates) {
          const candidate = {x:Math.max(left+3,Math.min(width-right-bw,px+dx)),y:Math.max(top+2,Math.min(height-bottom-bh-2,py+dy)),w:bw,h:bh};
          if (!occupied.some(item => rectangleOverlap(candidate,item))) { box=candidate;break; }
        }
        box ||= {x:left+3,y:top+2,w:bw,h:bh}; occupied.push(box);
        markup += `<line x1="${px}" y1="${py}" x2="${box.x+bw/2}" y2="${box.y+bh/2}" stroke="${colors.muted}" stroke-width=".7"/><circle cx="${px}" cy="${py}" r="2.5" fill="${colors.paper}" stroke="${colors.series[0]}"/><rect x="${box.x-2}" y="${box.y-2}" width="${bw+4}" height="${bh+3}" fill="${colors.paper}" opacity=".95"/>`;
        markup += multiText(box.x+2,box.y+12,lines,{size:12});
      }
    }
    if (candleDetails.length) markup += multiText(12, height - 22 - (candleDetails.length - 1) * 19, candleDetails, { color: colors.muted, size: 12 });
    markup += text((left + width - right) / 2, height - 8, figure.xLabel || 'Interval', { anchor: 'middle', color: colors.muted, size: 12 });
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
    figure.levels.forEach((level, index) => {
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
