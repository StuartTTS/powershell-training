# PSSessions and Remoting

PowerShell Remoting lets you run commands on remote computers as if you were sitting at their console. It uses the WS-Management (WinRM) protocol on Windows and SSH on cross-platform setups.

## Enabling Remoting

Before you can connect to a remote machine, remoting must be enabled on it:

```powershell
Enable-PSRemoting -Force
```

This configures the WinRM service, creates a listener, and sets firewall rules. It requires administrator privileges on the target machine.

> **Key Concept:** On Windows Server, PSRemoting is enabled by default. On client editions of Windows, you must run `Enable-PSRemoting` manually.

## Interactive Sessions with Enter-PSSession

`Enter-PSSession` opens a one-to-one interactive session on a remote computer. Your prompt changes to show the remote machine name:

```powershell
Enter-PSSession -ComputerName Server01
[Server01]: PS C:\> Get-Service | Where-Object Status -eq 'Running'
[Server01]: PS C:\> Exit-PSSession
```

## One-Off Commands with Invoke-Command

`Invoke-Command` runs a script block on one or more remote computers without entering an interactive session:

```powershell
Invoke-Command -ComputerName Server01, Server02 -ScriptBlock {
    Get-Process | Sort-Object CPU -Descending | Select-Object -First 5
}
```

Results automatically include a `PSComputerName` property so you can tell which machine each result came from.

## Persistent Sessions with New-PSSession

When you need to run multiple commands that share state (variables, imported modules), create a persistent session with `New-PSSession`:

```powershell
$session = New-PSSession -ComputerName Server01

Invoke-Command -Session $session -ScriptBlock { $data = Get-Service }
Invoke-Command -Session $session -ScriptBlock { $data.Count }

Remove-PSSession $session
```

> **Key Concept:** Temporary connections (via `-ComputerName`) create and destroy a session for each command. Persistent sessions (via `New-PSSession`) keep state between calls. Always clean up with `Remove-PSSession`.

## Using Credentials

When connecting to machines where your current account lacks permissions, provide credentials:

```powershell
$cred = Get-Credential

Enter-PSSession -ComputerName Server01 -Credential $cred
Invoke-Command -ComputerName Server01 -Credential $cred -ScriptBlock { hostname }
```

## Running Local Scripts Remotely

You can run an entire local script on remote machines without copying the file:

```powershell
Invoke-Command -ComputerName Server01, Server02 -FilePath C:\Scripts\Audit.ps1
```

PowerShell reads the local file and sends its contents to the remote machines for execution.
