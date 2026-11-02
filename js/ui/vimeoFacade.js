/**
 * Vimeo Lazy Facade — carga el iframe solo al hacer click en la fachada.
 * Evita cargar 3 reproductores pesados al abrir la página.
 */
export function initVimeoFacade() {
    const facades = document.querySelectorAll('.video-facade');

    facades.forEach(facade => {
        const activate = () => {
            const vimeoId = facade.dataset.vimeoId;
            if (!vimeoId || facade.classList.contains('active')) return;

            facade.classList.add('active');

            const iframe = document.createElement('iframe');
            iframe.src = `https://player.vimeo.com/video/${vimeoId}?badge=0&autopause=0&autoplay=1&muted=0`;
            iframe.allow = 'autoplay; fullscreen; picture-in-picture';
            iframe.allowFullscreen = true;
            iframe.title = facade.getAttribute('aria-label') || 'Video';
            iframe.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;border:0;';

            const wrapper = document.createElement('div');
            wrapper.className = 'video-iframe-wrapper';
            wrapper.appendChild(iframe);

            facade.replaceWith(wrapper);
        };

        facade.addEventListener('click', activate);
        facade.addEventListener('keydown', e => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                activate();
            }
        });
    });
}

