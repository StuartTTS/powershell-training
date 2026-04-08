# What is PowerShell?

PowerShell is a cross-platform task automation solution made up of a command-line shell, a scripting language, and a configuration management framework. Unlike traditional shells that work with text, PowerShell works with **objects** — structured data that you can filter, sort, and manipulate.

## Cmdlets

The basic commands in PowerShell are called **cmdlets** (pronounced "command-lets"). They follow a consistent `Verb-Noun` naming pattern:

```powershell
Get-Process
Get-Service
Set-Location
```

> **Key Concept:** The Verb-Noun pattern makes cmdlets discoverable. If you need to get something, the cmdlet probably starts with `Get-`. Need to change something? Try `Set-`.

## The Pipeline

PowerShell's pipeline (`|`) passes **objects** (not just text) from one cmdlet to the next:

```powershell
Get-Process | Where-Object { $_.CPU -gt 100 }
```

This gets all running processes, then filters to only those using more than 100 seconds of CPU time.

## Get-Help

When you're unsure about a cmdlet, `Get-Help` is your best friend:

```powershell
Get-Help Get-Process
Get-Help Get-Process -Examples
Get-Help Get-Process -Full
```

> **Key Concept:** Always try `Get-Help <cmdlet> -Examples` first — real examples are the fastest way to learn how a cmdlet works.

## Get-Command

Use `Get-Command` to discover cmdlets:

```powershell
Get-Command -Verb Get
Get-Command -Noun Process
Get-Command *service*
```
