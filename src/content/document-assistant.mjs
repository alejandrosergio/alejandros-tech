import { notes, notePath } from './notes.mjs';

export const assistantPaths = { es: '/laboratorio/asistente-documental/', en: '/en/lab/document-assistant/' };
export const corpusVersion = '2026-11-07-local';

// The demo indexes only this public, versioned library. No visitor uploads,
// professional records or private documents enter the retrieval context.
const guide = {
  id: 'demo',
  es: {
    title: 'Cómo funciona esta demo', summary: 'Alcance, fuentes y límites del asistente documental.',
    sections: [
      { title: 'Una biblioteca acotada', paragraphs: ['Este asistente responde sobre cuatro documentos públicos: las tres notas técnicas originales de Alejandro’sTech y esta guía. No busca en internet, no consulta archivos privados y no admite subir documentos. Es un prototipo personal para explorar la integración de IA en software, no un caso de un cliente.', 'Cada consulta es independiente. La aplicación no conserva un historial de preguntas o respuestas. Cambiar de página o recargar borra la conversación de la pantalla.'] },
      { title: 'De la pregunta a la evidencia', paragraphs: ['La consulta ligera funciona en el navegador: busca coincidencias de palabras y conceptos y muestra fragmentos literales con sus fuentes. No redacta con un modelo. Si activas la IA opcional, el dispositivo descarga Qwen3.5 y utiliza los fragmentos recuperados para generar una respuesta en el idioma de la página.', 'La aplicación acompaña el párrafo generado con la fuente y el extracto usados como contexto. Los identificadores, enlaces y fragmentos proceden de la biblioteca; el modelo no los inventa. Si la generación falla o no supera estas comprobaciones, vuelve a mostrar los fragmentos e indica el cambio. Una cita válida ayuda a revisar la respuesta, pero no garantiza que toda su interpretación sea correcta.'] },
      { title: 'Cuando falta información', paragraphs: ['Si la biblioteca no aporta evidencia suficiente, el asistente debe reconocerlo. No debe inventar fuentes, datos profesionales, precios ni resultados de proyectos. Puedes reformular la pregunta o abrir los documentos para comprobar qué información contienen.', 'La demo no ejecuta acciones, cambia datos ni envía mensajes a otras personas. Las respuestas son orientativas y requieren revisión humana antes de aplicarlas a un sistema real.'] },
      { title: 'Privacidad y disponibilidad', paragraphs: ['Las preguntas y respuestas se procesan en el dispositivo y no se envían a un servicio de IA. No hay claves ni consumo de API. La descarga opcional de aproximadamente 450 MB obtiene archivos públicos de Hugging Face y puede conservarlos en la caché del navegador; puedes borrarlos desde la demo. No se guardan conversaciones.', 'La IA descargable requiere WebGPU y memoria suficiente. La consulta ligera sigue disponible cuando el navegador no es compatible, la descarga se cancela o el modelo falla. Salir de la demo libera el modelo; volver no activa otra descarga ni generación automáticamente.'] }
    ]
  },
  en: {
    title: 'How this demo works', summary: 'Scope, sources and boundaries of the document assistant.',
    sections: [
      { title: 'A bounded library', paragraphs: ['This assistant answers questions about four public documents: Alejandro’sTech’s three original technical notes and this guide. It does not search the internet, access private files or accept document uploads. It is a personal prototype exploring AI integration in software, not a client case study.', 'Each query is independent. The application keeps no question or answer history. Navigating away or reloading clears the conversation from the screen.'] },
      { title: 'From question to evidence', paragraphs: ['Lightweight consultation runs in the browser: it matches words and concepts and shows verbatim passages with their sources. It does not write with a model. If you enable optional AI, the device downloads Qwen3.5 and uses the retrieved passages to generate an answer in the page’s language.', 'The application accompanies the generated paragraph with the source and excerpt used as context. Identifiers, links and passages come from the library; the model does not invent them. If generation fails or does not pass these checks, it shows passages instead and indicates the change. A valid citation helps review the answer, but does not guarantee that its entire interpretation is correct.'] },
      { title: 'When information is missing', paragraphs: ['If the library provides insufficient evidence, the assistant should acknowledge it. It must not invent sources, professional facts, prices or project outcomes. You can rephrase the question or open the documents to check what they contain.', 'The demo does not execute actions, change data or send messages to other people. Answers are guidance and require human review before being applied to a real system.'] },
      { title: 'Privacy and availability', paragraphs: ['Questions and answers are processed on the device and are not sent to an AI service. There are no keys or API usage charges. The optional download of approximately 450 MB retrieves public files from Hugging Face and may keep them in the browser cache; you can delete them from the demo. Conversations are not stored.', 'Downloadable AI requires WebGPU and sufficient memory. Lightweight consultation remains available when the browser is incompatible, the download is cancelled or the model fails. Leaving the demo releases the model; returning does not automatically start another download or generation.'] }
    ]
  }
};

export function assistantDocuments(lang) {
  return [notes.find(note => note.id === 'ai'), notes.find(note => note.id === 'integration'), notes.find(note => note.id === 'progressive')].map(note => ({
    id: note.id, title: note[lang].title, summary: note[lang].summary, href: notePath(note, lang),
    sections: note[lang].sections.map((section, i) => ({ ...section, id: `${note.id}-${i + 1}`, href: `${notePath(note, lang)}#section-${i + 1}` }))
  })).concat({
    id: guide.id, title: guide[lang].title, summary: guide[lang].summary, href: `${assistantPaths[lang]}#document-demo`,
    sections: guide[lang].sections.map((section, i) => ({ ...section, id: `demo-${i + 1}`, href: `${assistantPaths[lang]}#source-demo-${i + 1}` }))
  });
}

export const assistantCopy = {
  es: {
    label: 'Laboratorio · IA aplicada', title: ['Preguntar. Entender.', 'Comprobar.'],
    description: 'Un asistente documental que responde sobre una biblioteca pública y muestra la evidencia detrás de cada respuesta.',
    case: 'Ver el caso y sus decisiones', evaluation: 'Preguntas, resultados y evaluación', back: 'Todos los proyectos', prototype: 'Prototipo personal',
    workspace: 'Prueba el asistente', library: 'La biblioteca', libraryIntro: 'Cuatro documentos públicos. Abre cualquiera para leer la fuente completa.',
    libraryCount: '4 documentos · ES / EN', question: '¿Qué quieres consultar?', placeholder: 'Por ejemplo: ¿qué debo validar antes de usar una respuesta de IA?',
    hint: 'Entre 8 y 600 caracteres. Cada pregunta empieza una consulta nueva.', send: 'Consultar con fuentes', sending: 'Consultando la biblioteca…', cancel: 'Cancelar', clear: 'Limpiar',
    privacy: 'Tu consulta se procesa en tu dispositivo. No se envía a una API de IA ni se guarda un historial.',
    suggestions: 'Puedes empezar por aquí',
    examples: ['¿Qué debo validar antes de usar una respuesta de IA?', '¿Dónde deben guardarse las claves de una integración?', '¿Qué ocurre si los documentos no tienen la respuesta?'],
    answer: 'Respuesta y evidencia', idleTitle: 'La respuesta empieza en las fuentes.', idle: 'Escribe tu pregunta o elige un ejemplo. Podrás abrir cada cita y contrastar el extracto con el documento original.',
    steps: ['Consultar documentos', 'Abrir las fuentes', 'Activar IA si lo deseas'],
    sources: 'Fuentes de esta respuesta', quote: 'Extracto literal', openSource: 'Abrir la fuente', newTab: 'abre una pestaña nueva',
    caveat: 'Una cita permite revisar la respuesta. Comprueba la interpretación antes de utilizarla.',
    abstainedTitle: 'La biblioteca no aporta evidencia suficiente.', abstained: 'No puedo responder esa pregunta con estas fuentes. Prueba con una consulta sobre contexto de IA, contratos de integración, validación o esta demo.',
    ready: 'Consulta ligera · Sin descargas ni cargos de API', loading: 'Buscando contexto en los documentos.', completed: 'Respuesta de IA local lista. Revisa también las fuentes.', cancelled: 'Consulta cancelada. Puedes intentarlo de nuevo.', cleared: 'Consulta y respuesta borradas de la pantalla.', invalid: 'Escribe una pregunta de entre 8 y 600 caracteres.',
    extractsTitle: 'Esto dicen los documentos.', extractsReady: 'Fragmentos literales · Consulta ligera en tu dispositivo', lightMode: 'Consulta ligera', aiMode: 'IA en tu dispositivo',
    modelFallback: 'La IA no pudo completar una respuesta. Estos son los fragmentos encontrados, sin redacción del modelo.',
    extractsCaveat: 'Estos son fragmentos literales, no una respuesta generada por IA. Abre las fuentes para leer el contexto completo.',
    failed: 'No se pudo completar la consulta. Conservamos tu pregunta para que puedas volver a intentarlo.',
    timeout: 'La respuesta tardó demasiado. Puedes intentarlo de nuevo.',
    invalid_sources: 'La respuesta no superó la comprobación de fuentes. No se mostrará como válida; puedes reformular la pregunta.',
    noJS: 'La consulta interactiva necesita JavaScript. La biblioteca y el caso siguen disponibles para leerlos.',
    limitsTitle: 'Un experimento con límites claros.', limits: ['Biblioteca cerrada: sin búsquedas en internet ni archivos privados.', 'Consulta ligera disponible desde el principio; IA descargable voluntaria.', 'Sin acciones automáticas, cargos de API ni historial de consultas.', 'La IA local puede equivocarse: revisa sus fuentes e interpretación.'],
    model: {
      label: 'IA opcional', title: 'Un paso más, en tu dispositivo.', description: 'Puedes generar respuestas con Qwen3.5 sin enviar tu pregunta a un servicio de IA. La consulta ligera sigue disponible.',
      download: 'Activar IA en mi dispositivo', size: 'Descarga aproximada: 450 MB. Requiere WebGPU y alrededor de 1,6 GB de memoria gráfica. Puede tardar y usar datos móviles.',
      checking: 'Comprobando compatibilidad…', loading: 'Descargando y preparando el modelo…', ready: 'IA local lista. Las próximas consultas usarán el modelo.', generating: 'La IA local está preparando una respuesta breve…',
      unsupported: 'Este navegador no puede ejecutar este modelo. Puedes seguir consultando fragmentos y fuentes.', failed: 'La IA local no pudo continuar. La consulta ligera sigue disponible; puedes volver a intentarlo.',
      cancel: 'Cancelar descarga', stop: 'Desactivar IA', stopped: 'Modelo desactivado. La consulta ligera sigue disponible.', clear: 'Borrar descarga', cleared: 'Se borraron los archivos de este modelo guardados por la demo.', clearFailed: 'No se pudieron borrar todos los archivos. Puedes gestionar el almacenamiento desde tu navegador.', progress: 'Progreso de preparación del modelo',
      cache: 'Solo se descargará al activarlo. El navegador puede conservar los archivos para próximas visitas; las conversaciones no se guardan.', source: 'Conocer el modelo', retry: 'Volver a intentar'
    },
    document: 'Documento', sections: 'secciones', original: 'Contenido original de Alejandro’sTech', source: 'Ver documento original', version: 'Biblioteca actualizada el 7 de noviembre de 2026'
  },
  en: {
    label: 'Lab · Applied AI', title: ['Ask. Understand.', 'Verify.'],
    description: 'A document assistant that answers questions about a public library and shows the evidence behind each response.',
    case: 'Explore the case and decisions', evaluation: 'Questions, results and evaluation', back: 'All projects', prototype: 'Personal prototype',
    workspace: 'Try the assistant', library: 'The library', libraryIntro: 'Four public documents. Open any of them to read the complete source.',
    libraryCount: '4 documents · ES / EN', question: 'What would you like to ask?', placeholder: 'For example: what should I validate before using an AI response?',
    hint: 'Between 8 and 600 characters. Each question starts a new query.', send: 'Ask with sources', sending: 'Consulting the library…', cancel: 'Cancel', clear: 'Clear',
    privacy: 'Your query is processed on your device. It is not sent to an AI API and no history is stored.',
    suggestions: 'A few places to start',
    examples: ['What should I validate before using an AI response?', 'Where should integration keys be stored?', 'What happens if the documents do not contain the answer?'],
    answer: 'Answer and evidence', idleTitle: 'An answer starts with its sources.', idle: 'Write a question or choose an example. You will be able to open each citation and compare the excerpt with the original document.',
    steps: ['Consult documents', 'Open the sources', 'Enable AI if you wish'],
    sources: 'Sources for this answer', quote: 'Verbatim excerpt', openSource: 'Open source', newTab: 'opens a new tab',
    caveat: 'A citation helps you review the answer. Check the interpretation before using it.',
    abstainedTitle: 'The library provides insufficient evidence.', abstained: 'I cannot answer that question from these sources. Try a query about AI context, integration contracts, validation or this demo.',
    ready: 'Lightweight consultation · No downloads or API charges', loading: 'Finding context in the documents.', completed: 'Your local AI answer is ready. Review its sources too.', cancelled: 'Query cancelled. You can try again.', cleared: 'Question and answer cleared from the screen.', invalid: 'Write a question between 8 and 600 characters long.',
    extractsTitle: 'What the documents say.', extractsReady: 'Verbatim passages · Lightweight consultation on your device', lightMode: 'Lightweight consultation', aiMode: 'AI on your device',
    modelFallback: 'AI could not complete an answer. These are the retrieved passages, without model-written text.',
    extractsCaveat: 'These are verbatim passages, not an AI-generated answer. Open the sources to read the complete context.',
    failed: 'The query could not be completed. Your question is still here so you can try again.',
    timeout: 'The response took too long. You can try again.',
    invalid_sources: 'The answer did not pass the source checks. It will not be shown as valid; you can rephrase your question.',
    noJS: 'Interactive consultation requires JavaScript. You can still read the library and the case study.',
    limitsTitle: 'An experiment with clear boundaries.', limits: ['Closed library: no internet search or private files.', 'Lightweight consultation from the start; optional downloadable AI.', 'No automatic actions, API charges or query history.', 'Local AI can make mistakes: review its sources and interpretation.'],
    model: {
      label: 'Optional AI', title: 'One step further, on your device.', description: 'Generate answers with Qwen3.5 without sending your question to an AI service. Lightweight consultation remains available.',
      download: 'Enable AI on my device', size: 'Approximate download: 450 MB. Requires WebGPU and around 1.6 GB of GPU memory. It can take time and use mobile data.',
      checking: 'Checking compatibility…', loading: 'Downloading and preparing the model…', ready: 'Local AI is ready. Your next queries will use the model.', generating: 'Local AI is preparing a short answer…',
      unsupported: 'This browser cannot run this model. You can still consult passages and sources.', failed: 'Local AI could not continue. Lightweight consultation remains available; you can try again.',
      cancel: 'Cancel download', stop: 'Disable AI', stopped: 'Model disabled. Lightweight consultation remains available.', clear: 'Delete download', cleared: 'The model files stored by this demo were deleted.', clearFailed: 'Some files could not be deleted. You can manage storage in your browser settings.', progress: 'Model preparation progress',
      cache: 'Downloads only when you enable it. The browser may keep files for future visits; conversations are not stored.', source: 'About the model', retry: 'Try again'
    },
    document: 'Document', sections: 'sections', original: 'Original Alejandro’sTech content', source: 'Read original document', version: 'Library updated on 7 November 2026'
  }
};
