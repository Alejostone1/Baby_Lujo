'use client';
import { useActionState } from 'react';
import { ingresar } from '../acciones';
import { Aviso, BotonEnviar, Campo, Entrada } from '@/components/admin/Campos';

export default function Ingresar() {
  const [estado, accion] = useActionState(ingresar, null);
  return (
    <div className="mx-auto max-w-sm py-10">
      <h1 className="text-center font-display text-[1.9rem] tracking-[0.05em] text-tinta">Entrar al panel</h1>
      <p className="mt-3 text-center font-delicada text-lg italic text-taupe">Aquí se actualizan productos, precios y fotos del catálogo.</p>
      <form action={accion} className="mt-10 space-y-5">
        <Campo etiqueta="Contraseña">
          <Entrada type="password" name="clave" required autoComplete="current-password" autoFocus />
        </Campo>
        <Aviso estado={estado} />
        <BotonEnviar className="w-full">Entrar</BotonEnviar>
      </form>
    </div>
  );
}
