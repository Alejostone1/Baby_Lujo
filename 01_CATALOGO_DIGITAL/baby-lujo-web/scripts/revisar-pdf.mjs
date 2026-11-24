// Control de calidad del PDF: captura cada página y arma hojas de contacto para revisión visual.
// Además detecta textos que se salen de su caja o de la página.
// Uso: node scripts/revisar-pdf.mjs <base> <carpetaSalida> [escala]
import { chromium } from 'playwright-core';
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { navegador } from './navegador.mjs';

const [, , base = 'http://localhost:3000', out = 'revision-pdf', escala = '1'] = process.argv;
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch({ executablePath: navegador() });
const page = await b.newPage({ viewport: { width: 1000, height: 1300 }, deviceScaleFactor: +escala });
await page.emulateMedia({ media: 'print' });
await page.goto(`${base}/imprimir/alta`, { waitUntil: 'networkidle', timeout: 180000 });
await page.evaluate(() => document.fonts.ready);

const problemas = await page.evaluate(() => {
  const r = [];
  document.querySelectorAll('.hoja').forEach((h, i) => {
    const hb = h.getBoundingClientRect();
    h.querySelectorAll('h2,h3,p,dd,dt,span,li,img,a').forEach(el => {
      const b = el.getBoundingClientRect();
      if (!b.width) return;
      if (b.left < hb.left - 0.5 || b.right > hb.right + 0.5 || b.top < hb.top - 0.5 || b.bottom > hb.bottom + 0.5)
        if (!el.closest('.marca-foto')) r.push(`pág ${i + 1}: fuera de página → ${el.tagName} "${(el.textContent || el.getAttribute('src') || '').slice(0, 40)}"`);
      if (el.scrollWidth > el.clientWidth + 1 && getComputedStyle(el).overflow !== 'visible') r.push(`pág ${i + 1}: texto cortado → ${el.textContent?.slice(0, 40)}`);
    });
  });
  // Colisiones entre bloques de texto y fotos dentro de la misma página
  document.querySelectorAll('.hoja').forEach((h, i) => {
    const bloques = [...h.querySelectorAll('.ficha, .arco-pdf, .cabecera, .pie')].map(e => ({ e, b: e.getBoundingClientRect() }));
    for (let a = 0; a < bloques.length; a++) for (let c = a + 1; c < bloques.length; c++) {
      const x = bloques[a].b, y = bloques[c].b;
      if (bloques[a].e.contains(bloques[c].e) || bloques[c].e.contains(bloques[a].e)) continue;
      if (x.left < y.right - 1 && y.left < x.right - 1 && x.top < y.bottom - 1 && y.top < x.bottom - 1)
        r.push(`pág ${i + 1}: se superponen ${bloques[a].e.className} y ${bloques[c].e.className}`);
    }
  });
  return r;
});
console.log(problemas.length ? problemas.join('\n') : 'Sin desbordes ni superposiciones detectados');

const hojas = page.locator('.hoja');
const n = await hojas.count();
const miniaturas = [];
for (let i = 0; i < n; i++) {
  const f = path.join(out, `pagina-${String(i + 1).padStart(2, '0')}.png`);
  await hojas.nth(i).screenshot({ path: f });
  miniaturas.push(f);
}
const W = 300, H = 424, cols = 5, porHoja = 15;
for (let s = 0; s * porHoja < n; s++) {
  const grupo = miniaturas.slice(s * porHoja, s * porHoja + porHoja);
  const comp = await Promise.all(grupo.map(async (f, k) => ({ input: await sharp(f).resize(W, H).toBuffer(), left: (k % cols) * (W + 12) + 12, top: Math.floor(k / cols) * (H + 12) + 12 })));
  await sharp({ create: { width: cols * (W + 12) + 12, height: Math.ceil(grupo.length / cols) * (H + 12) + 12, channels: 3, background: '#8a8078' } }).composite(comp).jpeg({ quality: 85 }).toFile(path.join(out, `contacto-${s + 1}.jpg`));
}
console.log(`${n} páginas capturadas en ${out}`);
await b.close();
