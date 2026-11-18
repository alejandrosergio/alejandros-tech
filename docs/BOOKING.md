# Agenda de llamadas

## Servicio y destinos

El titular eligió Cal.com con su Outlook público y completó el acceso, los permisos de calendario y la verificación del correo. La cuenta es individual; no se contrató un plan de pago. La web conserva su alojamiento estático y no contiene credenciales de calendario, claves de API ni un servicio propio de reservas.

- Perfil: https://cal.com/alejandros-tech
- Español: https://cal.com/alejandros-tech/llamada
- Inglés: https://cal.com/alejandros-tech/discovery-call
- Calendario de creación y comprobación de conflictos: `alejandro.dev.sergio@outlook.com`.
- Videollamada: Cal Video, con enlace generado por Cal.com para la reserva.

Los dos enlaces son llamadas de 30 minutos del mismo profesional y usan la misma disponibilidad. La interfaz y las preguntas se presentan en el idioma correspondiente; se informa expresamente que las llamadas se realizan en español. No se presenta el inglés técnico del titular como nivel de conversación.

## Disponibilidad

Zona horaria del anfitrión: `America/Bogota`, Colombia, UTC−5. Lunes a viernes, en dos intervalos:

- 08:00–12:30.
- 14:00–17:00.

El almuerzo queda fuera de disponibilidad; una llamada debe terminar dentro del intervalo. Sábados y domingos están desactivados. Se seleccionó Colombia en **Fuera de la oficina → Días festivos** de Cal.com, con los festivos activados. El proveedor mantiene ese calendario; no hay una tabla de fechas ni una automatización periódica en este repositorio. La disponibilidad publicada también descuenta los conflictos del Outlook conectado. No se publican títulos ni detalles de eventos personales.

La configuración de Cal.com es la que aplica las reglas. `src/content/booking.mjs` contiene sus enlaces y las etiquetas públicas: al cambiar el horario, deben actualizarse tanto el servicio como esas etiquetas y las descripciones de los dos enlaces. No añadir un calendario ficticio en JavaScript ni considerar una solicitud de contacto como una reserva confirmada.

## Perfil y formulario

El perfil utiliza el nombre confirmado del titular, una biografía ES/EN, Cali (Colombia), los enlaces al sitio, LinkedIn, GitHub y ambos idiomas del CV. Las cuentas ajenas al calendario público y los otros proyectos siguen siendo independientes.

La reserva pide nombre, correo y un motivo de 20–1.000 caracteres. Organización o proyecto es opcional. Las etiquetas y los ejemplos del motivo y la organización están traducidos. Cal.com gestiona la validación, el estado final, la invitación, la cancelación y la reprogramación de su flujo estándar. No hay cobro de la llamada, grabación, transcripción automática ni inferencia de pago añadida por esta integración.

## Web y privacidad

`src/components/booking.mjs` genera un enlace real que abre otra pestaña sin JavaScript. El controlador local `src/client/booking.js` mejora el clic ordinario con un diálogo nativo; conserva los clics con modificadores. El iframe solo se crea tras abrir la agenda. El origen de reserva se valida y el enlace externo permanece disponible si el proveedor tarda o falla.

El marco local `booking-shell.html` carga el SDK oficial de Cal.com, que crea la agenda externa y gestiona su protocolo y dimensiones. El controlador principal solo acepta señales de disponibilidad o error del marco local creado, comprobando ventana y origen. El marco local acepta los cambios de tema únicamente de su ventana padre y su mismo origen. No se envían datos de los invitados en estas señales. No se escuchan mensajes para simular una reserva completada ni se copian datos de los visitantes al almacenamiento del sitio.

El cierre y la navegación retiran el marco, su observador, el temporizador y el listener de mensajes. El SDK y su sondeo periódico viven únicamente dentro del documento local desechable: desaparecen al retirar el marco. No se cargan en la página principal. El diálogo conserva el foco, el cierre nativo, el botón visible y los tokens de apariencia propios. La confirmación y los datos de los invitados pertenecen al servicio externo.

El marco sigue el tema claro/oscuro; la modal, sus botones y enlaces utilizan el acento del visitante. La agenda externa conserva la paleta neutra y la atribución del plan individual de Cal.com. No se sortean las opciones de personalización de marca que el proveedor reserva a sus planes de pago.

Los avisos de privacidad identifican la conexión voluntaria con Cal.com y su política. El consentimiento para recordar preferencias sigue siendo independiente de una reserva. El formulario anterior de Formspree conserva su endpoint y comportamiento; véase [CONTACT.md](CONTACT.md).

## Comprobación y mantenimiento

Ejecutar `pnpm build` y `pnpm check`. `scripts/check-booking.mjs` comprueba activación explícita, destinos ES/EN, alternativa sin modal, confianza de mensajes, callbacks tardíos, error/timeout y limpieza de recursos. La revisión en navegador debe comprobar las dos agendas, ambos temas, móvil, escritorio, teclado, regreso del foco, selección de una hora y los campos obligatorios, sin confirmar una reserva real salvo autorización específica.

La tecla Escape cierra el diálogo cuando el foco está en los controles del sitio. Dentro de la agenda externa, Cal.com administra el teclado y puede consumir esa tecla; el botón visible de cierre sigue disponible y es accesible con Tab. El cierre devuelve el foco al enlace que abrió la agenda.

La entrega no debe atribuir recepción de invitaciones a una prueba que no se haya hecho. Una comprobación visual de disponibilidad o una respuesta del servicio no demuestra por sí sola la recepción del correo de una reserva. El historial de verificación del formulario de contacto se conserva por separado.

Referencias consultadas el 17 de noviembre de 2026:

- [Cal.com: planes](https://cal.com/pricing).
- [Integración oficial](https://cal.com/embed) y código público servido en `https://app.cal.com/embed/embed.js`.
- [Privacidad de Cal.com](https://cal.com/privacy).
- [Ministerio del Interior: actualización de festivos en 2026](https://www.mininterior.gov.co/noticias/gobierno-sanciona-ley-que-convierte-el-9-de-julio-en-nuevo-festivo-nacional/). Se comprobó esta actualización al revisar el calendario del proveedor; no se sustituye con una lista antigua de fechas.
