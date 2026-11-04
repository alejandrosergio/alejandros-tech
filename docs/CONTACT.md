# Contacto, preferencias y privacidad

## Formulario autorizado

El titular pidió un formulario real con validaciones que envíe a `alejandro.dev.sergio@outlook.com`. Eligió Formspree y completó personalmente el registro y la verificación del correo. La web sigue siendo estática y portable. El formulario `Alejandro’sTech · Contacto ES/EN` utiliza `https://formspree.io/f/xgaarkbp`, configurado en `site.mjs`. Es un endpoint público de envío, no una credencial. No se exponen contraseñas de Outlook, tokens ni claves SMTP. No se conecta con el proveedor antes de enviar.

Campos: nombre (2–80), correo (hasta 254 en el navegador), asunto entre cuatro opciones, mensaje (20–4.000) y consentimiento obligatorio con valor `on`. Se recortan espacios antes del envío. Los límites HTML funcionan sin JavaScript. JavaScript añade un resumen enfocable con enlaces a los errores, mensajes localizados, bloqueo de envíos simultáneos, timeout de 20 segundos y conservación de datos tras un fallo. Los errores de campo del proveedor se traducen usando las etiquetas propias; nunca se insertan mensajes remotos como HTML.

En Workflow de Formspree se configuraron los cinco campos obligatorios: email de tipo Email; name de tipo Text con 2–80 caracteres; message con 20–4.000; topic con 1–80; consent con longitud 2. La selección entre los cuatro asuntos y el valor `on` se comprueban en el navegador; el servicio exige presencia y longitud. Se confirmó que una petición inválida devuelve HTTP 422 con los cinco errores y no se procesa como envío correcto. Se incluye `_gotcha` como honeypot y se conserva la protección predeterminada del servicio. La única acción es enviar al Outlook público; no se añade autorespondedor ni copia a terceros.

Sin JavaScript, el POST navega a Formspree, que gestiona la confirmación y cualquier desafío. `_language` conserva ES/EN en sus pantallas. Con JavaScript se envía FormData al mismo endpoint con Accept JSON. Solo una respuesta HTTP correcta y `ok: true`, sin errores, muestra éxito y limpia el formulario. Respuestas negativas, fallos de red y expiración del tiempo conservan los campos y ofrecen el correo directo. No se siguen URLs `next` remotas ni se reenvía automáticamente tras un fallo.

## Activación y comprobación

La cuenta y el correo destino fueron verificados por el titular antes de crear el formulario. El mismo endpoint se usa para ambos idiomas. No dar por verificada la recepción únicamente por un HTTP 200 o `ok: true`: la comprobación definitiva requiere enviar desde la web publicada y comprobar el mensaje recibido en Outlook. No publicar credenciales, enlaces de verificación ni contenido de mensajes privados en GitHub. El proveedor está sujeto a los límites del plan de su cuenta; el correo directo sigue siendo una alternativa.

Las primeras pruebas ES/EN desde el navegador del agente se retuvieron en Spam de Formspree. Se identificaron como las dos pruebas legítimas, se marcaron como Not Spam y ambos correos llegaron al Outlook configurado. La protección general permanece activa. Ante una consulta ausente, revisar primero las consultas retenidas en el panel y el correo no deseado de Outlook; no interpretar una respuesta positiva como garantía de paso por todos los filtros.

Documentación primaria consultada el 3 de noviembre de 2026:

- https://help.formspree.io/articles/building-your-form/building-an-html-form
- https://help.formspree.io/articles/building-your-form/submit-forms-with-javascript-ajax
- https://help.formspree.io/articles/building-your-form/getting-started-with-workflow
- https://help.formspree.io/articles/building-your-form/honeypot-spam-filtering
- https://help.formspree.io/articles/building-your-form/localization-and-translation
- https://formspree.io/legal/privacy-policy/

## Datos y consentimiento

El formulario explica que los datos pasan por Formspree hasta Outlook para atender la consulta y enlaza la política del proveedor. Formspree procesa y almacena las consultas conforme a su política; no se afirma un plazo de retención no confirmado. Se pide no incluir datos sensibles. La casilla del formulario no está premarcada y es independiente de las preferencias de cookies.

La cookie propia `at_consent` contiene solamente `preferences` o `essential`, con Path `/`, SameSite Lax, Secure en HTTPS y duración de 180 días. Recuerda la elección de privacidad. No hay analítica ni publicidad. No se obliga a aceptar ajustes opcionales para navegar o contactar.

Los ajustes opcionales viven en `alejandros-tech-preferences-v1` en localStorage, solo tras aceptar preferencias, con caducidad de 180 días. Antes de aceptar se aplican en memoria a la página actual. Al retirar el permiso se eliminan los ajustes y se restablecen los valores iniciales del sitio; la cookie recuerda el rechazo. Las preferencias antiguas, corruptas o caducadas no se aplican. El almacenamiento bloqueado no impide navegar. El correo o mensaje del formulario nunca se guarda localmente.

## Accesibilidad e interacción

El panel usa diálogos nativos, foco visible, cierre con Escape y retorno del foco a la tuerca de ajustes. Los interruptores exponen aria-checked. Las cinco paletas tienen pares de contraste para temas claro y oscuro; los tooltips y botones siguen el acento elegido. Texto100–125%, interlineado, enlaces y radios son ajustes acotados. El botón de tema anuncia la acción que realizará y responde también a cambios del sistema.

La fotografía es HTML con un zoom CSS suave. La pausa y el movimiento reducido la dejan neutra y detienen los efectos decorativos; no queda un modelo3D ni captura de arrastre. El desplazamiento, los enlaces y el zoom del navegador siguen disponibles. Ninguna coordenada de interacción se envía a un servicio.

El loader aparece en cada carga o recarga de documento, también con fragmentos. Su mínimo es1,2s y su límite independiente2,4s; teclado y botón permiten entrar antes. Los rayos usan el acento guardado y liberan sus recursos al terminar. No simula un porcentaje de descarga, ni aparece con movimiento reducido o sin JavaScript. El contenido HTML nunca depende del loader.
