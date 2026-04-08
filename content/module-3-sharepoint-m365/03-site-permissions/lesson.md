# Managing Site Permissions

SharePoint permissions control who can view, edit, and manage site content. PnP PowerShell lets you manage groups, members, and sharing settings programmatically.

## Viewing Site Groups

Every SharePoint site has default groups (Owners, Members, Visitors). List them all with:

```powershell
Get-PnPSiteGroup
```

To see details for a specific group, including its permission roles:

```powershell
Get-PnPSiteGroup -Group "Contoso Members"
```

## Setting Group Permissions

Change the permission level assigned to a group using `Set-PnPGroupPermissions`:

```powershell
Set-PnPGroupPermissions -Identity "Contoso Visitors" `
    -AddRole "Edit" -RemoveRole "Read"
```

> **Key Concept:** SharePoint uses **permission levels** like Full Control, Edit, Contribute, and Read. These levels are collections of individual permissions. You assign levels to groups, then add users to groups.

## Adding Members to Groups

Add users to an existing SharePoint group:

```powershell
Add-PnPGroupMember -Group "Contoso Members" `
    -LoginName "user@contoso.com"
```

You can also add multiple users by repeating the command or piping a list of email addresses through a `ForEach-Object` loop.

## Breaking Permission Inheritance

By default, subsites and lists inherit permissions from their parent. You can break this inheritance to set unique permissions:

```powershell
Set-PnPList -Identity "Confidential Docs" -BreakRoleInheritance
```

After breaking inheritance, the list keeps a copy of its parent permissions. You can then modify them independently.

## Site Design Rights

If you create custom site designs, you can grant specific users the right to apply them:

```powershell
Grant-PnPSiteDesignRights -Identity "YOUR-SITE-DESIGN-ID" `
    -Principals "user@contoso.com" -Rights View
```

## External Sharing

Control whether a site allows sharing with people outside your organization:

```powershell
# Check current sharing capability
Get-PnPSite -Includes SharingCapability

# Set sharing level using Set-PnPSite
Set-PnPSite -Identity "https://contoso.sharepoint.com/sites/HR" `
    -SharingCapability ExternalUserSharingOnly
```

> **Key Concept:** Sharing levels range from `Disabled` (no external sharing) to `ExternalUserAndGuestSharing` (most permissive). Tenant-level settings override site-level settings, so your site cannot be more permissive than the tenant allows.
