// Genera hojas de contacto numeradas de las fotos originales para la auditoría
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const SRC = path.resolve(__dirname, '../..');
const OUT = process.argv[2];
const files = fs.readdirSync(SRC).filter(f => /^WhatsApp.*\.jpe?g$/i.test(f)).sort((a, b) => {
  const k = f => { const m = f.match(/(\d\d)\.(\d\d)\.(\d\d) PM(?: \((\d)\))?/); return m[3] * 10 + (m[4] ? +m[4] : 0); };
  return k(a) - k(b);
});
fs.writeFileSync(path.join(OUT, 'index.json'), JSON.stringify(files.map((f, i) => ({ id: i + 1, file: f })), null, 1));
(async () => {
  const W = 300, H = 400, cols = 4, per = 12;
  for (let p = 0; p * per < files.length; p++) {
    const chunk = files.slice(p * per, p * per + per);
    const rows = Math.ceil(chunk.length / cols);
    const comps = [];
    for (let i = 0; i < chunk.length; i++) {
      const n = p * per + i + 1;
      const buf = await sharp(path.join(SRC, chunk[i])).rotate().resize(W, H - 30, { fit: 'contain', background: '#fff' }).toBuffer();
      const label = Buffer.from(`<svg width="${W}" height="30"><rect width="100%" height="100%" fill="#222"/><text x="8" y="21" font-size="18" fill="#fff" font-family="Arial">#${n}</text></svg>`);
      comps.push({ input: buf, left: (i % cols) * W, top: Math.floor(i / cols) * H + 30 });
      comps.push({ input: label, left: (i % cols) * W, top: Math.floor(i / cols) * H });
    }
    await sharp({ create: { width: cols * W, height: rows * H, channels: 3, background: '#888' } }).composite(comps).jpeg({ quality: 80 }).toFile(path.join(OUT, `sheet${p + 1}.jpg`));
  }
  for (const f of files) { const m = await sharp(path.join(SRC, f)).metadata(); console.log(f, m.width + 'x' + m.height); }
})();
