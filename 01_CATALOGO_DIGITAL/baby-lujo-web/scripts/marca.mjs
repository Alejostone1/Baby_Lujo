// Genera recursos de marca a partir del logotipo oficial SIN alterar su diseño:
//  - logo-transparente.png : mismo logo, el fondo crema se convierte en transparencia ("color a alfa").
//  - icon.png / apple-icon.png : el logo completo reducido.
//  - og.jpg (1200x630) : imagen para la vista previa al compartir por WhatsApp/Instagram.
// Uso: node scripts/marca.mjs
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(import.meta.dirname, '..');
const LOGO = path.join(root, 'marca', 'logo-original.jpeg');
const pub = p => path.join(root, 'public', p);
const BG = [252, 244, 233]; // color del fondo del logo, medido en la auditoría

const { data, info } = await sharp(LOGO).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const out = Buffer.alloc(info.width * info.height * 4);
for (let i = 0, j = 0; i < data.length; i += 3, j += 4) {
  let a = 0;
  for (let c = 0; c < 3; c++) a = Math.max(a, (BG[c] - data[i + c]) / BG[c]);
  a = Math.min(1, Math.max(0, (a - 0.012) * 1.04));
  for (let c = 0; c < 3; c++) out[j + c] = a > 0 ? Math.round(Math.max(0, Math.min(255, BG[c] - (BG[c] - data[i + c]) / a))) : BG[c];
  out[j + 3] = Math.round(a * 255);
}
fs.mkdirSync(pub('marca'), { recursive: true });
await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).png({ compressionLevel: 9 }).toFile(pub('marca/logo-transparente.png'));
await sharp(LOGO).resize(800).jpeg({ quality: 90 }).toFile(pub('marca/logo.jpg'));
await sharp(LOGO).resize(512).png().toFile(path.join(root, 'src/app/icon.png'));
await sharp(LOGO).resize(180).png().toFile(path.join(root, 'src/app/apple-icon.png'));

// Imagen para compartir: marfil, logo a la izquierda, dos prendas en marcos de arco a la derecha
const W = 1200, H = 630;
const arco = async (file, w, h) => {
  const mask = Buffer.from(`<svg width="${w}" height="${h}"><path d="M0 ${w / 2} A ${w / 2} ${w / 2} 0 0 1 ${w} ${w / 2} V ${h} H 0 Z" fill="#fff"/></svg>`);
  return sharp(file).resize(w, h, { fit: 'cover', position: 'top' }).composite([{ input: mask, blend: 'dest-in' }]).png().toBuffer();
};
const linea = (w, h, x, y) => Buffer.from(`<svg width="${w + 40}" height="${h + 40}"><path d="M20 ${20 + w / 2} A ${w / 2} ${w / 2} 0 0 1 ${20 + w} ${20 + w / 2} V ${20 + h} H 20 Z" fill="none" stroke="#C6A46C" stroke-width="1.5"/></svg>`);
const f1 = pub('productos/hd/BL-001.jpg'), f2 = pub('productos/hd/BL-004.jpg');
const aw = 250, ah = 470;
await sharp({ create: { width: W, height: H, channels: 3, background: '#F5EFE6' } })
  .composite([
    { input: await sharp(pub('marca/logo-transparente.png')).resize(470).toBuffer(), left: 40, top: 80 },
    { input: await arco(f1, aw, ah), left: 590, top: 80 },
    { input: linea(aw + 24, ah + 24), left: 590 - 32, top: 80 - 32 },
    { input: await arco(f2, aw, ah), left: 880, top: 80 },
    { input: linea(aw + 24, ah + 24), left: 880 - 32, top: 80 - 32 },
  ])
  .jpeg({ quality: 88 })
  .toFile(pub('og.jpg'));
console.log('Recursos de marca generados');
