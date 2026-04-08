# Strings, Arrays, and Hashtables

These three data structures form the backbone of everyday PowerShell scripting.

## Strings: Single vs Double Quotes

**Double quotes** expand variables and escape sequences. **Single quotes** treat everything as literal text:

```powershell
$name = "Alice"
"Hello, $name!"    # Hello, Alice!
'Hello, $name!'    # Hello, $name!
```

Use `$()` inside double quotes to evaluate expressions:

```powershell
"There are $($items.Count) items."
```

> **Key Concept:** Use single quotes when you want the exact literal string. Use double quotes when you need variable expansion or special characters like `` `n `` (newline).

## String Methods

Strings in PowerShell are .NET objects, so they have built-in methods:

```powershell
"hello world".ToUpper()              # HELLO WORLD
"hello world".Replace("world", "PS") # hello PS
"one,two,three".Split(",")           # array: one two three
"  spaces  ".Trim()                  # spaces
```

## Arrays

Create arrays with `@()` or comma-separated values. Access elements by zero-based index:

```powershell
$colors = @("red", "green", "blue")
$colors[0]     # red
$colors[-1]    # blue (last element)
$colors += "yellow"   # adds to the array
$colors.Count  # 4
```

Use the range operator to create number sequences:

```powershell
$nums = 1..5   # array: 1, 2, 3, 4, 5
```

> **Key Concept:** The `+=` operator creates a **new array** behind the scenes. For small arrays this is fine, but for large-scale operations, use a `[System.Collections.Generic.List[object]]` instead.

## Hashtables

A hashtable stores **key-value pairs** using `@{}`:

```powershell
$person = @{
    Name = "Alice"
    Age  = 30
    City = "Seattle"
}
$person["Name"]   # Alice
$person.Age       # 30
$person["Role"] = "Admin"   # add a new key
```

## Ordered Hashtables

Regular hashtables do not guarantee key order. Use `[ordered]` when order matters:

```powershell
$config = [ordered]@{
    Host = "localhost"
    Port = 8080
    SSL  = $true
}
```

This preserves the order you defined the keys in, which is important for display and CSV export.
