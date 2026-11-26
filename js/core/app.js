import { ScrollTrigger } from './libs.js';
import { initSmoothScroll, scrollToTarget } from '../ui/smoothScroll.js';
import { initCustomCursor } from '../ui/customCursor.js';
import { initMobileMenu } from '../ui/mobileMenu.js';
import { initLoopVideos } from '../ui/videoLoop.js';
import { initPageTransitions, initTitleReveals, initFadeIns, playPageEnter } from './motion.js';

/**
 * Arranque común a todas las páginas. Cada página arma primero su contenido
 * (desde los datos) y después llama a startApp().
 */
export function startApp() {
    initSmoothScroll();
    initMobileMenu();
    initCustomCursor();
    initPageTransitions();
    initTitleReveals();
    initFadeIns();
    initLoopVideos();

    const refresh = () => {
        if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    };

    // Si llegamos con un ancla (p. ej. desde un case study a "#sobre-mi"),
    // saltamos directo a la sección en lugar de hacer la entrada de la hoja.
    const target = location.hash && document.querySelector(decodeURIComponent(location.hash));
    if (target) {
        requestAnimationFrame(() => {
            scrollToTarget(target, true);
            refresh();
        });
        return;
    }

    playPageEnter(refresh);
}
