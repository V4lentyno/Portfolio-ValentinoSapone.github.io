/**
 * Interactive ambient background gradient reacting to cursor position.
 */
export function initBackgroundEffect() {
    const gradientBg = document.querySelector('.gradient-bg');
    if (!gradientBg) return;

    let mouseX = 50, mouseY = 50;
    let ticking = false;

    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth) * 100;
        mouseY = (e.clientY / window.innerHeight) * 100;

        if (!ticking) {
            requestAnimationFrame(() => {
                gradientBg.style.setProperty('--mouse-x', `${mouseX}%`);
                gradientBg.style.setProperty('--mouse-y', `${mouseY}%`);
                ticking = false;
            });
            ticking = true;
        }
    });
}
