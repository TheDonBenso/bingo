---
name: bingo-refactor
description: Refactor a vanilla JavaScript Bingo app into a structured, state-driven architecture with proper UI rendering, game logic, and styling. Use when improving maintainability, fixing bugs, or modernizing legacy JS apps.
---

# Bingo Refactor Skill

## Objective
Transform the existing Bingo app into a clean, maintainable, and scalable structure:
- Fix broken logic
- Replace string-based rendering with DOM-based rendering
- Introduce proper state management
- Improve UI clarity and responsiveness

---

## Procedure

### Step 1: Stabilize Data Layer
- Refactor `ballRoller` to use a proper array (no sparse indexes)
- Ensure numbers 1–90 are unique and removable
- Fix random selection logic:
  - Must remove by index, not value
- Ensure `pickedBalls` tracks history correctly

Refer to: `docs/game-logic.md`

---

### Step 2: Fix Rendering Layer
- Replace all `.textContent` rendering with DOM element creation
- Each number must be:
  - A `.number` element
  - Have unique id: `num_<value>`
- Ensure UI supports state classes:
  - `.drawn`
  - `.latest`

Refer to: `docs/ui-refactor.md`

---

### Step 3: Introduce State Sync
- After each number draw:
  - Update UI state
  - Remove previous `.latest`
  - Add `.drawn` + `.latest` to current number
- Ensure UI reflects actual game state at all times

---

### Step 4: Fix Event System
- Ensure all DOM selectors match HTML
- Remove broken selectors
- Ensure buttons:
  - Start game
  - Load decks
  trigger correctly

---

### Step 5: Refactor Ticket System
- Ensure:
  - Unique numbers per ticket
  - No duplicates
- Maintain 3x6 grid per ticket
- Store ticket state separately from UI

---

### Step 6: Add Win Detection Stability
- Ensure:
  - Row completion detection works reliably
  - No false positives
- Reset state on new game

---

## Constraints
- Do NOT introduce frameworks (React, Vue, etc.)
- Keep architecture modular (MVC-style or similar)
- Avoid global variable leakage
- Maintain readability over cleverness

---

## Completion Criteria
- Numbers render as a grid, not text
- Drawn numbers visually update
- Latest number is highlighted
- No duplicate IDs in DOM
- Game runs from start to win without errors