'use client';
import { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { TarjetaProducto } from './TarjetaProducto';
import type { Categoria, Producto } from '@/lib/tipos';

type Item = { p: Producto; precio: string | null };
const normal = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

export function Coleccion({ categorias, items }: { categorias: Categoria[]; items: Item[] }) {
  const [cat, setCat] = useState<string>('todo');
  const [q, setQ] = useState('');
  const busqueda = useDeferredValue(q);

  // Permite enlazar directamente a una categoría: /#coleccion=bodies
  useEffect(() => {
    const leer = () => {
      const m = location.hash.match(/coleccion=([\w-]+)/);
      if (m && categorias.some(c => c.id === m[1])) setCat(m[1]);
    };
    leer();
    addEventListener('hashchange', leer);
    return () => removeEventListener('hashchange', leer);
  }, [categorias]);

  const nombreCat = useMemo(() => Object.fromEntries(categorias.map(c => [c.id, c.nombre])), [categorias]);
  const filtrados = useMemo(() => {
    const t = normal(busqueda.trim());
    return items.filter(({ p }) =>
      (cat === 'todo' || p.categoria === cat) &&
      (!t || normal([p.nombre, p.descripcion, p.id, p.referencia ?? '', nombreCat[p.categoria], ...p.colores, ...p.piezas].join(' ')).includes(t)),
    );
  }, [items, cat, busqueda, nombreCat]);

  const agrupar = cat === 'todo' && !busqueda.trim();
  const chips = [{ id: 'todo', nombre: 'Toda la colección' }, ...categorias];

  return (
    <div>
      <div className="sticky top-[60px] z-20 -mx-5 border-y border-beige bg-marfil/92 px-5 backdrop-blur-md sm:top-[68px] sm:-mx-8 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between">
          <div role="tablist" aria-label="Categorías" className="sin-scroll -mx-1 flex gap-1 overflow-x-auto px-1">
            {chips.map(c => {
              const activo = cat === c.id;
              return (
                <button
                  key={c.id}
                  role="tab"
                  aria-selected={activo}
                  onClick={() => { setCat(c.id); document.getElementById('coleccion')?.scrollIntoView({ behavior: 'smooth' }); }}
                  className={`shrink-0 px-3.5 py-2 text-[0.66rem] versalitas transition-colors duration-300 ${activo ? 'text-tinta' : 'text-taupe/75 hover:text-tinta'}`}
                >
                  <span className={`border-b pb-1 ${activo ? 'border-dorado' : 'border-transparent'}`}>{c.nombre}</span>
                </button>
              );
            })}
          </div>
          <label className="relative block md:w-64">
            <span className="sr-only">Buscar en la colección</span>
            <svg aria-hidden viewBox="0 0 24 24" className="pointer-events-none absolute left-0 top-1/2 size-4 -translate-y-1/2 text-champagne" fill="none" stroke="currentColor" strokeWidth="1.4"><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></svg>
            <input
              type="search"
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Buscar: vestido, body, rosa…"
              className="w-full border-b border-champagne/60 bg-transparent py-2 pl-7 text-[0.95rem] text-tinta placeholder:font-delicada placeholder:text-[1.05rem] placeholder:italic placeholder:text-taupe/60 focus:border-bronce focus:outline-none"
            />
          </label>
        </div>
      </div>

      <div className="mx-auto max-w-6xl">
        {filtrados.length === 0 && (
          <div className="py-24 text-center">
            <p className="font-delicada text-2xl italic text-taupe">No encontramos prendas con “{busqueda}”.</p>
            <button onClick={() => { setQ(''); setCat('todo'); }} className="mt-5 text-[0.68rem] text-bronce underline decoration-dorado underline-offset-4 versalitas">Ver toda la colección</button>
          </div>
        )}

        {agrupar
          ? categorias.map((c, i) => {
              const grupo = filtrados.filter(x => x.p.categoria === c.id);
              if (!grupo.length) return null;
              return (
                <section key={c.id} aria-labelledby={`cat-${c.id}`} className="pt-16 sm:pt-24">
                  <header className="aparecer mb-10 text-center sm:mb-14">
                    <p className="font-delicada text-lg italic text-bronce">{grupo.length} {grupo.length === 1 ? 'pieza' : 'piezas'}</p>
                    <h2 id={`cat-${c.id}`} className="mt-1 font-display text-[1.9rem] leading-none tracking-[0.08em] text-tinta sm:text-[2.6rem]">{c.nombre}</h2>
                    <p className="mx-auto mt-4 max-w-md text-[0.92rem] leading-relaxed text-taupe">{c.descripcion}</p>
                  </header>
                  <Rejilla items={grupo} prioridad={i === 0} />
                </section>
              );
            })
          : filtrados.length > 0 && (
              <div className="pt-12">
                <p className="mb-10 text-center font-delicada text-lg italic text-bronce" aria-live="polite">
                  {filtrados.length} {filtrados.length === 1 ? 'pieza' : 'piezas'}
                </p>
                <Rejilla items={filtrados} nombreCat={nombreCat} />
              </div>
            )}
      </div>
    </div>
  );
}

function Rejilla({ items, nombreCat, prioridad }: { items: Item[]; nombreCat?: Record<string, string>; prioridad?: boolean }) {
  return (
    <ul className="grid grid-cols-2 gap-x-5 gap-y-12 sm:gap-x-9 sm:gap-y-16 md:grid-cols-3 xl:grid-cols-4">
      {items.map(({ p, precio }, i) => (
        <li key={p.id} className="aparecer" style={{ transitionDelay: `${(i % 4) * 70}ms` }}>
          <TarjetaProducto p={p} precio={precio} categoria={nombreCat?.[p.categoria]} prioridad={prioridad && i < 2} />
        </li>
      ))}
    </ul>
  );
}
