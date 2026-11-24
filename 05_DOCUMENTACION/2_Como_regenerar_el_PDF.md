# Cómo regenerar el catálogo PDF

El PDF no es un archivo aparte que haya que rediseñar: se arma automáticamente con **la misma información del panel**. Si cambias un precio en el panel, el siguiente PDF ya lo trae.

## Opción A · Desde el panel (sin instalar nada)

1. Entra al panel (`/admin`).
2. En **Catálogo en PDF** toca:
   - **PDF alta calidad (imprenta)**: para imprimir o presentar.
   - **PDF liviano (WhatsApp)**: para enviar por chat.
3. Se abre la ventana de impresión. Ajusta:
   - Destino: **Guardar como PDF**
   - Márgenes: **Ninguno**
   - Opciones: activa **Gráficos de fondo**
4. Guarda el archivo. Recomendado: hacerlo desde un computador con Google Chrome o Microsoft Edge.

## Opción B · Con el generador automático (computador con el proyecto)

Produce exactamente los dos archivos de `02_CATALOGO_PDF`, con nombres fijos y tipografías incorporadas.

```powershell
cd "BABY_LUJO_PROYECTO_FINAL\01_CATALOGO_DIGITAL\baby-lujo-web"
npm install
npm run pdf -- https://baby-lujo.vercel.app
```

El resultado queda en `BABY_LUJO_PROYECTO_FINAL\02_CATALOGO_PDF\`:

- `Baby_Lujo_Catalogo_Alta_Calidad.pdf`: fotos a resolución completa.
- `Baby_Lujo_Catalogo_WhatsApp.pdf`: fotos optimizadas, peso reducido.

Usa Chrome o Edge instalados en el equipo (no descarga nada adicional).

## Estructura del documento

Portada, presentación de la marca, índice de colecciones, un separador por colección,
páginas de producto con tres composiciones que se alternan (protagonista, asimétrica y dúo),
página de contacto con códigos QR y contraportada. El orden sigue las categorías y el orden de productos del panel.

## Revisión antes de enviar

`npm run` también incluye un revisor automático que detecta textos cortados, elementos fuera de la página o superpuestos:

```powershell
node scripts/revisar-pdf.mjs https://baby-lujo.vercel.app revision-pdf
```

Genera capturas de cada página y hojas de contacto en la carpeta `revision-pdf`.

## Nota de impresión

El PDF es A4 vertical sin márgenes de sangrado. Si la imprenta pide sangrado (normalmente 3 mm), pídeles imprimir «ajustado a página» o avísanos para preparar una versión con sangrado.
