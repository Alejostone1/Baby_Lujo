// Construye la fuente de datos única (productos.json) + fotos del catálogo + carpeta 04_INVENTARIO
// Uso: node construir-inventario.js <carpetaFotosTratadas>
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const { categorias, P } = require('./inventario-base');
const ROOT = path.resolve(__dirname, '..');
const WEB = path.join(ROOT, '01_CATALOGO_DIGITAL', 'baby-lujo-web');
const INV = path.join(ROOT, '04_INVENTARIO');
const TRAT = process.argv[2];
const idx = JSON.parse(fs.readFileSync(path.join(__dirname, 'index.json')));

const slug = s => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const pad = n => String(n).padStart(3, '0');

(async () => {
  for (const d of ['public/productos/hd', 'public/productos/web', 'data']) fs.mkdirSync(path.join(WEB, d), { recursive: true });
  fs.rmSync(path.join(INV, 'fotos_clasificadas'), { recursive: true, force: true });
  const productos = [];
  let n = 0;
  for (const [fotos, cat, nombre, descripcion, colores, piezas, variantesNombres] of P) {
    n++;
    const id = `BL-${pad(n)}`;
    const lista = Array.isArray(fotos) ? fotos : [fotos];
    const imagenes = [];
    for (let i = 0; i < lista.length; i++) {
      const foto = lista[i];
      const nombreArchivo = lista.length > 1 ? `${id}-${String.fromCharCode(97 + i)}.jpg` : `${id}.jpg`;
      const src = path.join(TRAT, `foto-${String(foto).padStart(2, '0')}.jpg`);
      await sharp(src).jpeg({ quality: 90, mozjpeg: true }).toFile(path.join(WEB, 'public/productos/hd', nombreArchivo));
      await sharp(src).resize(900).jpeg({ quality: 80, mozjpeg: true }).toFile(path.join(WEB, 'public/productos/web', nombreArchivo));
      const catIdx = categorias.findIndex(c => c.id === cat) + 1;
      const carpeta = path.join(INV, 'fotos_clasificadas', `${catIdx}_${categorias[catIdx - 1].nombre}`);
      fs.mkdirSync(carpeta, { recursive: true });
      fs.copyFileSync(src, path.join(carpeta, `${nombreArchivo.replace('.jpg', '')}_${slug(nombre)}.jpg`));
      imagenes.push({ archivo: nombreArchivo, fotoAuditoria: foto, original: idx[foto - 1].file, variante: variantesNombres ? variantesNombres[i] : null });
    }
    productos.push({
      id,
      slug: slug(nombre),
      nombre,
      categoria: cat,
      descripcion,
      piezas,
      colores,
      variantes: variantesNombres ? variantesNombres.map((v, i) => ({ nombre: v, imagen: imagenes[i].archivo })) : [],
      imagenes: imagenes.map(i => i.archivo),
      referencia: null,
      precio: null,
      tallas: [],
      activo: true,
      destacado: false,
      _origen: imagenes.map(i => ({ foto: i.fotoAuditoria, archivoOriginal: i.original })),
    });
  }
  const data = {
    marca: {
      nombre: 'BABY LUJO',
      firma: 'BY JOAQUÍN RP',
      lema: 'Delicadeza, elegancia y exclusividad desde los primeros momentos.',
      whatsapp: null,
      instagram: null,
      ciudad: null,
      moneda: 'COP',
      actualizado: new Date().toISOString().slice(0, 10),
    },
    categorias,
    productos,
  };
  fs.writeFileSync(path.join(WEB, 'data', 'catalogo.json'), JSON.stringify(data, null, 2));

  // Inventario legible (CSV para Excel + Markdown)
  const csv = ['ID;Categoría;Nombre;Colores;Piezas;Variantes;Foto(s) auditoría;Archivo(s) original(es);Referencia;Precio;Tallas'];
  for (const p of productos) {
    csv.push([p.id, categorias.find(c => c.id === p.categoria).nombre, p.nombre, p.colores.join(', '), p.piezas.join(', '), p.variantes.map(v => v.nombre).join(', '),
      p._origen.map(o => '#' + o.foto).join(' '), p._origen.map(o => o.archivoOriginal).join(' | '), 'PENDIENTE', 'PENDIENTE', 'PENDIENTE'].join(';'));
  }
  fs.writeFileSync(path.join(INV, 'inventario.csv'), '﻿' + csv.join('\r\n'));
  console.log('productos', productos.length, 'fotos', productos.reduce((a, p) => a + p.imagenes.length, 0));
})();
