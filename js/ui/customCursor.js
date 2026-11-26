import { gsap, ScrollTrigger } from '../core/libs.js';
import { reducedMotion } from '../core/motion.js';

/**
 * Cursor custom: círculo de 48px con mix-blend-mode: difference.
 * - Crece levemente sobre links y botones.
 * - Sobre elementos con data-cursor="ver" (o cualquier texto) crece más y muestra la etiqueta.
 * Se desactiva en dispositivos táctiles.
 */
export function initCustomCursor() {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (typeof gsap === 'undefined') return;

    const cursor = document.createElement('div');
    cursor.className = 'cursor';
    cursor.setAttribute('aria-hidden', 'true');
    cursor.innerHTML = '<span class="cursor__label"></span>';
    document.body.appendChild(cursor);
    document.documentElement.classList.add('has-cursor');

    const label = cursor.querySelector('.cursor__label');
    const dur = reducedMotion ? 0 : 0.35;
    const xTo = gsap.quickTo(cursor, 'x', { duration: dur, ease: 'power3' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: dur, ease: 'power3' });

    let visible = false;
    window.addEventListener('mousemove', (e) => {
        if (!visible) {
            gsap.set(cursor, { x: e.clientX, y: e.clientY });
            cursor.classList.add('is-visible');
            visible = true;
        }
        xTo(e.clientX);
        yTo(e.clientY);
    });

    document.addEventListener('mouseleave', () => {
        cursor.classList.remove('is-visible');
        visible = false;
    });

    // Delegación: funciona también con el contenido que se arma desde JS.
    document.addEventListener('mouseover', (e) => {
        const labelled = e.target.closest('[data-cursor]');
        const interactive = e.target.closest('a, button, [role="button"]');
        if (labelled) {
            cursor.classList.add('is-label');
            cursor.classList.remove('is-hover');
            label.textContent = labelled.dataset.cursor;
        } else if (interactive) {
            cursor.classList.add('is-hover');
            cursor.classList.remove('is-label');
            label.textContent = '';
        } else {
            cursor.classList.remove('is-hover', 'is-label');
            label.textContent = '';
        }
    });
}
