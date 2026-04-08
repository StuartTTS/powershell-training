# The Pipeline in Depth

In Module 1 you learned that the pipeline passes **objects** between cmdlets. Now let's master the cmdlets that make the pipeline truly powerful.

## Filtering with Where-Object

`Where-Object` filters objects based on a condition. The `$_` variable represents the **current object** in the pipeline:

```powershell
Get-Service | Where-Object { $_.Status -eq 'Running' }
Get-Process | Where-Object { $_.CPU -gt 50 }
```

> **Key Concept:** `$_` (or `$PSItem`) is the automatic variable that refers to the current pipeline object. You'll use it constantly.

## Selecting Properties with Select-Object

`Select-Object` picks which properties to display or limits how many objects are returned:

```powershell
Get-Process | Select-Object Name, CPU, Id -First 5
Get-Service | Select-Object -ExpandProperty Name
```

## Sorting and Grouping

`Sort-Object` orders results, while `Group-Object` clusters them by a property value:

```powershell
Get-Process | Sort-Object CPU -Descending
Get-Service | Group-Object Status
```

## Measuring with Measure-Object

`Measure-Object` counts items or calculates sums, averages, minimums, and maximums:

```powershell
Get-Process | Measure-Object -Property CPU -Sum -Average
Get-ChildItem | Measure-Object -Property Length -Sum
```

## ForEach-Object vs foreach

`ForEach-Object` runs in the **pipeline** and processes items one at a time as they stream through. The `foreach` **statement** collects all items first, then iterates:

```powershell
# Pipeline version — streams objects
Get-Service | ForEach-Object { $_.DisplayName.ToUpper() }

# Statement version — collects all first, then loops
foreach ($svc in Get-Service) {
    $svc.DisplayName.ToUpper()
}
```

> **Key Concept:** Use `ForEach-Object` (alias `%`) in pipelines for streaming. Use the `foreach` statement in scripts when you need the full collection or better performance on large datasets already in memory.

## Chaining It All Together

The real power comes from combining these cmdlets into a single pipeline:

```powershell
Get-Process |
    Where-Object { $_.CPU -gt 10 } |
    Sort-Object CPU -Descending |
    Select-Object Name, CPU -First 5
```

This filters processes by CPU usage, sorts them highest-first, and returns the top 5.
