// Inventario construido en la auditoría visual (Etapa 1).
// Nombres y descripciones se basan SOLO en lo que se ve en cada fotografía.
// Precio, tallas y referencia comercial quedan en null: no venían en el material.
// foto = número de la foto en la auditoría (orden cronológico de los archivos WhatsApp).

const categorias = [
  { id: 'ocasion-especial', nombre: 'Ocasión especial', descripcion: 'Vestidos y conjuntos de ceremonia para los momentos que se recuerdan.' },
  { id: 'conjuntos', nombre: 'Conjuntos', descripcion: 'Prendas coordinadas, pensadas para combinarse con armonía.' },
  { id: 'enterizos', nombre: 'Enterizos', descripcion: 'Una sola pieza, suave y práctica, para el día a día del bebé.' },
  { id: 'overoles', nombre: 'Overoles', descripcion: 'Jardineras con carácter, de texturas nobles y detalles bordados.' },
  { id: 'bodies', nombre: 'Bodies', descripcion: 'Básicos esenciales con estampados delicados y acabados cuidados.' },
];

// [foto(s), categoría, nombre, descripción visual, colores visibles, piezas visibles]
const P = [
  // Ocasión especial
  [25, 'ocasion-especial', 'Vestido de tul con perlas', 'Vestido marfil de tul con mangas transparentes, aplicaciones de perlas y flores, y bonete a juego.', ['Marfil'], ['Vestido', 'Bonete']],
  [27, 'ocasion-especial', 'Vestido de tul con flores bordadas', 'Vestido blanco con corpiño cruzado, cinta en la cintura, mangas de tul y falda con flores aplicadas.', ['Blanco'], ['Vestido']],
  [51, 'ocasion-especial', 'Vestido de tul con lunares y bolero', 'Vestido de tul blanco con lunares y volantes en vino tinto, acompañado de bolero tejido vino tinto con cuello bebé.', ['Blanco', 'Vino tinto'], ['Vestido', 'Bolero']],
  [26, 'ocasion-especial', 'Caballerito vino tinto', 'Camisa blanca de manga corta con corbatín, tirantes rayados y short vino tinto con dobladillo.', ['Blanco', 'Vino tinto'], ['Camisa', 'Corbatín', 'Tirantes', 'Short']],
  [28, 'ocasion-especial', 'Caballerito azul noche', 'Camisa celeste de manga larga con corbatín azul marino, tirantes y pantalón azul noche.', ['Celeste', 'Azul marino'], ['Camisa', 'Corbatín', 'Tirantes', 'Pantalón']],
  [10, 'ocasion-especial', 'Caballerito celeste con chaleco', 'Camisa blanca de manga corta, chaleco y short celeste con corbatín a juego.', ['Blanco', 'Celeste'], ['Camisa', 'Chaleco', 'Short', 'Corbatín']],
  [37, 'ocasion-especial', 'Caballerito marfil', 'Camisa estampada de manga corta con corbatín, tirantes y short marfil.', ['Marfil', 'Blanco'], ['Camisa', 'Corbatín', 'Tirantes', 'Short']],
  [40, 'ocasion-especial', 'Caballerito con boina', 'Camisa a rayas finas con corbatín, tirantes, pantalón en tono salvia y boina a juego.', ['Salvia', 'Crudo'], ['Camisa', 'Corbatín', 'Tirantes', 'Pantalón', 'Boina']],
  // Conjuntos
  [[41, 45], 'conjuntos', 'Ajuar Safari de cinco piezas', 'Ajuar con chaqueta cruzada estampada con jirafa y elefante, pantalón con pies, pantalón, babero y gorro.', ['Marfil', 'Rayas celeste'], ['Chaqueta', 'Pantalón con pies', 'Pantalón', 'Babero', 'Gorro'], ['Marfil', 'Rayas celeste']],
  [2, 'conjuntos', 'Conjunto tejido Safari', 'Cárdigan tejido marfil con elefante y jirafa bordados, botones de madera y pantalón tejido azul.', ['Marfil', 'Azul'], ['Cárdigan', 'Pantalón']],
  [42, 'conjuntos', 'Conjunto pata de gallo', 'Body marfil con volantes en los hombros, falda pata de gallo, diadema con moño y medias a juego.', ['Marfil', 'Negro'], ['Body', 'Falda', 'Diadema', 'Medias']],
  [9, 'conjuntos', 'Conjunto floral con capucha', 'Chaqueta con capucha y pantalón jogger en estampado floral menudo, con franjas y moños rosa.', ['Marfil', 'Rosa'], ['Chaqueta', 'Pantalón']],
  [35, 'conjuntos', 'Conjunto Jardín de conejitos', 'Camisa con cuello bebé y pantalón con pies, en estampado de flores y conejitos.', ['Marfil', 'Multicolor pastel'], ['Camisa', 'Pantalón con pies']],
  [12, 'conjuntos', 'Conjunto polo Osito', 'Buzo marfil con cuello polo, ribetes en contraste y osito bordado; pantalón café.', ['Marfil', 'Café'], ['Buzo', 'Pantalón']],
  [29, 'conjuntos', 'Conjunto colegial', 'Suéter azul marino con cuello polo blanco y escote en V, acompañado de pantalón beige.', ['Azul marino', 'Beige'], ['Suéter', 'Pantalón']],
  [38, 'conjuntos', 'Conjunto chaleco a rayas', 'Camisa polo blanca con chaleco tejido y short a rayas azul y marfil.', ['Blanco', 'Azul'], ['Camisa', 'Chaleco', 'Short']],
  [30, 'conjuntos', 'Conjunto camisa a rayas', 'Camisa de rayas celeste con cuello mao y short blanco.', ['Celeste', 'Blanco'], ['Camisa', 'Short']],
  [32, 'conjuntos', 'Conjunto texturizado con gorro', 'Chaqueta, pantalón y gorro en tela de relieve de puntos, en gris azulado.', ['Gris azulado'], ['Chaqueta', 'Pantalón', 'Gorro']],
  [19, 'conjuntos', 'Conjunto gris cuello polo', 'Buzo gris con cuello polo y pantalón jogger gris.', ['Gris'], ['Buzo', 'Pantalón']],
  [34, 'conjuntos', 'Conjunto Dino Roar con gorro', 'Camiseta y short celeste con estampado de dinosaurios, acompañados de gorro a juego.', ['Celeste', 'Azul marino'], ['Camiseta', 'Short', 'Gorro']],
  // Enterizos
  [1, 'enterizos', 'Enterizo tejido Pingüino', 'Enterizo tejido con diseño de pingüino en gris, marfil y negro, con botones de madera.', ['Gris', 'Marfil', 'Negro'], ['Enterizo']],
  [8, 'enterizos', 'Enterizo tejido Osito', 'Enterizo tejido azul con osito al frente, mangas a cuadros y ribetes camel.', ['Azul', 'Camel'], ['Enterizo']],
  [39, 'enterizos', 'Enterizo de peluche Osito', 'Enterizo de peluche café con orejitas, gorro de osito y mitones a juego.', ['Café'], ['Enterizo', 'Gorro', 'Mitones']],
  [7, 'enterizos', 'Enterizo con capucha Osito', 'Enterizo de felpa marfil con capucha gris, osito bordado y pies en contraste.', ['Marfil', 'Gris'], ['Enterizo']],
  [22, 'enterizos', 'Enterizo acanalado Osito con gorro', 'Enterizo acanalado camel con carita de oso y gorro con orejitas.', ['Camel'], ['Enterizo', 'Gorro']],
  [33, 'enterizos', 'Enterizo Osito con gorro', 'Enterizo con pies de osito, carita al frente y gorro a juego.', ['Taupe'], ['Enterizo', 'Gorro']],
  [17, 'enterizos', 'Enterizo Elefante', 'Enterizo gris acanalado con elefante aplicado y pies de elefante.', ['Gris'], ['Enterizo']],
  [3, 'enterizos', 'Enterizo Carritos', 'Enterizo marfil con estampado de carritos y animalitos, y ribetes tejidos.', ['Marfil', 'Multicolor'], ['Enterizo']],
  [21, 'enterizos', 'Enterizo Dinosaurios con capucha', 'Enterizo con pies y capucha con orejitas, estampado de dinosaurios en verde sobre marfil.', ['Marfil', 'Verde'], ['Enterizo']],
  [36, 'enterizos', 'Enterizo Dinosaurios azul con gorro', 'Enterizo con cremallera, mangas azules y estampado de dinosaurios, con gorro a juego.', ['Blanco', 'Azul'], ['Enterizo', 'Gorro']],
  [20, 'enterizos', 'Enterizo corto Dinosaurio', 'Enterizo corto marfil con cuello polo y dinosaurio verde aplicado.', ['Marfil', 'Verde'], ['Enterizo']],
  // Overoles
  [4, 'overoles', 'Overol de pana Conejita', 'Overol de pana rosa con conejita aplicada y botones al tono.', ['Rosa'], ['Overol']],
  [5, 'overoles', 'Overol Osita con corazones', 'Overol beige acanalado con corazones rosa y osita bordada con moño.', ['Beige', 'Rosa'], ['Overol']],
  [6, 'overoles', 'Overol de pana Dinosaurio', 'Overol de pana verde con dinosaurio aplicado y crestas en el costado.', ['Verde'], ['Overol']],
  [24, 'overoles', 'Overol de pana Osito', 'Overol de pana café con osito bordado y camiseta a rayas blanco y negro.', ['Café', 'Blanco', 'Negro'], ['Overol', 'Camiseta']],
  [23, 'overoles', 'Overol Dinosaurios', 'Overol verde oliva con estampado de dinosaurios y camiseta gris.', ['Verde oliva', 'Gris'], ['Overol', 'Camiseta']],
  [18, 'overoles', 'Overol tejido con gorro', 'Overol tejido azul con botón de madera y gorro tejido a juego.', ['Azul'], ['Overol', 'Gorro']],
  // Bodies
  [11, 'bodies', 'Body Conejita y Osito', 'Body rosa de manga larga con aplicación de conejita y osito, y ribetes florales.', ['Rosa'], ['Body']],
  [15, 'bodies', 'Body Rosas', 'Body de manga corta con estampado de rosas y flor de tul aplicada.', ['Rosa', 'Blanco'], ['Body']],
  [14, 'bodies', 'Body Cerezas', 'Body sin mangas marfil con volantes y cerezas bordadas.', ['Marfil', 'Rojo'], ['Body']],
  [13, 'bodies', 'Body Lazos', 'Body de manga larga con estampado de lazos rosa y ribetes al tono.', ['Marfil', 'Rosa'], ['Body']],
  [16, 'bodies', 'Body Lacitos', 'Body marfil de manga larga con lacitos rosa y ribetes en contraste.', ['Marfil', 'Rosa'], ['Body']],
  [46, 'bodies', 'Body Manzanita bordada', 'Body rosa palo de manga corta con manzana aplicada y frase bordada.', ['Rosa palo'], ['Body']],
  [43, 'bodies', 'Body Manzanitas', 'Body de manga corta con estampado de manzanitas y ribetes rosa.', ['Crudo', 'Malva'], ['Body']],
  [44, 'bodies', 'Body Frutal', 'Body de manga corta con estampado de manzanas y ribetes ciruela.', ['Blanco', 'Ciruela'], ['Body']],
  [48, 'bodies', 'Body Marinero', 'Body blanco con cuello marinero azul marino y ancla bordada.', ['Blanco', 'Azul marino'], ['Body']],
  [50, 'bodies', 'Body rayas marineras', 'Body a rayas blanco y azul marino con bolsillo en contraste.', ['Blanco', 'Azul marino'], ['Body']],
  [49, 'bodies', 'Body Anclas', 'Body celeste de manga corta con estampado de anclas y veleros.', ['Celeste', 'Azul marino'], ['Body']],
  [31, 'bodies', 'Body Veleros', 'Body blanco de manga corta con veleros estampados y ribetes azul marino.', ['Blanco', 'Azul marino'], ['Body']],
  [47, 'bodies', 'Body Autitos', 'Body de manga corta con estampado de autitos y ribetes azul grisáceo.', ['Crudo', 'Azul grisáceo'], ['Body']],
];

module.exports = { categorias, P };
