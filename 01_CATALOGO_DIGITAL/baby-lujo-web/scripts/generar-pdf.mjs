// Genera los dos PDF del catálogo a partir de la misma fuente de datos que la web.
//
//   npm run pdf                        -> usa el sitio publicado (NEXT_PUBLIC_SITE_URL de .env.local)
//   npm run pdf -- http://localhost:3000 -> usa un servidor local ya encendido
//   npm run pdf -- local               -> enciende un servidor local temporal con data/catalogo.json
//
// Resultado: ../../02_CATALOGO_PDF/Baby_Lujo_Catalogo_Alta_Calidad.pdf y Baby_Lujo_Catalogo_WhatsApp.pdf
import { chromium } from 'playwright-core';
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { navegador } from './navegador.mjs';

const raiz = path.resolve(import.meta.dirname, '..');
const destino = process.env.PDF_DESTINO ?? path.resolve(raiz, '../../02_CATALOGO_PDF');
fs.mkdirSync(destino, { recursive: true });

const leerEnv = () => {
  const f = path.join(raiz, '.env.local');
  if (!fs.existsSync(f)) return {};
  return Object.fromEntries(fs.readFileSync(f, 'utf8').split(/\r?\n/).filter(l => l.includes('=') && !l.startsWith('#')).map(l => { const i = l.indexOf('='); return [l.slice(0, i).trim(), l.slice(i + 1).trim().replace(/^"|"$/g, '')]; }));
};

let base = process.argv[2];
let servidor;
if (!base || base === 'local') {
  const env = leerEnv();
  if (!base && (process.env.NEXT_PUBLIC_SITE_URL || env.NEXT_PUBLIC_SITE_URL)) {
    base = process.env.NEXT_PUBLIC_SITE_URL || env.NEXT_PUBLIC_SITE_URL;
  } else {
    base = 'http://localhost:3311';
    console.log('Encendiendo un servidor local temporal…');
    servidor = spawn(process.platform === 'win32' ? 'npx.cmd' : 'npx', ['next', 'dev', '-p', '3311'], { cwd: raiz, shell: true, stdio: 'ignore' });
    for (let i = 0; i < 90; i++) {
      try { if ((await fetch(base)).ok) break; } catch {}
      await new Promise(r => setTimeout(r, 1000));
    }
  }
}
base = base.replace(/\/$/, '');
console.log('Generando desde', base);

const versiones = [
  { ruta: 'alta', archivo: 'Baby_Lujo_Catalogo_Alta_Calidad.pdf' },
  { ruta: 'ligera', archivo: 'Baby_Lujo_Catalogo_WhatsApp.pdf' },
];

const b = await chromium.launch({ executablePath: navegador() });
try {
  for (const v of versiones) {
    const page = await b.newPage({ viewport: { width: 900, height: 1200 } });
    await page.goto(`${base}/imprimir/${v.ruta}`, { waitUntil: 'networkidle', timeout: 180000 });
    await page.waitForSelector('[data-listo="si"]', { timeout: 60000 });
    await page.evaluate(async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map(img => img.complete ? null : new Promise(r => { img.onload = img.onerror = r; })));
    });
    const rotas = await page.evaluate(() => [...document.images].filter(i => !i.naturalWidth).map(i => i.src));
    if (rotas.length) throw new Error('Imágenes que no cargaron:\n' + rotas.join('\n'));
    const salida = path.join(destino, v.archivo);
    await page.pdf({ path: salida, preferCSSPageSize: true, printBackground: true, tagged: true });
    const paginas = await page.locator('.hoja').count();
    console.log(`✓ ${v.archivo}: ${paginas} páginas, ${(fs.statSync(salida).size / 1048576).toFixed(1)} MB`);
    await page.close();
  }
} finally {
  await b.close();
  if (servidor) { servidor.kill(); if (process.platform === 'win32') spawn('taskkill', ['/pid', String(servidor.pid), '/T', '/F'], { shell: true }); }
}
