/**
 * Copy de UI centralizado (i18n-lite). Una sola fuente para los textos visibles
 * y las etiquetas de accesibilidad, evitando literales repetidos por pantalla.
 */
export const STRINGS = {
  common: {
    error: 'Algo salió mal',
  },
  brand: {
    name: 'Cinemateca',
    tagline: 'una sala de repertorio',
  },
  home: {
    sections: {
      nowPlaying: { title: 'En cartelera', icon: 'ticket-outline' },
      topRated: { title: 'Mejor calificadas', icon: 'star-outline' },
      popular: { title: 'Populares', icon: 'flame-outline' },
    },
    errorBody:
      'No pudimos cargar la cartelera. Vuelve a intentarlo en un momento.',
    emptyTitle: 'Sin cartelera',
    emptyBody:
      'No hay estrenos ahora mismo. Vuelve más tarde para ver la nueva programación.',
  },
  search: {
    placeholder: 'Buscar películas',
    suggestionsLabel: 'Sugerencias',
    suggestions: ['Capitan America', 'Batman', 'El Conjuro', 'Gru', 'Michael'],
    prompt: 'Escribe un título o un director para empezar.',
    errorLabel: 'Error',
    errorBody: 'No pudimos completar la búsqueda. Intenta de nuevo.',
    emptyLabel: 'Sin resultados',
    emptyBody: (term: string) =>
      `No encontramos «${term}». Prueba con otro título o director.`,
  },
  detail: {
    synopsis: 'Sinopsis',
    production: 'Producción',
    languages: 'Idiomas',
    website: 'Sitio web',
    errorBody: 'No pudimos cargar la información de esta película.',
  },
  cast: {
    heading: 'Reparto',
  },
  themeModes: { system: 'sistema', light: 'claro', dark: 'oscuro' },
  a11y: {
    back: 'Volver',
    searchMovies: 'Buscar películas',
    clearSearch: 'Limpiar búsqueda',
    themeToggle: (modeLabel: string) =>
      `Tema ${modeLabel}, tocar para cambiar`,
  },
} as const;
