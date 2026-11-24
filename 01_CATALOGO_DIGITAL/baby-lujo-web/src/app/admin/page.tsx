import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { getCatalogo } from '@/lib/catalogo';
import { historial, usaBlob } from '@/lib/almacen';
import { foto, precioTexto } from '@/lib/formato';
import { exigirSesion } from '@/lib/sesion';
import { cambiarActivo, moverProducto, restaurarVersion, salir } from './acciones';

export default function Panel() {
  return (
    <Suspense fallback={<p className="font-delicada text-xl italic text-taupe">Cargando…</p>}>
      <Contenido />
    </Suspense>
  );
}

const accesos = [
  { href: '/admin/producto/nuevo', t: 'Agregar producto', d: 'Nombre, fotos, precio y tallas' },
  { href: '/admin/marca', t: 'WhatsApp y contacto', d: 'Número, Instagram y ciudad' },
  { href: '/admin/categorias', t: 'Categorías', d: 'Nombres, descripciones y orden' },
];

async function Contenido() {
  await exigirSesion();
  const { productos, categorias, marca } = await getCatalogo();
  const versiones = (await historial()).slice(1, 8);
  const activos = productos.filter(p => p.activo).length;
  const sinPrecio = productos.filter(p => p.activo && p.precio == null).length;

  return (
    <div className="space-y-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-[2rem] tracking-[0.04em] text-tinta">Catálogo</h1>
          <p className="mt-1 text-taupe">{activos} productos visibles de {productos.length} · {sinPrecio} sin precio · actualizado el {marca.actualizado}</p>
        </div>
        <form action={salir}><button className="text-[0.66rem] text-taupe underline underline-offset-4 versalitas">Cerrar sesión</button></form>
      </div>

      {!usaBlob && (
        <p className="border border-dorado/60 bg-marfil px-4 py-3 text-[0.9rem] text-taupe">
          Modo local: los cambios se guardan en el archivo <code>data/catalogo.json</code> de este computador.
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        {accesos.map(a => (
          <Link key={a.href} href={a.href} className="border border-beige bg-white/60 p-5 transition hover:border-dorado">
            <span className="block font-display text-[1.1rem] text-tinta">{a.t}</span>
            <span className="mt-1 block text-[0.85rem] text-taupe">{a.d}</span>
          </Link>
        ))}
      </div>

      <section className="border border-beige bg-white/60 p-5">
        <h2 className="font-display text-[1.1rem] text-tinta">Catálogo en PDF</h2>
        <p className="mt-1 text-[0.9rem] text-taupe">
          Se arma solo con la información de este panel. Al abrirlo, elige <strong>Guardar como PDF</strong> en la ventana de impresión,
          con márgenes en <strong>Ninguno</strong> y <strong>Gráficos de fondo</strong> activado.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <a href="/imprimir/alta#imprimir" target="_blank" className="border border-champagne px-4 py-2.5 text-[0.68rem] text-tinta versalitas hover:bg-beige/50">PDF alta calidad (imprenta)</a>
          <a href="/imprimir/ligera#imprimir" target="_blank" className="border border-champagne px-4 py-2.5 text-[0.68rem] text-tinta versalitas hover:bg-beige/50">PDF liviano (WhatsApp)</a>
        </div>
      </section>

      {categorias.map(cat => {
        const ps = productos.filter(p => p.categoria === cat.id);
        return (
          <section key={cat.id}>
            <h2 className="mb-4 flex items-baseline justify-between border-b border-beige pb-2">
              <span className="font-display text-[1.35rem] text-tinta">{cat.nombre}</span>
              <span className="font-delicada text-lg italic text-bronce">{ps.length} productos</span>
            </h2>
            {!ps.length && <p className="text-taupe">Aún no hay productos en esta categoría.</p>}
            <ul className="divide-y divide-beige">
              {ps.map((p, i) => (
                <li key={p.id} className={`flex items-center gap-4 py-3 ${p.activo ? '' : 'opacity-55'}`}>
                  <Link href={`/admin/producto/${p.id}`} className="arco relative block h-[72px] w-[54px] shrink-0 overflow-hidden bg-beige">
                    <Image src={foto(p.imagenes[0], 'web')} alt="" fill sizes="54px" className="object-cover" />
                  </Link>
                  <Link href={`/admin/producto/${p.id}`} className="min-w-0 flex-1">
                    <span className="block truncate text-[1rem] text-tinta">{p.nombre}</span>
                    <span className="block text-[0.82rem] text-taupe">{p.id} · {precioTexto(p, marca) ?? 'sin precio'} · {p.tallas.length ? p.tallas.join(', ') : 'sin tallas'}</span>
                  </Link>
                  <div className="flex shrink-0 items-center gap-1">
                    <form action={moverProducto.bind(null, p.id, -1)}><button disabled={i === 0} aria-label={`Subir ${p.nombre}`} className="grid size-9 place-items-center text-taupe hover:text-tinta disabled:opacity-25">↑</button></form>
                    <form action={moverProducto.bind(null, p.id, 1)}><button disabled={i === ps.length - 1} aria-label={`Bajar ${p.nombre}`} className="grid size-9 place-items-center text-taupe hover:text-tinta disabled:opacity-25">↓</button></form>
                    <form action={cambiarActivo.bind(null, p.id, !p.activo)}>
                      <button className={`ml-1 min-w-24 border px-3 py-2 text-[0.62rem] versalitas ${p.activo ? 'border-champagne text-tinta' : 'border-beige text-taupe'}`}>
                        {p.activo ? 'Visible' : 'Oculto'}
                      </button>
                    </form>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        );
      })}

      {versiones.length > 0 && (
        <section className="border border-beige bg-white/60 p-5">
          <h2 className="font-display text-[1.1rem] text-tinta">Versiones anteriores</h2>
          <p className="mt-1 text-[0.9rem] text-taupe">Si algo se borró o cambió por error, puedes volver a una versión anterior del catálogo.</p>
          <ul className="mt-3 divide-y divide-beige">
            {versiones.map(v => (
              <li key={v.url} className="flex items-center justify-between py-2 text-[0.9rem] text-taupe">
                {new Date(v.fecha).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'America/Bogota' })}
                <form action={restaurarVersion.bind(null, v.url)}><button className="text-[0.64rem] text-bronce underline underline-offset-4 versalitas">Restaurar</button></form>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
