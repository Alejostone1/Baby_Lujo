import 'server-only';
import { cacheLife, cacheTag } from 'next/cache';
import { leerCatalogo } from './almacen';
import type { Catalogo } from './tipos';

/**
 * Fuente única del catálogo. La web y el PDF leen siempre de aquí.
 * Se guarda en caché y se renueva al instante cuando se guarda un cambio desde el panel.
 */
export async function getCatalogo(): Promise<Catalogo> {
  'use cache';
  cacheTag('catalogo');
  cacheLife('hours');
  return leerCatalogo();
}

export async function getCatalogoPublico(): Promise<Catalogo> {
  const c = await getCatalogo();
  const activas = new Set(c.productos.filter(p => p.activo).map(p => p.categoria));
  return {
    ...c,
    categorias: c.categorias.filter(cat => activas.has(cat.id)),
    productos: c.productos.filter(p => p.activo),
  };
}
