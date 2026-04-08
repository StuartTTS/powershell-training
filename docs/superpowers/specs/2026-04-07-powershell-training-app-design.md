# PowerShell Training Web App — Design Spec

## Overview

An interactive, Codecademy-style web application for learning PowerShell from scratch through to SharePoint/M365 administration. Hosted on Cloudflare Pages as a static site with client-side validation (Phase 1), architected for a future execution backend (Phase 2).

## Goals

- Teach PowerShell fundamentals, intermediate scripting, and SharePoint/M365 PowerShell
- Provide hands-on exercises with immediate feedback, validated client-side
- All lesson content verified against Microsoft Learn official documentation
- Deployable to Cloudflare Pages with zero backend infrastructure initially
- Extensible for real PowerShell execution backend later

## Target User

A beginner with minimal PowerShell experience (between "never used it" and "dabbled"), working toward SharePoint administration. Has access to a Visual Studio subscription and plans to create a personal M365 dev tenant for hands-on practice.

---

## Curriculum

### Module 1: PowerShell Fundamentals

1. What is PowerShell — cmdlets, the pipeline, Get-Help
2. Variables and data types
3. Strings, arrays, and hashtables
4. Operators and comparisons
5. Control flow — if/else, switch, foreach, while
6. Functions and parameters
7. Error handling — try/catch, $ErrorActionPreference
8. Working with files and CSV/JSON
9. Modules — Install-Module, Import-Module

### Module 2: Intermediate PowerShell

1. The pipeline in depth — Where-Object, Select-Object, Sort-Object, ForEach-Object
2. Regular expressions and string manipulation
3. Working with REST APIs — Invoke-RestMethod
4. Script structure and best practices
5. PSSessions and remote execution basics
6. Working with credentials and SecureStrings

### Module 3: SharePoint & M365 PowerShell

1. Connecting to M365 — Install & connect PnP.PowerShell
2. Managing SharePoint sites and lists
3. Managing site permissions and sharing
4. Working with list items and content types
5. Managing Teams and Groups
6. User and license management with Microsoft Graph PowerShell
7. Bulk operations — CSV-driven provisioning
8. Automating reports and exports

Each lesson contains 3-5 exercises, ranging from fill-in-the-blank to writing complete scripts.

---

## Tech Stack

| Component | Technology |
|-----------|-----------|
| Framework | Next.js (static export) |
| Hosting | Cloudflare Pages |
| Code editor | Monaco Editor with PowerShell syntax highlighting |
| Styling | Tailwind CSS |
| Lesson content | Markdown files with frontmatter |
| Exercise definitions | JSON files alongside each lesson |
| Progress storage | localStorage (no auth) |

---

## App Architecture

### Page Flow

```
Home (course overview + progress summary)
  → Module page (lesson list + module progress)
    → Lesson page (explanation + exercises)
      → Exercise (prompt + editor + validation + hints)
```

### Key Components

- **Lesson viewer** — renders markdown explanation with syntax-highlighted examples
- **Exercise panel** — shows prompt, hints, and Monaco editor for typing answers
- **Validator engine** — checks answers against defined rules client-side
- **Progress tracker** — localStorage-based, tracks completed exercises per module
- **Navigation** — sidebar with modules/lessons, progress indicators, current position

### Exercise Types

- `syntax-check` — validates pattern/structure locally (Phase 1)
- `execution-required` — flagged for future backend; shows "run locally" hint for now

---

## Validation Engine

### Phase 1: Client-Side Validation

Each exercise defines validation rules in its JSON file:

| Rule Type | What it checks | Example |
|-----------|---------------|---------|
| `contains` | Answer includes specific cmdlets/keywords | Must use `Get-ChildItem` |
| `regex` | Answer matches a pattern | Pipeline with `\| Where-Object` |
| `structure` | Checks script shape — function, param block, try/catch | Function with parameters |
| `order` | Commands appear in correct sequence | Connect before querying |
| `forbidden` | Catches common mistakes | Used `Write-Host` instead of `Write-Output` |

### Feedback System

- **Correct:** Green checkmark, brief explanation of why it works, unlock next exercise
- **Incorrect:** Specific hint based on which validation rule failed
- **Stuck:** "Show hint" button (up to 3 progressive hints), then "Show solution" with explanation

### Phase 2 Prep

- Exercises tagged `execution-required` show: "This exercise works best when run against a real M365 tenant. Copy this to your local terminal and try it there."
- JSON schema includes `executionConfig` field (ignored in Phase 1) for future backend pickup

### Example Exercise JSON

```json
{
  "id": "m1-l2-ex3",
  "type": "syntax-check",
  "prompt": "Create a variable called $servers that contains an array of three server names.",
  "hints": [
    "Arrays in PowerShell use @() syntax",
    "Separate items with commas",
    "Try: $servers = @('server1', 'server2', 'server3')"
  ],
  "validation": [
    { "rule": "regex", "pattern": "\\$servers\\s*=\\s*@\\(" },
    { "rule": "contains", "value": "," }
  ],
  "solution": "$servers = @('Server01', 'Server02', 'Server03')",
  "explanation": "Arrays are created with @() and items separated by commas."
}
```

---

## Content Pipeline

### Directory Structure

```
/content
  /module-1-fundamentals
    /01-what-is-powershell
      lesson.md          # explanation with examples
      exercises.json     # array of exercises
      meta.json          # title, description, order, prerequisites
    /02-variables-and-types
      ...
  /module-2-intermediate
    ...
  /module-3-sharepoint-m365
    ...
```

### Lesson Format

- Short explanation (200-400 words per lesson)
- Code examples with syntax highlighting
- "Key concept" callout boxes
- Self-contained — no assumed knowledge beyond completed prerequisites

### Microsoft Learn Verification

- Before writing each lesson, query microsoft_docs_search and microsoft_code_sample_search for relevant cmdlets and concepts
- Cross-reference parameter names, syntax, and best practices against official docs
- Use microsoft_docs_fetch for deeper detail when needed (e.g., SharePoint PnP cmdlet changes)
- Flag any cmdlets that have been deprecated or replaced

### Progress Storage (localStorage)

```json
{
  "m1-l1-ex1": { "completed": true, "attempts": 2 },
  "m1-l1-ex2": { "completed": false, "attempts": 1 }
}
```

No auth required. Clearing browser data resets progress — acceptable for a personal training tool.

---

## UI & UX

### Layout

- **Sidebar (left):** Collapsible module/lesson tree with completion checkmarks and progress bars per module
- **Main area (center):** Split vertically — lesson content on top, exercise panel on bottom
- **Exercise panel:** Prompt text, Monaco editor, "Check Answer" button, hints area, feedback area

### UX Decisions

- Lessons auto-advance to next exercise on completion; free navigation allowed (no forced linear progression)
- Dark theme by default, light theme toggle available
- Mobile-responsive but optimized for desktop
- Each module shows a progress bar (e.g., "12/18 exercises completed")
- Home page shows overall dashboard: modules as cards with progress rings

### Design Feel

Clean and focused, not gamified. No points, badges, or streaks — just clear progress tracking. Professional tool, not a kids' coding game.

---

## Phases

### Phase 1 (Now)

- Static Next.js app on Cloudflare Pages
- All 3 modules with lesson content and exercises
- Client-side validation engine (pattern matching)
- localStorage progress tracking
- `execution-required` exercises show "run locally" hint

### Phase 2 (Future)

- Azure Functions backend for real PowerShell execution
- Connect to M365 dev tenant for live SharePoint exercises
- `execution-required` exercises run against the backend
- Potential: authentication and cloud-synced progress
