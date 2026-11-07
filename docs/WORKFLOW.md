# Solicitudes con contrato

Prototipo personal nuevo del 7 de noviembre de 2026. La ficha, demo y nota técnica tienen versiones completas ES/EN. No se presenta como trabajo para un cliente, aplicación desplegada en una empresa ni automatización de un tenant.

## Componentes

- `src/content/workflow.mjs`: rutas y etiquetas ES/EN.
- `src/components/workflow.mjs`: formulario semántico, recorrido, experimentos, respuesta y enlaces de documentación.
- `src/client/workflow-core.js`: reglas puras, validación, idempotencia, estados, versiones y copias de registros.
- `src/client/workflow.js`: mejora progresiva; memoria de pestaña, sin red ni almacenamiento persistente. Solo datos ficticios.
- `examples/workflow-api/`: dominio C#, API ASP.NET Core 10, contrato OpenAPI 3.1, escenarios compartidos y guías Power Automate ES/EN.

La web estática no aloja .NET. La API es una referencia local ejecutable. La guía explica cómo adaptar el contrato a un entorno autorizado, sin crear conectores ni generar costes. No se modifican el CV ni otros proyectos.

## Comprobaciones realizadas

SDK aislado oficial .NET 10.0.403, sin cambiar PATH global ni instalar paquetes externos de NuGet. Compilación Release: cero avisos y cero errores. El dominio C# ejecuta 79 comprobaciones; JavaScript, 98; el intercambio HTTP local, 102. Dos escenarios contienen 18 pasos compartidos. Se prueban también solicitudes simultáneas y versiones concurrentes.

Las cifras son recuentos de aserciones de esta versión, no métricas de negocio, rendimiento ni cobertura porcentual. GitHub Actions vuelve a ejecutar la generación de la web, sus controles y las comprobaciones .NET/HTTP.

## Límites

La API guarda hasta 50 registros en memoria. Sus bloqueos solo coordinan el proceso local. No tiene autenticación, permisos, persistencia, recuperación de aprobaciones externas ni garantía de ejecución exactamente una vez. Los errores exponen códigos del contrato, sin trazas internas. La guía separa esas necesidades de lo que está implementado y probado.

Reproducción, ejemplos HTTP y fuentes primarias: [README del ejemplo](../examples/workflow-api/README.md).
