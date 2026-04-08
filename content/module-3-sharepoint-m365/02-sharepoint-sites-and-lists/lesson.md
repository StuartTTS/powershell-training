# Managing SharePoint Sites and Lists

Once connected with `Connect-PnPOnline`, you can create and manage SharePoint sites, lists, and columns entirely from PowerShell.

## Getting Site Information

Retrieve details about the site you are connected to:

```powershell
Get-PnPSite                   # Returns the site collection object
Get-PnPWeb                    # Returns the current web (subsite) object
Get-PnPWeb | Select-Object Title, Url, Language
```

> **Key Concept:** In SharePoint, a **site collection** (returned by `Get-PnPSite`) is the top-level container. A **web** (returned by `Get-PnPWeb`) is an individual site or subsite within that collection.

## Creating New Sites

Use `New-PnPSite` to create communication or team sites. The `-Type` parameter controls which kind:

```powershell
# Communication site
New-PnPSite -Type CommunicationSite -Title "Company News" `
    -Url "https://contoso.sharepoint.com/sites/CompanyNews"

# Team site (backed by an M365 Group)
New-PnPSite -Type TeamSite -Title "Engineering" -Alias "Engineering"
```

Communication sites are for broadcasting content. Team sites are collaboration spaces tied to a Microsoft 365 Group.

## Working with Lists

Lists are the core data structure in SharePoint. Retrieve, create, and remove them with these cmdlets:

```powershell
# Get all lists on the current site
Get-PnPList

# Get a specific list by title
Get-PnPList -Identity "Projects"

# Create a new generic list
New-PnPList -Title "Inventory" -Template GenericList

# Create a document library
New-PnPList -Title "Proposals" -Template DocumentLibrary
```

## Adding Columns (Fields)

After creating a list, add custom columns with `Add-PnPField`:

```powershell
Add-PnPField -List "Inventory" -DisplayName "SKU" `
    -InternalName "SKU" -Type Text

Add-PnPField -List "Inventory" -DisplayName "Quantity" `
    -InternalName "Quantity" -Type Number
```

> **Key Concept:** Always specify both `-DisplayName` (what users see) and `-InternalName` (used in code and queries). The internal name cannot be changed after creation, so choose it carefully.

## Removing a List

To delete a list, use `Remove-PnPList`. Add `-Force` to skip the confirmation prompt:

```powershell
Remove-PnPList -Identity "Inventory" -Force
```
