# Regular Expressions and Strings

Regular expressions (regex) let you search, match, and transform text using patterns. PowerShell integrates regex directly into its operators.

## The -match Operator and $Matches

The `-match` operator tests if a string matches a regex pattern. When it succeeds, the automatic `$Matches` hashtable captures the result:

```powershell
'Server-042' -match 'Server-(\d+)'
$Matches[0]   # Full match: Server-042
$Matches[1]   # First capture group: 042
```

Use **named captures** for clearer code:

```powershell
'admin@contoso.com' -match '(?<user>.+)@(?<domain>.+)'
$Matches.user    # admin
$Matches.domain  # contoso.com
```

> **Key Concept:** `$Matches` is only populated on a successful `-match`. It persists until the next `-match` call, so always check the boolean result first.

## The -replace Operator

`-replace` uses regex to find and substitute text. Capture groups are referenced with `$1`, `$2`, etc.:

```powershell
'2025-04-07' -replace '(\d{4})-(\d{2})-(\d{2})', '$2/$3/$1'
# Result: 04/07/2025
```

## .NET Regex Methods

For advanced scenarios, use the `[regex]` .NET class. `[regex]::Match()` returns a single match, while `[regex]::Matches()` returns all matches:

```powershell
$text = 'IPs: 10.0.0.1 and 192.168.1.5'
$pattern = '\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}'
[regex]::Matches($text, $pattern) | ForEach-Object { $_.Value }
```

## Common Patterns

| Pattern | Matches |
|---|---|
| `\d+` | One or more digits |
| `\w+` | Word characters |
| `[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}` | Email (simplified) |
| `\d{1,3}(\.\d{1,3}){3}` | IPv4 address |

## String Formatting with -f

The `-f` operator inserts values into placeholders:

```powershell
'Hello, {0}! You have {1} items.' -f 'Alice', 5
'{0:N2} GB' -f (1073741824 / 1GB)   # 1.00 GB
```

## Here-Strings

Here-strings preserve multi-line text. Use `@" "@` for expandable strings or `@' '@` for literal strings:

```powershell
$name = 'World'
$expandable = @"
Hello, $name!
This preserves "quotes" and line breaks.
"@

$literal = @'
No $variables expanded here.
Everything is literal.
'@
```

> **Key Concept:** Here-strings are ideal for embedding JSON templates, multi-line messages, or any text that contains quotes and special characters.
