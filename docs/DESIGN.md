# Diseño

## Dirección visual

Una web profesional editorial: titulares amplios, mucho espacio, acentos azules y composiciones distintas según el contenido. dataconale.com sirve como referencia del recorrido personal e interactividad; la identidad, los textos, los componentes y los recursos de Alejandro’sTech son propios.

La siguiente edición toma poulo.site como referencia de interacciones y marcomadonnadesign.com como referencia de personalización por tonos. El panel propio se centra en apariencia y lectura: no replica contenido, proyectos, métricas o código de esas webs. Conserva el azul predeterminado y añade violeta, coral, océano y monocromo con variantes claras/oscuras. La tuerca queda visible en móvil con nombre accesible, sin tapar el formulario. El consentimiento de preferencias permite aceptar, elegir solo necesarias y cambiar de decisión desde el pie o el panel.

La paleta conserva la relación con el CV: azul marino, acento azul y tipografía de sistema. El tema claro usa fondo `#f5f7fb`, tinta `#11253f` y acento `#1467e6`; el oscuro usa `#090f1b`, `#edf3ff` y `#83bbff`. Los títulos combinan la familia sans del sistema con un acento editorial en Georgia, sin descargar fuentes.

## Recorrido

- Cabecera ligera y fija con navegación, idioma, tema y menú adaptable.
- Inicio editorial a pantalla completa, con retrato central y nombre superpuesto.
- Perfil con retrato y tarjeta de enfoque profesional.
- Mapa de tecnologías por áreas con inspector de contexto.
- Trayectoria y formación, con responsabilidades desplegables.
- Proyectos públicos con vistas reales y páginas propias.
- Proceso de trabajo y cuaderno técnico.
- Contacto destacado y pie compacto.

## Portada fotográfica

La nueva dirección toma la composición editorial de la referencia aportada por el titular: fondo carbón, retrato central, tipografía amplia y círculos finos. Conserva nombre, acentos y contenido propios. El recorte del retrato se presenta con un tratamiento casi monocromo, manteniendo el rostro despejado y situando el nombre sobre el torso. Los accesos laterales pasan a una distribución compacta en móvil.

La cabeza responde al ratón con perspectiva y un giro suave, sobre una capa fotográfica separada del torso. Es profundidad 2,5D, no una reconstrucción facial volumétrica. No hay movimiento automático en reposo; se puede pausar y se desactiva con puntero táctil, movimiento reducido y contraste elevado. Se retiran por completo el A+ WebGL, Aero Shards y sus estilos, controles y pruebas exclusivos. La marca A+ permanece en la navegación y la guía.

## Accesibilidad y comportamiento

La guía A+ acompaña las ocho secciones del inicio con el nombre actual, progreso y una sugerencia contextual. Se mantiene compacta; se puede abrir con clic, teclado o al acercar el ratón en escritorio, navegar a la sección anterior/siguiente y ocultarla. En móvil su panel se abre sobre la pastilla y admite desplazamiento interno. Se oculta mientras se usa el formulario y mientras se decide sobre cookies. Es navegación local: no envía el recorrido a un servicio ni simula una conversación de IA.

El cursor propio combina un punto preciso con una órbita que lo sigue y cambia sobre elementos interactivos. Solo sustituye el puntero con ratón y capacidades de puntero fino. Se conserva el cursor del sistema en campos de texto, diálogos, movimiento reducido y colores forzados; una opción explícita permite usarlo siempre. La órbita deja de solicitar fotogramas al alcanzar su posición. El botón flotante de subida aparece tras avanzar lo suficiente y devuelve el foco a la marca al usarlo con teclado. Las entradas de contenido tienen un ritmo escalonado y las secciones activas resaltan su marcador sin desplazar la lectura.

Contenido HTML real, rutas ES/EN completas, encabezados semánticos, salto con destino enfocable, foco visible y controles con etiquetas. El menú y los filtros son mejoras progresivas; las responsabilidades usan `details` nativo. El retrato tiene texto alternativo y los iconos decorativos se ocultan a tecnologías de asistencia.

Las revelaciones respetan movimiento reducido. El retrato permanece quieto cuando se solicita; el seguimiento se puede pausar. La portada no intercepta gestos táctiles ni el zoom. En colores forzados se simplifica el arte y se conservan límites y selección visibles. Se corrige el desbordamiento, sin ocultarlo globalmente.
