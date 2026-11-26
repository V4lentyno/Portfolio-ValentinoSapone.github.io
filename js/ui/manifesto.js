import { gsap, ScrollTrigger } from '../core/libs.js';
import { reducedMotion } from '../core/motion.js';

/**
 * Párrafo manifiesto: se parte en <span> por palabra y cada palabra pasa de
 * opacidad 0.25 a 1 ligada al scroll.
 */
export function initManifesto(el) {
    if (!el) return;
    const text = el.textContent.trim();
    el.setAttribute('aria-label', text);
    el.innerHTML = text
        .split(/\s+/)
        .map((w) => `<span class="word" aria-hidden="true">${w}</span>`)
        .join(' ');

    if (reducedMotion || typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.fromTo(
        el.querySelectorAll('.word'),
        { opacity: 0.25 },
        {
            opacity: 1,
            stagger: 0.05,
            ease: 'none',
            scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 50%', scrub: true },
        }
    );
}
