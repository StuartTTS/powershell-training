# Functions and Parameters

Functions let you package reusable blocks of code under a name you can call anytime. In PowerShell, you define a function with the `function` keyword and should follow the **Verb-Noun** naming convention — just like built-in cmdlets.

## Defining a Simple Function

```powershell
function Get-Greeting {
    "Hello, World!"
}

Get-Greeting   # outputs: Hello, World!
```

## Adding Parameters with param()

Use a `param()` block inside the function to declare parameters. You can specify types and default values:

```powershell
function Get-Greeting {
    param(
        [string]$Name = "World"
    )
    "Hello, $Name!"
}

Get-Greeting -Name "Alice"   # Hello, Alice!
Get-Greeting                 # Hello, World!
```

> **Key Concept:** Always declare parameters inside a `param()` block rather than in parentheses after the function name. The `param()` style is the standard for PowerShell and supports advanced features like validation attributes.

## Mandatory Parameters

Mark a parameter as required using the `[Parameter(Mandatory)]` attribute:

```powershell
function New-UserReport {
    param(
        [Parameter(Mandatory)]
        [string]$Username,

        [int]$Year = (Get-Date).Year
    )
    "Report for $Username - Year: $Year"
}
```

If the caller omits `-Username`, PowerShell will prompt for it automatically.

## Parameter Types

Adding a type constraint like `[string]`, `[int]`, or `[bool]` tells PowerShell to validate and convert input:

```powershell
function Get-Square {
    param([int]$Number)
    $Number * $Number
}

Get-Square -Number 7   # 49
```

## Return Values

PowerShell functions return **any output** that is not captured or redirected. You can also use the `return` keyword, which outputs a value and exits the function:

```powershell
function Test-EvenNumber {
    param([int]$Number)
    if ($Number % 2 -eq 0) { return $true }
    return $false
}
```

> **Key Concept:** In PowerShell, every uncaptured expression in a function becomes part of the output. Use `return` when you want to exit early, but remember it does not suppress other output that occurred before it.
