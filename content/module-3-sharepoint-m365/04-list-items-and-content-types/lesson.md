# List Items and Content Types

SharePoint lists store rows of data called **list items**. Each item has fields (columns) that hold values. PnP PowerShell gives you full CRUD (Create, Read, Update, Delete) control over list items.

## Reading List Items

Retrieve all items from a list:

```powershell
Get-PnPListItem -List "Projects"
```

For large lists, use a CAML query with the `-Query` parameter to filter server-side and improve performance:

```powershell
$query = "<View><Query><Where>
    <Eq><FieldRef Name='Status'/><Value Type='Text'>Active</Value></Eq>
</Where></Query></View>"

Get-PnPListItem -List "Projects" -Query $query
```

> **Key Concept:** CAML (Collaborative Application Markup Language) is SharePoint's XML-based query language. Using `-Query` filters data on the server, which is far more efficient than retrieving all items and filtering locally with `Where-Object`.

## Adding New Items

Create a new list item by passing a hashtable of field values:

```powershell
Add-PnPListItem -List "Projects" -Values @{
    Title       = "Website Redesign"
    Status      = "Active"
    Priority    = "High"
}
```

## Updating Items

Update an existing item by its ID:

```powershell
Set-PnPListItem -List "Projects" -Identity 5 -Values @{
    Status = "Completed"
}
```

## Deleting Items

Remove a list item by ID. Use `-Force` to skip confirmation:

```powershell
Remove-PnPListItem -List "Projects" -Identity 5 -Force
```

## Content Types

Content types define reusable sets of columns and behaviors. View available content types with:

```powershell
Get-PnPContentType
```

To see content types specific to a list:

```powershell
Get-PnPContentType -List "Projects"
```

## Adding Content Types to Lists

Apply an existing site content type to a list:

```powershell
Add-PnPContentTypeToList -List "Projects" `
    -ContentType "Document" -DefaultContentType
```

> **Key Concept:** The `-DefaultContentType` switch makes the added content type the default for new items. Without it, the content type is available but not pre-selected when users create items.
