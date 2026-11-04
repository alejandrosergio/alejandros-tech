// Keep ES/EN keys aligned: the structural check compares their schema deeply.
// Theme action labels describe the next state rather than the active theme.
export const locales = {
  es: {
    path: '/', title: 'Sergio Hernández · Software, automatización e IA | Alejandro’sTech',
    description: 'El universo profesional de Sergio Hernández: desarrollo .NET y React, Power Platform, automatización e integración de IA. Trayectoria, proyectos y notas técnicas.',
    skip: 'Ir al contenido', languages: 'Idioma', themeLight: 'Cambiar a tema claro', themeDark: 'Cambiar a tema oscuro', menu: 'Abrir navegación', closeMenu: 'Cerrar navegación', navLabel: 'Navegación principal',
    nav: [{ id: 'sobre-mi', label: 'Sobre mí' }, { id: 'tecnologias', label: 'Tecnologías' }, { id: 'trayectoria', label: 'Trayectoria' }, { id: 'proyectos', label: 'Proyectos' }, { id: 'conocimiento', label: 'Notas' }],
    contactNav: 'Hablemos', cv: 'Ver mi CV', visit: 'Visitar la web', source: 'Ver código', readCase: 'Explorar el proyecto', readNote: 'Leer la nota', backHome: 'Volver al inicio', backProjects: 'Todos los proyectos', backNotes: 'Todas las notas', related: 'Sigue explorando', rights: 'Todos los derechos reservados.', top: 'Volver arriba',
    hero: {
      "eyebrow": "Alejandro’sTech · Perfil profesional",
      "kicker": "Analista y desarrollador de software",
      "portrait": "Retrato de Sergio Hernández",
      "statement": "Software que conecta.",
      "intro": "Desarrollo full stack, automatización e integración de IA. Ideas que se convierten en soluciones.",
      "primary": "Explora mi trabajo",
      "workDetail": "Proyectos y decisiones",
      "secondary": "La persona detrás del código",
      "scroll": "Descubre mi mundo",
      "location": "Cali, Colombia",
      "cvLabel": "Mi CV",
      "contactLabel": "Contacto",
      "stack": ".NET · Power Platform · React · IA",
      "socialsLabel": "Redes y contacto",
      "disciplinesLabel": "Áreas de trabajo",
      "disciplines": [
        "Desarrollo de software",
        "Automatización",
        "IA aplicada",
        "Integraciones"
      ],
      "tagline": "Conectar ideas. Construir soluciones.",
      "go": "VER",
      "quickNav": "Explorar las secciones",
      "disciplineDescriptions": [
        ".NET y React, del frontend a las integraciones.",
        "Power Platform para aplicaciones y procesos.",
        "IA conectada a aplicaciones, con revisión técnica.",
        "APIs y sistemas conectados dentro de una solución."
      ],
      "actionsLabel": "CV y contacto"
    },
    about: {"label":"La persona detrás del código","title":["Mucho más que","una línea de código."],"intro":"Soy Sergio Alejandro Hernández Patiño, desarrollador .NET y Power Platform, con enfoque full stack, automatización e integración de IA.","paragraphs":["Mi recorrido profesional une Colombia y España. He trabajado en desarrollo de software, consultoría y dirección de desarrollo, participando desde el análisis de una necesidad hasta la puesta en producción y la evolución de la solución.","Me interesa cómo encajan las piezas: la interfaz que utiliza una persona, la lógica que la sostiene y los sistemas que necesitan hablar entre sí. Alejandro’sTech es el lugar donde reúno ese recorrido y lo que construyo."],"profileRole":".NET & Power Platform Developer","cardTitle":"De la necesidad a la solución.","cardText":"Desarrollo full stack, integración de sistemas y automatización, con una visión del ciclo completo del software.","cardDetails":["Análisis y diseño","Desarrollo e integración","Pruebas y evolución"],"facts":[{"value":"2020","label":"Inicio de mi trayectoria profesional"},{"value":"Full stack","label":"Del frontend a las integraciones"},{"value":"ES / EN","label":"Español nativo · Inglés B1"}]},
    skills: { label: 'Tecnologías y conocimientos', title: ['Las piezas con las', 'que construyo.'], intro: 'Un mapa de mi trabajo técnico. Explora cada área para conocer cómo utilizo sus herramientas.', all: 'Todas', filterLabel: 'Filtrar tecnologías por área', explorerLabel: 'Explorador de tecnologías', use: 'En mi trabajo', selected: 'Tecnología seleccionada', groups: { backend: 'Backend y datos', frontend: 'Frontend', power: 'Power Platform', integration: 'Integración e IA', tools: 'Herramientas' }, related: 'Contexto profesional', fallback: 'Tecnologías y aplicaciones' },
    career: { label: 'Trayectoria', title: ['Experiencia que', 'conecta etapas.'], intro: 'Desarrollo, consultoría y liderazgo técnico. Un recorrido por las responsabilidades y tecnologías que han dado forma a mi perfil.', educationLabel: 'Formación', educationTitle: 'Análisis y Desarrollo de Sistemas de Información', educationDegree: 'Tecnólogo · ADSI', educationSchool: 'Servicio Nacional de Aprendizaje · SENA', educationDate: '2019 — 2021', cvLink: 'La trayectoria completa, en mi CV' },
    projects: { label: 'Trabajo seleccionado', title: ['Ideas que ya', 'tienen forma.'], intro: 'Dos proyectos públicos que forman parte de mi identidad digital. Del planteamiento a una experiencia real en el navegador.', problem: 'El punto de partida', approach: 'Cómo lo construí', result: 'El resultado', stack: 'Tecnologías', scope: 'Mi aportación', imageCaption: 'Primera portada de Alejandro’sTech · versión publicada en 2026', cvCaption: 'Vista real del currículum profesional', overview: 'Ficha del proyecto' },
    notes: { label: 'Cuaderno técnico', title: ['Construir. Aprender.', 'Compartir.'], intro: 'Notas sobre las decisiones que hay detrás del software: interfaces, integraciones e IA aplicada.', type: 'Nota de desarrollo', date: '3 noviembre 2026', by: 'Por Sergio Hernández', contents: 'En esta nota', takeaway: 'Para llevar a la práctica', references: 'Para profundizar' },
    process: { label: 'Cómo trabajo', title: 'Una visión del ciclo completo.', steps: [{ title: 'Entender', text: 'Requerimientos, contexto y procesos antes de elegir una herramienta.' }, { title: 'Diseñar', text: 'Una solución que conecte experiencia de usuario, datos y sistemas.' }, { title: 'Construir', text: 'Desarrollo e integración, con pruebas durante la implementación.' }, { title: 'Evolucionar', text: 'Puesta en producción, documentación y mejora del software.' }] },
    contact: { label: 'Sigamos la conversación', title: ['¿Lo construimos', 'juntos?'], intro: 'Para hablar de software, compartir una idea o conversar sobre una oportunidad profesional.', copy: 'Copiar correo', copied: 'Correo copiado', copyFail: 'Selecciona y copia la dirección de correo', subject: 'Hablemos desde Alejandro’sTech', footer: 'Software, automatización e IA aplicada.' },
    notFoundHeading: 'Esta página no está aquí.', notFoundText: 'Puedes volver al inicio para explorar mi trayectoria, proyectos y notas de desarrollo.'
  },
  en: {
    path: '/en/', title: 'Sergio Hernández · Software, automation & AI | Alejandro’sTech',
    description: 'Sergio Hernández’s professional world: .NET and React development, Power Platform, automation and AI integration. Experience, projects and technical notes.',
    skip: 'Skip to content', languages: 'Language', themeLight: 'Switch to light theme', themeDark: 'Switch to dark theme', menu: 'Open navigation', closeMenu: 'Close navigation', navLabel: 'Main navigation',
    nav: [{ id: 'sobre-mi', label: 'About' }, { id: 'tecnologias', label: 'Technologies' }, { id: 'trayectoria', label: 'Experience' }, { id: 'proyectos', label: 'Projects' }, { id: 'conocimiento', label: 'Notes' }],
    contactNav: 'Let’s talk', cv: 'Explore my CV', visit: 'Visit website', source: 'View source', readCase: 'Explore the project', readNote: 'Read the note', backHome: 'Back to home', backProjects: 'All projects', backNotes: 'All notes', related: 'Keep exploring', rights: 'All rights reserved.', top: 'Back to top',
    hero: {
      "eyebrow": "Alejandro’sTech · Professional profile",
      "kicker": "Software analyst and developer",
      "portrait": "Portrait of Sergio Hernández",
      "statement": "Software that connects.",
      "intro": "Full stack development, automation and AI integration. Turning ideas into useful software.",
      "primary": "Explore my work",
      "workDetail": "Projects and decisions",
      "secondary": "The person behind the code",
      "scroll": "Discover my world",
      "location": "Cali, Colombia",
      "cvLabel": "My CV",
      "contactLabel": "Contact",
      "stack": ".NET · Power Platform · React · AI",
      "socialsLabel": "Social links and contact",
      "disciplinesLabel": "Areas of work",
      "disciplines": [
        "Software development",
        "Automation",
        "Applied AI",
        "Integrations"
      ],
      "tagline": "Connect ideas. Build solutions.",
      "go": "GO",
      "quickNav": "Explore the sections",
      "disciplineDescriptions": [
        ".NET and React, from frontend to integrations.",
        "Power Platform for applications and processes.",
        "AI connected to applications, with technical review.",
        "APIs and systems connected within a solution."
      ],
      "actionsLabel": "CV and contact"
    },
    about: {"label":"The person behind the code","title":["More than","a line of code."],"intro":"I’m Sergio Alejandro Hernández Patiño, a .NET and Power Platform developer focused on full stack development, automation and AI integration.","paragraphs":["My professional journey connects Colombia and Spain. I have worked in software development, consulting and development leadership, contributing from understanding a need through production deployment and the evolution of the solution.","I’m interested in how the pieces fit together: the interface someone uses, the logic behind it and the systems that need to talk to each other. Alejandro’sTech is where I bring together that journey and the things I build."],"profileRole":".NET & Power Platform Developer","cardTitle":"From a need to a solution.","cardText":"Full stack development, system integration and automation, with a view of the complete software lifecycle.","cardDetails":["Analysis and design","Development and integration","Testing and evolution"],"facts":[{"value":"2020","label":"The start of my professional journey"},{"value":"Full stack","label":"From frontend to integrations"},{"value":"ES / EN","label":"Native Spanish · B1 English"}]},
    skills: { label: 'Technologies and knowledge', title: ['The pieces', 'I build with.'], intro: 'A map of my technical work. Explore each area to see how I use its tools.', all: 'All', filterLabel: 'Filter technologies by area', explorerLabel: 'Technology explorer', use: 'In my work', selected: 'Selected technology', groups: { backend: 'Backend & data', frontend: 'Frontend', power: 'Power Platform', integration: 'Integration & AI', tools: 'Tools' }, related: 'Professional context', fallback: 'Technologies and applications' },
    career: { label: 'Professional journey', title: ['Experience that', 'connects chapters.'], intro: 'Development, consulting and technical leadership. A journey through the responsibilities and technologies that have shaped my profile.', educationLabel: 'Education', educationTitle: 'Information Systems Analysis and Development', educationDegree: 'Technology degree · ADSI', educationSchool: 'Servicio Nacional de Aprendizaje · SENA', educationDate: '2019 — 2021', cvLink: 'The full journey, in my CV' },
    projects: { label: 'Selected work', title: ['Ideas with', 'a life of their own.'], intro: 'Two public projects that form part of my digital identity. From the initial idea to a real experience in the browser.', problem: 'The starting point', approach: 'How I built it', result: 'The result', stack: 'Technologies', scope: 'My contribution', imageCaption: 'The first Alejandro’sTech homepage · published version, 2026', cvCaption: 'An actual view of the professional résumé', overview: 'Project overview' },
    notes: { label: 'Technical notebook', title: ['Build. Learn.', 'Share.'], intro: 'Notes on the decisions behind software: interfaces, integrations and applied AI.', type: 'Development note', date: '3 November 2026', by: 'By Sergio Hernández', contents: 'In this note', takeaway: 'Putting it into practice', references: 'Further reading' },
    process: { label: 'How I work', title: 'A view of the complete lifecycle.', steps: [{ title: 'Understand', text: 'Requirements, context and processes before choosing a tool.' }, { title: 'Design', text: 'A solution that connects user experience, data and systems.' }, { title: 'Build', text: 'Development and integration, with testing throughout implementation.' }, { title: 'Evolve', text: 'Production deployment, documentation and software improvements.' }] },
    contact: { label: 'Keep the conversation going', title: ['Shall we build', 'something together?'], intro: 'To talk about software, share an idea or discuss a professional opportunity.', copy: 'Copy email', copied: 'Email copied', copyFail: 'Select and copy the email address', subject: 'Let’s talk from Alejandro’sTech', footer: 'Software, automation and applied AI.' },
    notFoundHeading: 'This page isn’t here.', notFoundText: 'Head back home to explore my experience, projects and development notes.'
  }
};
