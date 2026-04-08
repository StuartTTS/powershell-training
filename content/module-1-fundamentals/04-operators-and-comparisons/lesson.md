# Operators and Comparisons

PowerShell uses named operators for comparisons instead of symbols like `==` or `!=`. This avoids conflicts with the `>` redirection operator and keeps syntax unambiguous.

## Comparison Operators

| Operator | Meaning                  | Example               |
|----------|--------------------------|-----------------------|
| `-eq`    | Equal to                 | `5 -eq 5`   → `True`  |
| `-ne`    | Not equal to             | `5 -ne 3`   → `True`  |
| `-gt`    | Greater than             | `10 -gt 5`  → `True`  |
| `-lt`    | Less than                | `3 -lt 7`   → `True`  |
| `-ge`    | Greater than or equal    | `5 -ge 5`   → `True`  |
| `-le`    | Less than or equal       | `4 -le 5`   → `True`  |

> **Key Concept:** Comparison operators are **case-insensitive** by default. Add a `c` prefix for case-sensitive versions: `-ceq`, `-cne`, `-cgt`, etc.

## String Operators: Wildcards and Regex

**`-like`** uses wildcard patterns (`*` matches any characters, `?` matches one):

```powershell
"PowerShell" -like "Power*"     # True
"PowerShell" -like "P??er*"     # True
```

**`-match`** uses **regular expressions** and populates the `$Matches` automatic variable:

```powershell
"Error 404" -match "\d+"        # True
$Matches[0]                      # 404
```

**`-replace`** performs regex-based substitution:

```powershell
"2025-01-15" -replace "-", "/"  # 2025/01/15
"Hello World" -replace "World", "PowerShell"  # Hello PowerShell
```

## Logical Operators

Combine conditions with logical operators:

```powershell
$age = 25
($age -ge 18) -and ($age -lt 65)   # True
($age -lt 13) -or ($age -gt 65)    # False
-not ($age -eq 30)                  # True
```

> **Key Concept:** `-and` and `-or` use **short-circuit evaluation** — PowerShell stops evaluating as soon as the result is determined.

## Arithmetic Operators

```powershell
10 + 3    # 13
10 - 3    # 7
10 * 3    # 30
10 / 3    # 3.33333333333333
10 % 3    # 1 (modulus — remainder)
```

PowerShell also supports `+=`, `-=`, `*=`, and `/=` shorthand:

```powershell
$count = 10
$count += 5   # $count is now 15
```
