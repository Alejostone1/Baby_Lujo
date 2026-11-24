import 'server-only';
import fs from 'node:fs/promises';
import path from 'node:path';
import { del, list, put } from '@vercel/blob';
import semilla from '../../data/catalogo.json';
import type { Catalogo } from './tipos';

/**
 * Dónde vive el catálogo:
 *  - Sitio publicado (existe BLOB_READ_WRITE_TOKEN): en Vercel Blob. Cada guardado crea una versión nueva
 *    (catalogo/catalogo-<fecha>.json) y se conservan las últimas 20 como copia de seguridad.
 *    Las fotos subidas desde el panel van a productos/.
 *  - Trabajo local (sin token): en el archivo data/catalogo.json.
 * Si en Blob aún no hay ninguna versión, se usa data/catalogo.json como punto de partida.
 * La estructura es idéntica en ambos casos, así que web y PDF siempre muestran lo mismo.
 */
export const usaBlob = Boolean(process.env.BLOB_READ_WRITE_TOKEN);
const PREFIJO = 'catalogo/';
const VERSIONES_GUARDADAS = 20;

async function versiones() {
  const { blobs } = await list({ prefix: PREFIJO, limit: 1000 });
  return blobs.sort((a, b) => +new Date(b.uploadedAt) - +new Date(a.uploadedAt));
}

export async function leerCatalogo(): Promise<Catalogo> {
  if (!usaBlob) return structuredClone(semilla) as Catalogo;
  const [ultima] = await versiones();
  if (!ultima) return structuredClone(semilla) as Catalogo;
  const r = await fetch(ultima.url, { cache: 'no-store' });
  if (!r.ok) throw new Error(`No se pudo leer el catálogo (${r.status})`);
  return (await r.json()) as Catalogo;
}

export async function guardarCatalogo(c: Catalogo) {
  c.marca.actualizado = new Date().toISOString().slice(0, 10);
  const json = JSON.stringify(c, null, 2);
  if (!usaBlob) {
    await fs.writeFile(path.join(process.cwd(), 'data', 'catalogo.json'), json);
    return;
  }
  const marca = new Date().toISOString().replace(/[:.]/g, '-');
  await put(`${PREFIJO}catalogo-${marca}.json`, json, { access: 'public', addRandomSuffix: false, contentType: 'application/json', cacheControlMaxAge: 31536000 });
  const antiguas = (await versiones()).slice(VERSIONES_GUARDADAS);
  if (antiguas.length) await del(antiguas.map(b => b.url));
}

/** Historial de versiones guardadas (solo en el sitio publicado). */
export async function historial() {
  if (!usaBlob) return [];
  return (await versiones()).map(b => ({ url: b.url, fecha: b.uploadedAt }));
}

/** Guarda una foto subida desde el panel y devuelve el nombre o la URL con que se referencia. */
export async function guardarFoto(nombre: string, contenido: Buffer): Promise<string> {
  if (!usaBlob) {
    for (const carpeta of ['hd', 'web']) {
      await fs.writeFile(path.join(process.cwd(), 'public', 'productos', carpeta, nombre), contenido);
    }
    return nombre;
  }
  const r = await put(`productos/${nombre}`, contenido, { access: 'public', addRandomSuffix: true, contentType: 'image/jpeg', cacheControlMaxAge: 31536000 });
  return r.url;
}
