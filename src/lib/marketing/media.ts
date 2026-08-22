/**
 * Landing-page photography — one source of truth.
 *
 * Three origins, and the difference between them is load-bearing:
 *
 *  • `/media/*.jpg` — OUR OWN photographs of Huesca, Aínsa, Barbastro and
 *    Zaragoza. These carry the "this is a real place" weight and must always
 *    be preferred for anything that claims to show *our* cities. Never
 *    substitute one of these with a generated image: the whole argument of
 *    the page is that the place is real.
 *  • Unsplash — real photographs we don't own yet. Served under the Unsplash
 *    License: free for commercial use, no permission needed, attribution
 *    appreciated but not required.
 *  • `/media/generated/*.jpg` — SYNTHETIC. Generated to give the mosaic a
 *    single art direction, replacing stock that was pulling in eight
 *    unrelated looks. These stand in for generic city life — a club, a
 *    rehearsal room, a workshop — and are NEVER captioned or positioned as a
 *    specific Huesca place or person. The footer credit line names them; if
 *    you add to this group, that line has to stay true.
 *
 * Every entry is swappable: drop a file in `/public/media` and change `src`.
 * Nothing else in the codebase needs to know where a picture came from.
 */

export type Photo = {
  /** Absolute Unsplash URL, or a path under /public. */
  src: string;
  /** Always written for a screen reader, never a keyword dump. */
  alt: string;
  /**
   * Focal point, as a CSS object-position. Set this whenever the subject
   * isn't dead centre — most of these crop hard into tall cards.
   */
  focus?: string;
};

const U = "https://images.unsplash.com/photo-";

/**
 * next/image loader that hands resizing to Unsplash's own CDN (imgix) instead
 * of proxying every request through /_next/image. Keeps srcset/lazy-loading
 * from next/image, costs us no image-optimisation budget, and Unsplash serves
 * modern formats already.
 *
 * Must be used from a Client Component — Next can only serialise a `loader`
 * function across the boundary that way.
 */
export function unsplashLoader({
  src,
  width,
  quality,
}: {
  src: string;
  width: number;
  quality?: number;
}) {
  if (!src.startsWith("https://images.unsplash.com")) return src;
  const url = new URL(src);
  url.searchParams.set("w", String(width));
  url.searchParams.set("q", String(quality ?? 72));
  url.searchParams.set("auto", "format");
  url.searchParams.set("fit", "crop");
  return url.toString();
}

/** True for anything the loader above can actually resize. */
export const isUnsplash = (src: string) =>
  src.startsWith("https://images.unsplash.com");

/* ── Our cities ──────────────────────────────────────────────────────
   Real photographs. The old-stone, small-city-centre character that the
   whole product is about.                                            */

export const OUR_CITIES = {
  sanLorenzo: {
    src: "/media/plaza-mercado-san-lorenzo.jpg",
    alt: "La plaza del Mercado de Huesca llena de gente durante las fiestas de San Lorenzo",
  },
  catedralHuesca: {
    src: "/media/plaza-catedral-huesca.jpg",
    alt: "La plaza de la Catedral de Huesca al atardecer",
  },
  lopezAllue: {
    src: "/media/plaza-lopez-allue.jpg",
    alt: "La plaza López Allué de Huesca con sus soportales",
  },
  ainsa: {
    src: "/media/ainsa-plaza-mayor.jpg",
    alt: "La plaza mayor medieval de Aínsa bajo los soportales de piedra",
  },
  barbastro: {
    src: "/media/mercadillo-barbastro.jpg",
    alt: "Puestos del mercadillo semanal de Barbastro",
  },
  claustro: {
    src: "/media/claustro-san-pedro-viejo.jpg",
    alt: "El claustro románico de San Pedro el Viejo en Huesca",
  },
  mercadoZaragoza: {
    src: "/media/mercado-central-zaragoza.jpg",
    alt: "El interior del Mercado Central de Zaragoza",
  },
  fuegos: {
    src: "/media/catedral-fuegos-san-lorenzo.jpg",
    alt: "Fuegos artificiales sobre la catedral de Huesca en San Lorenzo",
  },
} as const satisfies Record<string, Photo>;

/* ── Generated ───────────────────────────────────────────────────────
   SYNTHETIC IMAGES. See the header. One art direction across the whole
   set — documentary framing, 35mm grain, muted earth palette, unposed —
   which is the thing eight unrelated stock photos could not give the
   mosaic. Deliberately generic: a club, a rehearsal room, a workshop,
   a street. None of them claims to be a named place.                  */

export const MADE = {
  athletics: {
    src: "/media/generated/club-atletismo.jpg",
    alt: "Dos corredores entrenando al atardecer en la pista de atletismo de un pueblo",
  },
  guitar: {
    src: "/media/generated/ensayo-guitarra.jpg",
    alt: "Dos músicos ensayando con guitarras acústicas en una sala",
  },
  theatre: {
    src: "/media/generated/teatro-municipal.jpg",
    alt: "Las butacas vacías de un pequeño teatro municipal antes de un ensayo",
  },
  workshop: {
    src: "/media/generated/taller-bicicletas.jpg",
    alt: "Las manos de un mecánico centrando la rueda de una bicicleta en su taller",
  },
  neighbours: {
    src: "/media/generated/vecinos-calle.jpg",
    alt: "Cuatro vecinos charlando en una calle estrecha de piedra al atardecer",
  },
  trail: {
    src: "/media/generated/sendero-monte.jpg",
    alt: "Un sendero entre pinos en el monte, con el pueblo y la niebla al fondo",
  },
} as const satisfies Record<string, Photo>;

/* ── City life ───────────────────────────────────────────────────────
   The clubs, stages, counters and workbenches that a city is actually
   made of. Grouped by the module of the app each one belongs to.     */

export const LIFE = {
  /* Negocios locales */
  shopkeeper: {
    src: `${U}1556742049-0cfed4f6a45d?ixlib=rb-4.0.3`,
    alt: "Un comerciante atiende a una clienta en el mostrador de su tienda",
    focus: "50% 45%",
  },
  boutique: {
    src: `${U}1441986300917-64674bd600d8?ixlib=rb-4.0.3`,
    alt: "Interior de una tienda de ropa local con estantes de madera",
  },
  cafe: {
    src: `${U}1554118811-1e0d58224f24?ixlib=rb-4.0.3`,
    alt: "Una cafetería de barrio con plantas y mesas de madera",
  },
  market: {
    src: `${U}1488459716781-31db52582fe9?ixlib=rb-4.0.3`,
    alt: "Puesto de frutas y verduras de temporada en un mercado",
  },

  /* Clubes y deporte */
  athletics: {
    src: `${U}1461896836934-ffe607ba8211?ixlib=rb-4.0.3`,
    alt: "Una atleta en los tacos de salida de una pista de atletismo",
    focus: "50% 55%",
  },
  football: {
    src: `${U}1574629810360-7efbbe195018?ixlib=rb-4.0.3`,
    alt: "Un balón de fútbol sobre el césped junto a las botas de un jugador",
  },
  team: {
    src: `${U}1547347298-4074fc3086f0?ixlib=rb-4.0.3`,
    alt: "Un equipo de voleibol celebrando un punto",
    focus: "50% 35%",
  },
  strength: {
    src: `${U}1541534741688-6078c6bfb5c5?ixlib=rb-4.0.3`,
    alt: "Una deportista levantando una barra en un gimnasio",
    focus: "50% 40%",
  },
  cycling: {
    src: `${U}1517649763962-0c623066013b?ixlib=rb-4.0.3`,
    alt: "Un pelotón de ciclistas en plena carrera",
  },
  basketball: {
    src: `${U}1546519638-68e109498ffc?ixlib=rb-4.0.3`,
    alt: "Un balón entrando en la canasta durante un partido",
  },

  /* Cultura */
  guitar: {
    src: `${U}1510915361894-db8b60106cb1?ixlib=rb-4.0.3`,
    alt: "Las manos de un guitarrista sobre el mástil de una guitarra acústica",
    focus: "55% 50%",
  },
  theatre: {
    src: `${U}1507924538820-ede94a04019d?ixlib=rb-4.0.3`,
    alt: "El patio de butacas vacío de un teatro clásico",
  },
  stage: {
    src: `${U}1503095396549-807759245b35?ixlib=rb-4.0.3`,
    alt: "Siluetas de actores sobre el escenario ante un telón rojo",
  },
  concert: {
    src: `${U}1516450360452-9312f5e86fc7?ixlib=rb-4.0.3`,
    alt: "El público de un concierto con las manos en alto entre luces de colores",
  },
  festival: {
    src: `${U}1533174072545-7a4b6ad7a6c3?ixlib=rb-4.0.3`,
    alt: "Confeti cayendo sobre el público de un festival de música",
  },

  /* Empleo */
  workshop: {
    src: `${U}1581092160562-40aa08e78837?ixlib=rb-4.0.3`,
    alt: "Un taller con planos, herramientas y un prototipo sobre la mesa",
    focus: "50% 45%",
  },
  coworking: {
    src: `${U}1504384308090-c894fdcc538d?ixlib=rb-4.0.3`,
    alt: "Un espacio de coworking lleno de gente trabajando",
  },
  technician: {
    src: `${U}1558618666-fcd25c85cd64?ixlib=rb-4.0.3`,
    alt: "Un técnico trabajando con herramientas de precisión",
  },

  /* Comunidad */
  friends: {
    src: `${U}1590650046871-92c887180603?ixlib=rb-4.0.3`,
    alt: "Un grupo de amigas charlando alrededor de una mesa de café",
    focus: "50% 40%",
  },
  toast: {
    src: `${U}1519671482749-fd09be7ccebf?ixlib=rb-4.0.3`,
    alt: "Un brindis entre amigos alrededor de una mesa",
  },
  meetup: {
    src: `${U}1524178232363-1fb2b075b655?ixlib=rb-4.0.3`,
    alt: "Una charla ante un grupo de vecinos sentados en una sala",
  },

  /* Verde */
  forest: {
    src: `${U}1523712999610-f77fbcfc3843?ixlib=rb-4.0.3`,
    alt: "Luz del sol atravesando un bosque de pinos",
  },
  canopy: {
    src: `${U}1518495973542-4542c06a5843?ixlib=rb-4.0.3`,
    alt: "La copa de un árbol a contraluz",
  },
  solar: {
    src: `${U}1509391366360-2e959784a276?ixlib=rb-4.0.3`,
    alt: "Placas solares en un campo bajo un cielo despejado",
  },
} as const satisfies Record<string, Photo>;
