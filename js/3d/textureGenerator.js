import * as THREE from 'three';
import { projectsData } from '../config/projectsData.js';
import { wrapText } from '../utils/canvasHelpers.js';

/**
 * Creates a dynamic 2D canvas texture simulating a high-resolution OS UI screen for the 3D laptop monitor.
 * @param {number} projectIndex 
 * @param {Array<HTMLImageElement|HTMLVideoElement>} preloadedMedia 
 * @returns {{ texture: THREE.CanvasTexture, canvas: HTMLCanvasElement }}
 */
export function createVirtualOSScreenTexture(projectIndex, preloadedMedia = []) {
    const project = projectsData[projectIndex];
    const canvas = document.createElement('canvas');
    canvas.width = 1400;
    canvas.height = 875;
    const ctx = canvas.getContext('2d');

    // Deep Dark Base Background
    ctx.fillStyle = '#060810';
    ctx.fillRect(0, 0, 1400, 875);

    // 1. FULLSCREEN PROJECT MEDIA DISPLAY
    const media = preloadedMedia[projectIndex];
    if (media) {
        let mediaW = 0, mediaH = 0;
        if (media instanceof HTMLVideoElement) {
            mediaW = media.videoWidth || 1280;
            mediaH = media.videoHeight || 720;
        } else if (media instanceof HTMLImageElement) {
            mediaW = media.naturalWidth || media.width;
            mediaH = media.naturalHeight || media.height;
        }

        if (mediaW && mediaH) {
            const containerW = 1400;
            const containerH = 875;
            const containerAspect = containerW / containerH;
            const mediaAspect = mediaW / mediaH;

            let drawW, drawH, drawX, drawY;

            if (mediaAspect > containerAspect) {
                drawW = containerW;
                drawH = containerW / mediaAspect;
                drawX = 0;
                drawY = (containerH - drawH) / 2;
            } else {
                drawH = containerH;
                drawW = containerH * mediaAspect;
                drawX = (containerW - drawW) / 2;
                drawY = 0;
            }

            try {
                ctx.drawImage(media, drawX, drawY, drawW, drawH);
            } catch (e) {
                // Ignore rendering errors on unready media frames
            }
        }
    }

    // 2. SUBTLE TOP HEADER (BRAND + COUNTER)
    const topGrad = ctx.createLinearGradient(0, 0, 0, 100);
    topGrad.addColorStop(0, 'rgba(6, 8, 16, 0.85)');
    topGrad.addColorStop(1, 'rgba(6, 8, 16, 0)');
    ctx.fillStyle = topGrad;
    ctx.fillRect(0, 0, 1400, 100);

    ctx.fillStyle = '#ffffff';
    ctx.font = '600 16px Outfit, sans-serif';
    ctx.fillText('VALENTINO SAPONE', 60, 45);

    ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
    ctx.font = '500 14px Outfit, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(`PROYECTO ${project.id} / 03`, 1340, 45);
    ctx.textAlign = 'left';

    // 3. CLEAN MINIMALIST BOTTOM DESCRIPTION OVERLAY
    const bottomGrad = ctx.createLinearGradient(0, 600, 0, 875);
    bottomGrad.addColorStop(0, 'rgba(6, 8, 16, 0)');
    bottomGrad.addColorStop(0.4, 'rgba(6, 8, 16, 0.75)');
    bottomGrad.addColorStop(1, 'rgba(6, 8, 16, 0.96)');
    ctx.fillStyle = bottomGrad;
    ctx.fillRect(0, 600, 1400, 275);

    // Tag
    ctx.fillStyle = project.color;
    ctx.font = 'bold 14px Outfit, sans-serif';
    ctx.fillText(project.tag, 60, 715);

    // Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Outfit, sans-serif';
    ctx.fillText(project.title, 60, 760);

    // Description
    ctx.fillStyle = '#c0c5d5';
    ctx.font = '400 18px Outfit, sans-serif';
    wrapText(ctx, project.desc, 60, 800, 1280, 28);

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;
    return { texture, canvas };
}
