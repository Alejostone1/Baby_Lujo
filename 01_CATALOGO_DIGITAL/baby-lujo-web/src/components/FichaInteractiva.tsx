'use client';
import Image from 'next/image';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { foto } from '@/lib/formato';
import type { Producto } from '@/lib/tipos';
import { IconoWhatsApp } from './ui';

/** Galería con selector de color, ampliación a pantalla completa y botón de consulta. */
export function FichaInteractiva({ p, whatsappBase, children }: { p: Producto; whatsappBase: string | null; children: ReactNode }) {
  const [i, setI] = useState(0);
  const [ampliada, setAmpliada] = useState(false);
  const dialogo = useRef<HTMLDialogElement>(null);
  const variante = p.variantes[i]?.nombre;
  const imagen = p.variantes[i]?.imagen ?? p.imagenes[i] ?? p.imagenes[0];

  useEffect(() => {
    const d = dialogo.current;
    if (!d) return;
    if (ampliada && !d.open) d.showModal();
    if (!ampliada && d.open) d.close();
  }, [ampliada]);

  const mensaje = `Hola, BABY LUJO. Me interesa el producto ${p.nombre}${variante ? ` (color ${variante})` : ''}, código ${p.referencia ?? p.id}. ¿Me pueden dar información de precio y tallas disponibles?`;
  const wa = whatsappBase ? `${whatsappBase}?text=${encodeURIComponent(mensaje)}` : null;
  const miniaturas = p.variantes.length ? p.variantes.map(v => v.imagen) : p.imagenes;

  return (
    <div className="grid gap-14 lg:grid-cols-[1.05fr_1fr] lg:gap-20">
      <div className="mx-auto w-full max-w-[520px]">
        <button type="button" onClick={() => setAmpliada(true)} className="group block w-full cursor-zoom-in" aria-label="Ampliar fotografía">
          <div className="arco-marco arco-3x4 [--filete:12px]">
            <div className="arco arco-3x4 relative aspect-[3/4] bg-beige">
              <Image key={imagen} src={foto(imagen)} alt={`${p.nombre}${variante ? `, color ${variante}` : ''}`} fill preload sizes="(min-width:1024px) 44vw, 92vw" className="animate-[entrada_.8s_var(--ease-seda)_both] object-cover" />
            </div>
          </div>
          <span className="mt-4 block text-center text-[0.6rem] text-taupe/80 versalitas">Toca la foto para ampliar</span>
        </button>
        {miniaturas.length > 1 && (
          <div className="mt-6 flex justify-center gap-4" role="radiogroup" aria-label="Color">
            {miniaturas.map((m, k) => (
              <button
                key={m}
                role="radio"
                aria-checked={k === i}
                onClick={() => setI(k)}
                className={`flex flex-col items-center gap-2 text-[0.6rem] versalitas ${k === i ? 'text-tinta' : 'text-taupe/70'}`}
              >
                <span className={`arco relative block h-20 w-[60px] overflow-hidden ring-1 ring-offset-2 ring-offset-marfil transition ${k === i ? 'ring-dorado' : 'ring-transparent'}`}>
                  <Image src={foto(m, 'web')} alt="" fill sizes="60px" className="object-cover" />
                </span>
                {p.variantes[k]?.nombre}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="lg:sticky lg:top-28 lg:self-start lg:pt-6">
        {children}
        {p.variantes.length > 0 && (
          <p className="mb-6 mt-8 text-[0.72rem] text-taupe versalitas">Color seleccionado: <span className="text-tinta">{variante}</span></p>
        )}
        {wa ? (
          <a href={wa} target="_blank" rel="noopener noreferrer" className="relative inline-flex min-h-14 w-full items-center justify-center gap-3 bg-tinta px-8 text-[0.74rem] font-medium text-marfil versalitas transition-colors duration-500 hover:bg-taupe sm:w-auto">
            <span aria-hidden className="pointer-events-none absolute inset-[3px] ring-1 ring-inset ring-dorado/55" />
            <IconoWhatsApp className="size-5" /> Consultar por WhatsApp
          </a>
        ) : (
          <p className="text-[0.7rem] text-taupe versalitas">Consulta por WhatsApp: número en configuración</p>
        )}
      </div>

      <dialog
        ref={dialogo}
        onClose={() => setAmpliada(false)}
        onClick={() => setAmpliada(false)}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-marfil/97 p-0 backdrop:bg-tinta/40"
        aria-label={`Fotografía ampliada de ${p.nombre}`}
      >
        <div className="relative h-full w-full">
          <Image src={foto(imagen)} alt={p.nombre} fill sizes="100vw" quality={90} className="object-contain p-4 sm:p-10" />
          <button autoFocus onClick={() => setAmpliada(false)} className="absolute right-4 top-4 grid size-11 place-items-center rounded-full bg-marfil text-tinta ring-1 ring-champagne" aria-label="Cerrar">
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.4"><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>
      </dialog>
    </div>
  );
}
