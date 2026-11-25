# SEO y metadatos

`src/components/seo.mjs` genera metadatos estáticos para cada ruta en español e inglés. Conserva canonical propio, alternativas ES/EN recíprocas y `x-default` español. El sitemap incluye las rutas públicas; la página 404 lleva `noindex` y no publica un perfil estructurado.

La identidad de Sergio y de Alejandro’sTech permanece estable entre idiomas. La portada identifica un perfil; los casos, obras; las notas, artículos originales con su fecha real. El video declara la grabación local y su idioma hablado español, también en la ficha inglesa con subtítulos. No se añaden empleadores, valoraciones, cifras de visitas ni fechas de modificación inventadas.

Las miniaturas son los recursos locales que se muestran en cada caso. Sus dimensiones proceden del contenido compartido y se contrastan con los archivos entregados. Las tarjetas grandes se reservan para imágenes raster apaisadas. Los diagramas SVG conservan su formato original: su presentación final depende de que cada red lo admita; este marcado no garantiza una vista previa en todas las plataformas.

`pnpm check` incluye `scripts/check-seo.mjs` después del build. Comprueba los tamaños y formatos reales, las referencias del grafo y la coincidencia entre la fecha visible de cada nota y sus metadatos. Las comprobaciones generales verifican los idiomas, canonical, alternativas, enlaces, títulos, sitemap y robots.

No se añaden palabras clave ocultas ni promesas de posicionamiento. La indexación y la apariencia de los resultados dependen del buscador.

Referencias oficiales: [Open Graph](https://ogp.me/), [artículos en Google Search](https://developers.google.com/search/docs/appearance/structured-data/article), [perfil en Google Search](https://developers.google.com/search/docs/appearance/structured-data/profile-page) y [versiones localizadas](https://developers.google.com/search/docs/specialty/international/localized-versions).
