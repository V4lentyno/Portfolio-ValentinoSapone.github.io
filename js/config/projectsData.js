import proj01Img from '../../images/proyecto01.png';
import proj02Img from '../../images/proyecto02.png';
import ajedrezImg from '../../images/portadadiligencias.png';
import ajedrezVid from '../../videos/ajedrezgif.mp4';

/**
 * Configuration and data for featured 3D interactive projects showcase.
 */
export const projectsData = [
    {
        id: "01",
        title: "Rediseño Cosem Online",
        tag: "UI / UX DESIGN",
        desc: "La propuesta consistió en el rediseño de la interfaz de Cosem Online con el objetivo de simplificar la navegación y hacerla más intuitiva.",
        image: proj01Img,
        link: "https://www.behance.net/gallery/240027703/Rediseno-Cosem-Online",
        color: "#0066ff"
    },
    {
        id: "02",
        title: "LoopUp",
        tag: "APP & MODA SUSTENTABLE",
        desc: "LoopUp es una aplicación de compra y venta de accesorios de segunda mano, pensada para promover una moda sustentable, circular e inclusiva.",
        image: proj02Img,
        link: "https://www.behance.net/gallery/229775105/LoopUp-Mobile-App",
        color: "#7000ff"
    },
    {
        id: "03",
        title: "Modelado 3D Ajedrez",
        tag: "CINEMA 4D & REDSHIFT",
        desc: "Proyecto de Modelado 3D e iluminación hiperrealista de piezas de ajedrez realizado en Cinema 4D y renderizado en RedShift.",
        image: ajedrezImg,
        video: ajedrezVid,
        link: "https://www.behance.net/",
        color: "#ffbd2e"
    }
];

