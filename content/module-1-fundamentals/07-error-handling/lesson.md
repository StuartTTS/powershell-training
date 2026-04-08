# Error Handling

PowerShell produces two kinds of errors: **terminating** errors that stop execution, and **non-terminating** errors that report a problem but continue running the next statement. Understanding the difference is essential for writing robust scripts.

## Terminating vs Non-Terminating Errors

- **Non-terminating:** Most cmdlet errors (e.g., `Get-Item` on a file that does not exist). The cmdlet reports the error and moves on.
- **Terminating:** Errors from the `throw` keyword, .NET exceptions, or cmdlets that encounter critical failures. These stop the current pipeline or script unless caught.

## Controlling Error Behavior

Use `$ErrorActionPreference` to change how non-terminating errors behave for an entire session or script:

```powershell
$ErrorActionPreference = "Stop"   # Treat all errors as terminating
```

Or use the `-ErrorAction` parameter on individual cmdlets:

```powershell
Get-Item "C:\nonexistent" -ErrorAction SilentlyContinue
```

> **Key Concept:** Setting `-ErrorAction Stop` on a cmdlet converts its non-terminating errors into terminating errors, allowing `try/catch` to intercept them.

## try / catch / finally

Wrap risky code in a `try` block and handle failures in `catch`. The `finally` block always runs, whether or not an error occurred:

```powershell
try {
    $content = Get-Content "C:\data\config.txt" -ErrorAction Stop
    Write-Output "File loaded successfully."
} catch {
    Write-Output "Error: $_"
} finally {
    Write-Output "Cleanup complete."
}
```

Inside the `catch` block, `$_` (or `$PSItem`) holds the **ErrorRecord** object. You can access details like `$_.Exception.Message` or `$_.ScriptStackTrace`.

## Write-Error vs throw

These two look similar but behave differently:

```powershell
Write-Error "Something went wrong"   # Non-terminating by default
throw "Something went wrong"         # Always terminating
```

- **`Write-Error`** writes to the error stream but execution continues.
- **`throw`** immediately stops execution and can be caught by `try/catch`.

> **Key Concept:** Use `throw` when the error is severe enough that the script cannot continue. Use `Write-Error` when you want to report a problem but let the caller decide how to handle it.

## Catching Specific Exceptions

You can filter `catch` blocks by .NET exception type to handle different errors differently:

```powershell
try {
    $value = [int]"not_a_number"
} catch [System.FormatException] {
    Write-Output "Invalid number format."
} catch {
    Write-Output "Unexpected error: $_"
}
```
