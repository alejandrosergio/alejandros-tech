# Publicación y sincronización

## Destinos

- Site: `appgprj_6aea35f321688191a6452b8b65f782ee`.
- Origen: `https://alejandros-tech.alejosergio3000.chatgpt.site`.
- Repositorio: `alejandrosergio/alejandros-tech`, rama `main`.

El manifiesto `.openai/hosting.json` es la referencia local del Site. Conserva el ID y `static.directory: dist`. No hay vinculación de base de datos, backend de modelos ni secretos de inferencia. No sustituir el identificador por el del CV. La demo ejecuta consultas en el navegador y ofrece un modelo descargable opcional; revisar su funcionamiento real y sus alternativas antes de publicar. Ver [AI-DEMO.md](AI-DEMO.md).

## Procedimiento

Leer `AGENTS.md` y la versión instalada de la guía Sites. Abrir las fuentes del Site mediante su helper oficial y conservar el resultado completo. Los accesos temporales se pasan por stdin protegido, sin guardarlos.

Consultar GitHub antes de editar. Comparar árboles y hashes con la última sincronización verificada. Integrar cambios concurrentes sin sobrescribirlos.

Generar y comprobar:

```sh
pnpm build
pnpm check
```

Revisar las vistas e interacciones afectadas. El helper oficial prepara el commit de fuentes, lo envía al repositorio de Sites y empaqueta la salida. Guardar la versión usando exactamente su SHA y archivo, y desplegarla conservando el público acordado.

Guardar en GitHub los mismos archivos administrados. Si se usan herramientas Git Data, construir sobre el árbol actual, crear un commit con su padre actual y comprobar el SHA esperado al actualizar la referencia, sin forzar.

Verificar el resultado de publicación y el contenido remoto. Guardar la referencia de comparación en `.codex/sync-state.json`, que es local e ignorada. Informar URL, commit y comprobaciones.

## Límites del flujo

- GitHub no despliega automáticamente a Sites.
- La comprobación de GitHub Actions valida el código, no publica la web.
- Las credenciales de Sites son temporales y no viven en el repositorio.
- La continuidad del alojamiento depende del servicio y sus condiciones, no se promete gratuidad o disponibilidad perpetua.
- No hay automatizaciones recurrentes ni sincronización permanente.

## Ejemplos y evaluación

Los archivos administrados incluyen `examples/`. La API .NET es código de referencia y sus bin/obj se ignoran: el archivo de despliegue solo aloja el sitio estático. La referencia de evaluación debe corresponder a sus huellas; `pnpm check` exige resultados completos y revisados. GitHub Actions ejecuta los trabajos de web y .NET/HTTP antes de cerrar una entrega.
