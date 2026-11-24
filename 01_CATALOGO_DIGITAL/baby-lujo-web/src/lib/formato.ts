import type { Marca, Producto } from './tipos';

/** Ruta pública de una foto. Acepta archivos locales (BL-001.jpg) o URLs completas (fotos subidas desde el panel). */
export function foto(archivo: string, calidad: 'hd' | 'web' = 'hd') {
  return /^https?:\/\//.test(archivo) ? archivo : `/productos/${calidad}/${archivo}`;
}

export function precioTexto(p: Producto, marca: Marca) {
  if (p.precio == null) return null;
  try {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: marca.moneda, maximumFractionDigits: 0 }).format(p.precio);
  } catch {
    return `${marca.moneda} ${p.precio.toLocaleString('es-CO')}`;
  }
}

/** Enlace de WhatsApp con mensaje prellenado. Devuelve null si aún no hay número configurado. */
export function enlaceWhatsApp(marca: Marca, mensaje: string) {
  if (!marca.whatsapp) return null;
  const numero = marca.whatsapp.replace(/\D/g, '');
  return `https://wa.me/${numero}?text=${encodeURIComponent(mensaje)}`;
}

export function mensajeProducto(p: Producto, variante?: string) {
  return `Hola, BABY LUJO. Me interesa el producto ${p.nombre}${variante ? ` (${variante})` : ''}, código ${p.referencia ?? p.id}. ¿Me pueden dar información de precio y tallas disponibles?`;
}

export const mensajeGeneral = 'Hola, BABY LUJO. Vi el catálogo y quisiera recibir atención personalizada.';
