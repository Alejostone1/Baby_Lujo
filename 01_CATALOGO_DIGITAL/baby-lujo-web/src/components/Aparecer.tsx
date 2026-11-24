'use client';
import { useEffect } from 'react';

/** Activa la aparición suave de los elementos con clase .aparecer cuando entran en pantalla. */
export function Aparecer() {
  useEffect(() => {
    const io = new IntersectionObserver(
      entradas => entradas.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } }),
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    const observar = () => document.querySelectorAll('.aparecer:not(.visible)').forEach(el => io.observe(el));
    observar();
    const mo = new MutationObserver(observar);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, []);
  return null;
}
