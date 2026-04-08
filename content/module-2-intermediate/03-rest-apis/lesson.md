# Working with REST APIs

PowerShell makes it easy to interact with REST APIs using the `Invoke-RestMethod` cmdlet, which handles HTTP requests and automatically converts JSON responses into PowerShell objects.

## Making GET Requests

The simplest API call is a GET request. `Invoke-RestMethod` returns parsed objects, not raw text:

```powershell
$posts = Invoke-RestMethod -Uri 'https://jsonplaceholder.typicode.com/posts'
$posts[0].title
```

> **Key Concept:** Unlike `Invoke-WebRequest` (which returns the raw response), `Invoke-RestMethod` automatically parses JSON into PowerShell objects you can immediately work with.

## Adding Headers and Authentication

Many APIs require headers for authentication or content negotiation:

```powershell
$headers = @{
    'Authorization' = 'Bearer your-token-here'
    'Accept'        = 'application/json'
}
$result = Invoke-RestMethod -Uri 'https://api.example.com/data' -Headers $headers
```

## Making POST Requests

To send data, use `-Method Post` with a `-Body`. Convert PowerShell objects to JSON with `ConvertTo-Json`:

```powershell
$body = @{
    title  = 'New Post'
    body   = 'This is the content.'
    userId = 1
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri 'https://jsonplaceholder.typicode.com/posts' `
    -Method Post `
    -Body $body `
    -ContentType 'application/json'
```

> **Key Concept:** Always set `-ContentType 'application/json'` when sending JSON bodies, so the API knows how to parse your request.

## Working with JSON Responses

Responses are already converted to objects, so you can use the pipeline directly:

```powershell
$users = Invoke-RestMethod -Uri 'https://jsonplaceholder.typicode.com/users'
$users | Select-Object name, email | Sort-Object name
```

To convert objects back to JSON (for logging or saving), use `ConvertTo-Json`:

```powershell
$users | ConvertTo-Json -Depth 3 | Out-File 'users.json'
```

## Practical Example: Query a Public API

Here is a complete example that retrieves GitHub repository information:

```powershell
$repo = Invoke-RestMethod -Uri 'https://api.github.com/repos/PowerShell/PowerShell'
'Stars: {0}, Forks: {1}, Language: {2}' -f $repo.stargazers_count, $repo.forks_count, $repo.language
```

## Error Handling

Wrap API calls in `try/catch` to handle failures gracefully:

```powershell
try {
    $data = Invoke-RestMethod -Uri 'https://api.example.com/missing' -ErrorAction Stop
} catch {
    Write-Warning "API call failed: $($_.Exception.Message)"
}
```
