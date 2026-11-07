# Guía de integración con Power Automate

Diseño reproducible del flujo para el prototipo de solicitudes. No se ha creado un flujo en un tenant, enviado una aprobación ni contratado un conector. La demo pública funciona sin Microsoft 365; esta guía se aplica cuando existe un entorno autorizado.

## Antes de conectar

La API incluida escucha en loopback y no tiene autenticación ni persistencia. Un flujo en la nube no puede llamar a `127.0.0.1` de este equipo. No expongas este ejemplo sin completar identidad, permisos, HTTPS y almacenamiento duradero. Una conexión real puede requerir una API protegida accesible desde el entorno o una pasarela administrada; ambas son decisiones del despliegue.

Comprueba permisos del entorno y licencias de cada conector. Que la aprobación sea una capacidad de Power Automate no implica que HTTP, conectores personalizados o el proceso completo estén incluidos en todas las licencias. No se presupone coste cero para ese despliegue.

## Datos del proceso

Ejemplo de origen: una lista de pruebas con ID, título, categoría y prioridad. Usa datos ficticios. Mapea categoría a `access`, `automation` o `integration`; prioridad a `normal` o `high`.

| Valor | Ejemplo | Persistencia requerida en un entorno real |
| --- | --- | --- |
| Identificador de negocio | `REQ-1001` | Asociado al registro de origen |
| Clave de creación | `sp-demo-1001-create-v1` | La misma para todos los reintentos de esa creación |
| Versión esperada | `1`, después la devuelta por la API | Leída antes de una transición |
| Identificador de aprobación | Devuelto por el conector de aprobaciones | Asociado de forma duradera a la solicitud |

Para una lista de pruebas, una expresión posible de clave es `concat('sp-demo-', string(triggerBody()?['ID']), '-create-v1')`. El prefijo identifica ese origen; debe ser distinto para otros orígenes. No uses un nuevo `guid()` ni el identificador de ejecución en cada reintento: harías que una misma creación pareciera otra operación. Conserva el límite de 64 caracteres y el alfabeto del contrato.

## Secuencia del flujo

1. Disparador: creación de un registro de prueba. Valida y mapea los cuatro campos. Guarda ID de negocio y clave en un registro de control duradero.
2. Ámbito `Crear solicitud`: HTTP `POST /requests`, JSON y cabecera `Idempotency-Key` estable. `201` significa nueva; `200` con `replayed: true` devuelve el estado existente. No interpretes una repetición como una nueva aprobación.
3. Lee el estado actual. Si sigue en `received`, solicita `review` con `expectedVersion` actual. Un `409` obliga a volver a consultar y conciliar; no a forzar la versión.
4. Registra de forma duradera la operación de aprobación pendiente y reclama una sola ejecución antes de llamar al conector. Usa `Create an approval` y conserva su ID, después `Wait for an approval`; también existe `Start and wait for an approval` para casos más simples. Restringe quién puede decidir.
5. Si la decisión es aprobar, envía `approve` con la versión de revisión. Si es rechazar, envía `reject`. Antes de `complete`, vuelve a leer el estado y confirma que la operación de negocio prevista terminó.
6. Ámbito `Registrar error`: configura Run After para fallo, tiempo agotado y omisión según el ámbito anterior. Registra ID, etapa, código HTTP y código de problema; excluye secretos y datos innecesarios. Finaliza con un estado explícito.

El ejemplo local no implementa el registro de control duradero ni el despachador de aprobaciones del paso 4. Son necesarios para un proceso real: si el flujo se interrumpe entre crear una aprobación y guardar su ID, no debe reenviarla ciegamente. Una tarea de conciliación debe resolver las operaciones pendientes con evidencia del conector y del registro.

## Tratamiento de errores

| Respuesta | Qué debe hacer el flujo |
| --- | --- |
| `400 invalid_payload` | Detener y corregir datos; no reintentar sin cambios |
| `409 idempotency_conflict` | Revisar por qué la misma clave contiene otros datos |
| `409 duplicate_request` | Recuperar la solicitud existente y conciliar el origen |
| `409 version_conflict` | Leer el estado actual y decidir si la transición aún corresponde |
| `409 invalid_transition` | Revisar la lógica; no saltarse la máquina de estados |
| `503`, error de red o respuesta incierta | Reintentos acotados con la misma clave para crear; consultar estado antes de repetir transiciones |

La referencia devuelve `503` cuando alcanza 50 registros en memoria. En ese ejemplo, esperar no libera capacidad: hay que reiniciar la instancia local. El servidor real deberá distinguir saturación temporal y límites permanentes.

## Pruebas de aceptación en un entorno autorizado

- Misma creación repetida: un registro, misma solicitud y sin otra aprobación.
- Misma clave con datos distintos: `409`, sin cambios.
- Dos revisores con la misma versión: una transición aceptada y otra en conflicto.
- Rechazo: nunca llega a `completed`.
- Interrupción antes/después de crear la aprobación: recuperación del ID existente y conciliación, sin duplicados.
- Credencial ausente o actor sin permiso en la API real: rechazo antes de cambiar datos.

Estas son pruebas a ejecutar en el entorno de integración; no se presentan como pruebas ya realizadas de un tenant. Las pruebas del dominio y HTTP local sí se incluyen y se ejecutan en GitHub Actions.

## Fuentes oficiales

- [Aprobaciones](https://learn.microsoft.com/en-us/power-automate/get-started-approvals).
- [Manejo de errores, ámbitos y Run After](https://learn.microsoft.com/en-us/power-automate/guidance/coding-guidelines/error-handling).
- [Licencias](https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/faqs).
