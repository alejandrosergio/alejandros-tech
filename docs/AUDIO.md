# Audio opcional

## Grabación y licencia

«Night Owl», de **Broke For Free**, pertenece a *Directionless EP* (2011). Es una grabación instrumental de electrónica/downtempo. Sustituye la síntesis «Órbita digital» por petición del titular del 24 de noviembre de 2026; el sintetizador y sus pruebas de voces se retiraron del código activo.

Se descargó del [archivo oficial de Free Music Archive](https://files.freemusicarchive.org/storage-freemusicarchive-org/music/WFMU/Broke_For_Free/Directionless_EP/Broke_For_Free_-_01_-_Night_Owl.mp3). La [ficha FMA](https://freemusicarchive.org/music/Broke_For_Free/Directionless_EP/Broke_For_Free_-_Directionless_EP_-_01_Night_Owl/) y la etiqueta copyright del MP3 identifican **[CC BY 3.0](https://creativecommons.org/licenses/by/3.0/)**, que permite redistribución y adaptación con atribución. La [ficha oficial del artista](https://brokeforfree.bandcamp.com/track/night-owl) enlaza CC BY 4.0; para esta copia se conserva la licencia de su fuente FMA. Verificado el 24 de noviembre de 2026, sin compra, alta, muestras de YouTube ni servicio de reproducción externo.

Por petición del titular del 27 de noviembre de 2026, la copia local `/assets/audio/night-owl.mp3` queda en 55 s. Usa los primeros 59 s de la grabación y conserva una frase continua antes de reiniciarse. Su cuerpo reproduce los segundos 4–55 del original; le sigue una mezcla gradual de 4 s entre los segundos 55–59 y 0–4. Las curvas lineales de salida y entrada suman una ganancia unitaria; el final regresa al segundo 4, donde comienza el cuerpo del bucle. No hay repeticiones internas ni se han añadido instrumentos, síntesis o cambios de tempo o tono.

La copia conserva estéreo a 44,1 kHz. Se transcodificó de 320 a 160 kbps, se retiró la portada incrustada y se mantuvo la reducción de nivel de 3 dB respecto al original. Pesa 1.101.698 bytes frente a 8.054.458 del original completo. La decodificación pasó sin errores y produjo exactamente 2.425.500 muestras por canal (55 s), sin saturación; el pico de muestra de la copia es −3,45 dBFS y su media −20,89 dBFS. La diferencia entre las muestras contiguas al cierre del bucle es menor que otras diferencias entre muestras de los 100 ms próximos. Esta comprobación técnica no sustituye una escucha ni acredita todos los dispositivos.

El panel de volumen muestra título, autor, enlace a la fuente, licencia y la adaptación técnica en ES/EN. El MP3 conserva también crédito y licencia en sus etiquetas. [music.json](music.json) conserva las huellas; [el aviso público](../public/assets/licenses/night-owl.txt) acompaña la grabación. No se presenta como «sin copyright» ni se atribuye al artista un respaldo al sitio. La licencia propia del resto de la web no sustituye esta licencia.

## Transporte y volumen

- La página empieza en silencio y no crea un elemento de audio, contexto ni descarga al cargar. Solo Play solicita la grabación local; no hay precarga de música ni peticiones al proveedor.
- El botón cambia entre Play y Pausa, con nombre accesible, tooltip y estado ES/EN. El bucle de la introducción se repite mientras siga activado.
- Pausa, ocultar la pestaña, salir del documento o iniciar el video del proyecto detienen la música. Se retiran la fuente, el grafo y el contexto. Volver requiere otro Play, que empieza desde el inicio.
- Un contador de operación invalida promesas pendientes: cancelar una carga no puede reactivar después la reproducción. Los errores se anuncian y permiten reintentar.
- El regulador va de 0 a 100%, empieza al 65% y conserva el nivel solo en el documento actual. No escribe almacenamiento. Web Audio aplica una ganancia independiente, también en iOS; donde no está disponible se utiliza el volumen nativo.
- El panel admite teclado, Escape y cierre al pulsar/enfocar fuera. El indicador respeta movimiento reducido y colores forzados. Sin JavaScript permanece oculto.

## Verificación

`pnpm check` ejecuta el controlador publicado con medios y contexto simulados: activación explícita, volumen, cancelación, errores, video, visibilidad y liberación. La revisión nativa de navegador comprueba carga, reproducción y controles por separado; una simulación o una medición de nivel no sustituye escuchar la grabación.

Para reproducir la edición desde el original, la cadena de filtros de FFmpeg es:

```text
[0:a:0]asplit=3[b][t][h];
[b]atrim=start=4:end=55,asetpts=PTS-STARTPTS[body];
[t]atrim=start=55:end=59,asetpts=PTS-STARTPTS[tail];
[h]atrim=start=0:end=4,asetpts=PTS-STARTPTS[head];
[tail][head]acrossfade=d=4:c1=tri:c2=tri[blend];
[body][blend]concat=n=2:v=0:a=1,volume=-3dB[out]
```

Se exporta `[out]` con `libmp3lame`, `-b:a 160k -ar 44100 -ac 2 -write_xing 1`, sin portada y con etiquetas nuevas de título, artista, fuente, licencia y adaptación. La duración documentada corresponde a las muestras decodificadas; el contenedor MP3 puede informar algo más por el relleno del codificador.
