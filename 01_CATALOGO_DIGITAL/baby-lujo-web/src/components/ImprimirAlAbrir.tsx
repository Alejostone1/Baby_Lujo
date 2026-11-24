'use client';
import { useEffect } from 'react';

/** Si la página se abre con #imprimir (botón del panel), espera fotos y tipografías y abre «Guardar como PDF». */
export function ImprimirAlAbrir() {
  useEffect(() => {
    if (location.hash !== '#imprimir') return;
    (async () => {
      await document.fonts.ready;
      await Promise.all([...document.images].map(img => (img.complete ? null : new Promise(r => { img.onload = img.onerror = r; }))));
      setTimeout(() => window.print(), 400);
    })();
  }, []);
  return null;
}
