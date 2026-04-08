# Modules

Modules are packages of PowerShell commands -- cmdlets, functions, variables, and more -- bundled together for easy distribution and reuse. They are how the PowerShell ecosystem extends beyond the built-in commands.

## Why Modules Matter

Instead of writing everything from scratch, you can install modules that provide ready-made commands for Azure, Microsoft 365, databases, and thousands of other tasks. Modules keep your scripts concise and let you leverage community-tested code.

## Discovering Loaded Modules

Use `Get-Module` to see what is currently loaded in your session:

```powershell
Get-Module
```

To see **all** modules installed on your system (not just loaded ones), add `-ListAvailable`:

```powershell
Get-Module -ListAvailable
```

> **Key Concept:** PowerShell auto-imports modules when you call one of their commands. You rarely need to call `Import-Module` manually, but it is useful when you want to load a specific version or confirm a module is available.

## Finding Modules in the Gallery

The **PowerShell Gallery** (PSGallery) is the central public repository. Use `Find-Module` to search it:

```powershell
Find-Module -Name "*SharePoint*"
Find-Module -Tag "Azure"
```

## Installing Modules

Install a module from the gallery with `Install-Module`:

```powershell
Install-Module -Name Az -Scope CurrentUser
```

The `-Scope CurrentUser` flag installs the module in your personal modules folder, which does not require administrator privileges.

> **Key Concept:** Always review a module before installing. Use `Find-Module -Name <name>` to check the author, download count, and description before running `Install-Module`.

## Importing Modules

Although PowerShell auto-imports modules on first use, you can explicitly load one:

```powershell
Import-Module -Name Az.Accounts
```

This is useful in scripts where you want to guarantee the module is loaded before calling any of its commands.

## Key Modules to Know

| Module | Purpose |
|---|---|
| **Az** | Managing Azure resources |
| **Microsoft.Graph** | Microsoft 365 and Entra ID (Azure AD) |
| **PnP.PowerShell** | SharePoint Online administration |
| **PSReadLine** | Enhanced command-line editing (built-in) |
| **Pester** | Testing framework for PowerShell scripts |
| **ImportExcel** | Read/write Excel files without Excel installed |

## Checking Module Versions

After installing, verify the version with:

```powershell
Get-Module -Name Az -ListAvailable | Select-Object Name, Version
```
