import 'server-only';
import { createHash, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

/**
 * Acceso al panel con una sola contraseña (variable ADMIN_PASSWORD).
 * La cookie guarda una huella de la contraseña, nunca la contraseña.
 * Si la contraseña cambia, todas las sesiones abiertas se cierran solas.
 */
const COOKIE = 'bl_admin';

function huella() {
  const clave = process.env.ADMIN_PASSWORD;
  if (!clave) return null;
  return createHash('sha256').update(`baby-lujo::${clave}`).digest('hex');
}

export function contrasenaCorrecta(intento: string) {
  const clave = process.env.ADMIN_PASSWORD;
  if (!clave) return false;
  const a = createHash('sha256').update(intento).digest();
  const b = createHash('sha256').update(clave).digest();
  return timingSafeEqual(a, b);
}

export async function abrirSesion() {
  (await cookies()).set(COOKIE, huella()!, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 24 * 30 });
}

export async function cerrarSesion() {
  (await cookies()).delete(COOKIE);
}

export async function haySesion() {
  const h = huella();
  if (!h) return false;
  const v = (await cookies()).get(COOKIE)?.value;
  return Boolean(v && v.length === h.length && timingSafeEqual(Buffer.from(v), Buffer.from(h)));
}

export async function exigirSesion() {
  if (!(await haySesion())) redirect('/admin/ingresar');
}
