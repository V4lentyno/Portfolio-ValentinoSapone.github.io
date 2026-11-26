import { gsap, ScrollTrigger, Lenis } from '../core/libs.js';
import { reducedMotion, samePath } from '../core/motion.js';

/**
 * Lenis integrado con GSAP + ScrollTrigger.
 */
export let lenis = null;

const NAV_OFFSET = -48;

export function initSmoothScroll() {
    if (typeof Lenis !== 'undefined' && !reducedMotion) {
        lenis = new Lenis({ autoRaf: false, smoothWheel: true, lerp: 0.1 });
        window.lenis = lenis;

        if (typeof ScrollTrigger !== 'undefined') lenis.on('scroll', ScrollTrigger.update);
        if (typeof gsap !== 'undefined') {
            gsap.ticker.add((time) => lenis.raf(time * 1000));
            gsap.ticker.lagSmoothing(0);
        }
    }

    window.addEventListener('load', () => {
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    });

    // Anclas dentro de la misma página (incluye "./#proyectos" en la home)
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[href*="#"]');
        if (!link) return;
        const url = new URL(link.href, location.href);
        if (!url.hash || !samePath(url, location) || url.origin !== location.origin) return;
        const target = document.querySelector(decodeURIComponent(url.hash));
        if (!target) return;
        e.preventDefault();
        scrollToTarget(target);
        history.replaceState(null, '', url.hash);
    });
}

export function scrollToTarget(target, immediate = false) {
    if (lenis) {
        lenis.start();
        lenis.scrollTo(target, { offset: NAV_OFFSET, duration: 1.2, immediate, force: true });
    } else {
        const y = target.getBoundingClientRect().top + window.scrollY + NAV_OFFSET;
        window.scrollTo({ top: y, behavior: immediate || reducedMotion ? 'auto' : 'smooth' });
    }
}
