import { gsap, ScrollTrigger } from '../core/libs.js';
import { reducedMotion } from '../core/motion.js';

/**
 * Carrusel vertical infinito del CTA. Las tarjetas se duplican y la pista
 * sube un 50% en loop continuo; se pausa en hover.
 */
export function initVerticalCarousel(track, items) {
    if (!track || !items.length) return;

    const card = (it) =>
        `<figure class="cta__card"><img src="${it.src}" width="${it.width}" height="${it.height}" alt="" loading="lazy" decoding="async"></figure>`;
    const set = items.map(card).join('');
    track.innerHTML = set + set;

    if (reducedMotion || typeof gsap === 'undefined') return;

    const tween = gsap.to(track, { yPercent: -50, duration: items.length * 3.5, ease: 'none', repeat: -1 });
    const area = track.parentElement;
    area.addEventListener('mouseenter', () => tween.pause());
    area.addEventListener('mouseleave', () => tween.play());
}
