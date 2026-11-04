# Diseño

## Dirección visual actual

La referencia editorial aportada por el titular guía toda la web: superficies carbón, texto blanco cálido, titulares serif regulares, círculos finos y pequeñas marcas coral. La composición usa aire y líneas discretas en lugar de tarjetas azules brillantes. El contenido, la marca A+ y los proyectos siguen siendo propios de Alejandro’sTech.

El tema oscuro usa `#0e0e10` de fondo, `#f2eee8` de tinta y `#f06a73` de acento coral. El claro usa papel cálido `#f3f0ea`, tinta `#242122` y coral `#ad3545`. Georgia, Times New Roman y las familias de sistema disponibles aportan la tipografía sin descargas. La portada utiliza además Bodoni MT/Didot cuando están instaladas.

La primera visita parte de oscuro, coral y radio de 6 px. Las elecciones anteriores del visitante conservan prioridad. Siguen disponibles sistema/claro/oscuro, azul, violeta, coral, océano y monocromo, además de los controles de lectura. No se restablecen preferencias consentidas para imponer el nuevo aspecto.

## Recorrido y navegación

- Cabecera con marca, idiomas, tema y navegación expandida por encima de 760 px. En anchuras intermedias, los enlaces pueden ocupar una segunda fila. El menú se colapsa solo en móvil, hasta 760 px.
- Inicio a pantalla completa con busto volumétrico, nombre serif superpuesto sobre el torso y firma editorial. La cara permanece despejada.
- Perfil y enfoque profesional en dos columnas de texto, sin tarjeta giratoria ni segunda fotografía del titular.
- Explorador de tecnologías, trayectoria, proyectos y cuaderno con las mismas superficies, líneas y jerarquía tipográfica.
- Contacto y fichas interiores integrados en el sistema visual, con controles de formulario legibles en ambos temas.

El alto de cabecera se mide para que el inicio se adapte también cuando la navegación ocupa dos filas. En móvil se redistribuyen los accesos y se preservan las áreas táctiles y el desplazamiento normal.

## Busto 3D y apariencia

El titular eligió expresamente preparar un busto 3D estilizado basado en su foto. La geometría tiene volumen de cabeza y torso, cabello rizado, barba, camisa y manos abiertas, sin cadenas, gafas ni accesorios. La cabeza gira alrededor del cuello y cada ojo tiene su propio nodo móvil. Es una interpretación artística aproximada; no se afirma un escaneo ni una reconstrucción exacta del rostro o del cuerpo.

La apariencia en gris se preparó con la herramienta integrada de imágenes, usando una vista frontal del modelo, la foto del titular y la referencia de iluminación. El visualizador proyecta esa apariencia sobre las coordenadas de las superficies en su pose de reposo y aplica iluminación en WebGL. La malla aporta profundidad, oclusión, articulación y cambios de superficie al girar. La apariencia y su imagen estática de respaldo se documentan en `ASSETS.md`.

El ratón orienta la cabeza y los ojos con un recorrido acotado. El teclado permite flechas e Inicio; el arrastre táctil horizontal conserva el desplazamiento vertical y el zoom. No hay una animación continua en reposo. La pausa y el movimiento reducido mantienen una pose neutra; con mayor contraste se usa un respaldo estático atenuado y con colores forzados se simplifica la portada a contenido y navegación. Sin JavaScript, WebGL o carga del modelo permanece la imagen local.

## Movimiento y controles

Las entradas de contenido duran 1,2 segundos, con una curva suave y un escalonado de 110 ms limitado a 330 ms. Empiezan ligeramente antes de entrar en pantalla para que el visitante perciba la transición mientras avanza. Los elementos enfocados por teclado aparecen inmediatamente. Movimiento reducido, colores forzados y ausencia de JavaScript conservan todo el contenido visible.

El cursor combina un punto preciso y una órbita que crece discretamente sobre enlaces o botones. No muestra una flecha de redirección. Solo sustituye el cursor del sistema con ratón y puntero fino; los campos, diálogos, dispositivos táctiles, movimiento reducido y colores forzados conservan el puntero normal. La órbita deja de solicitar fotogramas al alcanzar su posición.

La guía A+ mantiene contexto, progreso y sugerencias para las ocho secciones del inicio. Se puede abrir, cerrar y ocultar; se retira durante el formulario y antes de resolver las cookies. El botón de subida aparece después de avanzar y devuelve el foco a la marca cuando se usa con teclado. Estas funciones son navegación local y no envían el recorrido a un servicio.

## Accesibilidad

Las rutas ES/EN, los encabezados, el salto de navegación, el foco visible, las etiquetas y los enlaces reales forman la base del sitio. La decoración no es necesaria para comprender o navegar. Se verifica reflujo en pantallas estrechas y con texto ampliado, corrigiendo la causa del desbordamiento. No se afirma una certificación universal de accesibilidad.

## Fondo global

Letter Glitch toma el preset Pixel y la paleta blanca/coral/menta/azul solicitados. Queda fijo detrás de las superficies, con velo de lectura central; solo se percibe suavemente en márgenes y zonas despejadas. No intercepta acciones ni añade letras a la lectura asistida. El pie permite pausarlo en cualquier ruta y la pausa de la escena lo detiene también. Movimiento reducido produce una textura estática; mayor contraste y colores forzados lo ocultan.
