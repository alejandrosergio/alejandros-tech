# Power Automate integration guide

A reproducible workflow design for the request prototype. No tenant flow has been created, no approval sent and no connector purchased. The public demo works without Microsoft 365; this guide applies to an authorised integration environment.

## Before connecting

The included API binds to loopback with no authentication or persistence. A cloud flow cannot call this computer’s `127.0.0.1`. Do not expose the example without identity, permissions, HTTPS and durable storage. A real connection may need a protected API reachable from the environment or a managed gateway; both are deployment decisions.

Check environment permissions and each connector’s licences. Approval capabilities do not imply that HTTP, custom connectors or the whole process are included in every plan. This guide assumes no free cloud deployment.

## Workflow data

Example source: a test list containing ID, title, category and priority. Use fictional data. Map category to `access`, `automation` or `integration`, and priority to `normal` or `high`.

| Value | Example | Required persistence in a real environment |
| --- | --- | --- |
| Business identifier | `REQ-1001` | Associated with the source record |
| Creation key | `sp-demo-1001-create-v1` | The same across all retries of that creation |
| Expected version | `1`, then the version returned by the API | Read before a transition |
| Approval identifier | Returned by the approval connector | Durably associated with the request |

For a test list, a possible key expression is `concat('sp-demo-', string(triggerBody()?['ID']), '-create-v1')`. The prefix identifies that source and must differ for other sources. Do not generate a new `guid()` or use the flow-run identifier for each retry: it would turn one logical creation into several operations. Respect the contract’s 64-character limit and alphabet.

## Flow sequence

1. Trigger on creation of a test record. Validate and map the four fields. Store the business ID and key in a durable control record.
2. `Create request` scope: HTTP `POST /requests`, JSON body and stable `Idempotency-Key` header. `201` means new; `200` with `replayed: true` returns existing state. A replay must not start a new approval.
3. Read current state. If still `received`, request `review` with the current `expectedVersion`. A `409` requires a fresh read and reconciliation, never forcing the version.
4. Durably record a pending approval operation and claim a single execution before calling the connector. Use `Create an approval`, retain its ID, then `Wait for an approval`; `Start and wait for an approval` also exists for simpler cases. Restrict who can decide.
5. For an approval, send `approve` with the review version. For rejection, send `reject`. Before `complete`, read current state again and confirm the intended business operation finished.
6. `Record error` scope: configure Run After for failure, timeout and skipped states as appropriate. Log ID, stage, HTTP status and problem code, excluding secrets and unnecessary data. Finish with an explicit outcome.

The local reference does not implement the durable control record or approval dispatcher in step 4. They are necessary in a real workflow: if a flow stops between creating an approval and saving its ID, blindly sending another approval is unsafe. Reconciliation must resolve pending operations using connector evidence and the durable record.

## Error handling

| Response | Flow behaviour |
| --- | --- |
| `400 invalid_payload` | Stop and correct data; do not retry unchanged input |
| `409 idempotency_conflict` | Investigate why one key contains different data |
| `409 duplicate_request` | Retrieve the existing request and reconcile its source |
| `409 version_conflict` | Read current state and decide whether the transition still applies |
| `409 invalid_transition` | Review the logic; do not skip the state machine |
| `503`, network error or uncertain response | Bounded creation retries with the same key; read current state before repeating transitions |

The reference returns `503` at its 50-record memory cap. Waiting does not free capacity in this example; restarting the local instance does. A real server must distinguish temporary saturation from persistent limits.

## Acceptance checks in an authorised environment

- Repeated creation: one record, same request and no additional approval.
- Same key with different data: `409`, no mutation.
- Two reviewers using the same version: one accepted transition, one conflict.
- Rejected request: never reaches `completed`.
- Interruption before/after approval creation: recover the existing ID and reconcile without duplicates.
- Missing credential or unauthorised actor in the real API: reject before mutation.

These are checks to perform in the integration environment, not claims of an already tested tenant. Domain and local HTTP checks are included and executed in GitHub Actions.

## Official sources

- [Approvals](https://learn.microsoft.com/en-us/power-automate/get-started-approvals).
- [Error handling, scopes and Run After](https://learn.microsoft.com/en-us/power-automate/guidance/coding-guidelines/error-handling).
- [Licensing](https://learn.microsoft.com/en-us/power-platform/admin/power-automate-licensing/faqs).
