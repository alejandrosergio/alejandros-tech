# Tecnologías y distribución del código

Las cuatro fichas personales y sus casos ES/EN muestran una barra de lenguajes y el inventario completo del alcance presentado. El quinto caso, un recorrido profesional en video por Power Platform, enumera sus seis tecnologías sin porcentajes porque no se han aportado las fuentes de la aplicación. Las tres contribuciones profesionales muestran las tecnologías documentadas en el CV maestro, con el mismo límite. Los inventarios sustituyen las anteriores listas abreviadas.

## Dos medidas distintas

`src/content/project-technologies.mjs` mantiene las herramientas, plataformas, lenguajes, bibliotecas y servicios, con su función ES/EN. Se enumeran por separado: Node.js no recibe una cuota adicional al JavaScript que ejecuta, ni WebLLM, Qwen o .NET se suman al mismo total de lenguajes. Los logotipos disponibles se reutilizan localmente; los demás elementos usan abreviaturas o iconos conceptuales, no marcas inventadas.

La distribución es una **aproximación por bytes de archivos fuente**, inspirada en la presentación de GitHub. No es una consulta a GitHub Linguist, un porcentaje de trabajo, de arquitectura, de habilidad ni una métrica de experiencia. Las extensiones `.js`/`.mjs`, `.css`, `.html` y `.cs` identifican los lenguajes del alcance actual. Las plantillas HTML dentro de JavaScript se cuentan como JavaScript.

Se excluyen copias generadas (`dist/`), bibliotecas y dependencias, modelos y otros binarios, ilustraciones, datos JSON, documentación y los resultados congelados de evaluación. No se pondera un modelo por el tamaño de sus pesos. Los saltos CRLF locales se normalizan a LF para que Windows y CI produzcan el mismo resultado. El redondeo por restos mayores conserva un total de 100,0% a una décima.

## Alcances verificables

`scripts/project-code.mjs` define los archivos de cada demo y recalcula sus tamaños al construir:

- Asistente: recuperación, supervisor, worker, interfaz, configuración del modelo, contenido de la demo y su CSS. Excluye el armazón compartido y la evaluación separada. El runtime de terceros y los pesos no cuentan como código propio.
- Solicitudes: fuentes de la demo, ejemplo C# y sus pruebas de dominio y HTTP. Es una referencia local .NET; no se convierte en backend del Site por aparecer en el inventario. Power Automate sigue identificado como guía sin flujo desplegado.
- Alejandro’sTech: fuentes de la interfaz compartida y las herramientas de construcción. Se excluyen los archivos asignados a las demos, la evaluación y sus salidas, para no mezclar su desglose con el del sitio.
- CV: los cinco archivos HTML/CSS/JS de `src/` en la revisión `b3bcdbc7cfc9d5d84f6e5d8fdd6224a268202284` de `alejandrosergio/sergio-hernandez-cv`, consultada el 17 de noviembre de 2026. `src/content/cv-code-snapshot.json` conserva sus tamaños y SHA de blob, junto a la revisión y el árbol consultados. No se modifica el CV ni se promete sincronización automática con él.

La revisión del CV confirmó sus dependencias de construcción `esbuild`, `fflate`, `html-minifier-terser` y `linkedom` en `package.json` y sus importaciones en los scripts. Las dependencias no se introducen en Alejandro’sTech por enumerarlas en ese caso.

## Presentación y mantenimiento

El componente `src/components/project-technologies.mjs` genera HTML estático: barras con descripción accesible, leyenda textual con porcentajes, inventarios y explicación desplegable. Las fichas mantienen el inventario dentro de un desplegable nativo; los casos muestran las tecnologías y sus funciones. Nada requiere una descarga de modelos, una llamada a GitHub desde el navegador ni JavaScript nuevo para ver los datos.

`pnpm build` pasa las distribuciones a las páginas y genera `dist/assets/project-code.json`. No se escribe ese archivo a mano. `pnpm check` verifica el redondeo, las exclusiones, la vigencia del resultado, los inventarios, las cuatro barras y los cuatro avisos profesionales en ambos idiomas. La revisión visual comprueba móvil, escritorio, temas, ampliación y teclado.

Para actualizar el CV: leer su revisión actual y árbol mediante GitHub, comprobar los archivos y las dependencias, actualizar únicamente la captura de metadatos en este repositorio y reconstruir. No ajustar porcentajes a mano ni copiar el código de terceros en la web. No atribuir al titular tecnologías de un trabajo profesional que sus fuentes confirmadas no mencionen.
