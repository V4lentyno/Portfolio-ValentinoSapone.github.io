import { projectsData } from '../config/projectsData.js';
import { coversData } from '../config/coversData.js';
import { startApp } from '../core/app.js';
import { initManifesto } from '../ui/manifesto.js';
import { initVerticalCarousel } from '../ui/carousel.js';
import { initLightbox } from '../ui/lightbox.js';

import thumbDiligencias from '../../images/thumbs/portada-diligencias.webp';
import thumbFeli from '../../images/thumbs/portada-feli.webp';
import thumbWaterproof from '../../images/thumbs/portada-waterproof.webp';
import thumbSalida from '../../images/thumbs/portada-salida.webp';
import thumbHyh from '../../images/thumbs/portada-hyh.webp';
import thumbCosem from '../../images/thumbs/cosem-01.webp';
import thumbLoopup from '../../images/thumbs/loopup-01.webp';
import thumbAjedrez from '../../images/thumbs/ajedrez-poster.webp';

function coverMarkup(p) {
    const c = p.cover;
    if (!c) {
        return `<div class="card__placeholder" style="aspect-ratio:${p.coverAspect || '16 / 9'}"><!-- TODO: portada de ${p.slug} --><span>${p.title}</span></div>`;
    }
    if (c.video) {
        return `<video class="card__img" src="${c.video}" poster="${c.poster}" width="${c.width}" height="${c.height}" muted loop playsinline preload="none" data-loop aria-hidden="true"></video>`;
    }
    const srcset = c.srcSm ? ` srcset="${c.srcSm} 1440w, ${c.src} ${c.width}w" sizes="(min-width: 768px) calc(100vw - 56px), 100vw"` : '';
    return `<img class="card__img" src="${c.src}"${srcset} width="${c.width}" height="${c.height}" alt="" loading="lazy" decoding="async">`;
}

function renderProjects() {
    const list = document.getElementById('work-list');
    if (!list) return;
    list.innerHTML = projectsData
        .map(
            (p) => `
        <a class="card" href="proyectos/${p.slug}.html" data-cursor="ver" data-fade style="--project:${p.color}">
            <div class="card__media">${coverMarkup(p)}</div>
            <div class="card__meta">
                <h2 class="card__title">${p.title}</h2>
                <p class="card__tag">${p.tag}</p>
            </div>
        </a>`
        )
        .join('');
}

function renderCoversFallback() {
    // Lista accesible por teclado (y fallback sin WebGL) que abre el mismo lightbox.
    const ul = document.getElementById('covers-fallback');
    if (!ul) return;
    ul.innerHTML = coversData
        .map((c, i) => `<li><button type="button" data-cover="${i}">${c.title.toLowerCase()}</button></li>`)
        .join('');
    ul.addEventListener('click', (e) => {
        const b = e.target.closest('[data-cover]');
        if (b) window.triggerLightboxAtIndex?.(Number(b.dataset.cover));
    });
}

function lazyCoversShelf() {
    const el = document.getElementById('covers-3d-canvas');
    if (!el) return;
    const load = () =>
        import('../3d/coversShowcase.js')
            .then((m) => m.initCovers3DShowcase())
            .catch(() => el.classList.add('is-unavailable'));
    if (!('IntersectionObserver' in window)) return load();
    const io = new IntersectionObserver((entries) => {
        if (entries.some((e) => e.isIntersecting)) {
            io.disconnect();
            load();
        }
    }, { rootMargin: '600px 0px' });
    io.observe(el);
}

document.addEventListener('DOMContentLoaded', () => {
    renderProjects();
    renderCoversFallback();
    initLightbox();
    initManifesto(document.getElementById('manifesto'));
    initVerticalCarousel(document.getElementById('cta-track'), [
        { src: thumbDiligencias, width: 400, height: 400 },
        { src: thumbCosem, width: 400, height: 225 },
        { src: thumbFeli, width: 400, height: 400 },
        { src: thumbLoopup, width: 400, height: 225 },
        { src: thumbSalida, width: 400, height: 400 },
        { src: thumbAjedrez, width: 400, height: 225 },
        { src: thumbWaterproof, width: 400, height: 400 },
        { src: thumbHyh, width: 400, height: 400 },
        // TODO: sumar una miniatura de NOLOGY cuando estén las exportaciones
    ]);
    startApp();
    lazyCoversShelf();
});
