# Credentials and SecureStrings

Handling credentials securely is critical in automation. PowerShell provides built-in tools to work with usernames and passwords without exposing them as plain text.

## Get-Credential

The `Get-Credential` cmdlet prompts for a username and password, returning a `PSCredential` object:

```powershell
$cred = Get-Credential
$cred = Get-Credential -UserName 'DOMAIN\Admin' -Message 'Enter admin password'
```

> **Key Concept:** Never hard-code passwords in scripts. Always use `Get-Credential` or retrieve credentials from a secure store.

## The PSCredential Object

A `PSCredential` object has two properties: `UserName` (a plain string) and `Password` (a `SecureString`). You can also construct one manually:

```powershell
$user = 'DOMAIN\ServiceAccount'
$pass = Read-Host -Prompt 'Password' -AsSecureString
$cred = [PSCredential]::new($user, $pass)
```

## Working with SecureStrings

A `SecureString` encrypts text in memory. You can convert a plain string to a `SecureString` using `ConvertTo-SecureString`:

```powershell
# From user input (interactive)
$secure = Read-Host -AsSecureString

# From a plain string (use only for testing, not production)
$secure = ConvertTo-SecureString 'MyPassword' -AsPlainText -Force
```

> **Key Concept:** `ConvertTo-SecureString -AsPlainText` is useful for testing but defeats the purpose of a SecureString. In production, always get passwords from interactive prompts or secure stores.

## Storing Credentials Safely with Export-Clixml

`Export-Clixml` serializes a credential object to an XML file. The password is encrypted using the Windows Data Protection API (DPAPI), meaning **only the same user on the same computer** can decrypt it:

```powershell
# Save credentials to file
Get-Credential | Export-Clixml -Path "$HOME\cred.xml"

# Load credentials later (no prompt needed)
$cred = Import-Clixml -Path "$HOME\cred.xml"
```

This pattern is ideal for scheduled tasks and automation scripts that run unattended.

## Using Credentials with Cmdlets

Many cmdlets accept a `-Credential` parameter. Pass the `PSCredential` object directly:

```powershell
$cred = Import-Clixml -Path "$HOME\cred.xml"

# Remoting
Invoke-Command -ComputerName Server01 -Credential $cred -ScriptBlock { hostname }

# File operations on network shares
New-PSDrive -Name S -PSProvider FileSystem -Root '\\Server\Share' -Credential $cred
```

## What NOT to Do

Never store passwords as plain text in your scripts:

```powershell
# WRONG - password visible in source code
$password = 'P@ssw0rd123'

# WRONG - password visible in script file
$cred = New-Object PSCredential('admin', (ConvertTo-SecureString 'P@ssw0rd123' -AsPlainText -Force))
```

> **Key Concept:** If someone can read your script, they can read any plain-text password in it. Use `Export-Clixml`/`Import-Clixml`, Azure Key Vault, or the `SecretManagement` module instead.
