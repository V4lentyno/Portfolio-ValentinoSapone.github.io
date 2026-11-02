import { coversData } from '../config/coversData.js';
import { lenis } from './smoothScroll.js';

/**
 * Manages full-screen Lightbox modal overlay for inspecting album artwork.
 */
export function initLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');

    let currentImageIndex = 0;
    const coverSources = coversData.map(c => c.image);

    function updateLightboxImage() {
        if (lightboxImg && coverSources[currentImageIndex]) {
            lightboxImg.src = coverSources[currentImageIndex];
        }
    }

    function openLightbox(index) {
        currentImageIndex = index;
        updateLightboxImage();
        if (lightbox) lightbox.classList.add('active');
        if (lenis) lenis.stop();
        else if (window.lenis) window.lenis.stop();
    }

    function closeLightbox() {
        if (lightbox) lightbox.classList.remove('active');
        if (lenis) lenis.start();
        else if (window.lenis) window.lenis.start();
    }

    window.triggerLightboxAtIndex = openLightbox;

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

    if (lightbox) {
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentImageIndex = (currentImageIndex > 0) ? currentImageIndex - 1 : coverSources.length - 1;
            updateLightboxImage();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            currentImageIndex = (currentImageIndex < coverSources.length - 1) ? currentImageIndex + 1 : 0;
            updateLightboxImage();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (!lightbox || !lightbox.classList.contains('active')) return;

        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowRight') {
            currentImageIndex = (currentImageIndex < coverSources.length - 1) ? currentImageIndex + 1 : 0;
            updateLightboxImage();
        } else if (e.key === 'ArrowLeft') {
            currentImageIndex = (currentImageIndex > 0) ? currentImageIndex - 1 : coverSources.length - 1;
            updateLightboxImage();
        }
    });
}
