// Control de calidad: capturas de pantalla en móvil y escritorio.
// Uso: node scripts/captura.mjs <url> <archivoSalida.png> [movil|escritorio] [pagina-completa]
import { chromium } from 'playwright-core';
import { navegador } from './navegador.mjs';

const [, , url, salida, modo = 'movil', completa] = process.argv;
const b = await chromium.launch({ executablePath: navegador() });
const ctx = await b.newContext(modo === 'movil'
  ? { viewport: { width: 390, height: 844 }, deviceScaleFactor: 1, isMobile: true, hasTouch: true }
  : { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
const page = await ctx.newPage();
const errores = [];
page.on('console', m => m.type() === 'error' && errores.push(m.text()));
page.on('pageerror', e => errores.push(e.message));
await page.goto(url, { waitUntil: 'networkidle', timeout: 120000 });
await page.evaluate(() => document.querySelectorAll('.aparecer').forEach(e => e.classList.add('visible')));
await page.waitForTimeout(1200);
await page.screenshot({ path: salida, fullPage: completa === 'completa' });
if (errores.length) console.log('ERRORES:', errores.join('\n'));
await b.close();
