/**
 * Custom cursor — reemplaza el cursor nativo en desktop con un dot animado.
 * Cambia de estado sobre proyectos 3D (muestra "DRAG") y links (muestra "VER").
 * Se desactiva automáticamente en dispositivos táctiles.
 */
export function initCustomCursor() {
    // No inicializar en dispositivos touch
    if (window.matchMedia('(hover: none) and (pointer: coarse)').matches) return;

    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.innerHTML = '<span class="cursor-label"></span>';
    document.body.appendChild(cursor);

    const label = cursor.querySelector('.cursor-label');

    let mouseX = -100, mouseY = -100;
    let curX = -100, curY = -100;

    document.addEventListener('mousemove', e => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth follow
    const tick = () => {
        curX += (mouseX - curX) * 0.18;
        curY += (mouseY - curY) * 0.18;
        cursor.style.transform = `translate(${curX}px, ${curY}px)`;
        requestAnimationFrame(tick);
    };
    tick();

    // Estado: canvas 3D → DRAG
    const canvases = document.querySelectorAll('.canvas-3d-fullscreen, .canvas-covers-3d');
    canvases.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('cursor--drag');
            label.textContent = 'DRAG';
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor--drag');
            label.textContent = '';
        });
    });

    // Estado: links / botones → VER
    document.querySelectorAll('a, button, .audiovisual-card, .video-facade').forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (!cursor.classList.contains('cursor--drag')) {
                cursor.classList.add('cursor--hover');
            }
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('cursor--hover');
        });
    });

    // Ocultar cuando el mouse sale de la ventana
    document.addEventListener('mouseleave', () => cursor.classList.add('cursor--hidden'));
    document.addEventListener('mouseenter', () => cursor.classList.remove('cursor--hidden'));
}

