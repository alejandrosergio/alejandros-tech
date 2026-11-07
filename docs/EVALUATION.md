# Evaluación abierta del asistente / Open assistant evaluation

Esta evaluación se realizó el 7 de noviembre de 2026 con el modelo real Qwen3.5-0.8B-q4f16_1-MLC, revisión `0ec138972555613c1d7812a821778ad0398c8790`, en un navegador de escritorio de Windows con WebGPU. La página pública mantiene los resultados originales, sus fuentes y una revisión por pregunta en ES/EN.

This evaluation ran on 7 November 2026 with the actual pinned Qwen3.5 model in a Windows desktop browser with WebGPU. Outputs are preserved verbatim; qualitative judgements are AI-assisted by Codex and checked against the source, not an independent human evaluation.

## Método / Method

- 12 preguntas por idioma: 9 con evidencia de referencia y 3 sin respuesta en la biblioteca. Total: 24.
- Mismo corpus público de cuatro documentos, índice, contexto de una sección, modelo, parámetros y validador que la demo.
- Los criterios de referencia fueron escritos antes de la ejecución. No se modificaron las etiquetas para convertir fallos en aciertos.
- Se separa recuperación, abstención de la consulta ligera, procedencia literal y revisión de contenido. Una cita válida no prueba que una interpretación sea correcta.
- Las preguntas sin evidencia no invocan el modelo. Una salida inválida conserva los extractos ligeros y se registra como rechazada.
- La procedencia se cuenta por consulta: todas sus citas son literales o la aplicación no muestra extractos. Por eso incluye cuatro abstenciones sin fuentes; no es un recuento de 24 citas ni una medida de corrección.

The twelve questions in each language include supported queries, paraphrases and out-of-library queries with overlapping vocabulary. Expected sources and criteria precede the run. Retrieval, lightweight abstention, verbatim provenance and content review are separate measurements. Queries without evidence do not invoke the model. Invalid generation keeps lightweight excerpts.

## Resultado de referencia / Reference results

| Comprobación / Check | Resultado / Result | Interpretación / Meaning |
| --- | --- | --- |
| Fuente esperada primera / Expected source first | 18/18 | Solo preguntas con referencia / Supported queries only |
| Fuente entre las tres primeras / Expected source top three | 18/18 | No mide la respuesta redactada / Does not grade generation |
| Abstención ligera / Lightweight abstention | 4/6 | Dos consultas sobre una clave real recuperan orientación general / Two actual-key queries retrieve general advice |
| Procedencia por consulta / Provenance per query | 24/24 | Incluye abstenciones sin extractos / Includes abstentions without excerpts |
| Modelo invocado / Model invoked | 20 | Cuatro consultas se detienen antes / Four stop before inference |
| Salida aceptada por el contrato / Contract-accepted output | 18 | La forma válida no garantiza contenido correcto / Valid shape does not guarantee correctness |
| Salida rechazada / Rejected output | 2 | Consultas EN sobre historial y descarga; retorno a extractos / EN history and download queries; excerpt fallback |

Revisión cualitativa de los 24 comportamientos: 17 correctos, 4 parciales, 1 respuesta insuficiente y 2 errores técnicos con alternativa ligera. No se publica una supuesta precisión general. Las cuatro abstenciones correctas evalúan la aplicación, no respuestas generadas.

Qualitative review of all 24 behaviours: 17 correct, 4 partial, 1 insufficient answer and 2 technical errors with lightweight fallback. This is not a general accuracy estimate. Four correct abstentions test the application rather than generated answers.

### Fallos que conviene mirar / Useful counterexamples

- `secret-overlap / es`: la ejecución final reconoce que no existe una clave en los documentos. La ejecución anterior sí confundió orientación general con una clave real; se conserva en `previous-run.json` sin mezclar sus cifras con las de referencia.
- `motion / en`: respuesta circular, sin las condiciones de pausa presentes en la fuente. `motion / es` conserva las condiciones pero añade una justificación confusa.
- `contract / en` y `html / en`: omiten detalles relevantes; `missing / en` omite alternativas de recuperación.
- `history / en` y `download / en`: `invalid_sources`. La salida no se presenta como generada y las fuentes siguen disponibles.
- `secret-overlap / en`: reconoce que el texto no contiene una clave real, pese al falso positivo del recuperador.

## Reproducción / Reproduction

1. Abre `/laboratorio/evaluacion-documental/` o `/en/lab/document-evaluation/`.
2. `Evaluar consulta ligera` procesa las 24 preguntas sin descargar un modelo.
3. `Evaluar con IA local` requiere activación explícita, WebGPU, aproximadamente 450 MB y memoria disponible. Mantén la pestaña visible. La descarga puede usar datos de la conexión; no hay API de pago.
4. Revisa cada resultado y descarga el JSON si lo deseas. Cancelar conserva los casos ya terminados y libera el modelo. Ocultar o abandonar la pestaña cancela la ejecución.
5. Para verificar la recuperación y el contrato sin inferencia: `pnpm build` y `pnpm check`. La compilación comprueba huellas del corpus, preguntas, núcleo, worker, supervisor, configuración y evaluador. Una referencia obsoleta impide publicar.

The browser runner uses the same code path and processes both languages. Downloading is explicit, cancellation releases the model, and navigation/hidden tabs stop the run. `pnpm check` replays retrieval, verifies accepted outputs against the citation contract and checks every review entry. These automated checks do not independently adjudicate meaning.

`src/content/evaluation-reference.mjs` contiene la ejecución final con inicio y fin estables. `evaluation-history.mjs` conserva la primera ejecución, tomada antes de retirar un mensaje de diagnóstico de inicialización; corpus, preguntas, prompt y parámetros eran iguales. Sus salidas diferentes muestran que no debe prometerse determinismo. En la primera ejecución, el exportador asignó su timestamp al descargar: `executedAt` identifica solo el día comprobado y `exportedAt` conserva esa hora original. El exportador actual fija inicio y fin por separado. No se inventa una hora de finalización ni se usan tiempos de ejecución como puntuación.

## Alcance y fuentes / Scope and sources

El conjunto es pequeño, conocido y específico del corpus. No incluye archivos privados, datos de clientes ni pruebas de despliegue empresarial. Resultados y rendimiento pueden variar entre dispositivos y ejecuciones. No acredita seguridad universal ni sustituye una revisión humana independiente.

The set is small, known and specific to this corpus. Results can vary across devices and runs. It does not establish general safety or replace independent human review. Semantic retrieval, corpus expansion or prompt changes would need a new version and evaluation rather than retaining these numbers.

La separación de dimensiones se inspira en [RAGAs, EACL 2024](https://aclanthology.org/2024.eacl-demo.16/) y [ALCE, EMNLP 2023](https://aclanthology.org/2023.emnlp-main.398/). Este laboratorio implementa comprobaciones propias; no ejecuta esos frameworks ni les atribuye los resultados del prototipo.
