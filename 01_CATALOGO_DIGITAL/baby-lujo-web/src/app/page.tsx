import Image from 'next/image';
import { getCatalogoPublico } from '@/lib/catalogo';
import { enlaceWhatsApp, foto, mensajeGeneral, precioTexto } from '@/lib/formato';
import { Coleccion } from '@/components/Coleccion';
import { Encabezado, Pie, WhatsAppFlotante } from '@/components/Marco';
import { Aparecer } from '@/components/Aparecer';
import { Boton, IconoWhatsApp, Ornamento } from '@/components/ui';

export default async function Inicio() {
  const { marca, categorias, productos } = await getCatalogoPublico();
  const wa = enlaceWhatsApp(marca, mensajeGeneral);
  const destacados = productos.filter(p => p.destacado);
  const [principal, secundario] = destacados.length >= 2 ? destacados : productos;
  const items = productos.map(p => ({ p, precio: precioTexto(p, marca) }));

  return (
    <>
      <Encabezado marca={marca} />
      <Aparecer />
      <main>
        {/* Portada */}
        <section className="relative overflow-hidden px-5 pb-20 pt-10 sm:px-8 sm:pt-14 lg:pb-28">
          <div className="mx-auto grid max-w-6xl items-center gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-10">
            <div className="flex flex-col items-center text-center">
              <h1 className="sr-only">BABY LUJO by Joaquín RP</h1>
              <Image
                src="/marca/logo-transparente.png"
                alt="BABY LUJO by Joaquín RP"
                width={420}
                height={420}
                preload
                className="w-[min(78vw,340px)] animate-[entrada_1.6s_var(--ease-seda)_both] lg:w-[400px]"
              />
              <p className="mt-2 max-w-sm font-delicada text-[1.45rem] italic leading-snug text-taupe sm:text-[1.6rem]">
                Delicadeza, elegancia y exclusividad desde los primeros momentos.
              </p>
              <div className="mt-9 flex w-full max-w-sm flex-col gap-3 sm:flex-row sm:justify-center">
                <Boton href="#coleccion" className="flex-1">Ver la colección</Boton>
                {wa && (
                  <Boton href={wa} externo variante="linea" className="flex-1">
                    <IconoWhatsApp /> Escríbenos
                  </Boton>
                )}
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[460px] lg:max-w-none">
              <div className="arco-marco arco-3x4 mx-auto w-[82%] [--filete:12px] lg:ml-auto lg:mr-6 lg:w-[74%]">
                <div className="arco arco-3x4 relative aspect-[3/4] bg-beige">
                  <Image src={foto(principal.imagenes[0])} alt={principal.nombre} fill preload sizes="(min-width:1024px) 38vw, 80vw" className="object-cover" />
                </div>
              </div>
              {secundario && (
                <div className="absolute -bottom-10 left-0 w-[38%] lg:-bottom-12 lg:left-2 lg:w-[34%]">
                  <div className="arco-marco arco-3x4 [--filete:7px]">
                    <div className="arco arco-3x4 relative aspect-[3/4] bg-beige ring-[6px] ring-marfil">
                      <Image src={foto(secundario.imagenes[0])} alt={secundario.nombre} fill sizes="(min-width:1024px) 16vw, 36vw" className="object-cover" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Bienvenida */}
        <section className="bg-marfil-claro px-5 py-20 text-center sm:py-28">
          <div className="aparecer mx-auto max-w-xl">
            <Ornamento />
            <h2 className="mt-8 font-display text-[1.7rem] leading-tight tracking-[0.06em] text-tinta sm:text-[2.2rem]">Bienvenidos a BABY LUJO</h2>
            <p className="mt-6 text-[1rem] leading-[1.85] text-taupe">
              Cada prenda de esta colección fue elegida para vestir los primeros momentos con ternura y elegancia.
              Recorre las piezas, guarda tus favoritas y escríbenos por WhatsApp para conocer precios, tallas y disponibilidad.
            </p>
            <p className="mt-8 font-delicada text-xl italic text-bronce">{productos.length} piezas · {categorias.length} colecciones</p>
          </div>
        </section>

        {/* Colección */}
        <section id="coleccion" aria-label="La colección" className="scroll-mt-16 px-5 pb-24 sm:px-8">
          <Coleccion categorias={categorias} items={items} />
        </section>

        {/* Contacto */}
        <section id="contacto" className="scroll-mt-16 px-5 pb-24 sm:px-8">
          <div className="aparecer arco-marco mx-auto max-w-2xl [--arco-r:180px] [--filete:12px]">
            <div className="arco bg-beige/70 px-7 pb-16 pt-24 text-center [--arco-r:180px] sm:px-16 sm:pt-28">
              <p className="font-delicada text-xl italic text-bronce">Atención personalizada</p>
              <h2 className="mt-2 font-display text-[1.8rem] leading-tight tracking-[0.06em] text-tinta sm:text-[2.3rem]">Estamos para asesorarte</h2>
              <p className="mx-auto mt-5 max-w-md text-[0.98rem] leading-relaxed text-taupe">
                Cuéntanos qué prenda te enamoró y te ayudamos con tallas, colores y disponibilidad.
              </p>
              <div className="mt-9 flex flex-col items-center gap-4">
                {wa ? (
                  <Boton href={wa} externo><IconoWhatsApp /> Escribir por WhatsApp</Boton>
                ) : (
                  <p className="text-[0.7rem] text-taupe versalitas">Canal de contacto en configuración</p>
                )}
                {marca.instagram && (
                  <a href={`https://instagram.com/${marca.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-[0.7rem] text-tinta underline decoration-dorado underline-offset-4 versalitas">
                    Instagram {marca.instagram.startsWith('@') ? marca.instagram : `@${marca.instagram}`}
                  </a>
                )}
                {marca.ciudad && <p className="font-delicada text-lg italic text-taupe">{marca.ciudad}</p>}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Pie marca={marca} />
      <WhatsAppFlotante href={wa} />
    </>
  );
}
