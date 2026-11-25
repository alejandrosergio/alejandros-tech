# Audio opcional

## Grabación y licencia

«Night Owl», de **Broke For Free**, pertenece a *Directionless EP* (2011). Es una grabación instrumental de electrónica/downtempo. Sustituye la síntesis «Órbita digital» por petición del titular del 24 de noviembre de 2026; el sintetizador y sus pruebas de voces se retiraron del código activo.

Se descargó del [archivo oficial de Free Music Archive](https://files.freemusicarchive.org/storage-freemusicarchive-org/music/WFMU/Broke_For_Free/Directionless_EP/Broke_For_Free_-_01_-_Night_Owl.mp3). La [ficha FMA](https://freemusicarchive.org/music/Broke_For_Free/Directionless_EP/Broke_For_Free_-_Directionless_EP_-_01_Night_Owl/) y la etiqueta copyright del MP3 identifican **[CC BY 3.0](https://creativecommons.org/licenses/by/3.0/)**, que permite redistribución y adaptación con atribución. La [ficha oficial del artista](https://brokeforfree.bandcamp.com/track/night-owl) enlaza CC BY 4.0; para esta copia se conserva la licencia de su fuente FMA. Verificado el 24 de noviembre de 2026, sin compra, alta, muestras de YouTube ni servicio de reproducción externo.

La copia local `/assets/audio/night-owl.mp3` conserva la pieza completa (194,07 s), estéreo a 44,1 kHz. Se transcodificó de 320 a 160 kbps, se retiró la portada incrustada y se redujo el nivel 3 dB. Pesa 3.883.133 bytes frente a 8.054.458 del original. La decodificación completa pasó sin errores; el pico de muestra de la copia es −1,6 dBFS y su media −16,0 dBFS. Estas medidas no acreditan calidad subjetiva ni todos los dispositivos.

El panel de volumen muestra título, autor, enlace a la fuente, licencia y la adaptación técnica en ES/EN. El MP3 conserva también crédito y licencia en sus etiquetas. [music.json](music.json) conserva las huellas; [el aviso público](../public/assets/licenses/night-owl.txt) acompaña la grabación. No se presenta como «sin copyright» ni se atribuye al artista un respaldo al sitio. La licencia propia del resto de la web no sustituye esta licencia.

## Transporte y volumen

- La página empieza en silencio y no crea un elemento de audio, contexto ni descarga al cargar. Solo Play solicita la grabación local; no hay precarga de música ni peticiones al proveedor.
- El botón cambia entre Play y Pausa, con nombre accesible, tooltip y estado ES/EN. La grabación completa se repite mientras siga activada.
- Pausa, ocultar la pestaña, salir del documento o iniciar el video del proyecto detienen la música. Se retiran la fuente, el grafo y el contexto. Volver requiere otro Play, que empieza desde el inicio.
- Un contador de operación invalida promesas pendientes: cancelar una carga no puede reactivar después la reproducción. Los errores se anuncian y permiten reintentar.
- El regulador va de 0 a 100%, empieza al 65% y conserva el nivel solo en el documento actual. No escribe almacenamiento. Web Audio aplica una ganancia independiente, también en iOS; donde no está disponible se utiliza el volumen nativo.
- El panel admite teclado, Escape y cierre al pulsar/enfocar fuera. El indicador respeta movimiento reducido y colores forzados. Sin JavaScript permanece oculto.

## Verificación

`pnpm check` ejecuta el controlador publicado con medios y contexto simulados: activación explícita, volumen, cancelación, errores, video, visibilidad y liberación. La revisión nativa de navegador comprueba carga, reproducción y controles por separado; una simulación o una medición de nivel no sustituye escuchar la grabación.
