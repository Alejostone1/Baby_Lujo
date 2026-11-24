# Publicación y administración técnica

## Dónde está todo

| Pieza | Servicio | Detalle |
|---|---|---|
| Código | GitHub | `github.com/Alejostone1/Baby_Lujo` (rama `main`) |
| Sitio web | Vercel | Proyecto `baby-lujo`, equipo *Alejostone's projects*. Carpeta raíz del proyecto: `01_CATALOGO_DIGITAL/baby-lujo-web` |
| Datos y fotos nuevas | Vercel Blob | Almacén `baby-lujo-catalogo` (gratis en el plan Hobby) |

## Cómo fluye la información (una sola fuente)

```
Panel /admin ──guarda──► Vercel Blob: catalogo/catalogo-<fecha>.json  (+ fotos nuevas en productos/)
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
     Web pública (/, /producto/…)     Páginas de impresión (/imprimir/alta, /imprimir/ligera)
                                              │
                                              ▼
                                   PDF alta calidad y PDF WhatsApp
```

- `data/catalogo.json` (en el repositorio) es el **punto de partida**: se usa mientras no exista ninguna versión guardada desde el panel, y en el trabajo local.
- Cada guardado del panel crea una versión nueva; se conservan las 20 últimas como copia de seguridad.
- La web se actualiza al instante después de guardar (caché etiquetada `catalogo`).

## Variables de entorno (Vercel → Project → Settings → Environment Variables)

| Variable | Para qué sirve |
|---|---|
| `ADMIN_PASSWORD` | Contraseña del panel. Para cambiarla, edita el valor y vuelve a desplegar (Deployments → ⋯ → Redeploy). Al cambiarla se cierran todas las sesiones abiertas. |
| `BLOB_READ_WRITE_TOKEN` | Creada automáticamente al conectar el almacén Blob. No compartir. |
| `NEXT_PUBLIC_SITE_URL` | Dirección pública del catálogo: se usa en la vista previa al compartir y en el código QR del PDF. Cámbiala si conectas un dominio propio. |

## Conectar un dominio propio (opcional)

1. Compra el dominio (por ejemplo en Vercel → Domains o en otro proveedor).
2. Vercel → proyecto `baby-lujo` → Settings → Domains → Add.
3. Sigue las instrucciones de DNS que muestra Vercel.
4. Actualiza `NEXT_PUBLIC_SITE_URL` con la nueva dirección y vuelve a desplegar.

## Publicar cambios de diseño o código

Cualquier `git push` a `main` publica automáticamente una nueva versión en Vercel (1–2 minutos).
Los datos del panel **no** se pierden al publicar: viven en Vercel Blob, no en el código.

## Trabajo local

```powershell
cd "BABY_LUJO_PROYECTO_FINAL\01_CATALOGO_DIGITAL\baby-lujo-web"
npm install
npm run dev
```

Abre `http://localhost:3000`. Sin `BLOB_READ_WRITE_TOKEN`, el panel local guarda en `data/catalogo.json` y las fotos en `public/productos/`.
Para el panel local crea un archivo `.env.local` con `ADMIN_PASSWORD=<una contraseña de prueba>`.

## Vista previa al compartir (WhatsApp, Instagram, Facebook)

- Página de inicio: imagen `public/og.jpg` (logo y dos prendas en arcos), título y descripción de la marca.
- Cada producto: su propia foto y descripción.
- Para regenerar la imagen y los íconos después de cambiar el logo: `npm run marca`.

## Scripts disponibles (`package.json`)

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor local |
| `npm run build` | Compilación de producción |
| `npm run pdf -- <url>` | Genera los dos PDF en `02_CATALOGO_PDF` |
| `npm run marca` | Regenera logo transparente, íconos e imagen para compartir |
| `node scripts/revisar-pdf.mjs <url> <carpeta>` | Revisión automática del PDF |
| `node scripts/captura.mjs <url> <archivo.png> movil` | Captura de pantalla de control |
