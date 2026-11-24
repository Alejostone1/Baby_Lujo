// Etapa 1/3: tratamiento fotográfico no destructivo.
// - Balance de blancos: corrige la dominante de color tomando la pared del fondo como referencia
//   (60 % hacia la mediana de su serie fotográfica) sin tocar estampados ni tonos propios de la prenda.
// - Exposición: ajuste suave de medios tonos para igualar la luminosidad de la serie.
// - Ampliación 2x (Lanczos) + nitidez moderada, para impresión.
// Uso: node tratar-fotos.js <index.json> <walls.json> <carpetaSalida>
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const SRC = path.resolve(__dirname, '../..');
const [, , idxPath, wallsPath, OUT] = process.argv;
const idx = JSON.parse(fs.readFileSync(idxPath));
const walls = Object.fromEntries(JSON.parse(fs.readFileSync(wallsPath)).map(w => [w.id, w.wall]));
fs.mkdirSync(OUT, { recursive: true });

const median = a => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };
const group = id => (walls[id][1] > 200 ? 'B' : 'A');
const tgt = {};
for (const g of ['A', 'B']) {
  const ws = Object.entries(walls).filter(([id]) => group(+id) === g).map(([, w]) => w);
  tgt[g] = { rg: median(ws.map(w => w[0] / w[1])), bg: median(ws.map(w => w[2] / w[1])), G: g === 'A' ? 160 : 222 };
}

(async () => {
  const report = [];
  for (const { id, file } of idx) {
    const w = walls[id], t = tgt[group(id)];
    const S = 0.5; const cap = g => Math.min(1.05, Math.max(0.96, g));
    const gainR = cap(1 + S * ((t.rg * w[1]) / w[0] - 1));
    const gainB = cap(1 + S * ((t.bg * w[1]) / w[2] - 1));
    let gamma = Math.log(t.G / 255) / Math.log(w[1] / 255);
    gamma = Math.min(1.08, Math.max(0.82, gamma));
    const lut = new Uint8Array(256);
    for (let i = 0; i < 256; i++) lut[i] = Math.round(255 * Math.pow(i / 255, gamma));
    const { data, info } = await sharp(path.join(SRC, file)).rotate().removeAlpha().raw().toBuffer({ resolveWithObject: true });
    for (let i = 0; i < data.length; i += 3) {
      data[i] = lut[Math.min(255, Math.round(data[i] * gainR))];
      data[i + 1] = lut[data[i + 1]];
      data[i + 2] = lut[Math.min(255, Math.round(data[i + 2] * gainB))];
    }
    await sharp(data, { raw: info })
      .resize(info.width * 2, info.height * 2, { kernel: 'lanczos3' })
      .sharpen({ sigma: 1.1, m1: 0.6, m2: 2 })
      .withMetadata({ density: 300 })
      .jpeg({ quality: 92, chromaSubsampling: '4:4:4', mozjpeg: true })
      .toFile(path.join(OUT, `foto-${String(id).padStart(2, '0')}.jpg`));
    report.push({ id, serie: group(id), gainR: +gainR.toFixed(3), gainB: +gainB.toFixed(3), gamma: +gamma.toFixed(3) });
  }
  fs.writeFileSync(path.join(OUT, '_ajustes.json'), JSON.stringify(report, null, 1));
  console.log('ok', report.length);
})();
