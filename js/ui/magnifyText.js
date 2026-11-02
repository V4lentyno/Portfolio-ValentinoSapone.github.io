import { lenis } from './smoothScroll.js';

/**
 * Interactive text magnification (lupa effect) on cursor proximity.
 */
export function initMagnifyText() {
    const magnifyText = document.querySelector('.magnify-text');
    if (!magnifyText) return;

    const textStr = magnifyText.textContent;
    magnifyText.textContent = '';

    [...textStr].forEach(char => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        magnifyText.appendChild(span);
    });

    const charSpans = Array.from(magnifyText.querySelectorAll('span'));
    let charPositions = [];

    function updateCharPositions() {
        charPositions = charSpans.map(sp => {
            const r = sp.getBoundingClientRect();
            return {
                sp,
                cX: r.left + r.width / 2,
                cY: r.top + r.height / 2
            };
        });
    }

    updateCharPositions();
    window.addEventListener('resize', updateCharPositions);
    
    if (lenis) {
        lenis.on('scroll', updateCharPositions);
    } else if (window.lenis) {
        window.lenis.on('scroll', updateCharPositions);
    }

    let mX = -1000, mY = -1000;
    let magnifyTicking = false;

    window.addEventListener('mousemove', (e) => {
        mX = e.clientX;
        mY = e.clientY;

        if (!magnifyTicking) {
            requestAnimationFrame(() => {
                charPositions.forEach(({ sp, cX, cY }) => {
                    const d = Math.hypot(mX - cX, mY - cY);
                    const maxD = 180;

                    if (d < maxD) {
                        const ratio = (maxD - d) / maxD;
                        const s = 1 + Math.pow(ratio, 2) * 3.5;
                        const ty = -Math.pow(ratio, 2) * 25;
                        sp.style.transform = `scale(${s}) translateY(${ty}px)`;
                        sp.style.color = "var(--accent)";
                        sp.style.textShadow = `0 0 ${20 * ratio}px var(--accent)`;
                    } else {
                        sp.style.transform = `scale(1) translateY(0px)`;
                        sp.style.color = "";
                        sp.style.textShadow = "";
                    }
                });
                magnifyTicking = false;
            });
            magnifyTicking = true;
        }
    });
}
