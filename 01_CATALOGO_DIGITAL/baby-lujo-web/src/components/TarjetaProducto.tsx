import Image from 'next/image';
import Link from 'next/link';
import { foto } from '@/lib/formato';
import type { Producto } from '@/lib/tipos';

export function TarjetaProducto({ p, precio, categoria, prioridad = false }: { p: Producto; precio: string | null; categoria?: string; prioridad?: boolean }) {
  return (
    <Link href={`/producto/${p.slug}`} className="group block outline-none" aria-label={`${p.nombre}, ver detalle`}>
      <div className="arco-marco arco-3x4 [--filete:6px] sm:[--filete:8px]">
        <div className="arco arco-3x4 relative aspect-[3/4] bg-beige">
          <Image
            src={foto(p.imagenes[0])}
            alt={p.nombre}
            fill
            sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 46vw"
            className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-seda)] group-hover:scale-[1.035] group-focus-visible:scale-[1.035]"
            loading={prioridad ? 'eager' : 'lazy'}
          />
        </div>
      </div>
      <div className="mt-4 text-center sm:mt-5">
        {categoria && <p className="text-[0.6rem] text-bronce versalitas">{categoria}</p>}
        <h3 className="mt-1.5 font-display text-[0.98rem] leading-snug text-tinta sm:text-[1.08rem]">{p.nombre}</h3>
        <p className="mt-1 font-delicada text-[1.02rem] italic text-taupe">
          {precio ?? 'Precio a consultar'}
          {p.variantes.length > 1 && <span className="not-italic"> · {p.variantes.length} colores</span>}
        </p>
      </div>
    </Link>
  );
}
