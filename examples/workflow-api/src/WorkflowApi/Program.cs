using System.Text.Json;
using System.Text.Json.Serialization;
using WorkflowDomain;

var builder = WebApplication.CreateBuilder(args);
if (string.IsNullOrWhiteSpace(builder.Configuration["urls"])) builder.WebHost.UseUrls("http://127.0.0.1:5086");
builder.WebHost.ConfigureKestrel(options => options.Limits.MaxRequestBodySize = 8192);
builder.Services.AddProblemDetails();
builder.Services.AddSingleton(new WorkflowStore());
var json = new JsonSerializerOptions(JsonSerializerDefaults.Web) { PropertyNameCaseInsensitive = false, UnmappedMemberHandling = JsonUnmappedMemberHandling.Disallow };
var app = builder.Build();
app.UseExceptionHandler();
app.Use(async (context, next) => { context.Response.Headers.CacheControl = "no-store"; await next(context); });
app.MapGet("/health", () => Results.Ok(new { status = "ok", scope = "process-local-reference" }));
app.MapGet("/requests/{requestId}", (string requestId, WorkflowStore store) => Response(store.Get(requestId)));
app.MapPost("/requests", async (HttpContext context, WorkflowStore store) =>
{
    if (!context.Request.HasJsonContentType()) return Results.Problem(statusCode: 415, title: "JSON required", extensions: new Dictionary<string, object?> { ["code"] = "unsupported_media_type" });
    try
    {
        var payload = await context.Request.ReadFromJsonAsync<CreateRequest>(json, context.RequestAborted);
        if (payload is null) return Response(new(400, "invalid_payload"));
        var result = store.Create(payload, context.Request.Headers["Idempotency-Key"].ToString());
        if (result.Status == 201) context.Response.Headers.Location = $"/requests/{Uri.EscapeDataString(result.Request!.RequestId)}";
        return Response(result);
    }
    catch (JsonException) { return Response(new(400, "invalid_payload")); }
    catch (BadHttpRequestException error) { return Response(new(error.StatusCode, "invalid_payload")); }
});
app.MapPost("/requests/{requestId}/transitions", async (string requestId, HttpContext context, WorkflowStore store) =>
{
    if (!context.Request.HasJsonContentType()) return Results.Problem(statusCode: 415, title: "JSON required", extensions: new Dictionary<string, object?> { ["code"] = "unsupported_media_type" });
    try
    {
        var payload = await context.Request.ReadFromJsonAsync<TransitionRequest>(json, context.RequestAborted);
        return payload is null ? Response(new(400, "invalid_transition_payload")) : Response(store.Transition(requestId, payload.Action, payload.ExpectedVersion));
    }
    catch (JsonException) { return Response(new(400, "invalid_transition_payload")); }
    catch (BadHttpRequestException error) { return Response(new(error.StatusCode, "invalid_transition_payload")); }
});
app.Run();

static IResult Response(WorkflowResult result) => result.Status >= 400
    ? Results.Problem(statusCode: result.Status, title: result.Code, extensions: new Dictionary<string, object?> { ["code"] = result.Code, ["errors"] = result.Errors ?? new Dictionary<string, string>() })
    : result.Replayed.HasValue
        ? Results.Json(new { replayed = result.Replayed.Value, request = result.Request }, statusCode: result.Status)
        : Results.Json(new { request = result.Request }, statusCode: result.Status);
