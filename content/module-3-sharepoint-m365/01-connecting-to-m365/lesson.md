# Connecting to M365

Before you can manage Microsoft 365 resources with PowerShell, you need two modules: **PnP.PowerShell** for SharePoint and **Microsoft.Graph** for users, groups, Teams, and licenses.

## Installing the Modules

Install both modules from the PowerShell Gallery:

```powershell
Install-Module PnP.PowerShell -Scope CurrentUser
Install-Module Microsoft.Graph -Scope CurrentUser
```

> **Key Concept:** Use `-Scope CurrentUser` so you do not need an elevated (admin) prompt. The Microsoft.Graph module is large — it installs many sub-modules. On first install, this can take several minutes.

## Connecting to SharePoint with PnP.PowerShell

Use `Connect-PnPOnline` with the `-Interactive` flag to authenticate through a browser popup. You must provide the URL of the SharePoint site you want to work with:

```powershell
Connect-PnPOnline -Url "https://contoso.sharepoint.com/sites/HR" -Interactive
```

Each connection targets a single site. To switch sites, run `Connect-PnPOnline` again with a different URL.

## Connecting to Microsoft Graph

Use `Connect-MgGraph` and specify the permission scopes your session needs:

```powershell
Connect-MgGraph -Scopes "User.Read.All", "Group.ReadWrite.All"
```

A browser window opens for consent. After you sign in, the session remains active until you explicitly disconnect or close the shell.

> **Key Concept:** Scopes follow a `Resource.Permission` pattern. `User.Read.All` grants read access to all users. Always request the minimum scopes you need — this is the principle of least privilege.

## Disconnecting

Always disconnect when you are finished to clear cached tokens:

```powershell
Disconnect-PnPOnline
Disconnect-MgGraph
```

## Understanding Authentication Flows

Both modules use **delegated authentication** by default — you sign in as yourself, and commands run with your permissions. For unattended scripts (scheduled tasks, automation), you can use **app-only authentication** with a registered Microsoft Entra application and a certificate or client secret.

```powershell
# App-only example with Microsoft Graph
Connect-MgGraph -ClientId "YOUR_APP_ID" -TenantId "YOUR_TENANT_ID" `
    -CertificateThumbprint "YOUR_CERT_THUMBPRINT"
```

Delegated authentication is best for interactive admin work. App-only authentication is best for scheduled automation.
