/**
 * Preloader — muestra una pantalla de carga mientras el DOM inicializa.
 * Se oculta automáticamente al dispararse el evento 'load' de la ventana.
 */
export function initPreloader() {
    const preloader = document.getElementById('preloader');
    const fill = document.getElementById('preloader-fill');
    if (!preloader) return;

    // Animar la barra de progreso
    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 15;
        if (progress > 90) progress = 90;
        if (fill) fill.style.width = progress + '%';
    }, 120);

    const hide = () => {
        clearInterval(interval);
        if (fill) fill.style.width = '100%';

        setTimeout(() => {
            preloader.style.opacity = '0';
            preloader.style.transition = 'opacity 0.6s ease';
            setTimeout(() => {
                preloader.style.display = 'none';
                preloader.setAttribute('aria-hidden', 'true');
            }, 600);
        }, 300);
    };

    if (document.readyState === 'complete') {
        hide();
    } else {
        window.addEventListener('load', hide, { once: true });
        // Fallback: ocultar a los 4s si algo tarda demasiado
        setTimeout(hide, 4000);
    }
}

