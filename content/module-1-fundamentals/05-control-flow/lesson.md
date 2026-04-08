# Control Flow

Control flow statements let you make decisions and repeat actions in your scripts.

## if / elseif / else

The most fundamental decision structure. The condition must be wrapped in parentheses, and the body goes inside braces:

```powershell
$score = 85

if ($score -ge 90) {
    "Grade: A"
} elseif ($score -ge 80) {
    "Grade: B"
} elseif ($score -ge 70) {
    "Grade: C"
} else {
    "Grade: F"
}
```

## switch Statement

Use `switch` when comparing one value against many possibilities. It is cleaner than a chain of `if/elseif` blocks:

```powershell
$day = "Monday"

switch ($day) {
    "Monday"    { "Start of the week" }
    "Friday"    { "Almost weekend!" }
    "Saturday"  { "Weekend!" }
    "Sunday"    { "Weekend!" }
    default     { "Midweek day" }
}
```

> **Key Concept:** Unlike many languages, PowerShell's `switch` tests **every** case by default and does not fall through. Use `break` inside a case to stop after the first match.

## foreach Loop

Iterates over each item in a collection:

```powershell
$fruits = @("apple", "banana", "cherry")

foreach ($fruit in $fruits) {
    "I like $fruit"
}
```

## for Loop

A counted loop with an initializer, condition, and increment:

```powershell
for ($i = 0; $i -lt 5; $i++) {
    "Iteration $i"
}
```

## while and do-while / do-until

**`while`** checks the condition before each iteration:

```powershell
$count = 0
while ($count -lt 3) {
    "Count is $count"
    $count++
}
```

**`do-while`** always executes at least once, then checks:

```powershell
$input = ""
do {
    $input = Read-Host "Enter 'quit' to exit"
} while ($input -ne "quit")
```

**`do-until`** runs until the condition becomes true (the inverse of `do-while`):

```powershell
$num = 1
do {
    $num *= 2
} until ($num -ge 100)
```

## break and continue

**`break`** exits the current loop entirely. **`continue`** skips the rest of the current iteration and moves to the next:

```powershell
foreach ($n in 1..10) {
    if ($n -eq 3) { continue }  # skip 3
    if ($n -eq 7) { break }     # stop at 7
    $n
}
# Output: 1 2 4 5 6
```

> **Key Concept:** `break` and `continue` work in `foreach`, `for`, `while`, `do-while`, and `do-until` loops. Inside a `switch`, `break` exits the switch statement.
