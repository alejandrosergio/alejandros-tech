using System.Globalization;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace WorkflowDomain;

public sealed record CreateRequest(string? RequestId, string? Title, string? Category, string? Priority);
public sealed record TransitionRequest(string? Action, int ExpectedVersion);
public sealed record WorkflowEvent(string Status, int Version, string At);
public sealed record RequestRecord(string RequestId, string Title, string Category, string Priority, string Status, int Version, IReadOnlyList<WorkflowEvent> Events);
public sealed record WorkflowResult(int Status, string Code, RequestRecord? Request = null, bool? Replayed = null, IReadOnlyDictionary<string, string>? Errors = null);

// Process-local reference store. The lock makes duplicate/concurrent operations
// atomic inside this process; it is not distributed or durable idempotency.
public sealed class WorkflowStore(TimeProvider? timeProvider = null, int capacity = 50)
{
    private readonly object gate = new();
    private readonly Dictionary<string, RequestRecord> requests = new(StringComparer.Ordinal);
    private readonly Dictionary<string, (string Fingerprint, string RequestId)> keys = new(StringComparer.Ordinal);
    private readonly TimeProvider clock = timeProvider ?? TimeProvider.System;
    private static readonly Regex RequestIdPattern = new("^[A-Z0-9][A-Z0-9-]{2,31}$", RegexOptions.CultureInvariant);
    private static readonly Regex KeyPattern = new("^[A-Za-z0-9_-]{8,64}$", RegexOptions.CultureInvariant);
    public int Count { get { lock (gate) return requests.Count; } }
    private string Timestamp() => clock.GetUtcNow().ToUniversalTime().ToString("yyyy-MM-dd'T'HH:mm:ss.fff'Z'", CultureInfo.InvariantCulture);
    private static RequestRecord Snapshot(RequestRecord request) => request with { Events = request.Events.ToArray() };

    public WorkflowResult Create(CreateRequest payload, string? key)
    {
        var id = (payload.RequestId ?? "").Trim().ToUpperInvariant();
        var title = (payload.Title ?? "").Trim();
        var category = (payload.Category ?? "").Trim();
        var priority = (payload.Priority ?? "").Trim();
        var errors = new Dictionary<string, string>();
        if (!RequestIdPattern.IsMatch(id)) errors["requestId"] = "format";
        if (title.Length is < 12 or > 160 || title.Any(c => c < 32 || c == 127)) errors["title"] = "length_or_control";
        if (category is not ("access" or "automation" or "integration")) errors["category"] = "choice";
        if (priority is not ("normal" or "high")) errors["priority"] = "choice";
        if (key is null || !KeyPattern.IsMatch(key)) errors["idempotencyKey"] = "format";
        if (errors.Count > 0) return new(400, "invalid_payload", Errors: errors);
        var fingerprint = JsonSerializer.Serialize(new[] { id, title, category, priority });
        lock (gate)
        {
            if (keys.TryGetValue(key!, out var previous))
                return previous.Fingerprint == fingerprint ? new(200, "replayed", Snapshot(requests[previous.RequestId]), true) : new(409, "idempotency_conflict");
            if (requests.ContainsKey(id)) return new(409, "duplicate_request");
            if (requests.Count >= capacity) return new(503, "capacity_reached");
            var request = new RequestRecord(id, title, category, priority, "received", 1, [new("received", 1, Timestamp())]);
            requests.Add(id, request); keys.Add(key!, (fingerprint, id));
            return new(201, "created", Snapshot(request), false);
        }
    }

    public WorkflowResult Transition(string requestId, string? action, int expectedVersion)
    {
        if (action is not ("review" or "approve" or "reject" or "complete") || expectedVersion < 1) return new(400, "invalid_transition_payload");
        lock (gate)
        {
            if (!requests.TryGetValue(requestId, out var current)) return new(404, "not_found");
            if (current.Version != expectedVersion) return new(409, "version_conflict");
            var target = (current.Status, action) switch { ("received", "review") => "review", ("review", "approve") => "approved", ("review", "reject") => "rejected", ("approved", "complete") => "completed", _ => null };
            if (target is null) return new(409, "invalid_transition");
            var version = current.Version + 1;
            var updated = current with { Status = target, Version = version, Events = [.. current.Events, new(target, version, Timestamp())] };
            requests[requestId] = updated;
            return new(200, "updated", Snapshot(updated));
        }
    }

    public WorkflowResult Get(string requestId)
    {
        lock (gate) return requests.TryGetValue(requestId, out var request) ? new(200, "found", Snapshot(request)) : new(404, "not_found");
    }
}
