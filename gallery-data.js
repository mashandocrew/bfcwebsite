/**
 * BFC_GALLERY — Datos de la Galería Bonati Fight Club
 *
 * Para agregar una foto nueva:
 * 1. Subir el archivo JPG/WEBP a la carpeta /gallery/ en el repositorio GitHub
 * 2. Agregar un nuevo objeto al array siguiendo la estructura:
 *
 *   {
 *     src: "gallery/nombre-del-archivo.jpg",
 *     alt: "Descripción de la foto",
 *     caption: "Breve descripción en español para el lightbox.",
 *     year: "2024"     // año opcional, se muestra en el overlay
 *   }
 *
 * Las fotos reales van en la carpeta /gallery/ del repositorio.
 */

const BFC_GALLERY = [
  { src: "https://picsum.photos/seed/bfc1/800/600",  alt: "Entrenamiento K1",            caption: "Sesión intensa de K1 en los comienzos del club.",                  year: "2019" },
  { src: "https://picsum.photos/seed/bfc2/400/500",  alt: "Clase de Muay Thai",          caption: "Entrenamiento de Muay Thai con el equipo fundador.",                year: "2020" },
  { src: "https://picsum.photos/seed/bfc3/600/400",  alt: "Competencia regional",        caption: "Participación del equipo en una competencia regional de artes marciales.", year: "2021" },
  { src: "https://picsum.photos/seed/bfc4/400/600",  alt: "Tonga Silva en combate",      caption: "Tonga Silva demostrando su técnica en un combate oficial.",         year: "2021" },
  { src: "https://picsum.photos/seed/bfc5/900/500",  alt: "El equipo BFC",               caption: "Foto grupal del equipo Bonati Fight Club en pleno.",                year: "2022" },
  { src: "https://picsum.photos/seed/bfc6/400/400",  alt: "Sparring",                    caption: "Ronda de sparring controlado para pulir la técnica.",               year: "2022" },
  { src: "https://picsum.photos/seed/bfc7/600/450",  alt: "Cinturón sudamericano",       caption: "El club conquista el cinturón sudamericano por primera vez.",       year: "2023" },
  { src: "https://picsum.photos/seed/bfc8/400/550",  alt: "Walter Bonati coaching",      caption: "Walter Bonati guiando a sus peleadores durante el entrenamiento.",  year: "2023" },
  { src: "https://picsum.photos/seed/bfc9/800/500",  alt: "Campeonato FFG 2024",         caption: "Histórica actuación del equipo en el Campeonato FFG 2024.",         year: "2024" },
  { src: "https://picsum.photos/seed/bfc10/500/400", alt: "MMA Tapa Team",               caption: "El Tapa Team en acción durante una velada de MMA.",                 year: "2024" },
  { src: "https://picsum.photos/seed/bfc11/400/600", alt: "Wrestling Tapa Team",         caption: "Entrenamiento de wrestling del Tapa Team rumbo a la competencia.",  year: "2024" },
  { src: "https://picsum.photos/seed/bfc12/700/450", alt: "BFC — Donde nacen campeones", caption: "El espíritu del club: forjar campeones dentro y fuera del ring.",   year: "2025" }
];
