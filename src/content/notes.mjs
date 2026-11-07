// Original technical notes written for this edition of Alejandro’sTech.
// These are explanations, not claims of client projects or measured outcomes.
import { labNotes } from './lab-notes.mjs';

export const notes = [
  ...labNotes,
  {
    id: 'progressive', slug: { es: 'interfaces-que-funcionan-desde-el-html', en: 'interfaces-that-start-with-html' }, category: { es: 'Interfaces', en: 'Interfaces' }, symbol: '</>', date: '2026-11-03', references: [{ title: 'MDN · Progressive enhancement', url: 'https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement' }],
    es: {
      title: 'Una buena interfaz empieza antes de JavaScript.',
      summary: 'Contenido, enlaces y estructura primero. Interactividad después. La mejora progresiva como una decisión de diseño y de desarrollo.',
      intro: 'Una web puede tener animaciones, fondos decorativos y controles interactivos y seguir ofreciendo una lectura útil cuando esas capas no están disponibles. La mejora progresiva consiste en construir esa base antes de añadir efectos.',
      sections: [
        { title: 'Una base que se pueda leer', paragraphs: ['El contenido principal debe existir en el documento que recibe el navegador. Un título, un párrafo y un enlace son útiles por sí mismos: no necesitan esperar a que una función termine de ejecutarse.', 'En Alejandro’sTech, las rutas de idioma, los proyectos, la trayectoria y las notas se generan como HTML. El navegador mejora esa experiencia con filtros, animaciones y controles, pero la información ya está ahí.'] },
        { title: 'Cada control tiene un trabajo', paragraphs: ['Un enlace lleva a otro lugar; un botón ejecuta una acción. Respetar esa diferencia ayuda a que la navegación con teclado, las tecnologías de asistencia y los comportamientos habituales del navegador funcionen de forma predecible.', 'La interacción también necesita una respuesta perceptible: qué tecnología está seleccionada, si una animación está pausada o si se ha copiado una dirección. Ese estado forma parte de la interfaz.'] },
        { title: 'El movimiento es una capa', paragraphs: ['La animación puede explicar una relación o dar carácter a una identidad. También debe poder detenerse. Una preferencia de movimiento reducido, una pestaña oculta o un efecto fuera de pantalla son situaciones que conviene tratar de forma explícita.', 'El retrato del inicio es una imagen HTML. El humo y la rejilla del loader son capas decorativas que se pueden detener; la información y los enlaces siguen disponibles sin depender de ellas.'] },
        { title: 'Probar la base y las mejoras', paragraphs: ['Conviene revisar la página con y sin sus mejoras: lectura en pantallas estrechas, foco visible, navegación por teclado, destinos de los enlaces y comportamiento cuando un recurso no está disponible.', 'La pregunta útil es concreta: ¿puede una persona encontrar lo que necesita y realizar la siguiente acción? Los efectos visuales deben acompañar esa respuesta.'] }
      ], takeaway: 'Empieza por una experiencia completa de lectura y navegación. Añade interacción allí donde aporte una función o una forma de explorar el contenido.'
    },
    en: {
      title: 'A good interface starts before JavaScript.',
      summary: 'Content, links and structure first. Interactivity next. Progressive enhancement as a design and development decision.',
      intro: 'A website can include animation, decorative backgrounds and interactive controls while still being useful when those layers are unavailable. Progressive enhancement means building that foundation before adding effects.',
      sections: [
        { title: 'A foundation people can read', paragraphs: ['The main content should exist in the document delivered to the browser. A heading, paragraph and link are useful on their own: they do not need to wait for a function to finish running.', 'On Alejandro’sTech, language routes, projects, experience and notes are generated as HTML. The browser enhances the experience with filters, animations and controls, but the information is already there.'] },
        { title: 'Every control has a job', paragraphs: ['A link takes you somewhere; a button performs an action. Respecting that difference helps keyboard navigation, assistive technology and familiar browser behaviours work predictably.', 'Interaction also needs perceptible feedback: which technology is selected, whether an animation is paused or whether an address was copied. That state is part of the interface.'] },
        { title: 'Motion is a layer', paragraphs: ['Animation can explain a relationship or give an identity character. It should also be possible to stop it. A reduced-motion preference, a hidden tab or an offscreen effect are situations worth handling explicitly.', 'The home portrait is an HTML image. Smoke and the loader grid are optional decorative layers that can stop; information and links remain available independently of those effects.'] },
        { title: 'Test the foundation and its enhancements', paragraphs: ['Review the page with and without its enhancements: reading on narrow screens, visible focus, keyboard navigation, link destinations and behaviour when a resource is unavailable.', 'A useful question is specific: can someone find what they need and take the next action? Visual effects should support that answer.'] }
      ], takeaway: 'Start with a complete reading and navigation experience. Add interaction where it offers a function or a useful way to explore content.'
    }
  },
  {
    id: 'integration', slug: { es: 'integrar-empieza-por-el-contrato', en: 'integration-starts-with-the-contract' }, category: { es: 'Integración', en: 'Integration' }, symbol: '{ }', date: '2026-11-03', references: [{ title: 'Microsoft · Retry pattern', url: 'https://learn.microsoft.com/en-us/azure/architecture/patterns/retry' }],
    es: {
      title: 'Integrar empieza por el contrato.',
      summary: 'Antes del conector o del endpoint, hay preguntas sobre datos, responsabilidades y fallos que merecen una respuesta.',
      intro: 'Conectar dos sistemas es más que conseguir que una petición responda. La integración necesita un acuerdo sobre qué significa la información, quién puede solicitarla y qué ocurre cuando el intercambio falla.',
      sections: [
        { title: 'Entender la operación de negocio', paragraphs: ['El punto de partida es describir el proceso: qué lo inicia, qué sistema es responsable del dato y qué necesita la persona que lo utiliza. Una integración útil conserva ese significado de principio a fin.', 'Una aplicación de Power Apps, un flujo de Power Automate y una API .NET pueden participar en el mismo proceso. La elección de las piezas depende de sus responsabilidades y de las restricciones del entorno.'] },
        { title: 'Hacer explícito el intercambio', paragraphs: ['El contrato describe campos, tipos, identificadores, valores opcionales y respuestas esperadas. También debe aclarar cómo se representan las fechas y cómo se comunican los errores.', 'Conviene distinguir un fallo de validación de una operación que no se puede completar en ese momento. Esa diferencia permite que una interfaz o una automatización responda de forma coherente.'] },
        { title: 'Diseñar también el camino de error', paragraphs: ['Un servicio puede estar temporalmente inaccesible y una solicitud puede repetirse. Antes de añadir reintentos, hay que entender si repetir la operación podría crear un duplicado o ejecutar una acción dos veces.', 'Un identificador de operación y un registro con contexto ayudan a seguir el intercambio entre sistemas. Las credenciales y los datos que no necesita ese registro deben permanecer fuera de él.'] },
        { title: 'Probar el proceso completo', paragraphs: ['Además de una respuesta correcta, revisa entradas incompletas, falta de permisos, respuestas inesperadas y fallos del servicio externo. La prueba debe cubrir cómo continúa el proceso y qué información recibe el usuario.', 'Documentar el contrato y las decisiones de error facilita la evolución de la integración cuando uno de los sistemas cambia.'] }
      ], takeaway: 'Define el significado de los datos, los permisos y el comportamiento ante fallos antes de dar por terminada una conexión entre sistemas.'
    },
    en: {
      title: 'Integration starts with the contract.',
      summary: 'Before the connector or endpoint, questions about data, responsibilities and failures deserve an answer.',
      intro: 'Connecting two systems means more than getting a request to respond. An integration needs an agreement about what the information means, who may request it and what happens when the exchange fails.',
      sections: [
        { title: 'Understand the business operation', paragraphs: ['Start by describing the process: what triggers it, which system owns the data and what the person using it needs. A useful integration preserves that meaning from beginning to end.', 'A Power Apps application, Power Automate flow and .NET API can take part in the same process. The choice of components depends on their responsibilities and the constraints of the environment.'] },
        { title: 'Make the exchange explicit', paragraphs: ['The contract describes fields, types, identifiers, optional values and expected responses. It should also clarify how dates are represented and how errors are communicated.', 'Distinguish a validation failure from an operation that cannot be completed at that moment. That difference lets an interface or automation respond coherently.'] },
        { title: 'Design the error path too', paragraphs: ['A service can become temporarily unavailable and a request can be repeated. Before adding retries, understand whether repeating the operation might create a duplicate or perform an action twice.', 'An operation identifier and contextual logging help trace the exchange across systems. Credentials and data that the log does not need should stay out of it.'] },
        { title: 'Test the complete process', paragraphs: ['Beyond a successful response, review incomplete inputs, missing permissions, unexpected responses and external service failures. Test how the process continues and what the user is told.', 'Documenting the contract and error-handling decisions makes the integration easier to evolve when one of the systems changes.'] }
      ], takeaway: 'Define the meaning of the data, permissions and failure behaviour before considering a connection between systems complete.'
    }
  },
  {
    id: 'ai', slug: { es: 'ia-con-contexto-y-revision', en: 'ai-with-context-and-review' }, category: { es: 'IA aplicada', en: 'Applied AI' }, symbol: 'Ai', date: '2026-11-03', references: [{ title: 'OWASP · Prompt injection', url: 'https://genai.owasp.org/llmrisk/llm01-prompt-injection/' }],
    es: {
      title: 'La IA necesita contexto. Y límites.',
      summary: 'Una integración de IA útil combina una tarea concreta, información pertinente y una forma de revisar el resultado.',
      intro: 'Integrar un modelo de lenguaje en una aplicación requiere pensar en el proceso que lo rodea. La respuesta del modelo es una pieza de la solución; la aplicación sigue siendo responsable de cómo se utiliza.',
      sections: [
        { title: 'Empezar por una tarea concreta', paragraphs: ['Resumir un texto, clasificar una solicitud o proponer un borrador son tareas diferentes. Describir qué entrada recibe la función y qué salida necesita el proceso ayuda a decidir si un modelo aporta valor.', 'También conviene establecer cuándo la aplicación debe pedir más información o devolver el trabajo a una persona, en lugar de continuar con una respuesta insuficiente.'] },
        { title: 'Dar contexto con intención', paragraphs: ['El contexto debe ser pertinente para la tarea y estar autorizado para ese uso. La información externa que procesa un modelo se trata como contenido, no como una fuente de permisos ni de nuevas instrucciones para la aplicación.', 'Los secretos de una integración pertenecen al lado del servidor y a su configuración protegida. El navegador no necesita recibir una credencial para mostrar el resultado de una operación.'] },
        { title: 'Validar antes de actuar', paragraphs: ['Si la aplicación espera una estructura determinada, debe validar esa estructura y sus valores antes de utilizarlos. Una frase convincente no garantiza que una respuesta sea correcta o adecuada para ejecutar una acción.', 'Las operaciones que cambian datos o afectan a otras personas necesitan controles de autorización en la aplicación y, cuando corresponda, revisión humana. El modelo no sustituye esas decisiones.'] },
        { title: 'Evaluar con ejemplos del proceso', paragraphs: ['Una evaluación útil incluye entradas habituales, casos ambiguos y situaciones donde falta información. Comprueba tanto la calidad de la respuesta como la capacidad del sistema para reconocer que necesita ayuda.', 'Conservar ejemplos de prueba permite revisar la integración cuando cambian las instrucciones, el contexto o el modelo. El objetivo es mejorar el comportamiento de la solución completa.'] }
      ], takeaway: 'Una tarea acotada, contexto autorizado, validación y revisión hacen que la IA encaje dentro de un proceso de software con responsabilidades claras.'
    },
    en: {
      title: 'AI needs context. And boundaries.',
      summary: 'A useful AI integration combines a specific task, relevant information and a way to review the result.',
      intro: 'Integrating a language model into an application means thinking about the process around it. The model’s response is one part of the solution; the application remains responsible for how it is used.',
      sections: [
        { title: 'Start with a specific task', paragraphs: ['Summarising text, classifying a request and proposing a draft are different tasks. Describing the input a function receives and the output the process needs helps determine whether a model adds value.', 'Also establish when the application should request more information or return the work to a person instead of continuing with an inadequate response.'] },
        { title: 'Provide context deliberately', paragraphs: ['Context should be relevant to the task and authorised for that use. External information processed by a model is content, not a source of permissions or new instructions for the application.', 'Integration secrets belong on the server and in its protected configuration. The browser does not need a credential to display the result of an operation.'] },
        { title: 'Validate before acting', paragraphs: ['If the application expects a particular structure, it must validate that structure and its values before using them. Convincing wording does not guarantee that a response is correct or suitable for taking action.', 'Operations that change data or affect other people need authorisation controls in the application and, where appropriate, human review. The model does not replace those decisions.'] },
        { title: 'Evaluate with examples from the process', paragraphs: ['A useful evaluation includes typical inputs, ambiguous cases and situations with missing information. Check both response quality and the system’s ability to recognise when help is needed.', 'Keeping test examples makes it possible to review the integration when instructions, context or the model change. The goal is to improve the behaviour of the complete solution.'] }
      ], takeaway: 'A bounded task, authorised context, validation and review help AI fit into a software process with clear responsibilities.'
    }
  }
];
export const notePath = (note, lang) => `${lang === 'en' ? '/en/notes/' : '/notas/'}${note.slug[lang]}/`;
