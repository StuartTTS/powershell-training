# User and License Management

The Microsoft Graph PowerShell module provides complete user lifecycle management, from creating accounts to assigning licenses.

## Getting User Information

Retrieve users from your tenant:

```powershell
# Get all users
Get-MgUser -All

# Get a specific user by UPN
Get-MgUser -UserId "alex@contoso.com"

# Select specific properties
Get-MgUser -All -Property DisplayName, UserPrincipalName, Department `
    | Select-Object DisplayName, UserPrincipalName, Department
```

> **Key Concept:** Microsoft Graph cmdlets return a limited set of properties by default. Use the `-Property` parameter to request additional fields, and pipe to `Select-Object` to shape your output.

## Creating New Users

Create a user account with `New-MgUser`:

```powershell
$passwordProfile = @{
    Password                      = "TempP@ss123!"
    ForceChangePasswordNextSignIn = $true
}

New-MgUser -DisplayName "Pat Johnson" `
    -UserPrincipalName "pat@contoso.com" `
    -MailNickname "pat" `
    -AccountEnabled:$true `
    -PasswordProfile $passwordProfile
```

## Updating Users

Modify existing user properties with `Update-MgUser`:

```powershell
Update-MgUser -UserId "pat@contoso.com" `
    -Department "Engineering" -JobTitle "Developer"
```

## Filtering with -Filter

The `-Filter` parameter uses OData syntax for efficient server-side filtering:

```powershell
# Find all users in the Engineering department
Get-MgUser -Filter "department eq 'Engineering'" -All

# Find disabled accounts
Get-MgUser -Filter "accountEnabled eq false" -All
```

## Checking Available Licenses

Use `Get-MgSubscribedSku` to view your tenant's license inventory:

```powershell
Get-MgSubscribedSku | Select-Object SkuPartNumber, ConsumedUnits,
    @{Name="TotalUnits"; Expression={$_.PrepaidUnits.Enabled}}
```

## Assigning Licenses

Assign a license to a user with `Set-MgUserLicense`:

```powershell
$sku = Get-MgSubscribedSku | Where-Object { $_.SkuPartNumber -eq "ENTERPRISEPACK" }

Set-MgUserLicense -UserId "pat@contoso.com" `
    -AddLicenses @(@{SkuId = $sku.SkuId}) `
    -RemoveLicenses @()
```

> **Key Concept:** `Set-MgUserLicense` requires both `-AddLicenses` and `-RemoveLicenses` parameters, even if one is empty. Pass an empty array `@()` for whichever operation you are not performing. The `-AddLicenses` parameter takes an array of hashtables with `SkuId` keys.
