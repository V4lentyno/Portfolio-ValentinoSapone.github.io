import { gsap, ScrollTrigger } from './libs.js';
/**
 * Sistema de movimiento compartido.
 * Una sola curva para todo el sitio: el spring de la referencia (stiffness 400,
 * damping 80, mass 1) se aproxima con expo.out ≈ 1.1s.
 */
export const EASE = 'expo.out';
export const DURATION = 1.1;

export const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const hasGsap = () => typeof gsap !== 'undefined';

/** Entrada de página: la hoja sube desde abajo y se acomoda. */
export function playPageEnter(onDone) {
    const page = document.getElementById('page');
    if (!page || !hasGsap() || reducedMotion) {
        onDone?.();
        return;
    }
    gsap.fromTo(
        page,
        { y: window.innerHeight },
        {
            y: 0,
            duration: 1.2,
            ease: EASE,
            clearProps: 'transform',
            onComplete: () => onDone?.(),
        }
    );
}

/**
 * Títulos gigantes: cada `.reveal-line` recorta (overflow: hidden) a su
 * `.reveal-line__inner`, que emerge desde abajo.
 *  - data-reveal="load"   → al cargar, con delay 0.7s
 *  - data-reveal="scroll" → al entrar al 85% del viewport
 *  - data-reveal="pixel"  → al cargar, recorte escalonado (guiño pixelado de NOLOGY)
 */
export function initTitleReveals() {
    if (!hasGsap() || reducedMotion) {
        document.documentElement.classList.remove('js-reveal');
        return;
    }

    document.querySelectorAll('[data-reveal]').forEach((el) => {
        const inner = el.querySelector('.reveal-line__inner') || el;
        const mode = el.dataset.reveal;

        if (mode === 'pixel') {
            gsap.fromTo(
                inner,
                { clipPath: 'inset(-10% 100% -40% 0)' },
                { clipPath: 'inset(-10% 0% -40% 0)', duration: 0.9, ease: 'steps(14)', delay: 0.7, clearProps: 'clipPath' }
            );
            return;
        }

        // Arranca por completo debajo de la máscara: la altura del texto + el aire
        // para descendentes (.reveal-line) + lo que sobresalen las ascendentes.
        const from = { yPercent: 140 };
        const to = { yPercent: 0, duration: DURATION, ease: EASE };
        if (mode === 'load') {
            gsap.fromTo(inner, from, { ...to, delay: 0.7 });
            gsap.set(el, { visibility: 'visible' });
        } else if (typeof ScrollTrigger !== 'undefined') {
            gsap.fromTo(inner, from, {
                ...to,
                scrollTrigger: { trigger: el, start: 'top 85%', once: true },
            });
        }
    });
}

/** Aparición mínima (opacidad) para láminas y tarjetas. Sin parallax. */
export function initFadeIns(selector = '[data-fade]') {
    if (!hasGsap() || reducedMotion || typeof ScrollTrigger === 'undefined') return;
    document.querySelectorAll(selector).forEach((el) => {
        gsap.from(el, {
            opacity: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: { trigger: el, start: 'top 90%', once: true },
        });
    });
}

/**
 * Transición entre páginas: fade del contenido (0.3s) antes de navegar.
 * La entrada la hace playPageEnter() en la página de destino.
 */
export function initPageTransitions() {
    const page = document.getElementById('page');

    // Al volver con el botón "atrás" (bfcache) la página puede quedar invisible.
    window.addEventListener('pageshow', (e) => {
        if (e.persisted && page) page.style.opacity = '';
    });

    document.addEventListener('click', (e) => {
        if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
        const link = e.target.closest('a[href]');
        if (!link || link.target === '_blank' || link.hasAttribute('download')) return;

        const url = new URL(link.href, location.href);
        if (url.origin !== location.origin) return;
        // Anclas dentro de la misma página las maneja smoothScroll.js
        if (samePath(url, location) && url.hash) return;
        if (url.href === location.href) return;

        e.preventDefault();
        const go = () => { window.location.href = url.href; };
        if (!page || !hasGsap() || reducedMotion) return go();
        gsap.to(page, { opacity: 0, duration: 0.3, ease: 'power2.out', onComplete: go });
    });
}

export function samePath(a, b) {
    const norm = (p) => p.replace(/index\.html$/, '').replace(/\/$/, '') || '/';
    return norm(a.pathname) === norm(b.pathname);
}
