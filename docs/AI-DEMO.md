# Asistente documental

## Alcance

Prototipo personal autorizado el 7 de noviembre de 2026. Conserva los ocho módulos y el diseño del sitio; añade un caso y una demo ES/EN. No representa un cliente, experiencia laboral anterior ni una medición de precisión.

- Demo ES: `/laboratorio/asistente-documental/`.
- Demo EN: `/en/lab/document-assistant/`.
- Caso ES: `/proyectos/asistente-documental/`.
- Caso EN: `/en/projects/document-assistant/`.

La autorización final es consulta ligera con fuentes y un modelo descargable opcional, sin cargos de API. No hay backend de inferencia, claves, cuentas, compras, suscripciones de IA ni base de datos. El borrador de servidor nunca publicado se retiró, junto a sus herramientas y configuración.

## Dos modos, identificados en la interfaz

La consulta ligera está disponible desde el principio. `src/client/assistant-core.js` construye un índice léxico por idioma, con puntuación BM25 y conceptos acotados. Encuentra hasta cuatro secciones dentro de 8000 caracteres y presenta hasta tres extractos literales con enlaces. No redacta una respuesta ni se presenta como generación de IA. Fuera de la biblioteca muestra información insuficiente.

La IA local requiere pulsar **Activar IA en mi dispositivo**. Descarga Qwen3.5 de 0,8B y lo ejecuta mediante WebLLM/WebGPU en un worker del navegador. El modelo recibe la pregunta y el extracto más relevante y produce una respuesta breve. La aplicación acompaña esa respuesta con la fuente y el extracto utilizados, sin pedirle al modelo que invente enlaces o metadatos. La consulta ligera continúa funcionando durante la preparación y cuando no existe un adaptador compatible. Un error o un resultado que no supera los controles devuelve los extractos originales y explica el cambio de modo.

`src/content/document-assistant.mjs` contiene traducciones, guía y biblioteca versionada: cuatro documentos y dieciséis secciones por idioma. Reutiliza las tres notas originales y añade una guía de la demo. Todo es público y legible sin JavaScript. No admite subida de archivos, navegación por internet ni documentos privados.

## Carga voluntaria y compatibilidad

`src/content/local-model.mjs` fija el modelo, revisión de pesos, runtime y SHA-256. WebLLM 0.2.87 se empaqueta con esbuild 0.28.2 en una entrada independiente. El controlador pequeño de la demo no importa ni descarga ese paquete pesado al abrirse. Ninguna otra página carga el asistente.

- Pesos: `mlc-ai/Qwen3.5-0.8B-q4f16_1-MLC`, revisión `0ec138972555613c1d7812a821778ad0398c8790`.
- Descarga aproximada: 450 MB; puede consumir datos móviles.
- Referencia de memoria del registro de WebLLM: alrededor de 1,6 GB de memoria gráfica. No es una garantía de consumo ni compatibilidad en todos los equipos.
- Requisitos: contexto seguro, WebGPU y `shader-f16`, además de memoria y límites GPU suficientes. La presencia de `navigator.gpu` por sí sola no garantiza que cargue.
- Runtime WASM local: `/assets/models/qwen35-08b-webgpu.wasm`, 7.358.915 bytes. Su origen y hash están en `ASSETS.md`.
- Contexto acotado a 4096 tokens, historial recurrente de una entrada y tokens de parada de Qwen3.5 `[248046, 248044]`.

El supervisor comprueba el adaptador solo al activar. Tiene un plazo de preparación de cinco minutos y de generación de un minuto. Cancelar interrumpe la generación; si el GPU no responde en 1,5 segundos, se termina el worker. Desactivar y salir de la página liberan el worker. Ocultar una pestaña con el modelo listo o generando también lo desactiva. No se reactiva ni inicia otra descarga por recordar un estado anterior.

## Contrato y validación

Las preguntas tienen entre 8 y 600 caracteres y no admiten caracteres de control. No hay historial: cada generación reinicia el contexto del modelo. Las instrucciones piden responder en el idioma de la página, usar solo el fragmento recuperado y tratar la pregunta y las fuentes como datos.

El modelo redacta texto breve con temperatura 0,1, máximo 180 tokens y razonamiento desactivado. Se rechazan salidas truncadas, vacías, demasiado largas o con marcadores de razonamiento o enlaces. Si el modelo indica que no puede responder, se conservan los fragmentos de la consulta ligera con un aviso. La aplicación construye el contrato de presentación: un párrafo, el identificador recuperado y el fragmento literal que se usó como contexto. Comprueba estructura, longitudes, identificadores permitidos, ausencia de duplicados y correspondencia de evidencia. Cada extracto tiene entre 24 y 320 caracteres. Los títulos y enlaces proceden del corpus; el modelo no decide destinos. El contenido se inserta como texto, nunca HTML. No hay un verificador semántico automático de la respuesta.

Una cita existente **no demuestra la corrección semántica de una interpretación**. La IA pequeña puede responder mal o rechazar una pregunta válida. La recuperación léxica puede perder paráfrasis; no hay embeddings ni búsqueda semántica. La demo muestra esos límites, permite abrir el contexto y no ejecuta acciones. No se promete un asistente generalista.

## Privacidad y almacenamiento

Las preguntas, fragmentos y respuestas se procesan en el dispositivo. La aplicación no los envía a un servicio de IA ni los persiste. El anfitrión sigue sirviendo los archivos normales de la página. Al activar el modelo, Hugging Face y su infraestructura de distribución reciben las solicitudes de descarga, con los datos normales de conexión; no reciben la pregunta como parte de este flujo.

WebLLM puede conservar los archivos del modelo en Cache Storage para reutilizarlos. **Borrar descarga** detiene el worker y elimina solo las entradas correspondientes a la revisión de pesos y al runtime de esta demo. No borra preferencias, cookies ni otros archivos del sitio. El navegador puede conservar además su caché HTTP; el control no promete borrar todo el almacenamiento del navegador. La caché de archivos descargados es independiente del consentimiento para guardar las preferencias opcionales del sitio.

No se añade telemetría ni almacenamiento de conversaciones. No se presenta el uso de la conexión o del dispositivo como libre de coste para el visitante: la condición de la entrega es **sin cargos de API ni servicios de IA de pago**.

## Comprobaciones

`scripts/check-document-assistant.mjs` ejercita recuperación relevante ES/EN, extractos reales, preguntas fuera del corpus, límites de entrada, rechazo de citas inventadas, contrato acotado, ausencia de descarga anticipada, cancelación y liberación del worker, salida estática e integridad del runtime. Las pruebas de ciclo de vida usan un worker controlado; no son respuestas de un modelo.

La revisión en navegador debe probar la consulta ligera en ambos idiomas, enlaces, límites, móvil estrecho y preferencias visuales. La carga real del modelo y una respuesta con fuentes por idioma son verificaciones adicionales en un navegador compatible. Si esa prueba falla, corregirla o informar la limitación con precisión; no presentar el fallback como generación correcta.

En la revisión local de esta entrega se descargó y ejecutó realmente el modelo: respondió sobre validación y protección de claves en español y sobre protección de claves en inglés. También se comprobaron cancelación, preguntas fuera de la biblioteca, errores de longitud y reflujo a 320/390 px con texto al 125 % y tema claro/oscuro. Son comprobaciones funcionales de ejemplos, no una evaluación estadística de precisión ni una prueba en todos los modelos de teléfono.

## Fuentes técnicas

- [WebLLM: uso básico](https://webllm.mlc.ai/docs/user/basic_usage.html).
- [WebLLM: workers y configuración](https://webllm.mlc.ai/docs/user/advanced_usage.html).
- [Registro de modelos y requisitos](https://github.com/mlc-ai/web-llm/blob/main/src/config.ts).
- [Pesos fijados de la demo](https://huggingface.co/mlc-ai/Qwen3.5-0.8B-q4f16_1-MLC/tree/0ec138972555613c1d7812a821778ad0398c8790).
- [Ficha y licencia de Qwen3.5](https://huggingface.co/Qwen/Qwen3.5-0.8B).

Ver `THIRD_PARTY.md` para licencias y `PUBLISHING.md` para publicación y sincronización.
