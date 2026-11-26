# Portfolio — Valentino Sapone

Portfolio personal (Vite + JavaScript vanilla en módulos ES, GSAP + ScrollTrigger, Lenis y Three.js).

```bash
npm install
npm run dev      # desarrollo
npm run build    # genera dist/ (home + 5 case studies)
npm run preview  # sirve dist/
```

## Estructura

- `index.html` — home. `proyectos/<slug>.html` — un case study por proyecto (misma plantilla).
- `partials/` — nav, footer y `<head>` compartidos; los inserta el plugin de `vite.config.js` (`<!-- partial:nav -->`).
- `js/config/projectsData.js` — fuente única de proyectos: tarjetas de la home, láminas, metadatos y orden de "siguiente proyecto".
- `js/config/coversData.js` — portadas (estante 3D, lightbox y carrusel del CTA).
- `js/core/` — librerías (`libs.js`), sistema de movimiento (`motion.js`) y arranque común (`app.js`).
- `js/pages/` — entrada de cada tipo de página (`home.js`, `project.js`).
- `js/ui/` — Lenis, cursor, menú mobile, manifiesto, carrusel, videos en loop, fachada de Vimeo y lightbox.
- `public/` — archivos que se copian tal cual a `dist/` (el CV en PDF).
- `js/3d/coversShowcase.js` — estante 3D de portadas (se carga con import dinámico solo en la home).

Las rutas son relativas (`base: './'`), así que el `dist/` funciona tanto en la raíz de un dominio (Vercel) como en una subcarpeta.

## Cómo agregar láminas a un case study

1. Exportar en WebP a 2880 px de ancho (y una copia de 1440 px con sufijo `-1440`) en `images/<slug>/`.
2. Importarlas en `projectsData.js` y sumarlas a `boards` con `width`/`height` reales y un `alt` descriptivo.
3. Para videos sobre un mockup, usar `overlays: [{ src, top, left, width, height, radius }]` (posiciones en %).

## TODO pendientes

- [ ] **Ajedrez**: imagen real del proyecto (antes usaba la portada de "Diligencias") y URL real de Behance (antes apuntaba a behance.net a secas). Hoy la tarjeta usa el video en loop.
- [ ] **Metadatos**: herramientas y año de Cosem, LoopUp, Ajedrez y Audiovisual (los campos vacíos no se muestran).
