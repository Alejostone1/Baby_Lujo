export type Categoria = { id: string; nombre: string; descripcion: string };

export type Variante = { nombre: string; imagen: string };

export type Producto = {
  id: string;
  slug: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  piezas: string[];
  colores: string[];
  variantes: Variante[];
  imagenes: string[];
  referencia: string | null;
  precio: number | null;
  tallas: string[];
  activo: boolean;
  destacado: boolean;
};

export type Marca = {
  nombre: string;
  firma: string;
  lema: string;
  whatsapp: string | null;
  instagram: string | null;
  ciudad: string | null;
  moneda: string;
  actualizado: string;
};

export type Catalogo = { marca: Marca; categorias: Categoria[]; productos: Producto[] };
