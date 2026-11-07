// Keep ES/EN keys aligned: the structural check compares their schema deeply.
// Theme action labels describe the next state rather than the active theme.
export const locales = {
  es: {
    path: '/', title: 'Sergio Hernández · Software e IA aplicada | Alejandro’sTech',
    description: 'Desarrollo de software e integración de IA con .NET, Power Platform y React. Conoce la trayectoria, proyectos y notas técnicas de Sergio Hernández.',
    skip: 'Ir al contenido', languages: 'Idioma', themeLight: 'Cambiar a tema claro', themeDark: 'Cambiar a tema oscuro', menu: 'Abrir navegación', closeMenu: 'Cerrar navegación', navLabel: 'Navegación principal',
    nav: [{ id: 'sobre-mi', label: 'Sobre mí' }, { id: 'tecnologias', label: 'Tecnologías' }, { id: 'trayectoria', label: 'Trayectoria' }, { id: 'proyectos', label: 'Proyectos' }, { id: 'conocimiento', label: 'Notas' }],
    contactNav: 'Hablemos', cv: 'Ver mi CV', visit: 'Visitar la web', source: 'Ver código', readCase: 'Explorar el proyecto', readNote: 'Leer la nota', backHome: 'Volver al inicio', backProjects: 'Todos los proyectos', backNotes: 'Todas las notas', related: 'Sigue explorando', rights: 'Todos los derechos reservados.',
    hero: {
      "eyebrow": "Alejandro’sTech · Perfil profesional",
      "kicker": "Analista y desarrollador de software",
      "portrait": "Retrato de Sergio Hernández",
      "statement": "IA aplicada al software.",
      "intro": "Integro IA en aplicaciones y procesos con .NET, Power Platform y React. Del análisis a la integración.",
      "primary": "Explora mi trabajo",
      "workDetail": "Proyectos y decisiones",
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
        "Modelos de lenguaje vía API, con revisión técnica.",
        "APIs y sistemas conectados dentro de una solución."
      ],
      "actionsLabel": "CV y contacto"
    },
    about: {"label":"La persona detrás del código","title":["Mucho más que","una línea de código."],"intro":"Soy Sergio Alejandro Hernández Patiño. Desarrollo software con .NET, Power Platform y React, e integro IA en aplicaciones y automatizaciones.","paragraphs":["Mi recorrido une Colombia y España: del backend y las interfaces en CODESA al desarrollo con .NET y Power Platform en Intelecto. Después asumí dirección de desarrollo en Auto Control Empresarial y trabajé con Microsoft 365 e integraciones en DynamizaTIC. El hilo común es entender el proceso y acompañar la solución hasta su uso.","Mi enfoque parte del proceso y conecta interfaz, datos y sistemas. En IA, integro modelos de lenguaje mediante APIs y reviso sus resultados en el contexto de la aplicación. Aquí reúno mi trayectoria, proyectos públicos y notas técnicas."],"profileRole":".NET & Power Platform Developer","cardTitle":"Aplicaciones, procesos e IA.","cardText":"Desarrollo full stack e integración de IA, con atención al contexto del proceso y a la revisión de los resultados.","cardDetails":["Análisis y diseño","Desarrollo e integración","Pruebas y evolución"],"facts":[{"value":"2020","label":"Inicio de mi trayectoria profesional"},{"value":"Full stack","label":"Del frontend a las integraciones"},{"value":"ES / EN","label":"Español nativo · Inglés B1"}]},
    skills: { label: 'Tecnologías y conocimientos', title: ['Las piezas con las', 'que construyo.'], intro: 'Explora las herramientas que conectan aplicaciones, automatización e IA, y el contexto en el que las utilizo.', all: 'Todas', filterLabel: 'Filtrar tecnologías por área', explorerLabel: 'Explorador de tecnologías', use: 'En mi trabajo', selected: 'Tecnología seleccionada', groups: { backend: 'Backend y datos', frontend: 'Frontend', power: 'Power Platform', integration: 'Integración e IA', tools: 'Herramientas' }, related: 'Contexto profesional', fallback: 'Tecnologías y aplicaciones' },
    career: { label: 'Trayectoria', title: ['Experiencia que', 'conecta etapas.'], intro: 'Desarrollo, consultoría y liderazgo técnico. Un recorrido por las responsabilidades y tecnologías que han dado forma a mi perfil.', educationLabel: 'Formación', educationTitle: 'Análisis y Desarrollo de Sistemas de Información', educationDegree: 'Tecnólogo · ADSI', educationSchool: 'Servicio Nacional de Aprendizaje · SENA', educationDate: '2019 — 2021', cvLink: 'La trayectoria completa, en mi CV' },
    projects: { label: 'Trabajo seleccionado', title: ['Ideas que ya', 'tienen forma.'], intro: 'Dos laboratorios propios de IA e integración y dos proyectos web públicos. Explora las decisiones, el funcionamiento y mi aportación en cada caso.', problem: 'El punto de partida', approach: 'Cómo lo construí', result: 'El resultado', stack: 'Tecnologías', scope: 'Mi aportación', imageCaption: 'Portada actual de Alejandro’sTech · captura real en español', cvCaption: 'Currículum profesional · captura real en español', overview: 'Ficha del proyecto' },
    notes: { label: 'Cuaderno técnico', title: ['Construir. Aprender.', 'Compartir.'], intro: 'IA aplicada, integración e interfaces: notas sobre el contexto, las decisiones y la revisión de resultados en el desarrollo de software.', type: 'Nota de desarrollo', by: 'Por Sergio Hernández', contents: 'En esta nota', takeaway: 'Para llevar a la práctica', references: 'Para profundizar' },
    process: { label: 'Cómo trabajo', title: 'Una visión del ciclo completo.', steps: [{ title: 'Entender', text: 'Requerimientos, contexto y procesos antes de elegir una herramienta.' }, { title: 'Diseñar', text: 'Una solución que conecte experiencia de usuario, datos y sistemas.' }, { title: 'Construir', text: 'Desarrollo e integración, con pruebas durante la implementación.' }, { title: 'Evolucionar', text: 'Puesta en producción, documentación y mejora del software.' }] },
    contact: { label: 'Sigamos la conversación', title: ['¿Lo construimos', 'juntos?'], intro: 'Para hablar de software e IA aplicada, compartir un proyecto o conversar sobre una oportunidad profesional.', copy: 'Copiar correo', copied: 'Correo copiado', copyFail: 'Selecciona y copia la dirección de correo', subject: 'Hablemos desde Alejandro’sTech', footer: 'Software, automatización e IA aplicada.' },
    notFoundHeading: 'Esta página no está aquí.', notFoundText: 'Puedes volver al inicio para explorar mi trayectoria, proyectos y notas de desarrollo.'
  },
  en: {
    path: '/en/', title: 'Sergio Hernández · Software & applied AI | Alejandro’sTech',
    description: 'Software development and AI integration with .NET, Power Platform and React. Explore Sergio Hernández’s experience, projects and technical notes.',
    skip: 'Skip to content', languages: 'Language', themeLight: 'Switch to light theme', themeDark: 'Switch to dark theme', menu: 'Open navigation', closeMenu: 'Close navigation', navLabel: 'Main navigation',
    nav: [{ id: 'sobre-mi', label: 'About' }, { id: 'tecnologias', label: 'Technologies' }, { id: 'trayectoria', label: 'Experience' }, { id: 'proyectos', label: 'Projects' }, { id: 'conocimiento', label: 'Notes' }],
    contactNav: 'Let’s talk', cv: 'Explore my CV', visit: 'Visit website', source: 'View source', readCase: 'Explore the project', readNote: 'Read the note', backHome: 'Back to home', backProjects: 'All projects', backNotes: 'All notes', related: 'Keep exploring', rights: 'All rights reserved.',
    hero: {
      "eyebrow": "Alejandro’sTech · Professional profile",
      "kicker": "Software analyst and developer",
      "portrait": "Portrait of Sergio Hernández",
      "statement": "Applied AI in software.",
      "intro": "I integrate AI into applications and workflows with .NET, Power Platform and React. From analysis to integration.",
      "primary": "Explore my work",
      "workDetail": "Projects and decisions",
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
        "Language models through APIs, with technical review.",
        "APIs and systems connected within a solution."
      ],
      "actionsLabel": "CV and contact"
    },
    about: {"label":"The person behind the code","title":["More than","a line of code."],"intro":"I’m Sergio Alejandro Hernández Patiño. I develop software with .NET, Power Platform and React, and integrate AI into applications and automation.","paragraphs":["My journey connects Colombia and Spain: from backend and interfaces at CODESA to .NET and Power Platform development at Intelecto. I then led development at Auto Control Empresarial and worked with Microsoft 365 and integrations at DynamizaTIC. The common thread is understanding the workflow and supporting the solution through adoption.","My approach starts with the workflow and connects interfaces, data and systems. For AI, I integrate language models through APIs and review their outputs in the application’s context. Here I bring together my experience, public projects and technical notes."],"profileRole":".NET & Power Platform Developer","cardTitle":"Applications, workflows and AI.","cardText":"Full stack development and AI integration, with attention to workflow context and reviewing the results.","cardDetails":["Analysis and design","Development and integration","Testing and evolution"],"facts":[{"value":"2020","label":"The start of my professional journey"},{"value":"Full stack","label":"From frontend to integrations"},{"value":"ES / EN","label":"Native Spanish · B1 English"}]},
    skills: { label: 'Technologies and knowledge', title: ['The pieces', 'I build with.'], intro: 'Explore the tools that connect applications, automation and AI, and the context in which I use them.', all: 'All', filterLabel: 'Filter technologies by area', explorerLabel: 'Technology explorer', use: 'In my work', selected: 'Selected technology', groups: { backend: 'Backend & data', frontend: 'Frontend', power: 'Power Platform', integration: 'Integration & AI', tools: 'Tools' }, related: 'Professional context', fallback: 'Technologies and applications' },
    career: { label: 'Professional journey', title: ['Experience that', 'connects chapters.'], intro: 'Development, consulting and technical leadership. A journey through the responsibilities and technologies that have shaped my profile.', educationLabel: 'Education', educationTitle: 'Information Systems Analysis and Development', educationDegree: 'Technology degree · ADSI', educationSchool: 'Servicio Nacional de Aprendizaje · SENA', educationDate: '2019 — 2021', cvLink: 'The full journey, in my CV' },
    projects: { label: 'Selected work', title: ['Ideas with', 'a life of their own.'], intro: 'Two personal AI and integration labs, and two public web projects. Explore the decisions, behaviour and my contribution in each case.', problem: 'The starting point', approach: 'How I built it', result: 'The result', stack: 'Technologies', scope: 'My contribution', imageCaption: 'Current Alejandro’sTech homepage · actual English screenshot', cvCaption: 'Professional résumé · actual English screenshot', overview: 'Project overview' },
    notes: { label: 'Technical notebook', title: ['Build. Learn.', 'Share.'], intro: 'Applied AI, integration and interfaces: notes on context, decisions and reviewing results in software development.', type: 'Development note', by: 'By Sergio Hernández', contents: 'In this note', takeaway: 'Putting it into practice', references: 'Further reading' },
    process: { label: 'How I work', title: 'A view of the complete lifecycle.', steps: [{ title: 'Understand', text: 'Requirements, context and processes before choosing a tool.' }, { title: 'Design', text: 'A solution that connects user experience, data and systems.' }, { title: 'Build', text: 'Development and integration, with testing throughout implementation.' }, { title: 'Evolve', text: 'Production deployment, documentation and software improvements.' }] },
    contact: { label: 'Keep the conversation going', title: ['Shall we build', 'something together?'], intro: 'To talk about software and applied AI, share a project or discuss a professional opportunity.', copy: 'Copy email', copied: 'Email copied', copyFail: 'Select and copy the email address', subject: 'Let’s talk from Alejandro’sTech', footer: 'Software, automation and applied AI.' },
    notFoundHeading: 'This page isn’t here.', notFoundText: 'Head back home to explore my experience, projects and development notes.'
  }
};
