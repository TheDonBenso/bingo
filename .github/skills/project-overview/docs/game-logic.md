# Game Logic Refactor (Comprehensive)

## Objective
Define a predictable, bug-free Bingo game engine that:
- Generates numbers correctly
- Prevents duplicates
- Maintains consistent state
- Supports UI updates cleanly

---

# 1. Number Pool (Ball Roller)

## Rules
- Must contain numbers 1–90
- Must NOT contain duplicates
- Must shrink as numbers are drawn

## Implementation Strategy (Preferred)
- Initialize once
- Shuffle once
- Draw sequentially

### Example
```js
function createShuffledPool() {
    const pool = [];
    for (let i = 1; i <= 90; i++) {
        pool.push(i);
    }
    return pool.sort(() => Math.random() - 0.5);
}