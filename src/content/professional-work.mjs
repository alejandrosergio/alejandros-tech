// Selected professional contributions supplied in the owner's complete CV.
// These summaries are separate from the site's runnable personal prototypes.
export const professionalWork = [
  {
    id: 'sap-receiving',
    stack: ['Power Apps', 'Dataverse', 'SAP', 'Power Automate'],
    es: {
      category: 'Operación e integración',
      title: 'Recepción de mercancía conectada con SAP',
      summary: 'Digitalización de la recepción en bodega y la validación de órdenes de compra, desde la captura hasta las aprobaciones.',
      details: [
        'Desarrollé una aplicación Canvas móvil con lectura de códigos de barras, fotos y operación offline, sobre un modelo relacional en Dataverse con auditoría y seguridad por roles.',
        'Integré las consultas de órdenes de compra y el envío de confirmaciones a SAP mediante APIs REST/JSON y un conector personalizado con OAuth 2.0.',
        'Automaticé aprobaciones multinivel y alertas en Teams. Gestioné soluciones administradas y Pipelines entre Dev/QA/Prod, con variables de entorno por mandante de SAP.'
      ]
    },
    en: {
      category: 'Operations and integration',
      title: 'Goods receiving connected to SAP',
      summary: 'Digitising warehouse receiving and purchase-order validation, from data capture through approvals.',
      details: [
        'Developed a mobile Canvas app with barcode scanning, photos and offline operation, using a relational Dataverse model with auditing and role-based security.',
        'Integrated purchase-order queries and receiving confirmations with SAP through REST/JSON APIs and a custom OAuth 2.0 connector.',
        'Automated multi-level approvals and Teams alerts. Managed solutions and Pipelines across Dev/QA/Prod, with environment variables for each SAP client.'
      ]
    }
  },
  {
    id: 'fleet-maintenance',
    stack: ['Power Apps', 'AI Builder', 'Dataverse', 'IoT / APIs'],
    es: {
      category: 'IA aplicada y trabajo de campo',
      title: 'Gestión y mantenimiento predictivo de flotas',
      summary: 'Inspecciones en campo, telemetría y diagnóstico visual para apoyar el mantenimiento y automatizar órdenes de trabajo.',
      details: [
        'Diseñé y desplegué aplicaciones Canvas y Model-Driven sobre Dataverse, con operación offline, escaneo QR y una interfaz administrativa para supervisores.',
        'Conecté telemetría IoT mediante APIs y un conector OAuth 2.0, sincronización de inventario con ERP y diagnóstico visual con AI Builder.',
        'Automaticé tickets, asignaciones y avisos en Teams con Power Automate. Gestioné roles, reglas de negocio y entregas entre Dev/Test/Prod.'
      ]
    },
    en: {
      category: 'Applied AI and field operations',
      title: 'Fleet management and predictive maintenance',
      summary: 'Field inspections, telemetry and visual diagnostics to support maintenance and automate work orders.',
      details: [
        'Designed and deployed Canvas and Model-Driven apps on Dataverse, with offline operation, QR scanning and an administrative interface for supervisors.',
        'Connected IoT telemetry through APIs and an OAuth 2.0 connector, ERP inventory synchronisation and visual diagnostics with AI Builder.',
        'Automated tickets, assignments and Teams notifications with Power Automate. Managed roles, business rules and delivery across Dev/Test/Prod.'
      ]
    }
  },
  {
    id: 'msf-flight-deck',
    stack: ['Power Apps', 'SharePoint', 'Power Automate', 'Microsoft 365'],
    es: {
      category: 'Proyecto Dell / Solumn',
      title: 'MSF Public Sector Flight Deck',
      summary: 'Desarrollo de la solución a partir del diseño base del cliente y adaptación de la arquitectura de datos de Dataverse a SharePoint.',
      details: [
        'Desarrollé la solución con Power Apps y Power Automate, adaptando la arquitectura al cambio de plataforma de datos.',
        'Configuré el tenant de Microsoft, usuarios, licencias, roles y permisos necesarios para el trabajo.',
        'Trabajé en desarrollo y Test/QA para validar y facilitar la transferencia entre tenants. Coordiné requerimientos, cambios de alcance, documentación y acompañamiento técnico con el cliente.'
      ]
    },
    en: {
      category: 'Dell / Solumn project',
      title: 'MSF Public Sector Flight Deck',
      summary: 'Solution development from the client’s base design, adapting the data architecture from Dataverse to SharePoint.',
      details: [
        'Developed the solution with Power Apps and Power Automate, adapting the architecture to the change in data platform.',
        'Configured the Microsoft tenant, users, licences, roles and permissions required for the work.',
        'Worked in development and Test/QA to validate the solution and support transfer between tenants. Coordinated requirements, scope changes, documentation and technical support with the client.'
      ]
    }
  }
];
