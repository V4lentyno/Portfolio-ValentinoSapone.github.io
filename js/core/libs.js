/**
 * Librerías de movimiento empaquetadas por Vite (antes se cargaban desde CDN).
 */
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger, Lenis };
