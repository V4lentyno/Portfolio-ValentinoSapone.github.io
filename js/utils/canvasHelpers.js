/**
 * Utility functions for 2D HTML Canvas rendering operations.
 */

/**
 * Wraps and renders multi-line text cleanly on a 2D canvas context.
 * @param {CanvasRenderingContext2D} ctx 
 * @param {string} text 
 * @param {number} x 
 * @param {number} y 
 * @param {number} maxWidth 
 * @param {number} lineHeight 
 */
export function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
    if (!text) return;
    const words = text.split(' ');
    let line = '';
    let currY = y;

    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + ' ';
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, currY);
            line = words[n] + ' ';
            currY += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, currY);
}
