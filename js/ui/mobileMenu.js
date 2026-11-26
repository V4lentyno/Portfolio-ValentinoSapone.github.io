import { lenis } from './smoothScroll.js';

/**
 * Menú mobile (< 768px): overlay a pantalla completa con links grandes.
 * Cierra antes de navegar para que el scroll a la sección (o la transición
 * de página) ocurra con Lenis reactivado.
 */
export function initMobileMenu() {
    const toggle = document.getElementById('menu-toggle');
    const menu = document.getElementById('mobile-menu');
    if (!toggle || !menu) return;

    const setOpen = (open) => {
        menu.classList.toggle('is-open', open);
        menu.setAttribute('aria-hidden', open ? 'false' : 'true');
        toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
        toggle.textContent = open ? 'cerrar' : 'menú';
        document.body.classList.toggle('menu-open', open);
        const l = lenis || window.lenis;
        if (l) open ? l.stop() : l.start();
    };

    toggle.addEventListener('click', () => setOpen(!menu.classList.contains('is-open')));

    // Cerrar en captura, antes de que smoothScroll / transiciones manejen el click.
    menu.addEventListener('click', (e) => {
        if (e.target.closest('a')) setOpen(false);
    }, true);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menu.classList.contains('is-open')) setOpen(false);
    });

    window.matchMedia('(min-width: 768px)').addEventListener('change', (mq) => {
        if (mq.matches) setOpen(false);
    });
}
