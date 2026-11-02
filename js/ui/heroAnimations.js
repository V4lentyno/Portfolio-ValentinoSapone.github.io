/**
 * Initial entrance animations for Hero section and Header using GSAP.
 */
export function initHeroAnimations() {
    if (typeof gsap === 'undefined') return;

    const tl = gsap.timeline();

    tl.fromTo(".hero-title",
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 0.2 }
    )
    .fromTo(".hero-desc",
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" },
        "-=0.6"
    )
    .fromTo(".cta-button",
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: "power3.out" },
        "-=0.4"
    )
    .fromTo(".image-placeholder",
        { scale: 0.9, opacity: 0, filter: "blur(10px)" },
        { scale: 1, opacity: 1, filter: "blur(0px)", duration: 1.2, ease: "power3.out" },
        "-=1"
    );

    // Header Fade In
    gsap.fromTo("header",
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
    );

    // Footer Parallax Animation
    if (typeof ScrollTrigger !== 'undefined') {
        gsap.fromTo(".footer-content",
            { y: 50, opacity: 0 },
            {
                y: 0, opacity: 1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: "footer",
                    start: "top 80%",
                    end: "top 20%",
                    scrub: 1
                }
            }
        );
    }
}
