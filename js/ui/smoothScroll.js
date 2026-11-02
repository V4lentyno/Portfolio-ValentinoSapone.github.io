/**
 * Global Lenis instance for smooth scrolling integrated with GSAP Ticker.
 */
export let lenis = null;

export function initSmoothScroll() {
    if (typeof Lenis === 'undefined') return;

    lenis = new Lenis({
        autoRaf: false,
        smoothWheel: true,
        lerp: 0.08,
    });

    window.lenis = lenis;

    if (typeof ScrollTrigger !== 'undefined') {
        lenis.on('scroll', ScrollTrigger.update);
    }

    if (typeof gsap !== 'undefined') {
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000);
        });
        gsap.ticker.lagSmoothing(0);
    }

    window.addEventListener('load', () => {
        if (typeof ScrollTrigger !== 'undefined') {
            ScrollTrigger.refresh();
        }
    });

    // Smooth scroll to anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        // Enlaces del menú hamburguesa son gestionados por initMobileMenu()
        if (anchor.closest('#main-nav')) return;

        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId && targetId !== '#') {
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
