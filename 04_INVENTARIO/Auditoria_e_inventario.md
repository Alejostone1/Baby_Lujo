# BABY LUJO · Auditoría del material e inventario

Fecha de auditoría: 24 de noviembre de 2026

## 1. Material recibido

| Recurso | Estado |
|---|---|
| Fotografías de producto | 51 archivos JPEG (`WhatsApp Image 2026-11-24 at 12.51.xx PM`). Ya estaban extraídas en la carpeta del proyecto; no se encontró el archivo `Baby_Lujo.rar`. |
| Logotipo | `logo.jpeg`, 1254 × 1254 px, fondo crema, trazos en dorado champagne. Se conserva intacto. |

## 2. Hallazgos técnicos

- **Resolución:** las fotos llegaron comprimidas por WhatsApp (896 × 1200 px o 960 × 1280 px). Son suficientes para la web y para composiciones de hasta media página en el PDF. Una foto a página completa A4 queda en torno a 110 ppp. **Si existen los archivos originales sin comprimir, conviene enviarlos**: el PDF de impresión mejoraría de inmediato con solo volver a ejecutar el proceso.
- **Estilo:** todas las fotos comparten la misma puesta en escena (prenda en gancho de madera sobre pared con molduras), en dos series de luz:
  - Serie A (41 fotos): pared beige de tono medio.
  - Serie B (10 fotos: #4, #5, #6, #10, #11, #24, #25, #26, #27 y, en tono intermedio, #3): pared marfil clara, con osito de peluche, planta o placa con el logo.
- **Duplicados:** no hay fotos repetidas. El análisis por huella visual (dHash) confirma que el par más parecido es #41 / #45, que es **la misma prenda en dos colores**.
- **Datos visibles en las fotos:** la etiqueta de la foto #11 muestra "3-6M". Es un dato de la muestra fotografiada; no confirma qué tallas hay disponibles, así que no se publicó como talla.

## 3. Tratamiento fotográfico aplicado

Todo el tratamiento es global y suave. No se cambió ningún color, estampado ni detalle de las prendas, y no se generó ninguna imagen con IA.

1. Balance de blancos tomando la pared del fondo como referencia (corrección máxima de ±5 % por canal).
2. Ajuste de medios tonos para igualar la luminosidad dentro de cada serie.
3. Ampliación 2× con remuestreo Lanczos y nitidez moderada (1792 × 2400 px) para impresión.
4. Versión web de 900 px de ancho, optimizada.

Los parámetros aplicados a cada foto quedan registrados en el proceso (`_herramientas/tratar-fotos.js`).

## 4. Clasificación

Las categorías se definieron **por el tipo de prenda que se ve en la foto**, no por información comercial. Son una propuesta y pueden renombrarse desde el panel de administración.

| Categoría | Productos |
|---|---|
| Ocasión especial | 8 |
| Conjuntos | 12 |
| Enterizos | 11 |
| Overoles | 6 |
| Bodies | 13 |
| **Total** | **50 productos · 51 fotos** |

Los códigos `BL-001` a `BL-050` son **identificadores internos del catálogo**, no referencias comerciales. Los nombres y las descripciones describen solo lo visible y deben ser validados.

Las 51 fotos originales se renombraron con su código y nombre (por ejemplo `BL-001_vestido-de-tul-con-perlas.jpeg`). La equivalencia con los nombres de WhatsApp está en `renombrado_fotos_originales.csv`.

El detalle completo (ID, nombre, colores, piezas, foto de origen y archivo original) está en `inventario.csv`, que se abre con Excel. Las fotos tratadas y renombradas están en `fotos_clasificadas/`, ordenadas por categoría.

## 5. Información pendiente (no venía en el material)

| Dato | Dónde se usa | Estado |
|---|---|---|
| Número de WhatsApp de ventas | Botones de consulta y PDF | ✓ +57 314 4264715 |
| Precios por producto | Fichas web y PDF | Pendiente (se muestra «Precio a consultar»). Moneda: ✓ pesos colombianos |
| Tallas disponibles por producto | Fichas web y PDF | Pendiente (se muestra «Consultar disponibilidad») |
| Referencias comerciales propias | Fichas | Pendiente (opcional) |
| Instagram u otras redes | Contacto | Pendiente |
| Ciudad o zona de envíos | Contacto | Pendiente |
| Dominio propio (si lo hay) | Publicación | Opcional. Hoy: https://baby-lujo.vercel.app |
| Materiales o composición de las telas | Descripciones | Pendiente (opcional) |
| Validación de nombres y categorías | Todo el catálogo | Pendiente |
