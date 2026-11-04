# Contacto, preferencias y privacidad

## Formulario autorizado

El titular pidió un formulario real con validaciones que envíe a `alejandro.dev.sergio@outlook.com`. La web sigue siendo estática y portable. Se usa el endpoint HTTPS de FormSubmit; no se exponen contraseñas de Outlook, tokens ni claves SMTP. No se conecta con el proveedor antes de enviar.

Campos: nombre (2–80), correo (hasta 254), asunto entre cuatro opciones, mensaje (20–4.000) y consentimiento obligatorio. Se recortan espacios antes del envío. Los límites HTML funcionan sin JavaScript. JavaScript añade un resumen enfocable con enlaces a los errores, mensajes localizados, bloqueo de envíos simultáneos, timeout de 20 segundos y conservación de datos tras un fallo. FormSubmit valida y filtra sus peticiones en el servidor; los límites específicos del sitio en el navegador no sustituyen controles del proveedor. Se incluye honeypot y se conserva la protección predeterminada del servicio. No se añade un autorespondedor ni una copia a terceros.

Sin JavaScript, el POST navega a FormSubmit, que gestiona la confirmación y cualquier desafío. Con JavaScript se usa su endpoint AJAX. Un resultado positivo se describe como solicitud aceptada por el servicio, nunca como entrega garantizada en la bandeja. Respuestas negativas, fallos de red y expiración del tiempo conservan los campos y ofrecen el correo directo. Si una respuesta indica activación pendiente, se muestra ese estado.

## Activación y comprobación

FormSubmit requiere verificar el destino mediante el enlace que envía al titular la primera vez. La activación depende del correo y del formulario/origen que identifique el proveedor. No dar por verificada la recepción únicamente por un HTTP 200 o `success: true`. La comprobación definitiva requiere un envío desde la web publicada y comprobar el correo recibido en Outlook. Si aún falta el enlace o la confirmación, informar de esa limitación al titular y continuar el resto del trabajo autorizado. No publicar credenciales o enlaces de activación en GitHub.

Documentación primaria consultada el 3 de noviembre de 2026:

- https://formsubmit.co/documentation
- https://formsubmit.co/ajax-documentation
- https://formsubmit.co/help
- https://formsubmit.co/privacy.pdf

## Datos y consentimiento

El formulario explica que los datos pasan por FormSubmit hasta Outlook para atender la consulta, y enlaza la política del proveedor. El proveedor indica una retención de 30 días. Se pide no incluir datos sensibles. La casilla del formulario no está premarcada y es independiente de las preferencias de cookies.

La cookie propia `at_consent` contiene solamente `preferences` o `essential`, con Path `/`, SameSite Lax, Secure en HTTPS y duración de 180 días. Recuerda la elección de privacidad. No hay analítica ni publicidad. No se obliga a aceptar ajustes opcionales para navegar o contactar.

Los ajustes opcionales viven en `alejandros-tech-preferences-v1` en localStorage, solo tras aceptar preferencias, con caducidad de 180 días. Antes de aceptar se aplican en memoria a la página actual. Al retirar el permiso se eliminan los ajustes y se restablecen los valores del sistema; la cookie recuerda el rechazo. Las preferencias antiguas, corruptas o caducadas no se aplican. El almacenamiento bloqueado no impide navegar. El correo o mensaje del formulario nunca se guarda localmente.

## Accesibilidad e interacción

El panel usa diálogos nativos, foco visible, cierre con Escape y retorno del foco al control de ajustes. Los interruptores son botones con role switch y aria-checked. Cinco paletas tienen pares diferenciados para temas claro y oscuro. Texto entre 100 y 125%, contraste, interlineado, subrayado y radio de tarjetas son ajustes acotados. Las preferencias de movimiento del dispositivo tienen prioridad. La opción de movimiento pausa el bucle real WebGL; el arrastre y el teclado siguen permitiendo explorar el modelo sin movimiento automático.

La tarjeta revela el enfoque con pointerenter de ratón y vuelve al retrato al salir, salvo que el foco permanezca en ella. El foco de teclado también muestra el enfoque; en móvil se conserva el botón táctil. El loader solo aparece al entrar en la portada sin fragmento, se puede saltar y tiene un límite de 1,4 segundos aunque fallen los demás scripts. No simula un porcentaje de descarga. No aparece con movimiento reducido ni sin JavaScript. El contenido HTML nunca depende del loader.
