# Caso audiovisual de Power Platform

El titular entregó `Video_Portafolio_Power_Platform.mp4` el 24 de noviembre de 2026 para publicarlo como proyecto y explicar su gestión freelance end to end. Dura 178 segundos. Los metadatos del original lo describen como una demostración editada con capturas reales, identidad anonimizada y narración sintética en español. Las escenas incluyen esquemas simplificados y subtítulos españoles integrados en la imagen.

## Alcance confirmado

Una aplicación guiada de apoyo comercial relaciona sector, reto, cuenta, motores, recomendaciones y resultados. Los catálogos e imágenes están en SharePoint. Dos procesos de Power Automate crean la estructura y cargan contenido desde Excel; conexiones y variables de entorno configuran el destino. Power Apps y Power Fx implementan componentes, navegación y estados de carga, con revisión de escritorio, tablet y móvil. Las plantillas de prompts usan el contexto seleccionado y permiten copiar o enviar el texto al propio correo; esto no acredita un modelo de IA integrado.

El relato de trabajo freelance se limita a lo mostrado: revisión de materiales y alcance, criterios de aceptación, experiencia y datos, implementación, pruebas con evidencia, documentación y entrega. Los seis documentos son instalación, modelo de datos, diccionario, manual de usuario, administración y ficha de versión. La entrega alinea solución, contenidos y documentación; el cierre muestra un ajuste, regresión y nueva versión con Git. No se añaden cifras de impacto, cliente, empleador, fechas del encargo, infraestructura de producción o servicios no demostrados. Tampoco se asume que este recorrido sea el mismo proyecto que los resúmenes del CV.

## Medios y procedencia

- Original conservado sin cambios fuera del repositorio: 12.976.214 bytes, H.264/AAC, 1920×1080, 24 fps. SHA-256: `680a74791cc6913755d8fe7f3bc1b17f3f45fdca63d7859f600c9d8ecfe6547a`.
- `public/assets/power-platform-delivery.mp4`: copia optimizada a 1280×720, H.264 CRF 24, AAC mono a 80 kb/s, cabecera fast-start y metadatos de edición retirados. Conserva las escenas, duración, narración y subtítulos integrados. 5.396.028 bytes; SHA-256: `d86b1dd70fcf8591dc4201ebbaf9cbaf0e5e892cb09abbc05b06f23d2e1ef406`.
- `public/assets/power-platform-preview.jpg`: fotograma real de la edición optimizada a los 69 segundos. Se utiliza como portada y póster en ambos idiomas; la captura conserva el español del original, identificado junto al reproductor.
- `src/content/power-platform-video.mjs`: ficha equivalente ES/EN, transcripción revisada y traducción. Una transcripción local asistió la revisión; no se envió el audio a un servicio ni se incorporaron herramientas/modelos de transcripción al proyecto.
- La construcción genera `dist/assets/power-platform-es.vtt` y `power-platform-en.vtt` a partir de las frases revisadas y sus intervalos. Los subtítulos de inglés se activan por defecto solo en la página inglesa; pueden desactivarse en el reproductor. Los españoles integrados en el propio video no pueden desactivarse.

No se publica el archivo original adicionalmente, ni los archivos de instalación, solución o código del trabajo profesional. Sin esas fuentes no se calcula un porcentaje de lenguajes. El inventario de seis tecnologías es independiente del código usado para presentar este caso en Alejandro’sTech.

## Presentación y comportamiento

La tarjeta sigue la cuadrícula y los estilos editoriales existentes. No carga el video en la portada: muestra únicamente el póster y enlaza la ficha. La ficha usa un reproductor nativo 16:9, `controls`, `playsinline` y `preload="none"`, con enlace MP4 alternativo y transcripción desplegable en HTML. No hay autoplay, bucle, librería de video o servicio externo. La grabación mantiene el español; no se finge una segunda grabación en inglés.

Solo esta ficha carga el pequeño controlador de video. La revisión pública detectó que el alojamiento responde `200` con el MP4 completo cuando se solicita un rango, y el avance del reproductor quedaba atascado. Tras pulsar Reproducir, el controlador prepara en memoria el archivo de 5,4 MB mediante una URL de objeto: los controles nativos pueden buscar cualquier escena sin depender de rangos del servidor. No hay petición del MP4 antes de esa acción ni almacenamiento persistente. Se admite un máximo de 6 MB; hay estados de preparación, reintento y reproducción manual si el navegador exige otra pulsación. Sin JavaScript siguen disponibles los controles y el enlace MP4, aunque el alojamiento mantiene su limitación de rangos.

Reproducir el video detiene y libera la música opcional; pulsar la música pausa el video y cancela su preparación pendiente. Ocultar la página cancela una descarga pendiente y pausa la grabación; volver no la reanuda. Abandonar la página también libera la URL de objeto, incluido el retorno mediante historial. Las preferencias de apariencia siguen aplicándose al contenedor y al resto de la ficha; el contenido grabado no cambia de tema.

La nueva ruta se añade al sitemap, las alternativas de idioma y el pie. Incluye `VideoObject` con nombre localizado, contenido, póster, fecha de incorporación, duración real e idioma de la grabación; no inventa estadísticas. Los casos anteriores, las ocho secciones del inicio y las entradas congeladas de evaluación permanecen intactos.

`pnpm check` verifica procedencia del contenedor, copia exacta, fast-start, H.264/AAC, carga voluntaria, subtítulos ordenados dentro de la duración, traducciones, rutas, inventario y coordinación de audio. La revisión en navegador comprueba el reproductor real, subtítulos, búsqueda temporal, transcripción y lectura en móvil/escritorio. La vista local incorpora MIME MP4/VTT y rangos para poder comprobar la búsqueda temporal.
