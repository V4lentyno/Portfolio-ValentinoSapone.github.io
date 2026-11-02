import { lenis } from './smoothScroll.js';

/**
 * Mobile drawer navigation toggle and scroll lock handler.
 */
export function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('#main-nav a');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            const isOpen = mainNav.classList.toggle('active');
            menuToggle.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

            if (isOpen) {
                if (lenis) lenis.stop();
                else if (window.lenis) window.lenis.stop();
            } else {
                if (lenis) lenis.start();
                else if (window.lenis) window.lenis.start();
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                menuToggle.classList.remove('active');
                mainNav.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');

                if (lenis) lenis.start();
                else if (window.lenis) window.lenis.start();
            });
        });
    }
}
