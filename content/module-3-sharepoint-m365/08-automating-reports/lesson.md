# Automating Reports and Exports

A major benefit of PowerShell automation is generating repeatable reports. You can query M365 data, shape it, and export it to CSV, all in a few lines.

## Exporting User Reports

Build a user report by selecting the properties you need and exporting to CSV:

```powershell
Get-MgUser -All -Property DisplayName, Department, JobTitle, AccountEnabled |
    Select-Object DisplayName, Department, JobTitle, AccountEnabled |
    Export-Csv -Path "C:\Reports\users.csv" -NoTypeInformation
```

> **Key Concept:** Always include `-NoTypeInformation` with `Export-Csv`. Without it, PowerShell adds a `#TYPE` header row that clutters the output file.

## SharePoint Site Usage Reports

Gather information about all sites or specific lists:

```powershell
Get-PnPList | Select-Object Title, ItemCount, LastItemModifiedDate |
    Export-Csv -Path "C:\Reports\lists.csv" -NoTypeInformation
```

## Group Membership Reports

Export the members of a specific group to a file:

```powershell
$group = Get-MgGroup -Filter "displayName eq 'Engineering'"
Get-MgGroupMember -GroupId $group.Id -All |
    ForEach-Object { Get-MgUser -UserId $_.Id } |
    Select-Object DisplayName, UserPrincipalName, JobTitle |
    Export-Csv -Path "C:\Reports\engineering-members.csv" -NoTypeInformation
```

## Formatting Output for the Console

When reviewing data interactively (not exporting), use `Format-Table` and `Format-List`:

```powershell
# Table format — good for lists of items
Get-MgUser -All | Format-Table DisplayName, Department, JobTitle -AutoSize

# List format — good for detailed single-object views
Get-MgUser -UserId "pat@contoso.com" | Format-List *
```

> **Key Concept:** `Format-Table` and `Format-List` are for **display only**. Never pipe formatted output to `Export-Csv` or other cmdlets — the data will be corrupted. Always use `Select-Object` before exporting.

## Selecting Clean Output

Use `Select-Object` to choose and rename columns for clean reports:

```powershell
Get-MgUser -All -Property DisplayName, CreatedDateTime |
    Select-Object DisplayName,
        @{Name="Created"; Expression={$_.CreatedDateTime}} |
    Sort-Object Created -Descending
```

## Scheduling Scripts

To run reports automatically, save your script as a `.ps1` file and use Windows Task Scheduler:

1. Open Task Scheduler and create a new task.
2. Set the trigger (e.g., daily at 7 AM).
3. Set the action to run `pwsh.exe` (PowerShell 7) or `powershell.exe` with the argument `-File "C:\Scripts\report.ps1"`.

For scheduled scripts, use **app-only authentication** (certificate-based) so the script can run without a user signing in interactively.

```powershell
# Example: scheduled script header
Connect-MgGraph -ClientId $appId -TenantId $tenantId `
    -CertificateThumbprint $thumbprint
# ... generate report ...
Disconnect-MgGraph
```
