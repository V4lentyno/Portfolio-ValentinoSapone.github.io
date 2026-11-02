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
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId && targetId !== '#') {
                const targetEl = document.querySelector(targetId);
                if (targetEl && lenis) {
                    e.preventDefault();
                    lenis.scrollTo(targetEl, { duration: 1.2 });
                }
            }
        });
    });
}
