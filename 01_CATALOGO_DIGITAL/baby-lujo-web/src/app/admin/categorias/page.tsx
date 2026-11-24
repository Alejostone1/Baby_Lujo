import Link from 'next/link';
import { Suspense } from 'react';
import { getCatalogo } from '@/lib/catalogo';
import { exigirSesion } from '@/lib/sesion';
import { FormCategorias } from '@/components/admin/FormsAjustes';

export default function Categorias() {
  return <Suspense><Contenido /></Suspense>;
}

async function Contenido() {
  await exigirSesion();
  const { categorias, productos } = await getCatalogo();
  const conteo: Record<string, number> = {};
  for (const p of productos) conteo[p.categoria] = (conteo[p.categoria] ?? 0) + 1;
  return (
    <div>
      <Link href="/admin" className="text-[0.66rem] text-taupe versalitas">← Volver al catálogo</Link>
      <h1 className="mb-2 mt-4 font-display text-[1.9rem] tracking-[0.04em] text-tinta">Categorías</h1>
      <p className="mb-8 text-taupe">El orden define cómo aparecen en la web y en el PDF.</p>
      <FormCategorias categorias={categorias} conteo={conteo} />
    </div>
  );
}
