> Estado actual: retrato fotográfico estático; modelo 3D conservado en fuente y excluido del build y de la publicación. Fondo Letter Glitch Pixel (A–Z, blanco/coral), excluido de la portada.

# Diseño

## Dirección visual actual

La referencia editorial aportada por el titular guía toda la web: superficies carbón, texto blanco cálido, titulares serif regulares, círculos finos y pequeñas marcas coral. La composición usa aire y líneas discretas en lugar de tarjetas azules brillantes. El contenido y los proyectos siguen siendo propios de Alejandro’sTech. La marca se muestra solo como texto; se ha retirado el logo A+ hasta preparar una nueva identidad gráfica.

El tema oscuro usa `#0e0e10` de fondo, `#f2eee8` de tinta y `#f06a73` de acento coral. El claro usa papel cálido `#f3f0ea`, tinta `#242122` y coral `#ad3545`. Georgia, Times New Roman y las familias de sistema disponibles aportan la tipografía sin descargas. La portada utiliza además Bodoni MT/Didot cuando están instaladas.

La primera visita parte de oscuro, coral y radio de 6 px. Las elecciones anteriores del visitante conservan prioridad. Siguen disponibles sistema/claro/oscuro, azul, violeta, coral, océano y monocromo, además de los controles de lectura. No se restablecen preferencias consentidas para imponer el nuevo aspecto.

## Recorrido y navegación

- Cabecera con marca tipográfica, idiomas, tema y navegación expandida por encima de 760 px. En anchuras intermedias, los enlaces pueden ocupar una segunda fila. El menú se colapsa solo en móvil, hasta 760 px.
- Inicio a pantalla completa con retrato fotográfico estático, nombre serif superpuesto sobre el torso y firma editorial. La cara permanece despejada.
- Perfil y enfoque profesional en dos columnas de texto, sin tarjeta giratoria ni segunda fotografía del titular.
- Explorador de tecnologías, trayectoria, proyectos y cuaderno con las mismas superficies, líneas y jerarquía tipográfica.
- Contacto y fichas interiores integrados en el sistema visual, con controles de formulario legibles en ambos temas.

La cabecera se superpone transparente sobre el inicio y adquiere fondo al alcanzar el contenido. Su alto se mide para adaptar la escena también cuando la navegación ocupa dos filas. En móvil se redistribuyen los accesos y se preservan las áreas táctiles y el desplazamiento normal.

## Busto 3D y apariencia

El titular eligió expresamente preparar un busto 3D estilizado basado en su foto. La geometría tiene volumen de cabeza y torso, cabello rizado, barba, polo y brazos cruzados basados en la foto original, sin cadenas, gafas ni accesorios. La cabeza gira alrededor del cuello y cada ojo tiene su propio nodo móvil. Es una interpretación artística aproximada; no se afirma un escaneo ni una reconstrucción exacta del rostro o del cuerpo.

La apariencia en gris se preparó con la herramienta integrada de imágenes, usando una vista frontal del modelo, la foto del titular y la referencia de iluminación. El visualizador proyecta esa apariencia sobre las coordenadas de las superficies en su pose de reposo y aplica iluminación en WebGL. La malla aporta profundidad, oclusión, articulación y cambios de superficie al girar. La apariencia y su imagen estática de respaldo se documentan en `ASSETS.md`.

La interacción 3D descrita aquí permanece archivada y no se ejecuta en la web actual. El ratón orientaba la cabeza y los ojos con un recorrido acotado. El teclado permite flechas e Inicio; el arrastre táctil horizontal conserva el desplazamiento vertical y el zoom. No hay una animación continua en reposo. La pausa y el movimiento reducido mantienen una pose neutra; con mayor contraste se usa un respaldo estático atenuado y con colores forzados se simplifica la portada a contenido y navegación. Sin JavaScript, WebGL o carga del modelo permanece la imagen local.

## Movimiento y controles

Las entradas de contenido duran unos 1,1 segundos, con una curva suave y un escalonado acotado. Los títulos estáticos entran por palabras y los párrafos por bloques, una vez asoman en pantalla para que el visitante perciba la transición mientras avanza. Los elementos enfocados por teclado aparecen inmediatamente. Movimiento reducido, colores forzados y ausencia de JavaScript conservan todo el contenido visible.

El cursor combina un punto preciso y una órbita que crece discretamente sobre enlaces o botones. No muestra una flecha de redirección. Solo sustituye el cursor del sistema con ratón y puntero fino; los campos, diálogos, dispositivos táctiles, movimiento reducido y colores forzados conservan el puntero normal. La órbita deja de solicitar fotogramas al alcanzar su posición.

La guía de navegación mantiene contexto, progreso y sugerencias para las ocho secciones del inicio. Se puede abrir, cerrar y ocultar; se retira durante el formulario y antes de resolver las cookies. El botón de subida aparece después de avanzar y devuelve el foco a la marca cuando se usa con teclado. Estas funciones son navegación local y no envían el recorrido a un servicio.

## Accesibilidad

Las rutas ES/EN, los encabezados, el salto de navegación, el foco visible, las etiquetas y los enlaces reales forman la base del sitio. La decoración no es necesaria para comprender o navegar. Se verifica reflujo en pantallas estrechas y con texto ampliado, corrigiendo la causa del desbordamiento. No se afirma una certificación universal de accesibilidad.

## Fondo global

Letter Glitch toma el preset Pixel y la paleta blanca/coral solicitados. Queda fijo detrás de las superficies, con velo de lectura central. La geometría real de la portada recorta su región: no aparecen letras en el inicio y la animación se pausa cuando queda completamente tapada. Fuera de la portada se revela con un borde suave; las páginas interiores mantienen el fondo. No intercepta acciones ni añade letras a la lectura asistida. El pie permite pausarlo. Movimiento reducido produce una textura estática; mayor contraste y colores forzados lo ocultan.

## Refinamiento de navegación y portada

La portada incluye accesos directos al CV web, contacto, LinkedIn, GitHub y correo. Las tres disciplinas siguen un raíl editorial vertical. Los círculos se renderizan detrás del busto con trazos tenues y rotación lenta; se detienen al pausar la escena, reducir movimiento o salir del área visible. Se retiró el número decorativo de la derecha. Ocho puntos de navegación representan las secciones reales.

El cursor cambia de órbita a un retículo abierto sobre enlaces y controles, sin flecha. Los tooltips son breves, se sitúan junto a sus controles y se retiran al desplazarse o pulsar Escape. El botón de accesibilidad usa el acento elegido con su color de texto de contraste.

El enfoque y el proceso incorporan desplegables nativos, operables con ratón y teclado incluso sin JavaScript. Las tecnologías conservan su explorador; trayectoria, proyectos, notas y contacto mantienen interacciones ligadas a su contenido. Los textos originales no se duplican para animarlos. Con texto ampliado, la portada móvil gana altura para separar títulos y botones.

## Escala y recorrido por módulo

Los títulos de portada, secciones y fichas usan una escala menor. CV y contacto son acciones destacadas en la franja inferior del inicio. Las redes tienen iconos de24px y objetivos de48px, separados del raíl vertical01/02/03. Las barras del raíl son verticales y cortas en reposo; se ensanchan sin rotar al pasar el cursor o enfocar y revelan una explicación. En móvil las redes se ordenan en una fila y las descripciones se muestran bajo el inicio.

Las superficies de lectura se extienden hasta ambos bordes de la ventana y conservan los márgenes del contenido. La navegación lateral sigue el recorrido real. Al estar disponible, oculta solo la barra del navegador: rueda, gesto táctil, teclado y enlaces conservan el desplazamiento nativo. En colores forzados o sin mejora JavaScript se conserva la barra. Los diálogos mantienen sus barras de desplazamiento. El acceso a accesibilidad combina una superficie neutra, icono y detalles en el acento seleccionado; el idioma activo utiliza el mismo acento con texto de contraste.

El círculo de la guía mide exclusivamente el avance de la sección actual, vuelve al inicio al cambiar de módulo y retrocede al subir. El porcentaje usa la misma fracción. Los ocho puntos laterales mantienen la posición global. El marcador de lectura se alinea con el desplazamiento de las anclas bajo la cabecera.

El cursor decorativo queda excluido desde que existe cualquier diálogo abierto, incluso antes de ejecutarse el observador de estado. La modal y su fondo conservan cursor nativo visible.
