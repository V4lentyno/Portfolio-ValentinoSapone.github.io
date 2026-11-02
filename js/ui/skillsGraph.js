/**
 * Skill bars percentage grow and icon reveal animations triggered by GSAP ScrollTrigger.
 */
export function initSkillsGraph() {
    if (typeof gsap === 'undefined') return;

    const skillBars = document.querySelectorAll('.skill-bar');

    skillBars.forEach((bar, index) => {
        const heightVal = bar.getAttribute('data-height');
        const parentContainer = bar.closest('.skill-bar-container');
        const iconPlace = parentContainer ? parentContainer.querySelector('.skill-icon-placeholder') : null;
        const skillName = parentContainer ? parentContainer.querySelector('.skill-name') : null;

        if (iconPlace && skillName) {
            gsap.set([iconPlace, skillName], { opacity: 0, y: 20 });
        }

        gsap.to(bar, {
            scrollTrigger: {
                trigger: ".skills-section",
                start: "top 75%",
            },
            height: heightVal,
            duration: 1.5,
            ease: "power3.out",
            delay: index * 0.1
        });

        if (iconPlace && skillName) {
            gsap.to([iconPlace, skillName], {
                scrollTrigger: {
                    trigger: ".skills-section",
                    start: "top 75%",
                },
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "back.out(1.7)",
                delay: index * 0.1 + 0.3
            });
        }
    });
}
