/* eslint-disable @next/next/no-img-element -- en el PDF se usan <img> directos para controlar la resolución exacta */
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import QRCode from 'qrcode';
import { getCatalogoPublico } from '@/lib/catalogo';
import { enlaceWhatsApp, foto, mensajeGeneral, precioTexto } from '@/lib/formato';
import type { Catalogo, Categoria, Producto } from '@/lib/tipos';
import { ImprimirAlAbrir } from '@/components/ImprimirAlAbrir';
import './imprimir.css';

export const metadata: Metadata = { title: 'Catálogo PDF', robots: { index: false, follow: false } };

export function generateStaticParams() {
  return [{ calidad: 'alta' }, { calidad: 'ligera' }];
}

type Calidad = 'hd' | 'web';
type Pagina =
  | { tipo: 'portada' } | { tipo: 'marca' } | { tipo: 'indice' }
  | { tipo: 'separador'; cat: Categoria; n: number; orden: number }
  | { tipo: 'protagonista'; cat: Categoria; p: Producto }
  | { tipo: 'duo'; cat: Categoria; a: Producto; b: Producto }
  | { tipo: 'asimetrica'; cat: Categoria; a: Producto; b: Producto }
  | { tipo: 'contacto' } | { tipo: 'contraportada' };

/** Secuencia editorial: cada colección abre con un separador y alterna composiciones. */
function paginar(c: Catalogo): Pagina[] {
  const out: Pagina[] = [{ tipo: 'portada' }, { tipo: 'marca' }, { tipo: 'indice' }];
  c.categorias.forEach((cat, ci) => {
    const ps = c.productos.filter(p => p.categoria === cat.id);
    if (!ps.length) return;
    out.push({ tipo: 'separador', cat, n: ps.length, orden: ci + 1 });
    out.push({ tipo: 'protagonista', cat, p: ps[0] });
    let resto = ps.slice(1), alterna = true;
    while (resto.length >= 2) {
      const [a, b] = resto;
      out.push(alterna ? { tipo: 'asimetrica', cat, a, b } : { tipo: 'duo', cat, a, b });
      alterna = !alterna;
      resto = resto.slice(2);
    }
    if (resto.length) out.push({ tipo: 'protagonista', cat, p: resto[0] });
  });
  out.push({ tipo: 'contacto' }, { tipo: 'contraportada' });
  return out;
}

const fechaEdicion = (iso: string) => new Intl.DateTimeFormat('es-CO', { month: 'long', year: 'numeric' }).format(new Date(iso + 'T12:00:00'));

export default function Imprimir({ params }: PageProps<'/imprimir/[calidad]'>) {
  return (
    <Suspense>
      <Documento params={params} />
    </Suspense>
  );
}

async function Documento({ params }: { params: PageProps<'/imprimir/[calidad]'>['params'] }) {
  const { calidad: c } = await params;
  if (c !== 'alta' && c !== 'ligera') notFound();
  const calidad: Calidad = c === 'alta' ? 'hd' : 'web';
  const cat = await getCatalogoPublico();
  const paginas = paginar(cat);
  const sitio = process.env.NEXT_PUBLIC_SITE_URL;
  const sitioPublico = sitio && !sitio.includes('localhost') ? sitio : null;
  const wa = enlaceWhatsApp(cat.marca, mensajeGeneral);
  const qrSitio = sitioPublico ? await QRCode.toString(sitioPublico, { type: 'svg', margin: 0, color: { dark: '#3D332D', light: '#0000' } }) : null;
  const qrWa = wa ? await QRCode.toString(wa, { type: 'svg', margin: 0, color: { dark: '#3D332D', light: '#0000' } }) : null;
  const edicion = fechaEdicion(cat.marca.actualizado);

  // Primera página de cada colección, para el índice
  const inicio: Record<string, number> = {};
  paginas.forEach((p, i) => { if (p.tipo === 'separador') inicio[p.cat.id] = i + 1; });

  const ctx = { calidad, marca: cat.marca, total: paginas.length, edicion };

  return (
    <div className="pdf" data-listo="si">
      <ImprimirAlAbrir />
      {paginas.map((pg, i) => {
        const num = i + 1;
        switch (pg.tipo) {
          case 'portada': {
            const [principal] = cat.productos.filter(p => p.destacado).concat(cat.productos);
            return (
              <section key={i} className="hoja portada">
                <div className="marco-doble" />
                <img className="portada-logo" src="/marca/logo-transparente.png" alt="BABY LUJO by Joaquín RP" />
                <div className="arco-pdf portada-foto"><img src={foto(principal.imagenes[0], calidad)} alt="" /></div>
                <p className="portada-pie"><span>Catálogo de colección</span><i>·</i><span>{edicion}</span></p>
              </section>
            );
          }
          case 'marca': {
            const fotoMarca = cat.productos.find(p => p.destacado && p !== cat.productos.find(x => x.destacado)) ?? cat.productos[1];
            return (
              <section key={i} className="hoja marca">
                <div className="marca-texto">
                  <p className="antetitulo">Baby luxury</p>
                  <h2 className="marca-lema">Delicadeza, elegancia y exclusividad desde los primeros momentos.</h2>
                  <div className="filete" />
                  <p>BABY LUJO nace para vestir los primeros momentos con la delicadeza que merecen. Cada pieza de esta colección fue elegida por su ternura, sus detalles y su elegancia serena.</p>
                  <p>Encontrarás vestidos y conjuntos de ceremonia, prendas coordinadas, enterizos, overoles y bodies, presentados uno a uno para que puedas apreciarlos con calma.</p>
                  <p>Para conocer precios, tallas y disponibilidad, escríbenos: te asesoramos de manera personal.</p>
                  <p className="marca-firma">{cat.marca.firma.replace('BY', 'by').replace('JOAQUÍN RP', 'Joaquín RP')}</p>
                </div>
                <div className="arco-pdf marca-foto"><img src={foto(fotoMarca.imagenes[0], calidad)} alt="" /></div>
                <Pie {...ctx} num={num} />
              </section>
            );
          }
          case 'indice':
            return (
              <section key={i} className="hoja indice">
                <p className="antetitulo centro">Contenido</p>
                <h2 className="titulo-pagina">Las colecciones</h2>
                <div className="filete centro" />
                <ol className="indice-lista">
                  {cat.categorias.map(c => {
                    const ps = cat.productos.filter(p => p.categoria === c.id);
                    return (
                      <li key={c.id}>
                        <div className="arco-pdf indice-foto"><img src={foto(ps[0].imagenes[0], 'web')} alt="" /></div>
                        <div className="indice-texto">
                          <h3>{c.nombre}</h3>
                          <p>{c.descripcion}</p>
                          <span>{ps.length} {ps.length === 1 ? 'pieza' : 'piezas'}</span>
                        </div>
                        <span className="indice-guia" />
                        <span className="indice-num">{String(inicio[c.id]).padStart(2, '0')}</span>
                      </li>
                    );
                  })}
                </ol>
                <Pie {...ctx} num={num} />
              </section>
            );
          case 'separador':
            return (
              <section key={i} className="hoja separador">
                <div className="separador-arco">
                  <p className="antetitulo centro">Colección</p>
                  <h2>{pg.cat.nombre}</h2>
                  <div className="filete centro" />
                  <p className="separador-desc">{pg.cat.descripcion}</p>
                  <p className="separador-n">{pg.n} {pg.n === 1 ? 'pieza' : 'piezas'}</p>
                </div>
                <Pie {...ctx} num={num} />
              </section>
            );
          case 'protagonista':
            return (
              <section key={i} className="hoja protagonista">
                <Cabecera cat={pg.cat} />
                <div className="arco-pdf prota-foto"><img src={foto(pg.p.imagenes[0], calidad)} alt="" /></div>
                <Ficha p={pg.p} precio={precioTexto(pg.p, cat.marca)} calidad={calidad} centrada />
                <Pie {...ctx} num={num} />
              </section>
            );
          case 'duo':
            return (
              <section key={i} className="hoja duo">
                <Cabecera cat={pg.cat} />
                <div className="duo-rejilla">
                  {[pg.a, pg.b].map(p => (
                    <div key={p.id} className="duo-item">
                      <div className="arco-pdf duo-foto"><img src={foto(p.imagenes[0], calidad)} alt="" /></div>
                      <Ficha p={p} precio={precioTexto(p, cat.marca)} calidad={calidad} centrada compacta />
                    </div>
                  ))}
                </div>
                <Pie {...ctx} num={num} />
              </section>
            );
          case 'asimetrica':
            return (
              <section key={i} className="hoja asimetrica">
                <Cabecera cat={pg.cat} />
                <div className="arco-pdf asim-foto-a"><img src={foto(pg.a.imagenes[0], calidad)} alt="" /></div>
                <div className="asim-ficha-a"><Ficha p={pg.a} precio={precioTexto(pg.a, cat.marca)} calidad={calidad} /></div>
                <div className="asim-ficha-b"><Ficha p={pg.b} precio={precioTexto(pg.b, cat.marca)} calidad={calidad} compacta alineadaDerecha /></div>
                <div className="arco-pdf asim-foto-b"><img src={foto(pg.b.imagenes[0], calidad)} alt="" /></div>
                <Pie {...ctx} num={num} />
              </section>
            );
          case 'contacto':
            return (
              <section key={i} className="hoja contacto">
                <div className="contacto-arco">
                  <p className="antetitulo centro">Atención personalizada</p>
                  <h2 className="titulo-pagina">Estamos para asesorarte</h2>
                  <div className="filete centro" />
                  <p className="contacto-texto">Cuéntanos qué prenda te enamoró y te ayudamos con tallas, colores y disponibilidad. Al escribirnos, menciona el código que aparece junto a cada producto.</p>
                  <div className="contacto-datos">
                    {cat.marca.whatsapp ? (
                      <div><span className="etiqueta">WhatsApp</span><a href={wa!}>{cat.marca.whatsapp}</a></div>
                    ) : (
                      <div className="pendiente"><span className="etiqueta">WhatsApp</span><span>[número por confirmar]</span></div>
                    )}
                    {cat.marca.instagram && <div><span className="etiqueta">Instagram</span><a href={`https://instagram.com/${cat.marca.instagram.replace('@', '')}`}>{cat.marca.instagram}</a></div>}
                    {sitioPublico && <div><span className="etiqueta">Catálogo en línea</span><a href={sitioPublico}>{sitioPublico.replace(/^https?:\/\//, '')}</a></div>}
                    {cat.marca.ciudad && <div><span className="etiqueta">Ubicación</span><span>{cat.marca.ciudad}</span></div>}
                  </div>
                  {(qrWa || qrSitio) && (
                    <div className="contacto-qr">
                      {qrWa && <a href={wa!}><span dangerouslySetInnerHTML={{ __html: qrWa }} /><em>Escríbenos</em></a>}
                      {qrSitio && <a href={sitioPublico!}><span dangerouslySetInnerHTML={{ __html: qrSitio }} /><em>Ver catálogo en línea</em></a>}
                    </div>
                  )}
                </div>
                <Pie {...ctx} num={num} />
              </section>
            );
          case 'contraportada':
            return (
              <section key={i} className="hoja contraportada">
                <div className="marco-doble" />
                <img className="contra-logo" src="/marca/logo-transparente.png" alt="BABY LUJO by Joaquín RP" />
                <p className="contra-lema">{cat.marca.lema}</p>
                <p className="contra-nota">Edición {edicion}. Precios, tallas y disponibilidad sujetos a confirmación.</p>
              </section>
            );
        }
      })}
    </div>
  );
}

function Cabecera({ cat }: { cat: Categoria }) {
  return (
    <header className="cabecera">
      <span>Baby Lujo</span>
      <span className="cabecera-cat">{cat.nombre}</span>
    </header>
  );
}

function Pie({ num, total, edicion }: { num: number; total: number; edicion: string }) {
  return (
    <footer className="pie">
      <span>Colección · {edicion}</span>
      <span className="pie-num"><i>◆</i> {String(num).padStart(2, '0')} <em>/ {String(total).padStart(2, '0')}</em></span>
    </footer>
  );
}

function Ficha({ p, precio, centrada, compacta, alineadaDerecha }: { p: Producto; precio: string | null; calidad: Calidad; centrada?: boolean; compacta?: boolean; alineadaDerecha?: boolean }) {
  return (
    <div className={`ficha ${centrada ? 'centrada' : ''} ${compacta ? 'compacta' : ''} ${alineadaDerecha ? 'derecha' : ''}`}>
      <p className="ficha-codigo">{p.referencia ?? p.id}</p>
      <h3>{p.nombre}</h3>
      <p className="ficha-precio">{precio ?? 'Precio a consultar'}</p>
      {!compacta && <p className="ficha-desc">{p.descripcion}</p>}
      <dl>
        <div><dt>Colores</dt><dd>{p.colores.join(' · ')}</dd></div>
        <div><dt>Incluye</dt><dd>{p.piezas.join(' · ')}</dd></div>
        <div><dt>Tallas</dt><dd>{p.tallas.length ? p.tallas.join(' · ') : 'Consultar disponibilidad'}</dd></div>
      </dl>
    </div>
  );
}
