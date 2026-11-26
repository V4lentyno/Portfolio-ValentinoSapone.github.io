import { projectsData } from '../config/projectsData.js';
import { startApp } from '../core/app.js';
import { initVimeoFacade } from '../ui/vimeoFacade.js';

const pad = (n) => String(n).padStart(2, '0');
/** Largo de la palabra más larga: lo usa el CSS para que los títulos gigantes no desborden. */
const longest = (t) => Math.max(...t.split(/\s+/).map((w) => w.length));

function boardMarkup(b, i) {
    const ratio = `aspect-ratio:${b.width} / ${b.height}`;
    const eager = i === 0;

    if (b.placeholder) {
        return `
        <figure class="board board--placeholder" style="${ratio}" role="img" aria-label="${b.alt}">
            <!-- TODO: ${b.todo} -->
            <figcaption class="board__todo">lámina ${pad(i + 1)} — pendiente de exportar</figcaption>
        </figure>`;
    }

    let media;
    if (b.video) {
        media = `<video class="board__media" src="${b.video}"${b.poster ? ` poster="${b.poster}"` : ''} width="${b.width}" height="${b.height}" muted loop playsinline preload="${eager ? 'auto' : 'none'}" data-loop aria-label="${b.alt}"></video>`;
    } else {
        const srcset = b.srcSm ? ` srcset="${b.srcSm} ${b.smWidth || 1440}w, ${b.src} ${b.width}w" sizes="(max-width: 767px) 360px, 100vw"` : '';
        media = `<img class="board__media" src="${b.src}"${srcset} width="${b.width}" height="${b.height}" alt="${b.alt}" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">`;
    }

    const overlays = (b.overlays || [])
        .map(
            (o) =>
                `<video class="board__overlay" src="${o.src}" style="top:${o.top}%;left:${o.left}%;width:${o.width}%;height:${o.height}%;border-radius:${o.radius || 48}px" muted loop playsinline preload="none" data-loop aria-hidden="true"></video>`
        )
        .join('');

    return `<figure class="board" style="${ratio}"${eager ? '' : ' data-fade'}>${media}${overlays}</figure>`;
}

function pieceMarkup(piece) {
    return `
    <section class="piece">
        <div class="piece__head">
            <p class="label">${piece.tag}</p>
            <h2 class="piece__title reveal-line" data-reveal="scroll" style="--chars:${longest(piece.title)}"><span class="reveal-line__inner">${piece.title}</span></h2>
            <p class="piece__desc">${piece.desc}</p>
        </div>
        <div class="video-facade" role="button" tabindex="0" data-vimeo-id="${piece.vimeoId}" data-title="${piece.title}"
             data-cursor="play" aria-label="Reproducir ${piece.title}">
            ${piece.thumb
                ? `<img class="video-facade__img" src="${piece.thumb.src}" srcset="${piece.thumb.srcSm} ${piece.thumb.smWidth}w, ${piece.thumb.src} ${piece.thumb.width}w" sizes="(max-width: 767px) 360px, 100vw" width="${piece.thumb.width}" height="${piece.thumb.height}" alt="" loading="lazy" decoding="async">`
                : `<span class="video-facade__title" aria-hidden="true">${piece.title}</span>`}
            <span class="video-facade__play">reproducir</span>
        </div>
    </section>`;
}

function metaItem(label, value) {
    if (!value) return '';
    return `<div class="case-meta__item"><dt class="label">${label}</dt><dd>${value}</dd></div>`;
}

function renderCase(p) {
    const index = projectsData.indexOf(p);
    const next = projectsData[(index + 1) % projectsData.length];
    const link = p.link
        ? `<a href="${p.link}" target="_blank" rel="noopener noreferrer">ver en behance ↗</a>`
        : '';

    const content = p.pieces
        ? `<div class="pieces">${p.pieces.map(pieceMarkup).join('')}</div>`
        : `<div class="boards">${p.boards.map(boardMarkup).join('')}</div>`;

    return `
    <header class="case-hero">
        <h1 class="case-title reveal-line" style="--title-chars:${longest(p.title)}" data-reveal="${p.pixelTitle ? 'pixel' : 'load'}"><span class="reveal-line__inner">${p.title}</span></h1>
    </header>
    <section class="case-info">
        <dl class="case-meta">
            ${metaItem('rol', p.role)}
            ${metaItem('herramientas', p.tools)}
            ${metaItem('año', p.year)}
            ${metaItem('proyecto', link)}
        </dl>
        <p class="case-intro">${p.desc}</p>
    </section>
    ${content}
    <a class="next" href="${next.slug}.html" data-cursor="ver">
        <span class="label">siguiente proyecto</span>
        <span class="next__title reveal-line" data-reveal="scroll" style="--next-chars:${longest(next.title)}"><span class="reveal-line__inner">${next.title}</span></span>
    </a>`;
}

/**
 * Títulos de varias palabras: van en una sola línea y se achican hasta ocupar el mismo
 * ancho que un título de una palabra como "nology" (~75% del viewport). La animación de
 * entrada no cambia porque solo mueve .reveal-line__inner.
 */
const TITLE_WIDTH = 0.755;
function fitLongTitle(title) {
    if (!title || !/\s/.test(title.textContent.trim())) return;
    title.classList.add('case-title--long');
    const inner = title.querySelector('.reveal-line__inner');
    const fit = () => {
        title.style.fontSize = '';
        const size = parseFloat(getComputedStyle(title).fontSize);
        const target = document.documentElement.clientWidth * TITLE_WIDTH;
        title.style.fontSize = `${(size * target) / inner.scrollWidth}px`;
    };
    fit();
    document.fonts?.ready.then(fit);
    let raf;
    window.addEventListener('resize', () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(fit);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    const slug = document.body.dataset.project;
    const project = projectsData.find((p) => p.slug === slug);
    const root = document.getElementById('case');
    if (!project || !root) return startApp();

    document.body.style.setProperty('--project', project.color);
    if (project.accent) document.body.style.setProperty('--cursor-color', project.accent);
    document.body.classList.add(`project--${slug}`);

    root.innerHTML = renderCase(project);
    fitLongTitle(root.querySelector('.case-title'));
    initVimeoFacade(root);
    startApp();
});
