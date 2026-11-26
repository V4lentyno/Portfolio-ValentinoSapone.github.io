import { reducedMotion } from '../core/motion.js';

/**
 * Videos en loop (muted, playsinline): se reproducen solo cuando están en viewport.
 * Con prefers-reduced-motion no hay autoplay: se muestran los controles.
 */
export function initLoopVideos(root = document) {
    const videos = root.querySelectorAll('video[data-loop]');
    if (!videos.length) return;

    if (reducedMotion || !('IntersectionObserver' in window)) {
        videos.forEach((v) => {
            if (reducedMotion) v.controls = true;
            else v.play().catch(() => {});
        });
        return;
    }

    const io = new IntersectionObserver((entries) => {
        entries.forEach(({ target, isIntersecting }) => {
            if (isIntersecting) {
                if (target.preload === 'none') target.preload = 'auto';
                target.play().catch(() => {});
            } else {
                target.pause();
            }
        });
    }, { threshold: 0.15 });

    videos.forEach((v) => io.observe(v));
}
