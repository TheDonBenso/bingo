---
name: project-overview
description: 'Scan and summarize a project codebase. Use when asked for a project overview, architecture summary, code review, onboarding summary, or "what does this app do". Produces a structured breakdown of purpose, architecture, files, patterns, and known issues.'
argument-hint: 'Optional: focus area (e.g., "architecture", "bugs", "UI")'
---

# Project Overview Skill

## Purpose
Produce a concise, structured overview of the current workspace by reading all key source files and summarizing the application's purpose, architecture, patterns, and state.

## When to Use
- "Give me a project overview"
- "What does this app do?"
- "Summarize the codebase for onboarding"
- "Review the architecture"
- "What files are in this project?"

## Procedure

1. **List workspace files** — Use `list_dir` on the root to identify all source files, folders, and assets.
2. **Read entry points first** — Read `index.html` / `app.js` / `main.*` / `README.md` to understand the app's top-level structure.
3. **Read remaining source files** — Read all JS, CSS, and config files in parallel.
4. **Identify the stack** — Note languages, frameworks, libraries, and patterns (e.g., MVC, module pattern).
5. **Draft the overview** using the Output Format below.
6. **Flag known issues** — Note any bugs, incomplete functions, or code smells found while reading.

## Output Format

Produce the overview in this structure:

### Application Name & Purpose
One sentence describing what the app does and who it's for.

### Tech Stack
- Languages: …
- Frameworks/Libraries: …
- Patterns: …

### File Structure
| File | Role |
|------|------|
| `index.html` | … |
| `app.js` | … |
| `style.css` | … |

### Architecture
Describe how the code is organized (e.g., MVC, modules, layers).

### Key Features / Game Logic
Bullet list of main features or flows implemented.

### Known Issues / Incomplete Areas
Bullet list of bugs, TODOs, or incomplete implementations found in the code.

### Suggested Next Steps
Up to 3 actionable improvements based on the current state.

---

## This Project — Bingo Game

> This section is pre-populated from the initial scan. Re-run the skill to refresh.

### Application Name & Purpose
A browser-based 2–4 player Bingo game (numbers 1–90) built with vanilla JavaScript, where players load randomized ticket cards and match numbers drawn from a ball roller.

### Tech Stack
- **Languages**: HTML, CSS, vanilla JavaScript (ES5)
- **Frameworks**: None
- **Patterns**: MVC (Module/Revealing Module Pattern) — `BingoController`, `UIController`, `GlobalController`

### File Structure
| File | Role |
|------|------|
| [Index.html](../../Index.html) | App shell — renders player cards (4 players × 3 decks × 5 boxes), roller display, and control buttons |
| [app.js](../../app.js) | All game logic — three IIFE modules: `BingoController` (data/logic), `UIController` (DOM), `GlobalController` (event wiring) |
| [style.css](../../style.css) | Layout and styling for cards, roller, and UI |

### Architecture
Three Revealing Module IIFEs wired together:
- **`BingoController`** — owns all game state (`ballRoller[1–90]`, `pickedBalls[]`, `ticketPopulator[3][6]`). Exposes `LoadRoller`, `SetRandomPick`, `LoadDecks`, `ClearDecks`, `GetData`.
- **`UIController`** — owns DOM selectors (`domstrings`). Exposes `displayNumbers`, `LoadDecks`, `getDOMstrings`.
- **`GlobalController`** — wires click listeners (`Start Game` → `startGame`, `LoadDecks` → `loadDecks`), bridges the two controllers.

### Key Features / Game Logic
- Ball roller pre-loaded with integers 1–90
- Randomized ticket generation (3 rows × 6 numbers per player)
- DOM display of roller numbers on game start
- Deck loading populates player card boxes dynamically

### Known Issues / Incomplete Areas
- `SetRandomPick`: uses `Math.random() * 100` but chained comparison `1 < pick < 90` is always `true` in JS — balls are not correctly bounded to 1–90 and duplicates are possible
- `LoadDecks` in `UIController`: `for(i<0; i<3; i++)` — init expression `i<0` is a bug (should be `i=0`); also `newhtml` (lowercase) vs `newHtml` (camelCase) — ReferenceError at runtime
- `Index.html` player card boxes are hardcoded with placeholder values (all show 5, 15, 25, 35, 45) instead of dynamic content
- `CheckTicketLine` is defined but has no implementation
- Winner detection / game-over logic is absent
- No restart / reset flow connected to `ClearDecks`

### Suggested Next Steps
1. **Fix `UIController.LoadDecks`** — correct the loop init (`i=0`) and variable casing (`newHtml`) so dynamic deck rendering works end-to-end.
2. **Fix `SetRandomPick`** — use `Math.floor(Math.random() * 90) + 1` and check `data.ballRoller` for remaining balls to avoid duplicates.
3. **Implement `CheckTicketLine`** — compare each picked ball against all player decks and highlight matches, then add win detection when a full row matches.
