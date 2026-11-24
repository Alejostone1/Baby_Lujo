'use server';
import { updateTag } from 'next/cache';
import { redirect } from 'next/navigation';
import { leerCatalogo, guardarCatalogo, guardarFoto } from '@/lib/almacen';
import { abrirSesion, cerrarSesion, contrasenaCorrecta, exigirSesion } from '@/lib/sesion';
import type { Catalogo, Producto } from '@/lib/tipos';

export type Estado = { ok?: string; error?: string } | null;

const lista = (v: FormDataEntryValue | null) => String(v ?? '').split(/[,;\n]/).map(s => s.trim()).filter(Boolean);
const texto = (v: FormDataEntryValue | null) => String(v ?? '').trim();
const slugDe = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

async function modificar(cambio: (c: Catalogo) => void | string) {
  await exigirSesion();
  const c = await leerCatalogo();
  const error = cambio(c);
  if (typeof error === 'string') return error;
  await guardarCatalogo(c);
  updateTag('catalogo');
}

export async function ingresar(_: Estado, fd: FormData): Promise<Estado> {
  if (!process.env.ADMIN_PASSWORD) return { error: 'El panel aún no tiene contraseña configurada (variable ADMIN_PASSWORD).' };
  if (!contrasenaCorrecta(texto(fd.get('clave')))) return { error: 'Contraseña incorrecta. Revisa mayúsculas y vuelve a intentarlo.' };
  await abrirSesion();
  redirect('/admin');
}

export async function salir() {
  await cerrarSesion();
  redirect('/admin/ingresar');
}

export async function cambiarActivo(id: string, activo: boolean) {
  await modificar(c => { const p = c.productos.find(x => x.id === id); if (p) p.activo = activo; });
}

export async function moverProducto(id: string, dir: -1 | 1) {
  await modificar(c => {
    const i = c.productos.findIndex(x => x.id === id);
    const cat = c.productos[i]?.categoria;
    let j = i + dir;
    while (j >= 0 && j < c.productos.length && c.productos[j].categoria !== cat) j += dir;
    if (i < 0 || j < 0 || j >= c.productos.length) return;
    [c.productos[i], c.productos[j]] = [c.productos[j], c.productos[i]];
  });
}

/** Sube una foto ya reducida en el navegador y devuelve su referencia. */
export async function subirFoto(fd: FormData): Promise<{ ref?: string; error?: string }> {
  await exigirSesion();
  const f = fd.get('foto');
  if (!(f instanceof File) || !f.size) return { error: 'No llegó ninguna foto.' };
  if (!f.type.startsWith('image/')) return { error: 'El archivo debe ser una imagen (JPG o PNG).' };
  const base = slugDe(texto(fd.get('nombre')) || 'foto') || 'foto';
  const ref = await guardarFoto(`${base}-${Date.now().toString(36)}.jpg`, Buffer.from(await f.arrayBuffer()));
  return { ref };
}

export async function guardarProducto(_: Estado, fd: FormData): Promise<Estado> {
  const id = texto(fd.get('id'));
  const nombre = texto(fd.get('nombre'));
  if (!nombre) return { error: 'Escribe el nombre del producto.' };
  const imagenes = lista(fd.get('imagenes'));
  if (!imagenes.length) return { error: 'Agrega al menos una fotografía.' };
  const coloresFoto = imagenes.map((_, i) => texto(fd.get(`colorFoto${i}`)));
  const precioTxt = texto(fd.get('precio')).replace(/[^\d]/g, '');

  let nuevoId = id;
  const error = await modificar(c => {
    const datos: Omit<Producto, 'id' | 'slug'> = {
      nombre,
      categoria: texto(fd.get('categoria')),
      descripcion: texto(fd.get('descripcion')),
      piezas: lista(fd.get('piezas')),
      colores: lista(fd.get('colores')),
      imagenes,
      variantes: coloresFoto.every(Boolean) && imagenes.length > 1 ? imagenes.map((img, i) => ({ nombre: coloresFoto[i], imagen: img })) : [],
      referencia: texto(fd.get('referencia')) || null,
      precio: precioTxt ? Number(precioTxt) : null,
      tallas: lista(fd.get('tallas')),
      activo: fd.get('activo') === 'on',
      destacado: fd.get('destacado') === 'on',
    };
    if (!c.categorias.some(k => k.id === datos.categoria)) return 'Elige una categoría válida.';
    const otros = c.productos.filter(p => p.id !== id);
    let slug = slugDe(nombre);
    for (let n = 2; otros.some(p => p.slug === slug); n++) slug = `${slugDe(nombre)}-${n}`;
    if (id) {
      const p = c.productos.find(x => x.id === id);
      if (!p) return 'El producto ya no existe.';
      Object.assign(p, datos, { slug });
    } else {
      const max = Math.max(0, ...c.productos.map(p => Number(p.id.replace(/\D/g, '')) || 0));
      nuevoId = `BL-${String(max + 1).padStart(3, '0')}`;
      // Se ubica al final de su categoría
      const ultimo = c.productos.map(p => p.categoria).lastIndexOf(datos.categoria);
      c.productos.splice(ultimo + 1 || c.productos.length, 0, { id: nuevoId, slug, ...datos });
    }
  });
  if (error) return { error };
  redirect(id ? `/admin/producto/${id}?guardado=${Date.now()}` : `/admin/producto/${nuevoId}?creado=1`);
}

export async function eliminarProducto(id: string) {
  await modificar(c => { c.productos = c.productos.filter(p => p.id !== id); });
  redirect('/admin');
}

export async function guardarMarca(_: Estado, fd: FormData): Promise<Estado> {
  const wa = texto(fd.get('whatsapp'));
  if (wa && wa.replace(/\D/g, '').length < 10) return { error: 'El WhatsApp debe incluir el indicativo del país, por ejemplo +57 314 426 4715.' };
  await modificar(c => {
    c.marca.whatsapp = wa || null;
    c.marca.instagram = texto(fd.get('instagram')) || null;
    c.marca.ciudad = texto(fd.get('ciudad')) || null;
    c.marca.moneda = texto(fd.get('moneda')) || 'COP';
  });
  return { ok: 'Datos de contacto guardados.' };
}

export async function guardarCategorias(_: Estado, fd: FormData): Promise<Estado> {
  const ids = fd.getAll('catId').map(String);
  const error = await modificar(c => {
    const nuevas = ids.map((id, i) => ({ id, nombre: texto(fd.getAll('catNombre')[i]), descripcion: texto(fd.getAll('catDesc')[i]), orden: Number(fd.getAll('catOrden')[i]) || i + 1 }));
    if (nuevas.some(n => !n.nombre)) return 'Cada categoría necesita un nombre.';
    const nueva = texto(fd.get('nuevaNombre'));
    if (nueva) {
      let id = slugDe(nueva);
      for (let n = 2; nuevas.some(x => x.id === id); n++) id = `${slugDe(nueva)}-${n}`;
      nuevas.push({ id, nombre: nueva, descripcion: texto(fd.get('nuevaDesc')), orden: nuevas.length + 1 });
    }
    const borrar = new Set(fd.getAll('catBorrar').map(String));
    for (const b of borrar) if (c.productos.some(p => p.categoria === b)) return 'Solo se puede eliminar una categoría vacía. Mueve antes sus productos a otra.';
    c.categorias = nuevas.filter(n => !borrar.has(n.id)).sort((a, b) => a.orden - b.orden).map(({ id, nombre, descripcion }) => ({ id, nombre, descripcion }));
    // El catálogo se muestra en el orden de las categorías
    const orden = new Map(c.categorias.map((k, i) => [k.id, i]));
    c.productos.sort((a, b) => (orden.get(a.categoria) ?? 99) - (orden.get(b.categoria) ?? 99));
  });
  if (error) return { error };
  return { ok: 'Categorías guardadas.' };
}

export async function restaurarVersion(url: string) {
  await exigirSesion();
  if (!/^https:\/\/[a-z0-9-]+\.public\.blob\.vercel-storage\.com\/catalogo\//.test(url)) return;
  const r = await fetch(url, { cache: 'no-store' });
  const c = (await r.json()) as Catalogo;
  await guardarCatalogo(c);
  updateTag('catalogo');
  redirect('/admin?restaurado=1');
}
