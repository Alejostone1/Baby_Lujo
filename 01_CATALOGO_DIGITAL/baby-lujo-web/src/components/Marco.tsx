import Image from 'next/image';
import Link from 'next/link';
import { enlaceWhatsApp, mensajeGeneral } from '@/lib/formato';
import type { Marca } from '@/lib/tipos';
import { IconoWhatsApp, Ornamento } from './ui';

export function Encabezado({ marca }: { marca: Marca }) {
  const wa = enlaceWhatsApp(marca, mensajeGeneral);
  return (
    <header className="sticky top-0 z-30 border-b border-beige/80 bg-marfil/90 backdrop-blur-md">
      <div className="mx-auto flex h-[60px] max-w-6xl items-center justify-between px-5 sm:h-[68px] sm:px-8">
        <Link href="/" className="flex items-center" aria-label="BABY LUJO, inicio">
          <Image src="/marca/logo-transparente.png" alt="BABY LUJO by Joaquín RP" width={52} height={52} className="size-11 sm:size-[52px]" />
        </Link>
        <nav className="flex items-center gap-5 text-[0.66rem] versalitas text-taupe sm:gap-8">
          <Link href="/#coleccion" className="hover:text-tinta">Colección</Link>
          <Link href="/#contacto" className="hover:text-tinta">Contacto</Link>
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer" className="hidden items-center gap-2 text-tinta hover:text-bronce sm:flex">
              <IconoWhatsApp /> WhatsApp
            </a>
          )}
        </nav>
      </div>
    </header>
  );
}

export function WhatsAppFlotante({ href }: { href: string | null }) {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Escribir a BABY LUJO por WhatsApp"
      className="fixed bottom-5 right-5 z-40 grid size-14 place-items-center rounded-full bg-tinta text-marfil shadow-[0_10px_30px_-10px_rgba(61,51,45,.55)] ring-1 ring-dorado/70 ring-offset-[3px] ring-offset-marfil transition-transform duration-500 hover:scale-105 sm:hidden"
    >
      <IconoWhatsApp className="size-6" />
    </a>
  );
}

export function Pie({ marca }: { marca: Marca }) {
  return (
    <footer className="border-t border-beige bg-marfil-claro">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-5 py-14 text-center">
        <Image src="/marca/logo-transparente.png" alt="BABY LUJO by Joaquín RP" width={120} height={120} />
        <Ornamento />
        <p className="max-w-xs font-delicada text-lg italic text-taupe">{marca.lema}</p>
        <p className="text-[0.6rem] text-taupe/70 versalitas">© {new Date(marca.actualizado).getFullYear()} {marca.nombre} · {marca.firma}</p>
      </div>
    </footer>
  );
}
