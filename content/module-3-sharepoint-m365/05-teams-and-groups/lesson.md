# Managing Teams and Groups

Microsoft 365 uses groups extensively. The Microsoft Graph PowerShell module lets you manage M365 Groups, Security Groups, and Teams from a single set of cmdlets.

## Understanding Group Types

| Type | Purpose | Has Mailbox | Has Team Site |
|------|---------|-------------|---------------|
| **M365 Group** | Collaboration (email, files, calendar) | Yes | Yes |
| **Security Group** | Access control and licensing | No | No |
| **Team** | An M365 Group with Microsoft Teams enabled | Yes | Yes |

> **Key Concept:** Every Microsoft Team is backed by an M365 Group, but not every M365 Group has a Team. When you create a Team, a group is created automatically.

## Working with Groups

List and create groups using `Get-MgGroup` and `New-MgGroup`:

```powershell
# Get all groups
Get-MgGroup -All

# Filter for a specific group
Get-MgGroup -Filter "displayName eq 'Engineering'"

# Create a new M365 Group
New-MgGroup -DisplayName "Design Team" -MailEnabled:$true `
    -MailNickname "designteam" -SecurityEnabled:$false `
    -GroupTypes "Unified"
```

To create a security group instead, set `-MailEnabled:$false`, `-SecurityEnabled:$true`, and omit `-GroupTypes`.

## Working with Teams

Retrieve Teams information and create channels:

```powershell
# Get a specific team (requires the group ID)
$group = Get-MgGroup -Filter "displayName eq 'Engineering'"
Get-MgTeam -TeamId $group.Id

# Create a new channel
New-MgTeamChannel -TeamId $group.Id `
    -DisplayName "Code Reviews" -Description "Channel for code review discussions"
```

## Managing Group Members

Add users to a group using `New-MgGroupMember`:

```powershell
$group = Get-MgGroup -Filter "displayName eq 'Design Team'"
$user = Get-MgUser -Filter "userPrincipalName eq 'alex@contoso.com'"

New-MgGroupMember -GroupId $group.Id `
    -DirectoryObjectId $user.Id
```

To view current members of a group:

```powershell
Get-MgGroupMember -GroupId $group.Id | ForEach-Object {
    Get-MgUser -UserId $_.Id | Select-Object DisplayName, UserPrincipalName
}
```

> **Key Concept:** Microsoft Graph cmdlets use object IDs (GUIDs) to reference resources, not display names. You typically look up the ID first with `Get-MgGroup` or `Get-MgUser`, then pass it to other cmdlets.
