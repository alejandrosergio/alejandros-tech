using System.Text.Json;
using WorkflowDomain;

var json = new JsonSerializerOptions(JsonSerializerDefaults.Web);
using var fixture = JsonDocument.Parse(File.ReadAllText(Path.Combine(AppContext.BaseDirectory, "fixtures.json")));
var checks = 0;
void Check(bool condition, string label) { checks++; if (!condition) throw new InvalidOperationException(label); }
foreach (var scenario in fixture.RootElement.GetProperty("scenarios").EnumerateArray())
{
    var store = new WorkflowStore();
    foreach (var step in scenario.GetProperty("steps").EnumerateArray())
    {
        var operation = step.GetProperty("operation").GetString();
        var result = operation switch
        {
            "create" => store.Create(step.GetProperty("payload").Deserialize<CreateRequest>(json)!, step.GetProperty("key").GetString()),
            "transition" => store.Transition(step.GetProperty("requestId").GetString()!, step.GetProperty("action").GetString(), step.GetProperty("expectedVersion").GetInt32()),
            "get" => store.Get(step.GetProperty("requestId").GetString()!),
            _ => throw new InvalidOperationException("Unknown fixture operation")
        };
        var expected = step.GetProperty("expected");
        Check(result.Status == expected.GetProperty("status").GetInt32(), "HTTP status: " + scenario.GetProperty("name"));
        Check(result.Code == expected.GetProperty("code").GetString(), "Outcome code");
        Check(store.Count == expected.GetProperty("count").GetInt32(), "Record count");
        if (expected.TryGetProperty("state", out var state)) Check(result.Request?.Status == state.GetString(), "State");
        if (expected.TryGetProperty("version", out var version)) Check(result.Request?.Version == version.GetInt32(), "Version");
    }
}
var concurrent = new WorkflowStore();
var payload = new CreateRequest("REQ-RACE", "Concurrent duplicate request", "integration", "normal");
var responses = await Task.WhenAll(Enumerable.Range(0, 24).Select(_ => Task.Run(() => concurrent.Create(payload, "concurrent-key-001"))));
Check(concurrent.Count == 1, "Concurrent duplicates create one record");
Check(responses.Count(result => result.Status == 201) == 1, "One creation acknowledgement");
Check(responses.Count(result => result.Code == "replayed") == 23, "Other callers replay the existing resource");
var approvals = await Task.WhenAll(Enumerable.Range(0, 12).Select(_ => Task.Run(() => concurrent.Transition("REQ-RACE", "review", 1))));
Check(approvals.Count(result => result.Status == 200) == 1, "One version transition wins");
Check(approvals.Count(result => result.Code == "version_conflict") == 11, "Stale concurrent transitions are rejected");
var limited = new WorkflowStore(capacity: 1);
limited.Create(payload, "capacity-key-001");
Check(limited.Create(payload with { RequestId = "REQ-LIMIT" }, "capacity-key-002").Status == 503, "Capacity is bounded");
Check(limited.Create(payload, "capacity-key-001").Status == 200, "Replay still works at capacity");
Console.WriteLine(JsonSerializer.Serialize(new { passed = true, checks, scenarios = 2, concurrency = true }));
