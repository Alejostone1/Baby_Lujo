import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getCatalogoPublico } from '@/lib/catalogo';
import { enlaceWhatsApp, foto, mensajeGeneral, precioTexto } from '@/lib/formato';
import { Encabezado, Pie, WhatsAppFlotante } from '@/components/Marco';
import { FichaInteractiva } from '@/components/FichaInteractiva';
import { TarjetaProducto } from '@/components/TarjetaProducto';
import { Aparecer } from '@/components/Aparecer';
import { Ornamento } from '@/components/ui';

export async function generateStaticParams() {
  const { productos } = await getCatalogoPublico();
  return productos.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<'/producto/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const { productos, marca } = await getCatalogoPublico();
  const p = productos.find(x => x.slug === slug);
  if (!p) return {};
  const precio = precioTexto(p, marca);
  return {
    title: p.nombre,
    description: `${p.descripcion}${precio ? ` ${precio}.` : ''}`,
    openGraph: { title: `${p.nombre} · BABY LUJO`, description: p.descripcion, images: [{ url: foto(p.imagenes[0], 'web'), width: 900, height: 1200, alt: p.nombre }] },
  };
}

export default function PaginaProducto({ params }: PageProps<'/producto/[slug]'>) {
  return (
    <Suspense fallback={<Esqueleto />}>
      <Contenido params={params} />
    </Suspense>
  );
}

function Esqueleto() {
  return (
    <div className="mx-auto max-w-6xl px-5 pt-28 sm:px-8" aria-busy="true">
      <div className="arco arco-3x4 mx-auto aspect-[3/4] w-full max-w-[520px] animate-pulse bg-beige/70 lg:mx-0" />
    </div>
  );
}

async function Contenido({ params }: { params: PageProps<'/producto/[slug]'>['params'] }) {
  const { slug } = await params;
  const { productos, categorias, marca } = await getCatalogoPublico();
  const p = productos.find(x => x.slug === slug);
  if (!p) notFound();
  const cat = categorias.find(c => c.id === p.categoria);
  const precio = precioTexto(p, marca);
  const waBase = marca.whatsapp ? `https://wa.me/${marca.whatsapp.replace(/\D/g, '')}` : null;
  const relacionados = productos.filter(x => x.categoria === p.categoria && x.id !== p.id).slice(0, 4);

  const filas: [string, string][] = [
    ['Código', p.referencia ?? p.id],
    ['Colores', p.colores.join(' · ')],
    ['Incluye', p.piezas.join(' · ')],
    ['Tallas', p.tallas.length ? p.tallas.join(' · ') : 'Consultar disponibilidad'],
  ];

  return (
    <>
      <Encabezado marca={marca} />
      <Aparecer />
      <main className="px-5 pb-24 pt-8 sm:px-8 sm:pt-12">
        <div className="mx-auto max-w-6xl">
          <nav aria-label="Ruta" className="mb-10 text-[0.62rem] text-taupe versalitas">
            <Link href="/#coleccion" className="hover:text-tinta">Colección</Link>
            <span className="mx-2 text-dorado">/</span>
            {cat && <Link href={`/#coleccion=${cat.id}`} className="hover:text-tinta">{cat.nombre}</Link>}
          </nav>

          <FichaInteractiva p={p} whatsappBase={waBase}>
            <p className="font-delicada text-xl italic text-bronce">{cat?.nombre}</p>
            <h1 className="mt-2 font-display text-[2.1rem] leading-[1.1] tracking-[0.03em] text-tinta sm:text-[2.7rem]">{p.nombre}</h1>
            <p className="mt-5 font-delicada text-[1.6rem] italic text-taupe">{precio ?? 'Precio a consultar'}</p>
            <Ornamento className="mt-7 justify-start" />
            <p className="mt-7 max-w-md text-[1rem] leading-[1.85] text-taupe">{p.descripcion}</p>
            <dl className="mt-8 max-w-md divide-y divide-beige border-y border-beige">
              {filas.map(([k, v]) => (
                <div key={k} className="flex gap-6 py-3.5">
                  <dt className="w-20 shrink-0 pt-0.5 text-[0.62rem] text-bronce versalitas">{k}</dt>
                  <dd className="text-[0.95rem] text-tinta">{v}</dd>
                </div>
              ))}
            </dl>
          </FichaInteractiva>

          {relacionados.length > 0 && (
            <section className="mt-28">
              <header className="aparecer mb-12 text-center">
                <p className="font-delicada text-lg italic text-bronce">De la misma colección</p>
                <h2 className="mt-1 font-display text-[1.7rem] tracking-[0.06em] text-tinta">{cat?.nombre}</h2>
              </header>
              <ul className="grid grid-cols-2 gap-x-5 gap-y-12 sm:gap-x-9 md:grid-cols-4">
                {relacionados.map(r => (
                  <li key={r.id} className="aparecer"><TarjetaProducto p={r} precio={precioTexto(r, marca)} /></li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </main>
      <Pie marca={marca} />
      <WhatsAppFlotante href={enlaceWhatsApp(marca, mensajeGeneral)} />
    </>
  );
}
