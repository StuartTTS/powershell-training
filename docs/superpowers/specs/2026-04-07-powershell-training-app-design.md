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

### URL Routing

```
/                                          → Home (dashboard)
/module/[moduleSlug]                       → Module overview
/module/[moduleSlug]/[lessonSlug]          → Lesson page with exercises
```

Examples:
- `/module/fundamentals/variables-and-types`
- `/module/sharepoint-m365/managing-sites-and-lists`

Slugs are derived from directory names (e.g., `module-1-fundamentals` → `fundamentals`, `01-what-is-powershell` → `what-is-powershell`). The numeric prefix is stripped from the slug but used for sort order.

### Exercise Types

- `syntax-check` — validates pattern/structure locally (Phase 1)
- `execution-required` — flagged for future backend; shows "run locally" hint for now

---

## Validation Engine

### Phase 1: Client-Side Validation

Each exercise defines validation rules in its JSON file. **All rules must pass** (AND logic). When multiple rules fail, the hint for the **first failing rule** is shown. If a failing rule has no `hintOnFail`, the generic message "Not quite — check your answer and try again" is shown.

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

### Exercise JSON Schema

```json
{
  "id": "string (required) — format: m{module}-l{lesson}-ex{number}, e.g. m1-l2-ex3",
  "type": "string (required) — 'syntax-check' | 'execution-required'",
  "prompt": "string (required) — the task description shown to the user",
  "hints": ["string[] (required) — 1-3 progressive hints, shown one at a time"],
  "validation": [
    {
      "rule": "string (required) — 'contains' | 'regex' | 'structure' | 'order' | 'forbidden'",
      "value": "string (for contains/forbidden) — literal text to check for",
      "pattern": "string (for regex) — regex pattern to match",
      "check": "string (for structure) — 'has-function' | 'has-param-block' | 'has-try-catch' | 'has-pipeline'",
      "sequence": ["string[] (for order) — ordered list of keywords/cmdlets"],
      "hintOnFail": "string (optional) — custom hint shown when this specific rule fails"
    }
  ],
  "solution": "string (required) — the reference solution",
  "explanation": "string (required) — why the solution works",
  "executionConfig": {
    "requiresConnection": "string (optional, Phase 2) — 'PnP.PowerShell' | 'MicrosoftGraph' | null",
    "expectedOutputPattern": "string (optional, Phase 2) — regex to validate command output",
    "cleanup": "string (optional, Phase 2) — PowerShell command to run after exercise to undo changes"
  }
}
```

### Example Exercise

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
    { "rule": "regex", "pattern": "\\$servers\\s*=\\s*@\\(", "hintOnFail": "Use $servers = @(...) to create an array" },
    { "rule": "contains", "value": ",", "hintOnFail": "Separate array items with commas" }
  ],
  "solution": "$servers = @('Server01', 'Server02', 'Server03')",
  "explanation": "Arrays are created with @() and items separated by commas."
}
```

### Known Phase 1 Limitations

- Pattern-based validation can be gamed (e.g., putting required keywords in comments). Accepted trade-off — this is a personal learning tool, not an exam system.

---

## Content Pipeline

### Directory Structure

```
/content
  /module-1-fundamentals
    module.json          # module-level metadata
    /01-what-is-powershell
      lesson.md          # explanation with examples
      exercises.json     # array of exercises
      meta.json          # lesson-level metadata
    /02-variables-and-types
      ...
  /module-2-intermediate
    module.json
    ...
  /module-3-sharepoint-m365
    module.json
    ...
```

### module.json Schema

```json
{
  "title": "string — display title, e.g. 'PowerShell Fundamentals'",
  "description": "string — summary for the home page card",
  "slug": "string — URL slug, e.g. 'fundamentals'",
  "order": "number — integer for module sort order (1, 2, 3)"
}
```

### meta.json Schema (Lesson-Level)

```json
{
  "title": "string — display title, e.g. 'Variables and Data Types'",
  "description": "string — one-line summary for the module overview page",
  "slug": "string — URL slug, e.g. 'variables-and-types'",
  "order": "number — integer for sort order (matches directory prefix)",
  "prerequisites": ["string[] — array of lesson IDs, e.g. ['m1-l1']. Empty array for first lesson."]
}
```

### Lesson Markdown Format

- Short explanation (200-400 words per lesson)
- Code examples with syntax highlighting (fenced code blocks with `powershell` language tag)
- Key concept callouts use blockquote with bold prefix: `> **Key Concept:** ...`
- Self-contained — no assumed knowledge beyond completed prerequisites

Example:

```markdown
## Variables

In PowerShell, variables start with a `$` sign...

> **Key Concept:** PowerShell variables are not strongly typed by default.

```powershell
$name = "Stuart"
$count = 42
```
```

### Microsoft Learn Verification (Authoring Guidance)

This is guidance for the content authoring process (AI-assisted), not app functionality:

- Before writing each lesson, query Microsoft Learn docs for relevant cmdlets and concepts
- Cross-reference parameter names, syntax, and best practices against official docs
- Fetch full documentation pages for deeper detail when needed (e.g., SharePoint PnP cmdlet changes)
- Flag any cmdlets that have been deprecated or replaced

### Progress Storage (localStorage)

```json
{
  "version": 1,
  "exercises": {
    "m1-l1-ex1": { "completed": true, "attempts": 2 },
    "m1-l1-ex2": { "completed": false, "attempts": 1 }
  }
}
```

- No auth required. Clearing browser data resets progress — acceptable for a personal training tool.
- `version` field enables future data migration if schema changes.
- If localStorage is unavailable (e.g., private browsing), the app works normally but progress is not persisted. Show a small banner: "Progress tracking unavailable in this browser mode."

---

## UI & UX

### Layout

- **Sidebar (left):** Collapsible module/lesson tree with completion checkmarks and progress bars per module
- **Main area (center):** Split vertically — lesson content on top, exercise panel on bottom
- **Exercise panel:** Prompt text, Monaco editor, "Check Answer" button, hints area, feedback area

### UX Decisions

- Lessons auto-advance to next exercise on completion; free navigation allowed (no forced linear progression)
- Dark theme by default, light theme toggle available
- Mobile-responsive but optimized for desktop. On small screens (<768px), Monaco degrades to a styled `<textarea>` with monospace font
- Each module shows a progress bar (e.g., "12/18 exercises completed")
- Home page shows overall dashboard: modules as cards with progress rings

### Design Feel

Clean and focused, not gamified. No points, badges, or streaks — just clear progress tracking. Professional tool, not a kids' coding game.

---

## Code Editor: Monaco Setup

Monaco Editor does not ship with built-in PowerShell support. Implementation requires:

1. Register a custom Monarch tokenizer for PowerShell syntax highlighting (keywords, cmdlets, variables, strings, comments)
2. Lazy-load Monaco only on lesson pages to avoid bloating the home/module pages (~2-4MB gzipped)
3. Show a loading skeleton while Monaco initializes

If bundle size becomes problematic, CodeMirror 6 (~150KB) is a viable fallback.

---

## Deployment

- **Build:** `next build` with `output: 'export'` in `next.config.js`
- **Image handling:** `unoptimized: true` in next.config (Cloudflare Pages doesn't support Next.js image optimization)
- **Deploy:** Connect GitHub repo to Cloudflare Pages; auto-deploys on push to `main`
- **Build command (Cloudflare):** `npm run build`
- **Output directory (Cloudflare):** `out`

---

## Testing Strategy

- **Validation engine:** Unit tests (Vitest) — each rule type tested with passing and failing inputs
- **Content loading:** Tests that all lesson markdown and exercise JSON files parse correctly
- **Exercise schema:** Validate all exercise JSON files against the schema at build time
- **E2E (future):** Playwright tests for core user flow — navigate to lesson, type answer, check validation feedback

---

## Scope

- **Total exercises:** 23 lessons x 3-5 exercises = ~70-115 exercises
- **SEO/discoverability:** Not a priority — this is a personal training tool. No OG images or sitemaps needed.
- **Accessibility:** Keyboard navigation for exercise panel (Tab to editor, Enter to check). ARIA labels on progress indicators.

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
