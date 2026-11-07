# Diseño de Alejandro’sTech

## Dirección visual

La web sigue la referencia editorial del titular: carbón, blanco cálido, serif regulares y acentos elegidos por el visitante. La marca es tipográfica, sin logo A+. El fondo oscuro usa #0e0e10 y el contenido casi negro #080809; el claro conserva el papel cálido. Las fuentes son locales y de sistema, sin descargas.

La primera visita parte de oscuro, coral y radio de 6 px. Las preferencias consentidas tienen prioridad: sistema/claro/oscuro, cinco tonos, texto 100–125%, radios y ajustes de lectura. Los tokens de acento y texto de contraste se aplican a botones, tooltips y controles.

## Portada y recorrido

La fotografía normal aparece una vez en la portada. El código del antiguo modelo3D y sus pruebas se retiraron por petición del titular; su historia y la procedencia de la imagen están en ASSETS.md y Git. Ninguna parte del contenido depende de WebGL.

El bloque de nombre y profesión se sitúa al 54% en escritorio; «Software que conecta» se centra verticalmente alrededor del 50%, conservando su columna derecha. El título profesional es «Analista y desarrollador de software» / «Software analyst and developer». La firma «Conectar ideas…» queda centrada bajo el nombre con un desplazamiento de 1,25 rem a la derecha; en móvil se centra sin desplazamiento. La composición móvil reserva al menos 880 px y aumenta su altura con texto ampliado para separar nombre, redes, invitación y acciones.

La fotografía se redujo al 140% de su superficie de encuadre en escritorio y al 112% en móvil, preservando su proporción 2:3. Se acerca y aleja durante 9,6 s, con escala 0,97–1,035 y flotación máxima de 6 px en escritorio; en móvil usa 0,98–1,025 y 4 px. Tres anillos con trazos blancos giran en 60/90/120 s, alternando el sentido. Conservan sus tamaños de escritorio y se reducen en móvil a84/108/132vw con límites de420/540/660px. Cada círculo tiene tres aperturas asimétricas normalizadas a un recorrido de100, para que el giro se perciba sin cambiar su grosor. Estos movimientos solo corren con la portada activa; pausa y movimiento reducido dejan la foto neutra.

El raíl izquierdo tiene cuatro disciplinas: desarrollo de software, automatización, IA aplicada e integraciones. La cuarta apunta a Proyectos y describe APIs y sistemas, sin añadir hechos profesionales. Las barras permanecen verticales en reposo y se ensanchan al pasar o enfocar, mostrando la descripción. En móvil el contenido equivalente se dispone en 2×2 y pasa a una columna en pantallas muy estrechas. Cali, Colombia y el stack tienen mayor tamaño y pueden envolver.

CV y Contacto destacan en la franja inferior, sin línea transversal. En móvil esta franja deja separación de los controles fijos de música y accesibilidad. Los accesos directos al CV abren una pestaña nueva con noopener noreferrer y conservan la ruta del idioma. Las redes del inicio son LinkedIn y GitHub; el correo se encuentra en Contacto. La portada no incluye el antiguo bloque «Descubre mi mundo».

El perfil usa texto, sin una segunda tarjeta de retrato. Tecnologías conserva su explorador; trayectoria y enfoque usan desplegables nativos; proyectos, notas y formulario mantienen sus interacciones de contenido y su alternativa HTML.

## Navegación, cursores y controles

La cabecera se superpone transparente a la portada y adquiere fondo al salir de ella. La navegación es expandida sobre760px y colapsada en móvil. Su altura medida guía los desplazamientos y paneles fijos.

Los ocho puntos laterales se renderizan bajo body, fuera de la capa aislada del hero, con nivel43 por encima de los módulos. Se ocultan con diálogos abiertos. La barra del navegador se oculta únicamente cuando la navegación mejorada está disponible; rueda, teclado, gestos, anclas y barras de los diálogos siguen siendo nativos. Colores forzados y ausencia de mejora conservan la barra.

La guía calcula el avance del módulo actual y lo reinicia al cambiar; los puntos muestran el recorrido global. El visitante puede ocultar la guía. El botón flotante de subida aparece después de avanzar y es el único acceso dedicado para volver arriba; el pie no duplica este enlace.

El cursor decorativo usa punto y retículo sin flecha de redirección; se detiene en reposo. Campos, diálogos, dispositivos táctiles y movimiento reducido conservan el cursor nativo. Los tooltips son breves, acentuados y se retiran al pulsar o desplazar. El tema anuncia su acción disponible según el estado; menú, pausa y switches exponen también su estado real.

Accesibilidad es una tuerca de46px/44px, con nombre accesible completo y tooltip. La modal conserva foco visible, controles táctiles y scroll propio. No se afirma una certificación universal.

## Fondos y loader

Letter Glitch Classic usa tipografía monoespaciada local de14px, letras, números y símbolos. Conserva la base verde oscura y los destellos verdes/azules del preset, con su variante clara al cambiar de tema. Cambia grupos pequeños de caracteres cada100ms y suaviza los tintes con un máximo de25fps. La portada recorta sus letras y no las muestra detrás del retrato. Los módulos tienen una base99% opaca, incluidos los márgenes; solo sus transiciones de hasta72px revelan el color intenso. Las páginas interiores añaden un velo de lectura bajo los artículos.

Splash Cursor Smoke aparece únicamente en la portada, detrás de la foto: gris, intensidad0,6 y tamaño0,5. Una entrada única responde después al puntero. La cola de animación es finita y no hay trabajo de render en reposo o fuera de vista.

Cada carga o recarga de documento, con o sin fragmento, muestra Grid Scan Deep en el loader: una rejilla en perspectiva con diez celdas, profundidad 8 y barrido luminoso, con el acento consentido ya aplicado por el arranque. El centro tiene un velo de lectura para la marca y el botón. Permanece dos segundos completos después de window.load; la descarga de imágenes no consume ese tiempo. Teclado y botón permiten entrar antes. Un vigilante de diez segundos evita retener una carga que no emite load y se cancela al recibir ese evento. Movimiento reducido, contraste alto y colores forzados evitan el loader. El único pase WebGL tiene respaldo CSS estático y libera sus recursos al cerrar.

Los efectos se suspenden con visibilidad y preferencias. Contraste alto y colores forzados mantienen una presentación simple. Letter Glitch se pausa también detrás del loader. Parámetros, procedencia y licencias constan en THIRD_PARTY.md.

## Audio opcional

Un control Play/Pausa junto a accesibilidad inicia una composición original local de 112 BPM mediante Web Audio. El icono de altavoz abre un panel compacto con volumen de 0 a 100%, inicialmente al 65%, con porcentaje visible, teclado y cierre con Escape. La guía deja espacio para ambos controles en móvil. La carga de la página nunca reproduce sonido; ocultar la pestaña o salir del documento detiene la interpretación, que requiere otro Play para comenzar de nuevo. El indicador visual respeta movimiento reducido. No se descargan pistas ni samples externos. La implementación y el alcance de esa procedencia se describen en [AUDIO.md](AUDIO.md).

## Contenido y accesibilidad base

ES y EN comparten estructura y contenido confirmado. Se preservan headings, salto al contenido, enlaces reales, referencias ARIA, etiquetas, foco, reflujo y zoom de texto. Las entradas de texto duran unos 1,1 s con escalonado acotado; enfocar por teclado y reducir movimiento hace el contenido inmediatamente visible. Las cookies solo guardan preferencias con consentimiento; el formulario valida y anuncia el resultado sin ocultar fallos.
