# Requests with a contract / Solicitudes con contrato

Original personal integration prototype for Alejandro’sTech, 7 November 2026. It is not a client implementation. The public website runs the JavaScript version in tab memory; this reference runs a real ASP.NET Core 10 API on loopback. No cloud account, paid inference, database or external package is needed to run it.

## Run / Ejecutar

Install the official .NET SDK selected by `global.json` (10.0.403, latest patch roll-forward). Node 22.13+ is needed only for the HTTP checks. From the repository root:

```sh
dotnet build examples/workflow-api/src/WorkflowApi/WorkflowApi.csproj -c Release
dotnet run --project examples/workflow-api/tests/WorkflowChecks/WorkflowChecks.csproj -c Release
node scripts/check-workflow.mjs
node scripts/check-workflow-http.mjs
dotnet run --project examples/workflow-api/src/WorkflowApi/WorkflowApi.csproj
```

The last command keeps the API at `http://127.0.0.1:5086`; stop it with Ctrl+C. The HTTP checker starts and stops its own loopback processes. To select an isolated SDK without changing PATH, set `TASK_DOTNET` to its `dotnet` executable for that checker.

El último comando mantiene la API en `http://127.0.0.1:5086`; se detiene con Ctrl+C. Las pruebas HTTP gestionan sus propios procesos locales. `TASK_DOTNET` permite seleccionar un ejecutable aislado de .NET sin cambiar PATH.

```sh
curl -i http://127.0.0.1:5086/requests \
  -H "Content-Type: application/json" \
  -H "Idempotency-Key: example-request-1001" \
  -d '{"requestId":"REQ-1001","title":"A fictional integration request","category":"integration","priority":"normal"}'

curl -i http://127.0.0.1:5086/requests/REQ-1001/transitions \
  -H "Content-Type: application/json" \
  -d '{"action":"review","expectedVersion":1}'
```

These examples use a POSIX shell. On PowerShell use `curl.exe`, with your shell’s JSON quoting, or `Invoke-RestMethod` with a JSON string in `-Body`. Only use fictional data.

## Contract / Contrato

- `GET /health`: local-reference readiness.
- `POST /requests`: canonicalise and validate fields, then create (`201`) or replay (`200`). Requires `Idempotency-Key`.
- `GET /requests/{requestId}`: read the current state or `404`.
- `POST /requests/{requestId}/transitions`: requires `action` and positive `expectedVersion`.
- State path: `received → review → approved → completed`; `review → rejected` is terminal.
- Same key + same normalised payload: return the current existing record. This is not a cached copy of the original HTTP body.
- Same key + changed payload, duplicate business ID, stale version or disallowed transition: `409` with a stable error code; no mutation.
- JSON only, body limit 8192 bytes, unknown fields rejected, `application/problem+json` errors and `Cache-Control: no-store`.

See [openapi.json](openapi.json), [fixtures.json](fixtures.json), [Power Automate ES](POWER-AUTOMATE.md) and [Power Automate EN](POWER-AUTOMATE-EN.md). OpenAPI 3.1 documents the API; it is not an import-ready Power Platform custom-connector package.

## Architecture and checks / Arquitectura y pruebas

`WorkflowDomain` owns validation, state transitions, an expected-version check and idempotency. `WorkflowApi` handles HTTP parsing and responses. A single lock makes store changes atomic within one .NET process. A returned record is a snapshot, not a mutable reference to storage.

The browser model in `src/client/workflow-core.js` and C# domain run the same two fixture scenarios with 18 steps. Additional checks cover concurrent creation, conflicting versions, capacity, malformed JSON, unknown fields, incorrect types, missing keys, unsupported content types and oversized requests. HTTP checks call the compiled API rather than a mock.

`WorkflowDomain` concentra validaciones, estados, versión e idempotencia. `WorkflowApi` adapta HTTP. Un bloqueo protege las modificaciones dentro del proceso .NET. Los registros devueltos son copias. JavaScript y C# ejecutan los mismos 18 pasos; las pruebas adicionales verifican concurrencia, capacidad y errores reales de HTTP.

## Deliberate scope / Alcance

Memory is capped at 50 requests. There is no persistence, authentication, authorisation, tenant integration, production deployment, message queue or exactly-once guarantee. Restarting clears keys, records and events. Process-local locking does not coordinate multiple servers. The JSON event list is a teaching aid, not a tamper-proof audit log.

La memoria está limitada a 50 solicitudes. Reiniciar borra datos y claves. No se incluyen identidad, permisos, persistencia, integración con un tenant, despliegue productivo ni garantía de ejecución exactamente una vez. El registro de eventos es didáctico y no constituye una auditoría inalterable.

The default loopback binding is intentional. Before any real cloud workflow can call an API, implement durable storage and unique constraints, authenticated HTTPS, per-operation authorisation, secret management, replay retention, monitoring and approval recovery. The Power Automate documents explain that boundary and do not imply that this example is ready to expose publicly.

## Primary references / Fuentes

- [HTTP idempotent methods, RFC 9110 §9.2.2](https://www.rfc-editor.org/rfc/rfc9110.html#section-9.2.2). The example’s key is an application contract, not a guarantee supplied by HTTP POST.
- [Problem Details, RFC 9457](https://www.rfc-editor.org/rfc/rfc9457.html).
- [ASP.NET Core validation](https://learn.microsoft.com/en-us/aspnet/core/fundamentals/validation?view=aspnetcore-10.0). Validation here is explicit domain code.
- [.NET support policy](https://dotnet.microsoft.com/en-us/platform/support/policy/dotnet-core).
