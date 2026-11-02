import { lenis } from './smoothScroll.js';

/**
 * Mobile drawer navigation toggle and scroll lock handler.
 */
export function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('#main-nav a');

    if (!menuToggle || !mainNav) return;

    const closeMenu = () => {
        menuToggle.classList.remove('active');
        mainNav.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('menu-open');

        const activeLenis = lenis || window.lenis;
        if (activeLenis) {
            activeLenis.start();
        }
    };

    menuToggle.addEventListener('click', () => {
        const isOpen = mainNav.classList.toggle('active');
        menuToggle.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        document.body.classList.toggle('menu-open', isOpen);

        const activeLenis = lenis || window.lenis;
        if (activeLenis) {
            if (isOpen) {
                activeLenis.stop();
            } else {
                activeLenis.start();
            }
        }
    });

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');
            closeMenu();

            if (targetId && targetId.startsWith('#') && targetId !== '#') {
                const targetEl = document.querySelector(targetId);
                if (targetEl) {
                    e.preventDefault();

                    const activeLenis = lenis || window.lenis;
                    if (activeLenis) {
                        activeLenis.start();
                        const headerOffset = window.innerWidth <= 1024 ? -70 : 0;
                        activeLenis.scrollTo(targetEl, {
                            offset: headerOffset,
                            duration: 1.2,
                            force: true
                        });
                    } else {
                        targetEl.scrollIntoView({ behavior: 'smooth' });
                    }
                }
            }
        });
    });
}
