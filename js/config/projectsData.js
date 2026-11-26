import cosem01 from '../../images/cosem-01.webp';
import cosem01Sm from '../../images/cosem-01-1440.webp';
import loopup01 from '../../images/loopup-01.webp';
import loopup01Sm from '../../images/loopup-01-1440.webp';
import ajedrezVideo from '../../videos/ajedrez.mp4';
import ajedrezPoster from '../../images/ajedrez-poster.webp';

/**
 * Fuente única de los proyectos: alimenta las tarjetas de la home y la plantilla
 * de case study (/proyectos/<slug>.html). El orden del array es el orden de la home
 * y el de "siguiente proyecto".
 *
 * Una lámina (board) puede ser:
 *   { src, srcSm?, width, height, alt }                  imagen a ancho completo
 *   { video, poster?, width, height, alt }                video en loop a ancho completo
 *   { placeholder: true, width, height, alt, todo }       hueco del tamaño correcto (falta exportar)
 * y opcionalmente `overlays: [{ src, top, left, width, height, radius }]` (en %)
 * para poner videos en loop encima de un mockup de pantalla.
 */

// TODO: exportar las 16 láminas de NOLOGY en alta resolución (WebP, 2880px y 1440px de ancho)
// como images/nology/nology-01.webp … nology-16.webp (+ -1440.webp), y el logo animado (GIF)
// como videos/nology-logo.mp4 (+ .webm). Luego importarlos acá y reemplazar los placeholders.
// Ajustar width/height a las medidas reales de cada lámina.
const nologyBoards = Array.from({ length: 16 }, (_, i) => {
    const n = String(i + 1).padStart(2, '0');
    return {
        placeholder: true,
        width: 2880,
        height: 1800,
        alt: i === 0 ? 'nology — logo animado' : `nology — lámina ${n}`,
        todo: i === 0 ? 'exportar logo animado (videos/nology-logo.mp4)' : `exportar lámina ${n}`,
    };
});

export const projectsData = [
    {
        slug: 'nology',
        title: 'nology',
        tag: 'branding & motion',
        color: '#0066ff', // TODO: ajustar al azul real de la marca NOLOGY si difiere
        accent: '#ff5fa2', // TODO: rosa NOLOGY real (cursor del case study)
        role: 'diseño de logotipo, diseño gráfico, gráficos animados',
        tools: 'adobe illustrator, after effects',
        year: '2026',
        link: 'https://www.behance.net/gallery/258906337/NOLOGY',
        desc: 'nology es una tienda de tecnología que valora lo retro. para su identidad diseñé un logotipo pixelado, como guiño a las primeras pantallas y consolas, y un isotipo protagonizado por un oso polar gamer con gorra, lentes y la lengua afuera. el sistema se completa con una paleta de azul, rosa, negro y blanco, recursos gráficos tomados del propio personaje (la estrella, la gorra y la boca) y aplicaciones en papelería, redes, stickers y el local.',
        cover: null, // TODO: portada de la tarjeta (usar nology-01 o un fotograma del logo animado)
        coverAspect: '16 / 10',
        pixelTitle: true,
        boards: nologyBoards,
        videos: [],
    },
    {
        slug: 'cosem',
        title: 'rediseño cosem online',
        tag: 'ui / ux design',
        color: '#0066ff',
        role: 'ui / ux design',
        tools: null, // TODO: herramientas usadas
        year: null, // TODO: año
        link: 'https://www.behance.net/gallery/240027703/Rediseno-Cosem-Online',
        desc: 'La propuesta consistió en el rediseño de la interfaz de Cosem Online con el objetivo de simplificar la navegación y hacerla más intuitiva.',
        cover: { src: cosem01, srcSm: cosem01Sm, width: 2596, height: 1460 },
        boards: [
            { src: cosem01, srcSm: cosem01Sm, width: 2596, height: 1460, alt: 'Rediseño Cosem Online — portada del proyecto' },
            // TODO: agregar las láminas del proyecto en Behance (images/cosem/cosem-02.webp …)
        ],
        videos: [],
    },
    {
        slug: 'loopup',
        title: 'loopup',
        tag: 'app & moda sustentable',
        color: '#7000ff',
        role: 'ui / ux design · app mobile',
        tools: null, // TODO: herramientas usadas
        year: '2025',
        link: 'https://www.behance.net/gallery/229775105/LoopUp-Mobile-App',
        desc: 'LoopUp es una aplicación de compra y venta de accesorios de segunda mano, pensada para promover una moda sustentable, circular e inclusiva.',
        cover: { src: loopup01, srcSm: loopup01Sm, width: 2594, height: 1458 },
        boards: [
            { src: loopup01, srcSm: loopup01Sm, width: 2594, height: 1458, alt: 'LoopUp — portada del proyecto' },
            // TODO: agregar las láminas del proyecto en Behance (images/loopup/loopup-02.webp …)
            // y, si hay, videos de la app como `overlays` dentro del mockup del teléfono.
        ],
        videos: [],
    },
    {
        slug: 'ajedrez',
        title: 'modelado 3d ajedrez',
        tag: 'cinema 4d & redshift',
        color: '#ffbd2e',
        role: 'modelado 3d e iluminación',
        tools: 'cinema 4d, redshift',
        year: null, // TODO: año
        link: null, // TODO: URL real del proyecto en Behance (antes apuntaba a behance.net a secas)
        desc: 'Proyecto de Modelado 3D e iluminación hiperrealista de piezas de ajedrez realizado en Cinema 4D y renderizado en RedShift.',
        // TODO: imagen real del ajedrez (antes usaba por error la portada de "Diligencias").
        // Mientras tanto la tarjeta usa el video en loop con un fotograma como póster.
        cover: { video: ajedrezVideo, poster: ajedrezPoster, width: 1600, height: 900 },
        boards: [
            { video: ajedrezVideo, poster: ajedrezPoster, width: 1600, height: 900, alt: 'Piezas de ajedrez modeladas en Cinema 4D girando' },
        ],
        videos: [],
    },
    {
        slug: 'audiovisual',
        title: 'audiovisual',
        tag: 'tres piezas en video',
        color: '#0066ff',
        role: 'edición, motion y dirección audiovisual',
        tools: null, // TODO: herramientas usadas
        year: null,
        link: null,
        desc: 'Tres piezas en video realizadas durante la Licenciatura en Diseño Multimedia en Universidad ORT Uruguay.',
        cover: null, // TODO: miniatura para la tarjeta (fotograma de una de las piezas)
        coverAspect: '16 / 9',
        boards: [],
        videos: [],
        pieces: [
            {
                title: 'carpeta anual 2',
                tag: 'audiovisual & multimedia',
                vimeoId: '1178099028',
                desc: 'Recopilación de trabajos y entregas realizadas durante el tercer y cuarto semestre de la Licenciatura en Diseño Multimedia en Universidad ORT Uruguay.',
            },
            {
                title: 'repeat',
                tag: 'branding & motion',
                vimeoId: '1178099739',
                desc: 'Proyecto de identidad visual para estudio de diseño ficticio especializado en música urbana y producción gráfica contemporánea.',
            },
            {
                title: 'daynnite',
                tag: 'mixed media & videoclip',
                vimeoId: '1220455394',
                desc: 'Videoclip mixed media para la materia Gráfica para Cine y TV del 5.º semestre de la Licenciatura en Diseño Multimedia, con la canción "DayNnite" de Kid Cudi.',
            },
        ],
    },
];
