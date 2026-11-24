// Prueba de extremo a extremo del panel: ingresar, editar un precio y comprobar que la web pública lo muestra.
// Uso: node scripts/probar-panel.mjs <base> <contraseña> <carpetaCapturas> [seguro]
// Con "seguro" guarda el producto sin modificarlo (prueba de escritura que no altera datos).
import { chromium } from 'playwright-core';
import { navegador } from './navegador.mjs';

const [, , base, clave, out, modo] = process.argv;
const b = await chromium.launch({ executablePath: navegador() });
const page = await b.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
const paso = m => console.log('•', m);

await page.goto(`${base}/admin`);
await page.waitForURL(/ingresar/);
paso('Sin sesión redirige a /admin/ingresar');
await page.fill('input[name=clave]', 'equivocada');
await page.click('button:has-text("Entrar")');
await page.getByText('Contraseña incorrecta').waitFor();
paso('Contraseña incorrecta rechazada');
await page.fill('input[name=clave]', clave);
await page.click('button:has-text("Entrar")');
await page.waitForURL(`${base}/admin`);
await page.screenshot({ path: `${out}/admin-lista.png`, fullPage: false });
paso('Ingreso correcto');

await page.goto(`${base}/admin/producto/BL-010`);
if (modo !== 'seguro') {
  await page.fill('input[name=precio]', '129000');
  await page.fill('input[name=tallas]', '0-3M, 3-6M');
}
await page.click('button:has-text("Guardar cambios")');
await page.getByText('Cambios guardados').waitFor({ timeout: 30000 });
await page.screenshot({ path: `${out}/admin-ficha.png`, fullPage: true });
paso(modo === 'seguro' ? 'Guardado sin cambios en BL-010 (escritura correcta)' : 'Precio y tallas guardados en BL-010');

const pub = await b.newPage();
await pub.goto(`${base}/producto/conjunto-tejido-safari`);
const precio = await pub.locator('h1 + p').innerText();
const tallas = await pub.locator('dt:has-text("Tallas") + dd').innerText();
paso(`La web pública muestra: ${precio} · ${tallas}`);
await b.close();
