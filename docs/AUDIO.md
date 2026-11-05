# Audio opcional

## Composición y procedencia

`src/client/soundtrack.js` contiene una composición escrita para Alejandro’sTech a 112 BPM: un ciclo de ocho compases, cuatro armonías, bajo, percusión y melodía propios. Web Audio produce los tonos con osciladores y la percusión con ruido generado localmente; un eco filtrado aporta espacio sin cargar una muestra de reverberación.

No se incorporan grabaciones, pistas o samples externos, ni se consulta un servicio de música. Esta descripción documenta la procedencia; no significa dominio público ni una licencia libre y no se anuncia como «sin copyright». La pieza no forma parte de los recursos de React Bits. Los derechos generales del proyecto se describen en [README.md](../README.md) y [LEEME.md](../LEEME.md).

## Play, pausa y navegación

- Cada documento empieza en silencio. El contexto de audio solo se crea y reanuda al activar Play con ratón, tacto o teclado.
- El mismo botón cambia a Pausa, actualiza su nombre accesible, tooltip y `aria-pressed`, y anuncia el estado en ES/EN.
- Pausa detiene las voces, cancela la programación y cierra el contexto. Un nuevo Play comienza el ciclo desde el inicio.
- Ocultar la pestaña o salir del documento también detiene el audio; volver no lo reanuda automáticamente. No se guarda un estado de reproducción.
- Si la API no está disponible, el permiso falla o el contexto se interrumpe, el control conserva un estado recuperable y anuncia el problema o la pausa. El contenido de la web sigue disponible.

El botón fijo vive junto al control de accesibilidad y aparece en todas las rutas. Su indicador visual respeta movimiento reducido y colores forzados; la elección de escuchar es independiente de las animaciones decorativas. Sin JavaScript el botón permanece oculto y no se reproduce audio.

## Volumen

El icono de altavoz junto a Play abre un regulador de 0 a 100%, con etiqueta y porcentaje en ES/EN. Empieza al 65% en cada documento. El máximo de salida subió de 0,15 a 0,6; el nivel inicial combinado es 0,39. El compresor y la entrada gradual se conservan. Son ganancias de la web: el volumen del dispositivo también influye en lo que se escucha.

El regulador actúa sobre una ganancia independiente de la entrada gradual y suaviza cada cambio durante unos milisegundos, sin reiniciar la frase ni crear voces. 0% silencia la salida. Ajustarlo con la música pausada prepara el siguiente Play sin iniciar audio. El nivel se conserva al pausar dentro del documento y vuelve al valor inicial al navegar; no añade almacenamiento opcional. El panel admite teclado y se cierra con Escape, al enfocar o pulsar fuera, o al ocultar/salir de la pestaña.

## Mantenimiento y comprobación

`src/components/soundtrack.mjs` genera el control localizado; `src/styles/soundtrack.css` adapta su presentación. El motor limita las voces simultáneas y programa un intervalo corto usando el reloj de audio; elimina voces y nodos al terminar. No descarga medios ni utiliza un bucle visual para llevar el tempo.

`scripts/check-soundtrack.mjs` ejercita el controlador con una superficie de audio simulada: inicio explícito, pausa, visibilidad, errores, programación, volumen, cierre del panel y liberación de recursos. La escucha real y la revisión del control en móvil/escritorio son comprobaciones de navegador separadas; la simulación no acredita la calidad sonora.
