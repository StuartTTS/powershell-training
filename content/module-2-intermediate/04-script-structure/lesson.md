# Script Structure and Best Practices

Moving from one-liners to full scripts requires understanding how PowerShell scripts are organized and what conventions make them maintainable.

## Script Files and Execution Policy

PowerShell scripts are saved as `.ps1` files. Before running scripts, you need an appropriate execution policy:

```powershell
Get-ExecutionPolicy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

> **Key Concept:** `RemoteSigned` is the recommended policy for most users. It allows local scripts to run freely while requiring downloaded scripts to be signed.

## The #Requires Statement

Place `#Requires` at the top of your script to enforce prerequisites. The script will not run if the requirements are not met:

```powershell
#Requires -Version 7.0
#Requires -Modules ActiveDirectory
#Requires -RunAsAdministrator
```

## Comment-Based Help

Add structured help so users can run `Get-Help` on your script. Place the comment block at the top of the file, before the `param` block:

```powershell
<#
.SYNOPSIS
    Exports user data to a CSV file.

.DESCRIPTION
    Retrieves user accounts from Active Directory and exports
    selected properties to a CSV file.

.PARAMETER OutputPath
    The file path for the exported CSV.

.EXAMPLE
    .\Export-Users.ps1 -OutputPath C:\Reports\users.csv
#>
```

## Script-Level Param Block

Define parameters at the top of the script using `param()`. This is how users pass arguments to your script:

```powershell
param(
    [Parameter(Mandatory)]
    [string]$OutputPath,

    [int]$MaxResults = 100,

    [switch]$IncludeDisabled
)
```

## Regions and Organization

Use `#region` and `#endregion` to create collapsible sections in your editor:

```powershell
#region Configuration
$LogPath = Join-Path $PSScriptRoot 'logs'
$Date = Get-Date -Format 'yyyy-MM-dd'
#endregion

#region Main Logic
# Your core script logic here
#endregion
```

> **Key Concept:** `$PSScriptRoot` is an automatic variable that contains the directory of the currently running script. Use it to build paths relative to the script location.

## Naming Conventions

Follow these community-standard conventions for readable scripts:

- **Cmdlets and functions:** Use `Verb-Noun` format with approved verbs (`Get-Verb` lists them)
- **Variables:** Use `PascalCase` (e.g., `$UserName`, `$OutputPath`)
- **Parameters:** Use `PascalCase` with descriptive names
- **Script files:** Use `Verb-Noun.ps1` naming (e.g., `Export-UserReport.ps1`)

## Putting It All Together

A well-structured script follows this order:

```powershell
#Requires -Version 7.0

<#
.SYNOPSIS
    Brief description of the script.
#>

param(
    [Parameter(Mandatory)]
    [string]$InputPath
)

#region Main Logic
# Script body here
#endregion
```
