import { evaluationPaths } from './evaluation-cases.mjs';
import { workflowPaths } from './workflow.mjs';

export const labNotes = [
  {
    id: 'evaluation', slug: { es: 'evaluar-respuestas-con-fuentes', en: 'evaluating-answers-with-sources' }, category: { es: 'IA · Evaluación', en: 'AI · Evaluation' }, symbol: '[?]', date: '2026-11-07',
    references: [
      { title: 'RAGAs · EACL 2024', url: 'https://aclanthology.org/2024.eacl-demo.16/' },
      { title: 'ALCE · EMNLP 2023', url: 'https://aclanthology.org/2023.emnlp-main.398/' }
    ],
    es: {
      title: 'Una fuente correcta no garantiza una respuesta correcta.', summary: 'Cómo separar recuperación, citas y contenido al evaluar un asistente documental. Con preguntas, resultados y una ejecución reproducible.',
      intro: 'Un asistente puede citar un documento real y aun así no responder a la pregunta. Para distinguir esos comportamientos, la evaluación de esta web separa lo que encuentra el buscador de lo que escribe el modelo y de lo que termina viendo la persona.',
      sections: [
        { title: 'Define primero qué debería pasar', paragraphs: ['El conjunto público contiene doce preguntas por idioma. Nueve tienen una sección de referencia; tres no tienen respuesta en la biblioteca. Los criterios se escriben antes de revisar las salidas y no se cambian para hacer que una ejecución parezca mejor.', 'La pregunta sobre una clave secreta real comparte vocabulario con un documento que recomienda proteger credenciales. Ese texto es pertinente al tema, pero no contiene una clave real. Recuperarlo no equivale a responder bien.'] },
        { title: 'Mide capas diferentes', paragraphs: ['La recuperación comprueba si una sección esperada aparece en primer lugar o entre las tres primeras. La procedencia comprueba que los extractos existan literalmente en los documentos. La revisión de contenido comprueba si la respuesta resuelve la pregunta sin añadir afirmaciones sin respaldo.', 'RAGAs distingue dimensiones de recuperación y generación; ALCE analiza también la calidad de las citas. Esas investigaciones orientan esta separación, pero el laboratorio usa comprobaciones propias: no ejecuta sus herramientas ni presenta sus resultados como si fueran los de este prototipo.'] },
        { title: 'Prueba el mismo camino que utiliza la demo', paragraphs: ['El evaluador importa el mismo índice, selección de contexto, contrato de generación y validador que el asistente. La consulta ligera no descarga un modelo. La ejecución opcional prepara Qwen3.5 en el navegador y recorre las veinticuatro preguntas.', 'El registro exportado incluye pregunta, secciones recuperadas, respuesta aceptada o motivo de rechazo, fuentes mostradas y huellas de los componentes evaluados. Si cambia una entrada relevante, la construcción impide conservar una referencia que ya no corresponde.'] },
        { title: 'Publica también lo que falla', paragraphs: ['Las preguntas sin respuesta forman parte del resultado. Una coincidencia de palabras puede mostrar orientación general donde debería reconocerse que no existe evidencia suficiente. El laboratorio conserva ese fallo para que la persona pueda contrastarlo.', 'La revisión publicada está asistida por IA y contrastada con los documentos; no es una evaluación humana independiente. Un conjunto pequeño y preparado para esta biblioteca detecta regresiones concretas, pero no demuestra precisión general, seguridad universal ni aptitud para datos privados.'] }
      ],
      takeaway: 'Evalúa por separado lo que recuperas, lo que citas y lo que afirmas. Conserva los casos negativos y el registro de la ejecución.',
      links: [{ title: 'Abrir preguntas, respuestas y evaluación', href: evaluationPaths.es }]
    },
    en: {
      title: 'A correct source does not guarantee a correct answer.', summary: 'How to separate retrieval, citations and content when evaluating a document assistant. With questions, results and a reproducible run.',
      intro: 'An assistant can cite a real document and still fail to answer the question. To distinguish these behaviours, this website’s evaluation separates what retrieval finds, what the model writes and what the person ultimately sees.',
      sections: [
        { title: 'Define the expected behaviour first', paragraphs: ['The public set contains twelve questions per language. Nine have a reference section; three have no answer in the library. Criteria are written before reviewing outputs and are not changed to make a run look better.', 'The question about an actual secret key shares vocabulary with a document recommending credential protection. That passage is topically relevant but contains no actual key. Retrieving it does not mean the question was answered correctly.'] },
        { title: 'Measure different layers', paragraphs: ['Retrieval checks whether an expected section ranks first or in the top three. Provenance checks whether excerpts exist verbatim in documents. Content review checks whether an answer resolves the question without adding unsupported claims.', 'RAGAs distinguishes retrieval and generation dimensions; ALCE also examines citation quality. These studies inform the separation, but this lab uses its own checks: it does not run their tools or attribute their results to this prototype.'] },
        { title: 'Test the same path as the demo', paragraphs: ['The evaluator imports the assistant’s index, context selection, generation contract and validator. Lightweight evaluation downloads no model. The optional run prepares Qwen3.5 in the browser and processes all twenty-four questions.', 'The exported record includes the question, retrieved sections, accepted answer or rejection reason, displayed sources and fingerprints of the evaluated components. If a relevant input changes, the build prevents a reference from silently becoming stale.'] },
        { title: 'Publish failures too', paragraphs: ['Unsupported questions are part of the result. Word overlap can produce general advice where the system should acknowledge insufficient evidence. The lab retains that failure so the reader can inspect it.', 'The published review is AI-assisted and checked against the documents; it is not an independent human evaluation. A small set written for this library detects specific regressions, but demonstrates neither general accuracy nor universal safety or suitability for private data.'] }
      ],
      takeaway: 'Evaluate retrieval, citations and claims separately. Keep negative cases and the execution record.',
      links: [{ title: 'Open questions, answers and evaluation', href: evaluationPaths.en }]
    }
  },
  {
    id: 'workflow', slug: { es: 'solicitudes-reintentos-y-aprobaciones', en: 'requests-retries-and-approvals' }, category: { es: '.NET · Automatización', en: '.NET · Automation' }, symbol: '{↻}', date: '2026-11-07',
    references: [
      { title: 'RFC 9110 · Idempotent methods', url: 'https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2.2' },
      { title: 'RFC 9457 · Problem Details', url: 'https://www.rfc-editor.org/rfc/rfc9457.html' },
      { title: 'Microsoft · Power Automate approvals', url: 'https://learn.microsoft.com/en-us/power-automate/get-started-approvals' },
      { title: 'Microsoft · Power Automate error handling', url: 'https://learn.microsoft.com/en-us/power-automate/guidance/coding-guidelines/error-handling' }
    ],
    es: {
      title: 'Reintentar sin duplicar. Aprobar sin saltarse pasos.', summary: 'Un ejemplo ejecutable con contrato HTTP, idempotencia y control de versión. Así se conecta la lógica de una API con un flujo de aprobación.',
      intro: 'Cuando una automatización no recibe respuesta, puede repetir una petición que el servidor ya procesó. El prototipo de solicitudes separa esa repetición de la decisión de aprobar y de los cambios de estado posteriores.',
      sections: [
        { title: 'Dos identificadores con responsabilidades distintas', paragraphs: ['requestId identifica la solicitud de negocio. Idempotency-Key identifica el intento lógico de crearla. La misma clave y los mismos datos devuelven el registro existente; la misma clave con otros datos devuelve 409. Otra clave con el mismo requestId también se rechaza.', 'El prototipo normaliza espacios de los campos y convierte el identificador a mayúsculas antes de comparar. Conserva las claves en memoria hasta reiniciar el proceso. No ofrece deduplicación entre servidores, después de un reinicio ni una garantía de ejecución exactamente una vez.'] },
        { title: 'La aprobación es una transición explícita', paragraphs: ['El recorrido válido es recibida, en revisión, aprobada y completada. La revisión también puede terminar en rechazo. La API exige la versión esperada y devuelve 409 si otro cambio se adelantó.', 'Un contador de versión evita sobrescribir un estado más reciente, pero no identifica a quien aprueba. El ejemplo es local y no tiene autenticación. En una implantación real, identidad, permisos y registro duradero son responsabilidades del servidor.'] },
        { title: 'Reproduce el contrato antes de añadir un conector', paragraphs: ['La demo de navegador y el dominio .NET recorren los mismos escenarios JSON: creación, repetición, conflicto de datos, rechazo, transición inválida y versión antigua. Las pruebas HTTP arrancan la API local y verifican el intercambio real.', 'La API limita el tamaño del cuerpo, rechaza campos desconocidos y devuelve errores Problem Details. Los códigos estables permiten distinguir una entrada inválida de un conflicto. Un fallo de validación no se resuelve repitiendo la misma petición.'] },
        { title: 'Añade Power Automate con un camino de recuperación', paragraphs: ['La guía del repositorio propone registrar una solicitud, iniciar revisión y esperar la decisión de una persona autorizada. El flujo conserva requestId y clave entre reintentos; no genera otra clave cada vez que falla una llamada.', 'Después de una respuesta incierta, consulta el estado antes de avanzar. Separa los errores en ámbitos con Run After y registra contexto sin secretos. La guía no está desplegada en un tenant y no presupone conectores gratuitos: permisos, conectividad y licencias dependen del entorno.'] }
      ],
      takeaway: 'Haz que los reintentos, las decisiones y los conflictos sean parte del contrato. Prueba esos caminos antes de conectarlos con un proceso real.',
      links: [{ title: 'Probar el flujo y sus conflictos', href: workflowPaths.es }, { title: 'Ejecutar la API .NET y sus pruebas', href: 'https://github.com/alejandrosergio/alejandros-tech/tree/main/examples/workflow-api' }]
    },
    en: {
      title: 'Retry without duplicates. Approve without skipping steps.', summary: 'A runnable example with an HTTP contract, idempotency and version checks. Connecting API logic with an approval workflow.',
      intro: 'When automation receives no response, it can repeat a request the server already processed. The request prototype separates that replay from the approval decision and subsequent state changes.',
      sections: [
        { title: 'Two identifiers with different responsibilities', paragraphs: ['requestId identifies the business request. Idempotency-Key identifies the logical creation attempt. The same key and data return the existing record; the same key with different data returns 409. A different key with the same requestId is also rejected.', 'The prototype trims field values and uppercases the identifier before comparison. Keys remain in memory until the process restarts. It provides no cross-server or post-restart deduplication and no exactly-once execution guarantee.'] },
        { title: 'Approval is an explicit transition', paragraphs: ['The valid journey is received, in review, approved and completed. Review can also end in rejection. The API requires the expected version and returns 409 if another change happened first.', 'A version counter prevents overwriting newer state, but does not identify the approver. The example runs locally without authentication. In a real deployment, identity, permissions and durable records belong to the server.'] },
        { title: 'Reproduce the contract before adding a connector', paragraphs: ['The browser demo and .NET domain run the same JSON scenarios: creation, replay, changed-data conflict, rejection, invalid transition and old version. HTTP checks start the local API and verify the actual exchange.', 'The API limits body size, rejects unknown fields and returns Problem Details errors. Stable codes distinguish invalid input from conflicts. Repeating an invalid request does not fix validation.'] },
        { title: 'Add Power Automate with a recovery path', paragraphs: ['The repository guide proposes registering a request, starting review and waiting for an authorised person’s decision. The flow keeps requestId and key across retries rather than creating a new key for every failed call.', 'After an uncertain response, read the current state before proceeding. Separate errors into scopes with Run After and log context without secrets. The guide is not deployed in a tenant and assumes no free connectors: permissions, connectivity and licences depend on the environment.'] }
      ],
      takeaway: 'Make retries, decisions and conflicts part of the contract. Test those paths before connecting them to a real process.',
      links: [{ title: 'Try the workflow and its conflicts', href: workflowPaths.en }, { title: 'Run the .NET API and its checks', href: 'https://github.com/alejandrosergio/alejandros-tech/tree/main/examples/workflow-api' }]
    }
  }
];
