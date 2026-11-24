'use client';
import { useActionState } from 'react';
import { guardarCategorias, guardarMarca } from '@/app/admin/acciones';
import type { Categoria, Marca } from '@/lib/tipos';
import { Aviso, BotonEnviar, Campo, Entrada, claseCampo } from './Campos';

export function FormMarca({ marca }: { marca: Marca }) {
  const [estado, accion] = useActionState(guardarMarca, null);
  return (
    <form action={accion} className="max-w-lg space-y-5">
      <Campo etiqueta="WhatsApp de ventas" ayuda="Con indicativo del país. Los botones «Consultar por WhatsApp» abren este número.">
        <Entrada name="whatsapp" defaultValue={marca.whatsapp ?? ''} placeholder="+57 314 426 4715" inputMode="tel" />
      </Campo>
      <Campo etiqueta="Instagram" ayuda="Opcional. Ej.: @babylujo"><Entrada name="instagram" defaultValue={marca.instagram ?? ''} /></Campo>
      <Campo etiqueta="Ciudad o zona de envíos" ayuda="Opcional. Se muestra en Contacto."><Entrada name="ciudad" defaultValue={marca.ciudad ?? ''} /></Campo>
      <Campo etiqueta="Moneda">
        <select name="moneda" defaultValue={marca.moneda} className={claseCampo}>
          <option value="COP">Pesos colombianos (COP)</option>
          <option value="USD">Dólares (USD)</option>
        </select>
      </Campo>
      <Aviso estado={estado} />
      <BotonEnviar>Guardar</BotonEnviar>
    </form>
  );
}

export function FormCategorias({ categorias, conteo }: { categorias: Categoria[]; conteo: Record<string, number> }) {
  const [estado, accion] = useActionState(guardarCategorias, null);
  return (
    <form action={accion} className="space-y-6">
      {categorias.map((c, i) => (
        <fieldset key={c.id} className="grid gap-4 border border-beige bg-white/60 p-5 sm:grid-cols-[5rem_1fr]">
          <input type="hidden" name="catId" value={c.id} />
          <Campo etiqueta="Orden"><Entrada name="catOrden" type="number" min={1} defaultValue={i + 1} /></Campo>
          <div className="space-y-4">
            <Campo etiqueta="Nombre"><Entrada name="catNombre" defaultValue={c.nombre} required /></Campo>
            <Campo etiqueta="Descripción"><textarea name="catDesc" defaultValue={c.descripcion} rows={2} className={claseCampo} /></Campo>
            <p className="text-[0.85rem] text-taupe">
              {conteo[c.id] ?? 0} productos.{' '}
              {!conteo[c.id] && <label className="ml-2 inline-flex items-center gap-2"><input type="checkbox" name="catBorrar" value={c.id} /> Eliminar esta categoría</label>}
            </p>
          </div>
        </fieldset>
      ))}
      <fieldset className="space-y-4 border border-dashed border-champagne p-5">
        <legend className="px-2 text-[0.64rem] text-bronce versalitas">Nueva categoría (opcional)</legend>
        <Campo etiqueta="Nombre"><Entrada name="nuevaNombre" /></Campo>
        <Campo etiqueta="Descripción"><textarea name="nuevaDesc" rows={2} className={claseCampo} /></Campo>
      </fieldset>
      <Aviso estado={estado} />
      <BotonEnviar>Guardar categorías</BotonEnviar>
    </form>
  );
}
