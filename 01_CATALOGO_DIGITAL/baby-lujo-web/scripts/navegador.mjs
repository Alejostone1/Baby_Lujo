import fs from 'node:fs';

/** Busca un navegador Chromium ya instalado (Chrome o Edge) para generar el PDF sin descargar nada. */
export function navegador() {
  const candidatos = [
    process.env.CHROME_PATH,
    'C:/Program Files/Google/Chrome/Application/chrome.exe',
    'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
    'C:/Program Files/Microsoft/Edge/Application/msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium',
  ].filter(Boolean);
  const encontrado = candidatos.find(p => fs.existsSync(p));
  if (!encontrado) throw new Error('No se encontró Chrome ni Edge. Indica la ruta con la variable CHROME_PATH.');
  return encontrado;
}
