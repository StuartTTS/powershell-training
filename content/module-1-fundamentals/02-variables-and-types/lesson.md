# Variables and Data Types

In PowerShell, variables are storage containers for data. Every variable name starts with a `$` sign, and you create one simply by assigning a value to it.

## Creating and Assigning Variables

```powershell
$name = "Alice"
$age = 30
$isAdmin = $true
```

No declaration keyword is needed — variables spring into existence on first assignment. Variable names are **case-insensitive**, so `$Name` and `$name` refer to the same variable.

> **Key Concept:** PowerShell uses **automatic type detection**. When you assign `42`, the variable becomes an `[int]`. Assign `"hello"`, and it becomes a `[string]`. You can check a variable's type with `.GetType()`.

```powershell
$count = 42
$count.GetType().Name   # Int32

$count = "hello"
$count.GetType().Name   # String
```

## Common Data Types

| Type         | Example                          |
|--------------|----------------------------------|
| `[string]`   | `"Hello World"`                  |
| `[int]`      | `42`                             |
| `[bool]`     | `$true`, `$false`                |
| `[array]`    | `@(1, 2, 3)`                    |
| `[datetime]` | `Get-Date`                       |

## Type Casting

You can force a variable to a specific type by placing the type accelerator before the variable name or the value:

```powershell
[int]$port = "8080"          # converts string "8080" to integer 8080
[string]$code = 404          # converts integer 404 to string "404"
[datetime]$date = "2025-01-15"  # converts string to DateTime object
```

Once a variable is constrained with a type, it rejects incompatible values:

```powershell
[int]$number = 10
$number = "hello"   # Error — "hello" cannot convert to int
```

## The $null Value

`$null` represents the absence of a value. Any variable that has never been assigned is `$null`:

```powershell
$undefined -eq $null   # True
```

> **Key Concept:** Always place `$null` on the left side of comparisons (`$null -eq $var`) to avoid unexpected behavior when `$var` is an array.

Use `$null` to explicitly clear a variable:

```powershell
$data = "something"
$data = $null   # variable now has no value
```
