// Owner-supplied, anonymised walkthrough. The video demonstrates the delivery;
// it does not publish the business application or its solution/source files.
export const powerPlatformProject = {
  id: 'power-platform-delivery',
  slug: { es: 'power-platform-de-principio-a-fin', en: 'power-platform-end-to-end' },
  name: 'Power Platform · De principio a fin',
  imageSize: { width: 1280, height: 720 },
  image: { es: '/assets/power-platform-preview.jpg', en: '/assets/power-platform-preview.jpg' },
  video: { src: '/assets/power-platform-delivery.mp4', duration: 178, uploaded: '2026-11-24T22:26:45Z' },
  es: {
    name: 'Power Platform · De principio a fin', type: 'Caso profesional · Recorrido en video',
    imageAlt: 'Captura del video: aplicación Power Apps adaptada a escritorio, tablet y móvil',
    title: 'De la necesidad a una entrega que puede continuar.',
    summary: 'Una aplicación guiada de apoyo comercial con Power Apps, catálogos en SharePoint y preparación automatizada del entorno. Un recorrido por mi trabajo como freelancer: analizar, construir, validar y transferir.',
    problem: 'Convertir documentos, contenido y diseño en una experiencia coherente: seleccionar un sector y un reto, consultar recomendaciones y reutilizar el contexto en plantillas de prompts. El contenido debía poder actualizarse y la solución debía quedar preparada para su instalación y mantenimiento por otro equipo.',
    approach: [
      'Acordar el alcance: contrasto los materiales recibidos, defino criterios de aceptación y reviso el impacto de cada solicitud antes de implementarla.',
      'Conectar experiencia y datos: diseño el recorrido guiado y organizo catálogos, relaciones e imágenes en SharePoint, con modelo y diccionario de datos.',
      'Construir y preparar el entorno: implemento componentes, fórmulas Power Fx y estados de carga en Power Apps. Power Automate crea la estructura y carga el contenido desde Excel, con un destino configurable.',
      'Validar lo que recibe el usuario: compruebo contexto, textos completos, copia, correo y regresiones. Reviso escritorio, tablet y móvil con evidencias del entorno de pruebas.',
      'Transferir el conocimiento: preparo instalación, modelo de datos, diccionario, manual de usuario, administración y ficha de versión, con capturas e instrucciones.',
      'Entregar y evolucionar: alineo solución, contenido y documentación. Ante un ajuste, reviso dependencias, corrijo, pruebo, actualizo los documentos afectados y versiono el cambio con Git.'
    ],
    result: 'El video muestra una entrega organizada en solución, contenidos y documentación, junto con un ejemplo de corrección y nueva versión. Mi objetivo es que el equipo que la recibe pueda entenderla, instalarla y seguir evolucionándola.',
    contribution: 'Gestión y desarrollo end to end como freelancer: alcance, experiencia, datos, implementación, pruebas, documentación y preparación de la entrega.',
    demoLabel: 'Ver el recorrido'
  },
  en: {
    name: 'Power Platform · End to end', type: 'Professional case · Video walkthrough',
    imageAlt: 'Video frame: Power Apps application adapted to desktop, tablet and mobile',
    title: 'From a business need to a handover that lasts.',
    summary: 'A guided sales-support application with Power Apps, SharePoint catalogues and automated environment setup. A walkthrough of my freelance delivery process: analyse, build, validate and hand over.',
    problem: 'Turn documents, content and design into a coherent experience: select a sector and a challenge, explore recommendations and reuse the context in prompt templates. Content needed to remain editable, and another team needed to be able to install and maintain the solution.',
    approach: [
      'Agree the scope: cross-check the supplied materials, define acceptance criteria and assess the impact of each request before implementation.',
      'Connect experience and data: design the guided journey and organise SharePoint catalogues, relationships and images, with a data model and dictionary.',
      'Build and prepare the environment: implement Power Apps components, Power Fx formulas and loading states. Power Automate creates the structure and loads Excel content into a configurable destination.',
      'Validate what the user receives: check context, complete text, copying, email and regressions. Review desktop, tablet and mobile with evidence from the test environment.',
      'Transfer knowledge: prepare installation, data model, dictionary, user manual, administration and version record documents, with screenshots and instructions.',
      'Deliver and evolve: align the solution, content and documentation. For a change, review dependencies, fix, test, update affected documents and version the work with Git.'
    ],
    result: 'The video shows a handover organised into solution, content and documentation, including a correction followed by a new version. My aim is for the receiving team to understand, install and continue evolving the application.',
    contribution: 'End-to-end freelance management and development: scope, experience, data, implementation, testing, documentation and handover preparation.',
    demoLabel: 'Watch the walkthrough'
  }
};

export const projectVideoCopy = {
  es: {
    title: 'El proyecto en acción', duration: '2:58 min',
    description: 'Capturas anonimizadas y esquemas simplificados. Narración sintética y textos en español; subtítulos ES/EN disponibles en los controles del video.',
    transcript: 'Leer la transcripción', fallback: 'Tu navegador no puede reproducir este video.',
    download: 'Abrir el video MP4', captions: 'Español', subtitles: 'English'
  },
  en: {
    title: 'The project in action', duration: '2:58 min',
    description: 'Anonymised screenshots and simplified diagrams. Synthetic Spanish narration and Spanish on-screen text; ES/EN subtitles are available in the video controls.',
    transcript: 'Read the transcript', fallback: 'Your browser cannot play this video.',
    download: 'Open the MP4 video', captions: 'Español', subtitles: 'English'
  }
};

// Speech corrected against the supplied edit. Phrase boundaries keep captions
// short; the transcript also describes the silent product/library sequence.
export const videoTranscript = [
  { start: 0, end: 10,
    es: ['Así convierto una necesidad de negocio en una solución de Power Platform:', 'desde los requisitos hasta una aplicación que se puede probar, instalar y mantener.'],
    en: ['This is how I turn a business need into a Power Platform solution:', 'from requirements to an application that can be tested, installed and maintained.'] },
  { start: 10, end: 23,
    es: ['Empiezo contrastando los documentos, el contenido y el diseño recibido.', 'Convierto cada solicitud en un alcance claro, criterios de aceptación y una revisión de sus impactos.'],
    en: ['I start by cross-checking the documents, content and design supplied.', 'I turn each request into a clear scope, acceptance criteria and an assessment of its impact.'] },
  { start: 23, end: 35,
    es: ['Después conecto las decisiones del usuario en un recorrido guiado.', 'Cada elección alimenta la siguiente pantalla y el resultado final, con una navegación coherente y adaptable.'],
    en: ['Next, I connect the user’s decisions in a guided journey.', 'Each choice feeds the next screen and final result, with coherent, responsive navigation.'] },
  { start: 36, end: 50,
    es: ['Organizo el contenido en SharePoint: catálogos, relaciones, recomendaciones e imágenes.', 'El modelo y el diccionario de datos permiten entender qué guarda cada campo y cómo se utiliza.'],
    en: ['I organise the content in SharePoint: catalogues, relationships, recommendations and images.', 'The data model and dictionary explain what each field stores and how it is used.'] },
  { start: 50, end: 63,
    es: ['Con Power Automate preparo la estructura y la carga inicial desde Excel.', 'Las conexiones y variables de entorno hacen configurable el destino, sin depender de un sitio de desarrollo.'],
    en: ['With Power Automate, I prepare the structure and initial Excel data load.', 'Connections and environment variables make the destination configurable, independent of a development site.'] },
  { start: 63, end: 75,
    es: ['En Power Apps implemento componentes reutilizables, fórmulas y estados de carga.', 'Reviso espacios, botones, ventanas y comportamientos en escritorio, tablet y móvil.'],
    en: ['In Power Apps, I implement reusable components, formulas and loading states.', 'I review spacing, buttons, windows and behaviour on desktop, tablet and mobile.'] },
  { start: 75, end: 93, visual: true,
    es: ['[En pantalla: una recomendación reúne contexto, argumentos e imágenes del producto. El detalle se amplía en una ventana y la biblioteca permite consultar materiales de apoyo.]'],
    en: ['[On screen: a recommendation brings together context, supporting arguments and product images. A window expands the details, and the library provides reference materials.]'] },
  { start: 93, end: 107,
    es: ['La evolución añade prompts que utilizan el contexto seleccionado.', 'El usuario elige una misión, consulta los textos, los copia o se los envía a su propio correo.'],
    en: ['The next iteration adds prompts that use the selected context.', 'The user chooses a mission, reviews the text, copies it or emails it to themselves.'] },
  { start: 107, end: 122,
    es: ['Valido lo que el usuario recibe: contexto correcto, texto completo, copia y correo.', 'También compruebo regresiones y presentación con evidencia del entorno de pruebas.'],
    en: ['I validate what the user receives: correct context, complete text, copying and email.', 'I also check regressions and presentation with evidence from the test environment.'] },
  { start: 122, end: 137,
    es: ['La entrega incluye seis documentos: instalación, modelo de datos, diccionario,', 'manual de usuario, administración y ficha de versión.', 'Uso capturas e instrucciones para facilitar la transferencia.'],
    en: ['The handover includes six documents: installation, data model, dictionary,', 'user manual, administration and version record.', 'I use screenshots and instructions to support knowledge transfer.'] },
  { start: 137, end: 152,
    es: ['Preparo un paquete con la solución, los contenidos y la documentación alineados.', 'Compruebo versiones, archivos y configuración para que otro equipo pueda seguir el proceso de instalación.'],
    en: ['I prepare a package with the solution, content and documentation aligned.', 'I check versions, files and configuration so another team can follow the installation process.'] },
  { start: 153, end: 163,
    es: ['Cuando aparece un ajuste, reviso dónde repercute, corrijo, pruebo y actualizo los documentos afectados.', 'Después integro el cambio en Git y preparo la nueva entrega.'],
    en: ['When a change is needed, I assess its impact, fix, test and update the affected documents.', 'Then I integrate the change in Git and prepare the next handover.'] },
  { start: 167, end: 175,
    es: ['Mi enfoque conecta análisis, datos, desarrollo, pruebas y documentación.', 'El resultado es una solución trazable, mantenible y preparada para evolucionar.'],
    en: ['My approach connects analysis, data, development, testing and documentation.', 'The result is a traceable, maintainable solution that is ready to evolve.'] }
];

const timestamp = seconds => new Date(Math.round(seconds * 1000)).toISOString().slice(11, 23);
export function videoCaptions(lang) {
  return 'WEBVTT\n\n' + videoTranscript.filter(segment => !segment.visual).flatMap(segment => {
    const phrases = segment[lang];
    return phrases.map((text, index) => {
      const start = segment.start + (segment.end - segment.start) * index / phrases.length;
      const end = segment.start + (segment.end - segment.start) * (index + 1) / phrases.length;
      return `${timestamp(start)} --> ${timestamp(end)} line:75%\n${text}\n`;
    });
  }).join('\n');
}
