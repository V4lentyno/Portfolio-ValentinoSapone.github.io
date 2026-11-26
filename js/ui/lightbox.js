import { coversData } from '../config/coversData.js';
import { lenis } from './smoothScroll.js';

/**
 * Lightbox de portadas con flechas y teclado (Esc, ←, →).
 * El estante 3D lo abre con window.triggerLightboxAtIndex(i).
 */
export function initLightbox() {
    const box = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    const caption = document.getElementById('lightbox-caption');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');
    if (!box || !img) return;

    let index = 0;
    let lastFocus = null;
    const total = coversData.length;

    const render = () => {
        const c = coversData[index];
        img.src = c.image;
        img.alt = `Portada de ${c.title}`;
        if (caption) caption.textContent = `${c.title.toLowerCase()} — ${index + 1}/${total}`;
    };
    const step = (d) => { index = (index + d + total) % total; render(); };

    const open = (i) => {
        index = i;
        render();
        lastFocus = document.activeElement;
        box.classList.add('is-open');
        box.setAttribute('aria-hidden', 'false');
        (lenis || window.lenis)?.stop();
        closeBtn?.focus();
    };
    const close = () => {
        box.classList.remove('is-open');
        box.setAttribute('aria-hidden', 'true');
        (lenis || window.lenis)?.start();
        lastFocus?.focus?.();
    };

    window.triggerLightboxAtIndex = open;

    closeBtn?.addEventListener('click', close);
    prevBtn?.addEventListener('click', (e) => { e.stopPropagation(); step(-1); });
    nextBtn?.addEventListener('click', (e) => { e.stopPropagation(); step(1); });
    box.addEventListener('click', (e) => { if (e.target === box) close(); });

    document.addEventListener('keydown', (e) => {
        if (!box.classList.contains('is-open')) return;
        if (e.key === 'Escape') close();
        else if (e.key === 'ArrowRight') step(1);
        else if (e.key === 'ArrowLeft') step(-1);
    });
}
