import loopup01 from '../../images/loopup-01.webp';
import loopup01Sm from '../../images/loopup-01-1440.webp';
import ajedrezVideo from '../../videos/ajedrez.mp4';
import ajedrezPoster from '../../images/ajedrez-poster.webp';
import nologyLogo from '../../videos/nology-logo.mp4';

/**
 * Fuente única de los proyectos: alimenta las tarjetas de la home y la plantilla
 * de case study (/proyectos/<slug>.html). El orden del array es el orden de la home
 * y el de "siguiente proyecto".
 *
 * Una lámina (board) puede ser:
 *   { src, srcSm?, smWidth?, width, height, alt }        imagen a ancho completo (srcSm mide smWidth, 1440 por defecto)
 *   { video, poster?, width, height, alt }                video en loop a ancho completo
 *   { placeholder: true, width, height, alt, todo }       hueco del tamaño correcto (falta exportar)
 * y opcionalmente `overlays: [{ src, top, left, width, height, radius }]` (en %)
 * para poner videos en loop encima de un mockup de pantalla.
 */

// NOLOGY: láminas exportadas a 2800px (+ versión 1440px) y logo animado en loop.
const nologyImages = import.meta.glob('../../images/nology/nology-*.webp', { eager: true, import: 'default' });
const nologyImg = (n, sm = false) => nologyImages[`../../images/nology/nology-${n}${sm ? '-1440' : ''}.webp`];
const nologyBoardList = [
    ['02', 1800, 'nology — introducción a la marca'],
    ['03', 2000, 'nology — logotipo'],
    ['04', 1600, 'nology — isotipo del oso polar gamer y logotipo de letras píxel'],
    ['05', 2300, 'nology — construcción del logotipo sobre grilla de píxel'],
    ['06', 2840, 'nology — versiones del logo'],
    ['07', 3520, 'nology — versiones cromáticas'],
    ['08', 2200, 'nology — paleta: azul glaciar, rosa estrella, negro píxel y blanco polar'],
    ['09', 2000, 'nology — tipografía'],
    ['10', 2120, 'nology — recursos gráficos: estrella, gorra y boca'],
    ['11', 1800, 'nology — patrón'],
    ['12', 1640, 'nology — usos incorrectos del logo'],
    ['13', 1576, 'nology — aplicación en la fachada del local'],
    ['14', 2100, 'nology — papelería'],
    ['15', 2160, 'nology — aplicaciones digitales y redes'],
    ['16', 2360, 'nology — stickers'],
    ['17', 1800, 'nology — cierre'],
];
// COSEM: láminas a 1920px (+ 1080px para pantallas chicas).
const cosemImages = import.meta.glob('../../images/cosem/cosem-*.webp', { eager: true, import: 'default' });
const cosemImg = (n, sm = false) => cosemImages[`../../images/cosem/cosem-${n}${sm ? '-1080' : ''}.webp`];
const cosemBoards = [
    ['01', 1080, 'Rediseño Cosem Online — portada'],
    ['02', 1080, 'Cosem Online — qué es la aplicación'],
    ['03', 1080, 'Cosem Online — problema inicial y contexto'],
    ['04', 1080, 'Cosem Online — investigación UX: user persona, user journey map y benchmarking'],
    ['05', 2948, 'Cosem Online — user personas'],
    ['06', 1080, 'Cosem Online — user journey map'],
    ['07', 2096, 'Cosem Online — benchmarking de apps de salud'],
    ['08', 1080, 'Cosem Online — resultados de la encuesta'],
    ['09', 1080, 'Cosem Online — entrevista'],
    ['10', 2191, 'Cosem Online — solución propuesta: home original y home rediseñada'],
    ['11', 1080, 'Cosem Online — resultados de las pruebas de usuario'],
    ['12', 4265, 'Cosem Online — design system: tipografías, colores, botones, campos e íconos'],
    ['13', 2235, 'Cosem Online — wireframes low-fi'],
    ['14', 2417, 'Cosem Online — pantallas high-fi en modo claro'],
    ['15', 2208, 'Cosem Online — pantallas high-fi en modo oscuro'],
].map(([n, height, alt]) => ({ src: cosemImg(n), srcSm: cosemImg(n, true), smWidth: 1080, width: 1920, height, alt }));

const nologyBoards = [
    { video: nologyLogo, poster: nologyImg('01-poster'), width: 1280, height: 720, alt: 'nology — logo animado en loop' },
    ...nologyBoardList.map(([n, height, alt]) => ({
        src: nologyImg(n),
        srcSm: nologyImg(n, true),
        width: 2800,
        height,
        alt,
    })),
];

export const projectsData = [
    {
        slug: 'nology',
        title: 'nology',
        tag: 'branding & motion',
        color: '#0097ec', // azul glaciar
        accent: '#fca7ff', // rosa estrella (cursor del case study)
        role: 'diseño de logotipo, diseño gráfico, gráficos animados',
        tools: 'adobe illustrator, after effects',
        year: '2026',
        link: 'https://www.behance.net/gallery/258906337/NOLOGY',
        desc: 'nology es una tienda de tecnología que valora lo retro. para su identidad diseñé un logotipo pixelado, como guiño a las primeras pantallas y consolas, y un isotipo protagonizado por un oso polar gamer con gorra, lentes y la lengua afuera. el sistema se completa con una paleta de azul, rosa, negro y blanco, recursos gráficos tomados del propio personaje (la estrella, la gorra y la boca) y aplicaciones en papelería, redes, stickers y el local.',
        cover: { video: nologyLogo, poster: nologyImg('01-poster'), width: 1280, height: 720 },
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
        cover: { src: cosemImg('01'), srcSm: cosemImg('01', true), smWidth: 1080, width: 1920, height: 1080 },
        boards: cosemBoards,
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
