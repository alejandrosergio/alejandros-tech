// Inventory of the implemented scope. Frameworks, models and services are not
// assigned language percentages: they overlap with the source they support.
const definitions = [
  ['html', 'HTML', 'html', 'Estructura y contenido accesible', 'Accessible structure and content'],
  ['css', 'CSS', 'css', 'Diseño adaptable, temas y animaciones', 'Responsive layout, themes and animation'],
  ['javascript', 'JavaScript', 'JS', 'Interfaz y lógica en el navegador', 'Browser interface and application logic'],
  ['node', 'Node.js', 'node', 'Construcción y herramientas locales', 'Build and local tooling'],
  ['canvas', 'Canvas 2D', '2D', 'Fondos y efectos gráficos', 'Backgrounds and graphics'],
  ['webgl', 'WebGL 2 / GLSL', 'GL', 'Animación del loader con shaders', 'Shader-based loader animation'],
  ['audio', 'Web Audio API', '♫', 'Composición musical opcional', 'Optional music composition'],
  ['bm25', 'BM25', 'rag', 'Recuperación léxica de fragmentos', 'Lexical excerpt retrieval'],
  ['webllm', 'WebLLM', 'ai', 'Ejecución opcional del modelo local', 'Optional on-device model runtime'],
  ['qwen', 'Qwen3.5 · 0.8B', 'ai', 'Modelo descargable opcional', 'Optional downloadable model'],
  ['webgpu', 'WebGPU', 'GPU', 'Aceleración del modelo compatible', 'Compatible model acceleration'],
  ['wasm', 'WebAssembly', 'WASM', 'Runtime compilado del modelo', 'Compiled model runtime'],
  ['workers', 'Web Workers', 'WW', 'Inferencia en un hilo independiente', 'Inference in a separate worker'],
  ['cache', 'Cache API', 'DB', 'Descarga y gestión de la caché del modelo', 'Model download and cache management'],
  ['csharp', 'C#', 'csharp', 'Dominio y pruebas del ejemplo local', 'Local example domain and checks'],
  ['net', '.NET 10', 'net', 'Ejecución del ejemplo local', 'Local example runtime'],
  ['aspnet', 'ASP.NET Core 10', 'net', 'API de referencia ejecutable localmente', 'Locally runnable reference API'],
  ['http', 'HTTP / REST', 'api', 'Contrato de intercambio entre sistemas', 'System communication contract'],
  ['json', 'JSON', '{}', 'Datos y contratos estructurados', 'Structured data and contracts'],
  ['openapi', 'OpenAPI 3.1', 'api', 'Especificación del contrato HTTP', 'HTTP contract specification'],
  ['automate-guide', 'Power Automate', 'automate', 'Guía de integración; sin flujo desplegado', 'Integration guide; no deployed flow'],
  ['esbuild', 'esbuild', 'ES', 'Empaquetado de JavaScript y CSS', 'JavaScript and CSS bundling'],
  ['pnpm', 'pnpm', 'PN', 'Dependencias fijadas en el lockfile', 'Dependencies pinned in the lockfile'],
  ['git', 'Git / GitHub', 'git', 'Fuentes y control de versiones', 'Source and version control'],
  ['actions', 'GitHub Actions', 'git', 'Verificaciones automáticas', 'Automated checks'],
  ['sites', 'ChatGPT Sites', 'WEB', 'Publicación de la web estática', 'Static website hosting'],
  ['cal', 'Cal.com', 'CAL', 'Agenda de llamadas conectada a Outlook', 'Call booking connected to Outlook'],
  ['formspree', 'Formspree', '@', 'Envío del formulario de contacto', 'Contact form delivery'],
  ['fflate', 'fflate', 'ZIP', 'Archivo ZIP descargable del CV', 'Downloadable résumé ZIP archive'],
  ['minifier', 'html-minifier-terser', 'HTML', 'Optimización del HTML publicado', 'Published HTML optimisation'],
  ['linkedom', 'linkedom', 'DOM', 'Transformación y comprobación del HTML', 'HTML transformation and checks'],
  ['powerapps', 'Power Apps', 'powerapps', 'Aplicaciones de negocio', 'Business applications'],
  ['dataverse', 'Dataverse', 'dataverse', 'Modelo de datos, roles y reglas de negocio', 'Data model, roles and business rules'],
  ['sap', 'SAP', 'sap', 'Órdenes de compra y confirmación de recepción', 'Purchase orders and receiving confirmations'],
  ['automate', 'Power Automate', 'automate', 'Aprobaciones, tareas y notificaciones', 'Approvals, tasks and notifications'],
  ['oauth', 'OAuth 2.0', 'oauth', 'Autorización de integraciones', 'Integration authorisation'],
  ['connectors', 'Conectores personalizados / Custom connectors', 'api', 'Conexión con servicios empresariales', 'Business service connections'],
  ['teams', 'Microsoft Teams', 'M365', 'Alertas y comunicación del proceso', 'Workflow alerts and communication'],
  ['pipelines', 'Power Platform Pipelines', 'ALM', 'Entrega de soluciones entre entornos', 'Solution delivery across environments'],
  ['ai-builder', 'AI Builder', 'ai-builder', 'Diagnóstico visual integrado', 'Integrated visual diagnostics'],
  ['iot', 'IoT', 'IoT', 'Telemetría conectada mediante APIs', 'Telemetry connected through APIs'],
  ['erp', 'ERP', 'ERP', 'Sincronización del inventario', 'Inventory synchronisation'],
  ['alm', 'ALM', 'ALM', 'Gestión de entregas Dev/Test/Prod', 'Dev/Test/Prod release management'],
  ['sharepoint', 'SharePoint', 'sharepoint', 'Datos de la solución adaptada', 'Adapted solution data'],
  ['m365', 'Microsoft 365', 'M365', 'Tenant, usuarios, licencias y permisos', 'Tenant, users, licences and permissions'],
];
export const technologyCatalog = Object.fromEntries(definitions.map(([id, name, mark, es, en]) => [id, { name, mark, es, en }]));

const web = ['html', 'css', 'javascript'];
const tooling = ['node', 'esbuild', 'pnpm', 'git', 'sites'];
export const projectTechnologies = {
  'document-assistant': [...web, 'bm25', 'webllm', 'qwen', 'webgpu', 'wasm', 'workers', 'cache', ...tooling, 'actions'],
  'request-workflow': [...web, 'csharp', 'net', 'aspnet', 'http', 'json', 'openapi', 'automate-guide', ...tooling, 'actions'],
  'alejandros-tech': [...web, 'canvas', 'webgl', 'audio', 'formspree', 'cal', ...tooling, 'actions'],
  cv: [...web, 'json', 'node', 'esbuild', 'fflate', 'minifier', 'linkedom', 'pnpm', 'git', 'sites'],
  'sap-receiving': ['powerapps', 'dataverse', 'sap', 'automate', 'http', 'json', 'oauth', 'connectors', 'teams', 'pipelines'],
  'fleet-maintenance': ['powerapps', 'dataverse', 'ai-builder', 'iot', 'http', 'oauth', 'connectors', 'erp', 'automate', 'teams', 'alm'],
  'msf-flight-deck': ['powerapps', 'sharepoint', 'automate', 'm365'],
};

export const projectTechnologyCopy = {
  es: {
    title: 'Tecnologías del proyecto', all: 'Ver todas las tecnologías', distribution: 'Distribución del código', approximate: 'aprox.', method: 'Cómo se calcula',
    explanation: 'Por tamaño de los archivos fuente, redondeado a una décima. No mide tiempo de trabajo ni dominio de una tecnología. Las herramientas y servicios no suman porcentajes separados.',
    excluded: 'Se excluyen dependencias, modelos, archivos generados, datos y documentación. Las plantillas HTML escritas dentro de JavaScript cuentan como JavaScript.',
    source: 'Ver fuentes', snapshot: 'Fuentes consultadas', unavailable: 'Sin porcentajes: no se dispone del código de este trabajo profesional.',
    scopes: { 'document-assistant': 'Demo documental: lógica, interfaz, modelo opcional y estilos propios. Excluye la estructura compartida de la web y la evaluación independiente.', 'request-workflow': 'Demo del flujo y ejemplo local .NET, incluidas sus pruebas. Excluye la estructura compartida de la web.', 'alejandros-tech': 'Interfaz de la web y herramientas de construcción. Las demos tienen su propio desglose.', cv: 'Fuentes de la interfaz del CV. Consulta fijada a una revisión del repositorio; no se modifica ese proyecto.' },
  },
  en: {
    title: 'Project technologies', all: 'Explore all technologies', distribution: 'Code breakdown', approximate: 'approx.', method: 'How it is calculated',
    explanation: 'By source file size, rounded to one decimal place. It does not measure working time or proficiency. Tools and services do not add separate percentages.',
    excluded: 'Dependencies, models, generated files, data and documentation are excluded. HTML templates written inside JavaScript count as JavaScript.',
    source: 'View source', snapshot: 'Source snapshot', unavailable: 'No percentages: the source code for this professional work is unavailable.',
    scopes: { 'document-assistant': 'Document demo: logic, interface, optional model and its own styles. Excludes the shared website structure and the separate evaluation.', 'request-workflow': 'Workflow demo and local .NET example, including its checks. Excludes the shared website structure.', 'alejandros-tech': 'Website interface and build tooling. The demos have their own breakdowns.', cv: 'Résumé interface source. Pinned to a repository revision; that project is not modified.' },
  },
};
