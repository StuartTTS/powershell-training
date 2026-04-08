# Bulk Operations

Real-world administration often means performing the same action on hundreds or thousands of items. PowerShell excels at bulk operations by combining CSV files, loops, and error handling.

## Reading Input from CSV

Use `Import-Csv` to load a structured data file. Each row becomes a PowerShell object, and column headers become property names:

```powershell
$users = Import-Csv -Path "C:\Data\new-users.csv"
$users[0].DisplayName   # Access the first user's DisplayName column
```

A typical CSV for user creation might look like:

```
DisplayName,UserPrincipalName,Department,MailNickname
Pat Johnson,pat@contoso.com,Engineering,pat
Sam Lee,sam@contoso.com,Sales,sam
```

## Processing with ForEach

Loop through each row and execute a command:

```powershell
$users = Import-Csv -Path "C:\Data\new-users.csv"

foreach ($user in $users) {
    $passwordProfile = @{
        Password = "TempP@ss123!"
        ForceChangePasswordNextSignIn = $true
    }
    New-MgUser -DisplayName $user.DisplayName `
        -UserPrincipalName $user.UserPrincipalName `
        -MailNickname $user.MailNickname `
        -Department $user.Department `
        -AccountEnabled:$true `
        -PasswordProfile $passwordProfile
}
```

## Adding Items to SharePoint Lists in Bulk

The same pattern works for populating SharePoint lists:

```powershell
$items = Import-Csv -Path "C:\Data\inventory.csv"

foreach ($item in $items) {
    Add-PnPListItem -List "Inventory" -Values @{
        Title    = $item.ProductName
        SKU      = $item.SKU
        Quantity = [int]$item.Quantity
    }
}
```

## Error Handling in Bulk Operations

Wrap each iteration in `try/catch` so one failure does not stop the entire batch:

```powershell
foreach ($user in $users) {
    try {
        New-MgUser -DisplayName $user.DisplayName `
            -UserPrincipalName $user.UserPrincipalName `
            -AccountEnabled:$true -MailNickname $user.MailNickname `
            -PasswordProfile $passwordProfile
        Write-Host "Created: $($user.DisplayName)" -ForegroundColor Green
    }
    catch {
        Write-Warning "Failed: $($user.DisplayName) - $_"
    }
}
```

> **Key Concept:** Always use `try/catch` inside bulk loops. Without it, a single bad row (duplicate account, invalid email) will abort the entire operation. Logging successes and failures helps you track what happened.

## Tracking Progress

For large batches, `Write-Progress` gives users a visual status bar:

```powershell
$total = $users.Count
for ($i = 0; $i -lt $total; $i++) {
    Write-Progress -Activity "Creating users" `
        -Status "$($i+1) of $total" `
        -PercentComplete (($i / $total) * 100)

    # ... create user logic here ...
}
Write-Progress -Activity "Creating users" -Completed
```
