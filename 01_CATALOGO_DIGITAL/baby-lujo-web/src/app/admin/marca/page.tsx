import Link from 'next/link';
import { Suspense } from 'react';
import { getCatalogo } from '@/lib/catalogo';
import { exigirSesion } from '@/lib/sesion';
import { FormMarca } from '@/components/admin/FormsAjustes';

export default function Marca() {
  return <Suspense><Contenido /></Suspense>;
}

async function Contenido() {
  await exigirSesion();
  const { marca } = await getCatalogo();
  return (
    <div>
      <Link href="/admin" className="text-[0.66rem] text-taupe versalitas">← Volver al catálogo</Link>
      <h1 className="mb-8 mt-4 font-display text-[1.9rem] tracking-[0.04em] text-tinta">WhatsApp y contacto</h1>
      <FormMarca marca={marca} />
    </div>
  );
}
