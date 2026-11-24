# Audio opcional

## Composición y procedencia

`src/client/soundtrack.js` contiene «Órbita digital», una composición original de techno ambiental a 118 BPM, creada el 24 de noviembre de 2026 para sustituir el anterior groove house. El ciclo de 32 compases combina ocho armonías, bajo redondo, percusión suave, arpegios FM y una melodía espaciada. La introducción, una sección de respiración y el cierre cambian la densidad para evitar repetir una frase corta continuamente.

Los pads tienen una entrada lenta, apertura de filtro y una atenuación suave sincronizada con el bombo. Una modulación de frecuencia breve aporta el ataque digital y cristalino; los arpegios alternan posiciones estéreo y un eco filtrado les da profundidad. La percusión utiliza ruido generado localmente, con agudos contenidos. El pulso y las texturas buscan una sensación tecnológica y futurista sin recurrir a grabaciones, voces o melodías de otros artistas.

No se incorporan grabaciones, pistas o samples externos, ni se consulta un servicio de música. Esta descripción documenta la procedencia; no significa dominio público ni una licencia libre y no se anuncia como «sin copyright». La pieza no forma parte de los recursos de React Bits. Los derechos generales del proyecto se describen en [README.md](../README.md) y [LEEME.md](../LEEME.md).

## Play, pausa y navegación

- Cada documento empieza en silencio. El contexto de audio solo se crea y reanuda al activar Play con ratón, tacto o teclado.
- El mismo botón cambia a Pausa, actualiza su nombre accesible, tooltip y `aria-pressed`, y anuncia el estado en ES/EN.
- Pausa detiene las voces, cancela la programación y cierra el contexto. Un nuevo Play comienza el ciclo desde el inicio.
- Ocultar la pestaña o salir del documento también detiene el audio; volver no lo reanuda automáticamente. No se guarda un estado de reproducción.
- Si la API no está disponible, el permiso falla o el contexto se interrumpe, el control conserva un estado recuperable y anuncia el problema o la pausa. El contenido de la web sigue disponible.

El botón fijo vive junto al control de accesibilidad y aparece en todas las rutas. Su indicador visual respeta movimiento reducido y colores forzados; la elección de escuchar es independiente de las animaciones decorativas. Sin JavaScript el botón permanece oculto y no se reproduce audio.

## Volumen

El icono de altavoz junto a Play abre un regulador de 0 a 100%, con etiqueta y porcentaje en ES/EN. Empieza al 65% en cada documento. La mezcla sintetizada se compensa después del compresor, con una ganancia máxima de 1,4 y una entrada gradual de 550 ms. La prueba de audio conserva margen antes de saturar, también al llevar el regulador al máximo. Son ganancias de la web: el volumen del dispositivo también influye en lo que se escucha.

El regulador actúa sobre una ganancia independiente de la entrada gradual y suaviza cada cambio durante unos milisegundos, sin reiniciar la frase ni crear voces. 0% silencia la salida. Ajustarlo con la música pausada prepara el siguiente Play sin iniciar audio. El nivel se conserva al pausar dentro del documento y vuelve al valor inicial al navegar; no añade almacenamiento opcional. El panel admite teclado y se cierra con Escape, al enfocar o pulsar fuera, o al ocultar/salir de la pestaña.

## Mantenimiento y comprobación

`src/components/soundtrack.mjs` genera el control localizado; `src/styles/soundtrack.css` adapta su presentación. El motor limita las voces simultáneas y programa un intervalo corto usando el reloj de audio; elimina voces y nodos al terminar. No descarga medios ni utiliza un bucle visual para llevar el tempo.

`scripts/check-soundtrack.mjs` ejercita el controlador con una superficie de audio simulada: inicio explícito, pausa, visibilidad, errores, programación, volumen, cierre del panel y liberación de recursos. La escucha real y la revisión del control en móvil/escritorio son comprobaciones de navegador separadas; la simulación no acredita la calidad sonora.

La revisión del 24 de noviembre incluye una muestra local de 66 segundos renderizada con el mismo grafo DSP mediante `OfflineAudioContext`, con una salida gradual para la muestra. La compensación final de ganancia se aplica después del compresor, por lo que se reproduce mediante un escalado lineal equivalente en la muestra. A 65% se midieron −23,3 LUFS integrados y −7,3 dBFS de pico verdadero, sin muestras saturadas; el escalado del regulador a 100% conserva margen en este recorrido. Son resultados de esa prueba a 44,1 kHz, no una garantía de calidad subjetiva o de todos los dispositivos. Los archivos de prueba no se incorporan a la descarga de la web.
