import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

export function IconoWhatsApp({ className = 'size-4' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="currentColor">
      <path d="M12 2a10 10 0 0 0-8.66 15l-1.3 4.76 4.88-1.28A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-2.9.76.78-2.83-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.14c-.25-.12-1.46-.72-1.69-.8-.23-.09-.39-.13-.56.12-.16.25-.64.8-.78.96-.15.17-.29.19-.54.06a6.7 6.7 0 0 1-3.32-2.9c-.25-.43.25-.4.71-1.33.08-.16.04-.3-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.4-.41-.56-.42h-.48a.92.92 0 0 0-.66.31 2.78 2.78 0 0 0-.87 2.07 4.83 4.83 0 0 0 1 2.56 11.05 11.05 0 0 0 4.24 3.74c1.57.68 2.19.74 2.98.62.48-.07 1.46-.6 1.67-1.18.2-.58.2-1.08.14-1.18-.06-.1-.22-.17-.47-.29Z" />
    </svg>
  );
}

type BotonProps = { href: string; children: ReactNode; variante?: 'lleno' | 'linea'; externo?: boolean; className?: string } & Omit<ComponentProps<'a'>, 'href'>;

/** Botón de marca: lleno (tinta con filete dorado interior) o de línea. */
export function Boton({ href, children, variante = 'lleno', externo, className = '', ...rest }: BotonProps) {
  const base = 'group relative inline-flex min-h-12 items-center justify-center gap-2.5 px-7 text-[0.72rem] font-medium versalitas transition-colors duration-500 ease-[var(--ease-seda)]';
  const estilos = variante === 'lleno'
    ? 'bg-tinta text-marfil hover:bg-taupe'
    : 'text-tinta ring-1 ring-inset ring-champagne hover:bg-beige/60';
  const contenido = (
    <>
      {variante === 'lleno' && <span aria-hidden className="pointer-events-none absolute inset-[3px] ring-1 ring-inset ring-dorado/55" />}
      {children}
    </>
  );
  if (externo) return <a href={href} target="_blank" rel="noopener noreferrer" className={`${base} ${estilos} ${className}`} {...rest}>{contenido}</a>;
  return <Link href={href} className={`${base} ${estilos} ${className}`}>{contenido}</Link>;
}

/** Pequeño ornamento: filete dorado con un rombo central. */
export function Ornamento({ className = '' }: { className?: string }) {
  return (
    <div aria-hidden className={`flex items-center justify-center gap-3 text-dorado ${className}`}>
      <span className="h-px w-12 bg-current opacity-70" />
      <svg viewBox="0 0 10 10" className="size-2"><path d="M5 0 10 5 5 10 0 5Z" fill="currentColor" /></svg>
      <span className="h-px w-12 bg-current opacity-70" />
    </div>
  );
}
