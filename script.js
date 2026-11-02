/**
 * Portfolio Valentino Sapone - Main Application Entry Point
 * Clean Code Architecture with Modular ES6 Components
 */

import { initSmoothScroll } from './js/ui/smoothScroll.js';
import { initHeroAnimations } from './js/ui/heroAnimations.js';
import { initProjects3DShowcase } from './js/3d/projectsShowcase.js';
import { initCovers3DShowcase } from './js/3d/coversShowcase.js';
import { initSkillsGraph } from './js/ui/skillsGraph.js';
import { initMagnifyText } from './js/ui/magnifyText.js';
import { initLightbox } from './js/ui/lightbox.js';
import { initMobileMenu } from './js/ui/mobileMenu.js';
import { initBackgroundEffect } from './js/ui/backgroundEffect.js';

document.addEventListener("DOMContentLoaded", () => {
    // 1. Core UX & Scroll Framework
    initSmoothScroll();
    initBackgroundEffect();
    initMobileMenu();

    // 2. 3D WebGL Canvas Engines
    initProjects3DShowcase();
    initCovers3DShowcase();

    // 3. UI Animations & Micro-Interactions
    initHeroAnimations();
    initSkillsGraph();
    initMagnifyText();
    initLightbox();
});
