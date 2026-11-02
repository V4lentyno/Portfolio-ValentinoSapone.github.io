/**
 * Smooth entrance animation for discipline cards and tools using GSAP ScrollTrigger.
 */
export function initSkillsGraph() {
    if (typeof gsap === 'undefined') return;

    // Respetar preferencia de reducción de movimiento
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const cards = document.querySelectorAll('.discipline-card');
    if (!cards.length) return;

    gsap.fromTo(cards,
        {
            y: 40,
            opacity: 0
        },
        {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".skills-section",
                start: "top 75%",
            }
        }
    );
}
