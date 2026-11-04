# Diseño de Alejandro’sTech

## Dirección visual

La web sigue la referencia editorial del titular: carbón, blanco cálido, serif regulares y acentos elegidos por el visitante. La marca es tipográfica, sin logo A+. El fondo oscuro usa #0e0e10 y el contenido casi negro #080809; el claro conserva el papel cálido. Las fuentes son locales y de sistema, sin descargas.

La primera visita parte de oscuro, coral y radio de6px. Las preferencias consentidas tienen prioridad: sistema/claro/oscuro, cinco tonos, texto100–125%, radios y ajustes de lectura. Los tokens de acento y texto de contraste se aplican a botones, tooltips y controles.

## Portada y recorrido

La fotografía normal aparece una vez en la portada. El código del antiguo modelo3D y sus pruebas se retiraron por petición del titular; su historia y la procedencia de la imagen están en ASSETS.md y Git. Ninguna parte del contenido depende de WebGL.

El bloque de nombre, profesión y firma se sitúa al54% en escritorio; la invitación «Software que conecta» sube al46%. El título profesional es «Analista y desarrollador de software» / «Software analyst and developer». La composición móvil reserva al menos880px y aumenta su altura con texto ampliado para separar nombre, redes, invitación y acciones.

La foto se acerca y aleja durante9,6s, con escala0,985–1,025 en escritorio y0,99–1,015 en móvil. Tres anillos de tamaño moderado giran a velocidades distintas detrás de ella. Ambos movimientos se detienen y la foto vuelve neutra al pausar o reducir movimiento.

CV y Contacto destacan en la franja inferior, sin línea transversal. Los accesos directos al CV abren una pestaña nueva con noopener noreferrer y conservan la ruta del idioma. Las redes del inicio son LinkedIn y GitHub; el correo se encuentra en Contacto. El indicador de bajar utiliza el acento elegido.

El perfil usa texto, sin una segunda tarjeta de retrato. Tecnologías conserva su explorador; trayectoria y enfoque usan desplegables nativos; proyectos, notas y formulario mantienen sus interacciones de contenido y su alternativa HTML.

## Navegación, cursores y controles

La cabecera se superpone transparente a la portada y adquiere fondo al salir de ella. La navegación es expandida sobre760px y colapsada en móvil. Su altura medida guía los desplazamientos y paneles fijos.

Los ocho puntos laterales se renderizan bajo body, fuera de la capa aislada del hero, con nivel43 por encima de los módulos. Se ocultan con diálogos abiertos. La barra del navegador se oculta únicamente cuando la navegación mejorada está disponible; rueda, teclado, gestos, anclas y barras de los diálogos siguen siendo nativos. Colores forzados y ausencia de mejora conservan la barra.

La guía calcula el avance del módulo actual y lo reinicia al cambiar; los puntos muestran el recorrido global. El visitante puede ocultar la guía. El botón de subida aparece después de avanzar.

El cursor decorativo usa punto y retículo sin flecha de redirección; se detiene en reposo. Campos, diálogos, dispositivos táctiles y movimiento reducido conservan el cursor nativo. Los tooltips son breves, acentuados y se retiran al pulsar o desplazar. El tema anuncia su acción disponible según el estado; menú, pausa y switches exponen también su estado real.

Accesibilidad es una tuerca de46px/44px, con nombre accesible completo y tooltip. La modal conserva foco visible, controles táctiles y scroll propio. No se afirma una certificación universal.

## Fondos y loader

Letter Glitch Pixel usa letras localesA–Z y blanco/coral, con cambios pequeños cada120ms. La portada recorta sus letras y no las muestra detrás del retrato. Los módulos tienen una base99% opaca, incluidos los márgenes; solo sus transiciones de hasta72px revelan el color intenso. Las páginas interiores añaden un velo de lectura bajo los artículos.

Splash Cursor Smoke aparece únicamente en la portada, detrás de la foto: gris, intensidad0,6 y tamaño0,5. Una entrada única responde después al puntero. La cola de animación es finita y no hay trabajo de render en reposo o fuera de vista.

Cada carga o recarga de documento, con o sin fragmento, muestra Light Rays Underwater en el loader. Toma el acento consentido ya aplicado por el arranque. Dura al menos1,2s, termina a2,4s como máximo y admite salida inmediata por teclado o botón; no espera recursos decorativos. Movimiento reducido evita el loader. WebGL tiene un respaldo CSS estático y sus recursos se liberan al cerrar.

Los efectos se suspenden con visibilidad y preferencias. Contraste alto y colores forzados mantienen una presentación simple. Letter Glitch se pausa también detrás del loader. Parámetros, procedencia y licencias constan en THIRD_PARTY.md.

## Contenido y accesibilidad base

ES y EN comparten estructura y contenido confirmado. Se preservan headings, salto al contenido, enlaces reales, referenciasARIA, etiquetas, foco, reflujo y zoom de texto. Las entradas de texto duran unos1,2s con escalonado acotado; enfocar por teclado y reducir movimiento hace el contenido inmediatamente visible. Las cookies solo guardan preferencias con consentimiento; el formulario valida y anuncia el resultado sin ocultar fallos.
