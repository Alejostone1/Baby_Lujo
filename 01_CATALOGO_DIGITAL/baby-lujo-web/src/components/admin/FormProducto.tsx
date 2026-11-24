'use client';
import Image from 'next/image';
import { useActionState, useState } from 'react';
import { eliminarProducto, guardarProducto, subirFoto } from '@/app/admin/acciones';
import { foto } from '@/lib/formato';
import type { Categoria, Producto } from '@/lib/tipos';
import { Aviso, BotonEnviar, Campo, Entrada, claseCampo } from './Campos';

/** Reduce la foto en el navegador (máx. 1800 px, JPEG) antes de subirla: carga rápida y sin límites de tamaño. */
async function reducir(archivo: File): Promise<Blob> {
  const bmp = await createImageBitmap(archivo);
  const escala = Math.min(1, 1800 / Math.max(bmp.width, bmp.height));
  const lienzo = document.createElement('canvas');
  lienzo.width = Math.round(bmp.width * escala);
  lienzo.height = Math.round(bmp.height * escala);
  lienzo.getContext('2d')!.drawImage(bmp, 0, 0, lienzo.width, lienzo.height);
  return new Promise(r => lienzo.toBlob(b => r(b!), 'image/jpeg', 0.88));
}

export function FormProducto({ p, categorias }: { p: Producto | null; categorias: Categoria[] }) {
  const [estado, accion] = useActionState(guardarProducto, null);
  const [imagenes, setImagenes] = useState<string[]>(p?.imagenes ?? []);
  const [colores, setColores] = useState<string[]>(p ? p.imagenes.map(img => p.variantes.find(v => v.imagen === img)?.nombre ?? '') : []);
  const [subiendo, setSubiendo] = useState(false);
  const [errorFoto, setErrorFoto] = useState<string | null>(null);
  const [nombre, setNombre] = useState(p?.nombre ?? '');

  async function agregarFotos(archivos: FileList | null) {
    if (!archivos?.length) return;
    setSubiendo(true); setErrorFoto(null);
    try {
      for (const a of Array.from(archivos)) {
        const fd = new FormData();
        fd.set('foto', new File([await reducir(a)], 'foto.jpg', { type: 'image/jpeg' }));
        fd.set('nombre', p?.id ?? nombre ?? 'foto');
        const r = await subirFoto(fd);
        if (r.error || !r.ref) throw new Error(r.error ?? 'No se pudo subir la foto.');
        setImagenes(x => [...x, r.ref!]);
        setColores(x => [...x, '']);
      }
    } catch (e) {
      setErrorFoto(e instanceof Error ? e.message : 'No se pudo subir la foto.');
    } finally {
      setSubiendo(false);
    }
  }

  const mover = (i: number, d: number) => {
    const j = i + d;
    if (j < 0 || j >= imagenes.length) return;
    const a = [...imagenes]; [a[i], a[j]] = [a[j], a[i]]; setImagenes(a);
    const c = [...colores]; [c[i], c[j]] = [c[j], c[i]]; setColores(c);
  };
  const quitar = (i: number) => { setImagenes(imagenes.filter((_, k) => k !== i)); setColores(colores.filter((_, k) => k !== i)); };

  return (
    <form action={accion} className="space-y-8">
      <input type="hidden" name="id" value={p?.id ?? ''} />
      <input type="hidden" name="imagenes" value={imagenes.join('\n')} />

      <fieldset className="space-y-4">
        <legend className="mb-3 font-display text-[1.2rem] text-tinta">Fotografías</legend>
        <ul className="flex flex-wrap gap-5">
          {imagenes.map((img, i) => (
            <li key={img} className="w-[132px]">
              <div className="arco relative h-[176px] w-[132px] overflow-hidden bg-beige">
                <Image src={foto(img, 'web')} alt="" fill sizes="132px" className="object-cover" />
                {i === 0 && <span className="absolute bottom-0 left-0 right-0 bg-tinta/80 py-1 text-center text-[0.56rem] text-marfil versalitas">Principal</span>}
              </div>
              <div className="mt-2 flex justify-between text-taupe">
                <button type="button" onClick={() => mover(i, -1)} disabled={i === 0} className="px-2 disabled:opacity-25" aria-label="Mover a la izquierda">←</button>
                <button type="button" onClick={() => quitar(i)} className="text-[0.6rem] underline versalitas">Quitar</button>
                <button type="button" onClick={() => mover(i, 1)} disabled={i === imagenes.length - 1} className="px-2 disabled:opacity-25" aria-label="Mover a la derecha">→</button>
              </div>
              {imagenes.length > 1 && (
                <input
                  name={`colorFoto${i}`}
                  value={colores[i] ?? ''}
                  onChange={e => setColores(c => c.map((v, k) => (k === i ? e.target.value : v)))}
                  placeholder="Color (opcional)"
                  className={`${claseCampo} mt-2 px-2 py-1.5 text-[0.85rem]`}
                />
              )}
            </li>
          ))}
          <li>
            <label className={`arco grid h-[176px] w-[132px] cursor-pointer place-items-center border border-dashed border-champagne text-center text-[0.62rem] text-bronce versalitas ${subiendo ? 'opacity-50' : 'hover:bg-beige/40'}`}>
              {subiendo ? 'Subiendo…' : '+ Agregar foto'}
              <input type="file" accept="image/*" multiple className="sr-only" disabled={subiendo} onChange={e => { agregarFotos(e.target.files); e.target.value = ''; }} />
            </label>
          </li>
        </ul>
        <p className="text-[0.82rem] text-taupe/80">La primera foto es la principal. Si el producto viene en varios colores, sube una foto por color y escribe el nombre del color debajo de cada una.</p>
        {errorFoto && <Aviso estado={{ error: errorFoto }} />}
      </fieldset>

      <fieldset className="grid gap-5 sm:grid-cols-2">
        <legend className="mb-3 font-display text-[1.2rem] text-tinta">Información</legend>
        <div className="sm:col-span-2"><Campo etiqueta="Nombre"><Entrada name="nombre" value={nombre} onChange={e => setNombre(e.target.value)} required /></Campo></div>
        <Campo etiqueta="Categoría">
          <select name="categoria" defaultValue={p?.categoria ?? categorias[0]?.id} className={claseCampo}>
            {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </Campo>
        <Campo etiqueta="Referencia propia" ayuda={`Opcional. Si la dejas vacía se usa el código ${p?.id ?? 'automático'}.`}><Entrada name="referencia" defaultValue={p?.referencia ?? ''} /></Campo>
        <div className="sm:col-span-2">
          <Campo etiqueta="Descripción"><textarea name="descripcion" defaultValue={p?.descripcion ?? ''} rows={3} className={claseCampo} /></Campo>
        </div>
        <Campo etiqueta="Precio (pesos colombianos)" ayuda="Solo números, sin puntos. Vacío = «Precio a consultar».">
          <Entrada name="precio" inputMode="numeric" defaultValue={p?.precio ?? ''} placeholder="Ej. 89000" />
        </Campo>
        <Campo etiqueta="Tallas disponibles" ayuda="Separadas por comas. Ej.: 0-3M, 3-6M, 6-9M">
          <Entrada name="tallas" defaultValue={p?.tallas.join(', ') ?? ''} />
        </Campo>
        <Campo etiqueta="Colores" ayuda="Separados por comas."><Entrada name="colores" defaultValue={p?.colores.join(', ') ?? ''} /></Campo>
        <Campo etiqueta="Piezas que incluye" ayuda="Separadas por comas."><Entrada name="piezas" defaultValue={p?.piezas.join(', ') ?? ''} /></Campo>
        <label className="flex items-center gap-3 text-tinta"><input type="checkbox" name="activo" defaultChecked={p?.activo ?? true} className="size-5 accent-[#8A6F47]" /> Visible en el catálogo</label>
        <label className="flex items-center gap-3 text-tinta"><input type="checkbox" name="destacado" defaultChecked={p?.destacado ?? false} className="size-5 accent-[#8A6F47]" /> Destacado en la portada</label>
      </fieldset>

      <Aviso estado={estado} />
      <div className="flex flex-wrap items-center justify-between gap-4 border-t border-beige pt-6">
        <BotonEnviar>{p ? 'Guardar cambios' : 'Crear producto'}</BotonEnviar>
        {p && (
          <button
            type="button"
            onClick={async () => { if (confirm(`¿Eliminar definitivamente «${p.nombre}»? Si solo quieres ocultarlo, desmarca «Visible en el catálogo».`)) await eliminarProducto(p.id); }}
            className="text-[0.64rem] text-[#8a3328] underline underline-offset-4 versalitas"
          >
            Eliminar producto
          </button>
        )}
      </div>
    </form>
  );
}
