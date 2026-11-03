# Diseño inicial

## Referencia

La web del CV aporta la paleta y el tono: azul marino `#102d52`, acento `#0067b8`, fondos suaves `#f0f5fc`, tipografía de sistema y controles discretos. No se copia su disposición de currículum ni su monograma SH.

Alejandro’sTech usa un signo A con un pequeño símbolo más y una ilustración vectorial de conexiones. Es una identidad inicial editable, no una marca registrada ni una identidad comercial certificada.

El inicio mejora esa ilustración con un A+ tridimensional de geometría local: metal biselado, acentos azules, órbitas y partículas. El modelo responde al cursor, al arrastre horizontal y a las flechas del teclado; Inicio restablece la vista. El control de animación permite pausar o activar el movimiento. En móvil se mantiene el desplazamiento vertical y el zoom táctil. El SVG original queda como alternativa estática sin JavaScript o WebGL.

## Composición

- Cabecera con marca, enlaces ES/EN y cambio de tema.
- Mensaje principal y breve presentación a la izquierda.
- Ilustración decorativa de desarrollo, automatización e IA a la derecha.
- CV, correo y perfiles profesionales como siguientes pasos.
- Pie compacto con próxima apertura y derechos.
- En móvil, contenido en una columna y arte debajo, sin reducir el texto para encajarlo.

## Accesibilidad

El texto es HTML real, no texto incrustado en una imagen. El arte usa SVG y tiene una descripción breve. Se conservan foco visible, salto al contenido, idioma del documento y del selector, rutas sin dependencia de JavaScript, áreas táctiles y reflujo.

Las animaciones decorativas respetan `prefers-reduced-motion`. El modo de colores forzados evita elementos decorativos que compitan con la lectura. El tema se guarda solo como preferencia local del navegador. No se añaden fuentes, rastreadores ni solicitudes a terceros desde el frontend.

La escena 3D comienza quieta si se solicita movimiento reducido. No renderiza continuamente cuando está pausada, fuera de pantalla o en una pestaña oculta. Limita la resolución del lienzo para reducir la carga en móvil y recupera el contexto gráfico o muestra la alternativa estática si se pierde.
