import { technologyCatalog, projectTechnologies } from './project-technologies.mjs';

// Every product below is named in the owner's master CV. No years or proficiency
// ratings are inferred. Complementary and historical experience stay explicit.
const cv = (id, name, group, es, en, context = 'cv', mark = id) => ({
  id, name, group, es, en, mark, source: 'cv',
  context: {
    es: context === 'history' ? 'Trayectoria anterior · CODESA' : context === 'additional' ? 'Experiencia complementaria · CV maestro' : 'Competencias documentadas · CV maestro',
    en: context === 'history' ? 'Earlier career · CODESA' : context === 'additional' ? 'Complementary experience · Master résumé' : 'Documented skills · Master résumé'
  }
});
export const cvTechnologies = [
  cv('powerfx', 'Power Fx', 'power', 'Fórmulas y comportamiento de aplicaciones Power Apps.', 'Formulas and application behaviour in Power Apps.'),
  cv('powerpages', 'Power Pages', 'power', 'Portales dentro del ecosistema Microsoft Power Platform.', 'Portals within Microsoft Power Platform.'),
  cv('m365', 'Microsoft 365', 'collaboration', 'Administración de entornos, usuarios, licencias, roles y permisos.', 'Environment, user, licence, role and permission administration.'),
  cv('teams', 'Microsoft Teams', 'collaboration', 'Colaboración, alertas y notificaciones conectadas con procesos.', 'Collaboration, alerts and notifications connected to workflows.'),
  cv('outlook', 'Outlook', 'collaboration', 'Correo y calendario dentro de soluciones Microsoft 365.', 'Email and calendar within Microsoft 365 solutions.'),
  cv('onedrive', 'OneDrive', 'collaboration', 'Archivos y colaboración dentro de Microsoft 365.', 'Files and collaboration within Microsoft 365.'),
  cv('excel', 'Excel', 'collaboration', 'Datos y libros de carga para aplicaciones y automatizaciones.', 'Data and loading workbooks for applications and automation.'),
  cv('planner', 'Microsoft Planner', 'collaboration', 'Organización de tareas y colaboración en Microsoft 365.', 'Task organisation and collaboration in Microsoft 365.'),
  cv('entra', 'Microsoft Entra ID', 'collaboration', 'Identidades, acceso y administración de usuarios.', 'Identity, access and user administration.'),
  cv('defender', 'Microsoft Defender', 'collaboration', 'Administración dentro del entorno de seguridad Microsoft.', 'Administration within the Microsoft security environment.'),
  cv('net-framework', '.NET Framework', 'backend', 'Desarrollo de aplicaciones sobre .NET Framework.', 'Application development on .NET Framework.', 'cv', 'net'),
  cv('aspnet', 'ASP.NET Core / Web API', 'backend', 'Servicios backend y APIs REST dentro del ecosistema .NET.', 'Backend services and REST APIs within .NET.', 'cv', 'net'),
  cv('webforms', 'ASP.NET WebForms', 'backend', 'Aplicaciones web del ecosistema ASP.NET clásico.', 'Web applications in the classic ASP.NET ecosystem.', 'cv', 'net'),
  cv('winforms', 'Windows Forms', 'backend', 'Aplicaciones de escritorio con C# y .NET.', 'Desktop applications with C# and .NET.', 'cv', 'net'),
  cv('linq', 'LINQ', 'backend', 'Consultas integradas en código .NET y acceso a datos.', 'Language-integrated queries and data access in .NET.', 'cv', 'net'),
  cv('dapper', 'Dapper', 'backend', 'Acceso a datos mediante consultas SQL en aplicaciones .NET.', 'SQL-based data access in .NET applications.', 'cv', 'net'),
  cv('java', 'Java', 'backend', 'Servicios backend con Java 17 en mi etapa anterior.', 'Backend services with Java 17 in my earlier career.', 'history'),
  cv('spring', 'Spring Boot', 'backend', 'Servicios Java y arquitectura de microservicios.', 'Java services and microservice architecture.', 'history'),
  cv('python', 'Python', 'backend', 'Experiencia complementaria con Python.', 'Complementary experience with Python.', 'additional'),
  cv('angular', 'Angular', 'frontend', 'Interfaces web desarrolladas en mi trayectoria anterior.', 'Web interfaces developed in my earlier career.', 'history'),
  cv('javascript', 'JavaScript', 'frontend', 'Interfaz y lógica de aplicaciones web.', 'Web application interfaces and logic.'),
  cv('canvas', 'Canvas 2D / HTML5', 'frontend', 'Dibujo y experiencias gráficas en el navegador.', 'Drawing and graphics in the browser.', 'cv', 'web'),
  cv('bootstrap', 'Bootstrap', 'frontend', 'Estilos y componentes para interfaces web adaptables.', 'Styles and components for responsive web interfaces.'),
  cv('reactnative', 'React Native', 'frontend', 'Desarrollo de aplicaciones móviles con React Native.', 'Mobile application development with React Native.', 'cv', 'react'),
  cv('xamarin', 'Xamarin', 'frontend', 'Desarrollo móvil con C# y el ecosistema .NET.', 'Mobile development with C# and .NET.'),
  cv('azuresql', 'Azure SQL', 'data', 'Datos relacionales en servicios de Azure SQL.', 'Relational data in Azure SQL services.'),
  cv('oracle', 'Oracle / PL/SQL', 'data', 'Datos, procedimientos y consultas de mi etapa anterior.', 'Data, procedures and queries from my earlier career.', 'history'),
  cv('mysql', 'MySQL', 'data', 'Consulta y gestión de datos relacionales.', 'Relational data querying and management.'),
  cv('mongodb', 'MongoDB', 'data', 'Datos orientados a documentos.', 'Document-oriented data.'),
  cv('redis', 'Redis', 'data', 'Datos en memoria dentro de soluciones de software.', 'In-memory data within software solutions.'),
  cv('databricks', 'Databricks', 'data', 'Procesamiento y trabajo con datos en Databricks.', 'Data processing and work in Databricks.'),
  cv('grpc', 'gRPC', 'integration', 'Comunicación entre servicios mediante contratos.', 'Contract-based communication between services.'),
  cv('rabbitmq', 'RabbitMQ', 'integration', 'Mensajería e integración entre sistemas.', 'Messaging and system integration.'),
  cv('azurefunctions', 'Azure Functions', 'cloud', 'Funciones para integrar datos y procesos.', 'Functions that integrate data and workflows.'),
  cv('appservice', 'Azure App Service', 'cloud', 'Alojamiento de aplicaciones y servicios.', 'Application and service hosting.'),
  cv('storage', 'Azure Storage', 'cloud', 'Almacenamiento para soluciones de Azure.', 'Storage for Azure solutions.'),
  cv('servicebus', 'Azure Service Bus', 'cloud', 'Mensajería entre componentes y servicios.', 'Messaging between components and services.'),
  cv('aks', 'Azure Kubernetes Service', 'cloud', 'Contenedores en Azure Kubernetes Service (AKS).', 'Containers in Azure Kubernetes Service (AKS).'),
  cv('aws', 'Amazon Web Services', 'cloud', 'Servicios AWS utilizados para integración y almacenamiento.', 'AWS services used for integration and storage.'),
  cv('awslambda', 'AWS Lambda', 'cloud', 'Funciones dentro del ecosistema AWS.', 'Functions within the AWS ecosystem.'),
  cv('amazons3', 'Amazon S3', 'cloud', 'Almacenamiento de objetos en AWS.', 'Object storage in AWS.'),
  cv('applicationinsights', 'Application Insights', 'cloud', 'Monitoreo y diagnóstico de aplicaciones.', 'Application monitoring and diagnostics.'),
  cv('datadog', 'Datadog', 'cloud', 'Observabilidad y diagnóstico de soluciones.', 'Solution observability and diagnostics.'),
  cv('subversion', 'SVN / Subversion', 'tools', 'Control de versiones con Subversion.', 'Version control with Subversion.'),
  cv('jenkins', 'Jenkins', 'tools', 'Automatización de tareas de entrega e integración.', 'Delivery and integration task automation.'),
  cv('docker', 'Docker', 'tools', 'Contenedores para desarrollo y entrega.', 'Containers for development and delivery.'),
  cv('mscopilot', 'Microsoft Copilot', 'ai', 'Uso con revisión técnica humana de sus resultados.', 'Use with human technical review of its output.'),
  cv('githubcopilot', 'GitHub Copilot', 'ai', 'Asistencia al desarrollo con revisión del código.', 'Development assistance with code review.'),
  cv('chatgpt', 'ChatGPT', 'ai', 'Apoyo a tareas de trabajo con revisión humana.', 'Support for work tasks with human review.'),
  cv('claude', 'Claude', 'ai', 'Uso de asistentes de IA con revisión técnica.', 'Use of AI assistants with technical review.'),
  cv('gemini', 'Gemini', 'ai', 'Uso de asistentes de IA con revisión técnica.', 'Use of AI assistants with technical review.'),
  cv('appsheet', 'AppSheet', 'tools', 'Experiencia complementaria con aplicaciones low-code.', 'Complementary experience with low-code applications.', 'additional'),
  cv('outsystems', 'OutSystems', 'tools', 'Experiencia complementaria con la plataforma low-code.', 'Complementary experience with the low-code platform.', 'additional'),
  cv('mendix', 'Mendix', 'tools', 'Experiencia complementaria con la plataforma low-code.', 'Complementary experience with the low-code platform.', 'additional'),
  cv('zapier', 'Zapier', 'tools', 'Experiencia complementaria con automatización e integraciones.', 'Complementary experience with automation and integrations.', 'additional'),
  cv('bpmn', 'BPMN', 'methods', 'Modelado de procesos de negocio.', 'Business process modelling.'),
  cv('sipoc', 'SIPOC', 'methods', 'Análisis de proveedores, entradas, procesos, salidas y clientes.', 'Analysis of suppliers, inputs, processes, outputs and customers.'),
  cv('vsm', 'VSM', 'methods', 'Mapeo del flujo de valor para analizar procesos.', 'Value stream mapping for process analysis.'),
  cv('asis', 'AS-IS / TO-BE', 'methods', 'Análisis del proceso actual y diseño del proceso objetivo.', 'Current-state analysis and future-state process design.'),
  cv('kpi', 'KPIs', 'methods', 'Indicadores para revisar procesos y resultados.', 'Indicators for reviewing processes and results.'),
  cv('scrum', 'Scrum', 'methods', 'Trabajo iterativo y coordinación de entregas.', 'Iterative work and delivery coordination.'),
  cv('kanban', 'Kanban', 'methods', 'Visualización y gestión del trabajo en curso.', 'Visualisation and management of work in progress.'),
  cv('lean', 'Lean', 'methods', 'Identificación de oportunidades de mejora en procesos.', 'Identifying process improvement opportunities.'),
  cv('testing', 'Pruebas / Testing', 'methods', 'Pruebas unitarias y validación de soluciones.', 'Unit tests and solution validation.'),
  cv('cicd', 'CI/CD', 'tools', 'Integración y entrega continuas con pruebas y control de cambios.', 'Continuous integration and delivery with tests and change control.'),
  cv('rpa', 'RPA / Power Automate Desktop', 'power', 'Automatización de escritorio dentro de Power Automate.', 'Desktop automation within Power Automate.', 'cv', 'automate'),
  cv('architecture', 'Microservicios / Microservices', 'backend', 'Arquitectura de servicios e inyección de dependencias.', 'Service architecture and dependency injection.')
];

// Link the project inventories to this same directory without turning the demo's
// runtime or its configuration guides into claimed client production experience.
export const projectSkillIds = {
  html: 'web', css: 'web', http: 'api', 'automate-guide': 'automate', git: 'git',
  'git-version': 'git', 'sharepoint-catalog': 'sharepoint', 'automate-setup': 'automate',
  'pipelines': 'alm'
};
const projectGroups = { canvas: 'frontend', webgl: 'frontend', audio: 'frontend', bm25: 'ai', webllm: 'ai', qwen: 'ai', webgpu: 'ai', wasm: 'frontend', workers: 'frontend', cache: 'frontend', json: 'integration', openapi: 'integration', connectors: 'integration', iot: 'integration', teams: 'collaboration', m365: 'collaboration', powerfx: 'power', excel: 'collaboration' };
export function completeTechnologies(core) {
  const entries = [...core.map(item => ({ ...item, mark: item.id, source: 'cv', group: ({ sql: 'data', azure: 'cloud', sharepoint: 'collaboration', node: 'backend' })[item.id] || item.group })), ...cvTechnologies];
  const ids = new Set(entries.map(item => item.id));
  for (const key of new Set(Object.values(projectTechnologies).flat())) {
    const id = projectSkillIds[key] || key;
    if (ids.has(id)) continue;
    const tech = technologyCatalog[key];
    entries.push({ id, name: tech.name, group: projectGroups[id] || 'tools', mark: id, source: 'project', es: tech.es, en: tech.en,
      context: { es: 'Proyectos de muestra · Alcance documentado en cada caso', en: 'Sample projects · Scope documented in each case' } });
    ids.add(id);
  }
  const featured = ['net', 'csharp', 'react', 'powerapps', 'dataverse', 'automate', 'copilot', 'rag', 'ai-builder', 'azure', 'api', 'sql'];
  return [...featured.map(id => entries.find(item => item.id === id)), ...entries.filter(item => !featured.includes(item.id))];
}
