# Working with Files

PowerShell provides a rich set of cmdlets for reading, writing, and managing files. These cmdlets work with text, CSV, and JSON data out of the box.

## Reading and Writing Text Files

Use `Get-Content` to read a file (returns an array of lines) and `Set-Content` to write content (overwrites the file):

```powershell
$lines = Get-Content -Path ".\config.txt"
Set-Content -Path ".\output.txt" -Value "Hello, World!"
```

To **append** to an existing file instead of overwriting, use `Add-Content`:

```powershell
Add-Content -Path ".\log.txt" -Value "New log entry"
```

`Out-File` is similar to `Set-Content` but preserves PowerShell's formatting. It is what the `>` redirect operator uses internally:

```powershell
Get-Process | Out-File -Path ".\processes.txt"
```

> **Key Concept:** `Set-Content` writes raw strings. `Out-File` writes the formatted display output of objects. For data you plan to process later, prefer `Set-Content` or `Export-Csv`.

## Checking If a Path Exists

Always verify a path before reading or writing:

```powershell
if (Test-Path ".\data.csv") {
    $data = Get-Content ".\data.csv"
}
```

## Working with CSV Files

`Import-Csv` reads a CSV file and returns objects with properties matching the column headers. `Export-Csv` does the reverse:

```powershell
$users = Import-Csv -Path ".\users.csv"
$users | Where-Object { $_.Department -eq "IT" } | Export-Csv -Path ".\it-users.csv" -NoTypeInformation
```

## Working with JSON

Convert objects to JSON with `ConvertTo-Json` and parse JSON strings with `ConvertFrom-Json`:

```powershell
$config = @{ Server = "prod-01"; Port = 443 }
$config | ConvertTo-Json | Set-Content ".\config.json"

$loaded = Get-Content ".\config.json" -Raw | ConvertFrom-Json
$loaded.Server   # prod-01
```

> **Key Concept:** Use `-Raw` with `Get-Content` when reading JSON files. Without it, `Get-Content` returns an array of lines, which `ConvertFrom-Json` may not parse correctly.

## Building File Paths Safely

Use `Join-Path` and `Split-Path` instead of string concatenation to build cross-platform paths:

```powershell
$fullPath = Join-Path -Path $HOME -ChildPath "Documents\report.csv"
$folder   = Split-Path -Path $fullPath -Parent     # parent directory
$fileName = Split-Path -Path $fullPath -Leaf        # file name only
```
