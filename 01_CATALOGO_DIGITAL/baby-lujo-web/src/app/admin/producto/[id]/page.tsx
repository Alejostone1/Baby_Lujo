import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { getCatalogo } from '@/lib/catalogo';
import { exigirSesion } from '@/lib/sesion';
import { FormProducto } from '@/components/admin/FormProducto';

export default function EditarProducto(props: PageProps<'/admin/producto/[id]'>) {
  return (
    <Suspense fallback={<p className="font-delicada text-xl italic text-taupe">Cargando…</p>}>
      <Contenido {...props} />
    </Suspense>
  );
}

async function Contenido({ params, searchParams }: PageProps<'/admin/producto/[id]'>) {
  await exigirSesion();
  const { id } = await params;
  const { creado, guardado } = await searchParams;
  const { productos, categorias } = await getCatalogo();
  const p = id === 'nuevo' ? null : productos.find(x => x.id === id);
  if (p === undefined) notFound();
  return (
    <div>
      <Link href="/admin" className="text-[0.66rem] text-taupe versalitas">← Volver al catálogo</Link>
      <h1 className="mt-4 font-display text-[1.9rem] tracking-[0.04em] text-tinta">{p ? p.nombre : 'Nuevo producto'}</h1>
      {p && (
        <p className="mt-1 text-taupe">
          Código {p.id} ·{' '}
          <Link href={`/producto/${p.slug}`} target="_blank" className="text-bronce underline underline-offset-4">ver en el catálogo</Link>
        </p>
      )}
      {guardado && <p className="mt-4 border border-[#b9cdb0] bg-[#f1f6ee] px-4 py-3 text-[#3c5a30]">Cambios guardados. Ya se ven en el catálogo.</p>}
      {creado && <p className="mt-4 border border-[#b9cdb0] bg-[#f1f6ee] px-4 py-3 text-[#3c5a30]">Producto creado. Ya aparece en el catálogo.</p>}
      <div className="mt-10"><FormProducto key={p ? huella(JSON.stringify(p)) : 'nuevo'} p={p} categorias={categorias} /></div>
    </div>
  );
}

/** Huella corta del producto: si cambia tras guardar, el formulario se vuelve a montar con los datos nuevos. */
function huella(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return String(h);
}
