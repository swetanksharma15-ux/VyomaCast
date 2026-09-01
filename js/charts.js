/**
 * VyomaCast — Charts Module (charts.js)
 * Clean, lightweight HTML5 Canvas 2D charts with automatic high-DPI scaling.
 */

const Charts = {
  drawSparkline(canvasId, temps) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !temps || !temps.length) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width || canvas.parentElement.clientWidth || 300;
    const h = rect.height || 140;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const min = Math.min(...temps);
    const max = Math.max(...temps);
    const range = max - min || 1;
    const pad = 24;

    const points = temps.map((t, i) => ({
      x: pad + (i / (temps.length - 1)) * (w - pad * 2),
      y: (h - pad) - ((t - min) / range) * (h - pad * 2)
    }));

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 3;
    ctx.stroke();

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    ctx.font = '600 11px Inter, sans-serif';
    ctx.textAlign = 'center';

    points.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#0284c7';
      ctx.fill();
      ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
      ctx.fillText(`${temps[i]}°`, p.x, p.y - 8);
    });
  },

  drawForecastChart(canvasId, highs, lows, labels) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !highs || !highs.length) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width || canvas.parentElement.clientWidth || 300;
    const h = rect.height || 200;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const all = [...highs, ...lows];
    const min = Math.min(...all) - 2;
    const max = Math.max(...all) + 2;
    const range = max - min || 1;
    const pad = 32;

    const highPts = highs.map((t, i) => ({
      x: pad + (i / (highs.length - 1)) * (w - pad * 2),
      y: (h - pad) - ((t - min) / range) * (h - pad * 2)
    }));

    const lowPts = lows.map((t, i) => ({
      x: pad + (i / (lows.length - 1)) * (w - pad * 2),
      y: (h - pad) - ((t - min) / range) * (h - pad * 2)
    }));

    // High Line
    ctx.beginPath();
    ctx.moveTo(highPts[0].x, highPts[0].y);
    highPts.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = '#ef4444';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Low Line
    ctx.beginPath();
    ctx.moveTo(lowPts[0].x, lowPts[0].y);
    lowPts.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = '#0284c7';
    ctx.lineWidth = 3;
    ctx.stroke();

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    ctx.font = '600 11px Inter, sans-serif';
    ctx.textAlign = 'center';

    highPts.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#ef4444';
      ctx.fill();
      ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
      ctx.fillText(`${highs[i]}°`, p.x, p.y - 8);
    });

    lowPts.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#0284c7';
      ctx.fill();
      ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
      ctx.fillText(`${lows[i]}°`, p.x, p.y + 15);
      ctx.fillStyle = '#64748b';
      ctx.fillText(labels[i], p.x, h - 6);
    });
  },

  drawHourlySpline(canvasId, values, labels, color = '#0284c7') {
    const canvas = document.getElementById(canvasId);
    if (!canvas || !values || !values.length) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width || canvas.parentElement.clientWidth || 300;
    const h = rect.height || 240;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min || 1;
    const pad = 32;

    const points = values.map((v, i) => ({
      x: pad + (i / (values.length - 1)) * (w - pad * 2),
      y: (h - pad) - ((v - min) / range) * (h - pad * 2)
    }));

    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach(p => ctx.lineTo(p.x, p.y));
    ctx.strokeStyle = color;
    ctx.lineWidth = 3;
    ctx.stroke();

    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    ctx.font = '600 11px Inter, sans-serif';
    ctx.textAlign = 'center';

    points.forEach((p, i) => {
      if (i % 3 === 0 || i === points.length - 1) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
        ctx.fillStyle = isDark ? '#f8fafc' : '#0f172a';
        ctx.fillText(`${values[i]}`, p.x, p.y - 8);
        ctx.fillStyle = '#64748b';
        ctx.fillText(labels[i], p.x, h - 6);
      }
    });
  }
};