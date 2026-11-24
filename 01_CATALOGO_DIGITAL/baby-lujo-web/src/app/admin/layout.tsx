import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = { title: 'Panel de administración', robots: { index: false, follow: false } };

export default function LayoutAdmin({ children }: LayoutProps<'/admin'>) {
  return (
    <div className="min-h-dvh bg-marfil-claro">
      <header className="border-b border-beige bg-marfil">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <Link href="/admin" className="flex items-center gap-3">
            <Image src="/marca/logo-transparente.png" alt="" width={40} height={40} />
            <span className="text-[0.66rem] text-taupe versalitas">Panel del catálogo</span>
          </Link>
          <Link href="/" target="_blank" className="text-[0.66rem] text-bronce underline decoration-dorado underline-offset-4 versalitas">Ver catálogo</Link>
        </div>
      </header>
      <div className="mx-auto max-w-5xl px-5 py-8 sm:py-12">{children}</div>
    </div>
  );
}
