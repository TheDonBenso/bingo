
---

# 🏗️ 4. docs/architecture.md

```md id="architecture-md"
# Architecture Refactor

## Current Issues

- Controllers are loosely structured
- UI and logic are tightly coupled
- DOM updates are not state-driven

---

## Target Structure

### 1. Data Layer (Model)
- Holds:
  - ballRoller
  - pickedBalls
  - tickets

---

### 2. Logic Layer (Controller)
- Handles:
  - number generation
  - validation
  - win detection

---

### 3. UI Layer (View)
- Responsible ONLY for:
  - rendering
  - updating DOM
  - reflecting state

---

## Rules

- No direct DOM manipulation in logic layer
- No business logic in UI layer
- Clear separation of concerns

---

## Outcome

- Easier debugging
- Easier extension (multiplayer, animations)
- Cleaner mental model