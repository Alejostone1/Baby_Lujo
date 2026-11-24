// Detecta fotos repetidas o casi idénticas mediante hash perceptual (dHash 16x16)
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const SRC = path.resolve(__dirname, '../..');
const idx = JSON.parse(fs.readFileSync(process.argv[2]));
(async () => {
  const hs = [];
  for (const { id, file } of idx) {
    const px = await sharp(path.join(SRC, file)).greyscale().resize(17, 16, { fit: 'fill' }).raw().toBuffer();
    const bits = [];
    for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) bits.push(px[y * 17 + x] > px[y * 17 + x + 1] ? 1 : 0);
    hs.push({ id, bits });
  }
  const pairs = [];
  for (let i = 0; i < hs.length; i++) for (let j = i + 1; j < hs.length; j++) {
    let d = 0; for (let k = 0; k < 256; k++) d += hs[i].bits[k] !== hs[j].bits[k];
    pairs.push([d, hs[i].id, hs[j].id]);
  }
  pairs.sort((a, b) => a[0] - b[0]);
  console.log('Pares más parecidos (distancia de 256):');
  pairs.slice(0, 12).forEach(p => console.log(p.join('  ')));
})();
