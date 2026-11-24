'use client';
import type { ComponentProps, ReactNode } from 'react';
import { useFormStatus } from 'react-dom';

export const claseCampo = 'w-full rounded-none border border-beige bg-white/70 px-3.5 py-3 text-[1rem] text-tinta placeholder:text-taupe/50 focus:border-bronce focus:outline-none';

export function Campo({ etiqueta, ayuda, children }: { etiqueta: string; ayuda?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[0.64rem] text-bronce versalitas">{etiqueta}</span>
      {children}
      {ayuda && <span className="mt-1.5 block text-[0.8rem] text-taupe/80">{ayuda}</span>}
    </label>
  );
}

export function Entrada(props: ComponentProps<'input'>) {
  return <input {...props} className={`${claseCampo} ${props.className ?? ''}`} />;
}

export function BotonEnviar({ children, className = '' }: { children: ReactNode; className?: string }) {
  const { pending } = useFormStatus();
  return (
    <button disabled={pending} className={`relative inline-flex min-h-12 items-center justify-center bg-tinta px-7 text-[0.72rem] font-medium text-marfil versalitas transition hover:bg-taupe disabled:opacity-60 ${className}`}>
      <span aria-hidden className="pointer-events-none absolute inset-[3px] ring-1 ring-inset ring-dorado/55" />
      {pending ? 'Guardando…' : children}
    </button>
  );
}

export function Aviso({ estado }: { estado: { ok?: string; error?: string } | null }) {
  if (!estado) return null;
  return (
    <p role="status" className={`border px-4 py-3 text-[0.92rem] ${estado.error ? 'border-[#d9a39b] bg-[#fbefed] text-[#8a3328]' : 'border-[#b9cdb0] bg-[#f1f6ee] text-[#3c5a30]'}`}>
      {estado.error ?? estado.ok}
    </p>
  );
}
