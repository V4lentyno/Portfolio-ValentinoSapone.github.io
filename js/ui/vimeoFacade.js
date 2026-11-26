/**
 * Vimeo Lazy Facade — carga el iframe solo al hacer click en la fachada.
 * Evita cargar tres reproductores pesados al abrir la página.
 */
export function initVimeoFacade(root = document) {
    root.querySelectorAll('.video-facade').forEach((facade) => {
        const activate = () => {
            const vimeoId = facade.dataset.vimeoId;
            if (!vimeoId || facade.classList.contains('is-active')) return;
            facade.classList.add('is-active');

            const iframe = document.createElement('iframe');
            iframe.src = `https://player.vimeo.com/video/${vimeoId}?badge=0&autopause=0&autoplay=1&dnt=1`;
            iframe.allow = 'autoplay; fullscreen; picture-in-picture';
            iframe.allowFullscreen = true;
            iframe.title = facade.dataset.title || 'Video';

            const wrapper = document.createElement('div');
            wrapper.className = 'video-frame';
            wrapper.appendChild(iframe);
            facade.replaceWith(wrapper);
        };

        facade.addEventListener('click', activate);
        facade.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                activate();
            }
        });
    });
}
