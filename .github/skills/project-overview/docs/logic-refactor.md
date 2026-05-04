# App Logic Refactor Plan

Target file: [app.js](app.js)

## Goal

Refactor the Bingo application logic to make it easier to maintain, test, and extend without changing current game behavior.

## Refactor Tasks

### 1. Establish a Safe Baseline
- [ ] Document current behavior for key flows:
  - [ ] Load decks
  - [ ] Start game
  - [ ] Draw balls until win/no-winner
- [ ] Add a quick manual regression checklist in this file before changing logic.
- [ ] Confirm there are no current runtime errors in browser console.

### 2. Standardize Module Boundaries
- [ ] Keep `BingoController` purely state + game rules.
- [ ] Keep `UIController` purely rendering + DOM querying.
- [ ] Keep `GlobalController` purely orchestration/event wiring.
- [ ] Remove any cross-module leakage (for example direct state references where getters should be used).

### 3. Replace Magic Numbers With Constants
- [ ] Introduce constants near top-level scope for shared values:
  - [ ] `PLAYER_COUNT = 4`
  - [ ] `TICKET_ROWS = 3`
  - [ ] `TICKET_COLS = 6`
  - [ ] `BALL_MIN = 1`
  - [ ] `BALL_MAX = 90`
  - [ ] `DRAW_INTERVAL_MS = 1000`
- [ ] Replace hardcoded values across all modules with these constants.

### 4. Simplify Data Shape Helpers
- [ ] Consolidate matrix/array creation utilities:
  - [ ] `createEmptyMarks(rows, cols)`
  - [ ] `createEmptyPlayerMarks(players, rows, cols)`
- [ ] Ensure helper names clearly describe returned structure.
- [ ] Ensure all state reset paths reuse these helpers.

### 5. Isolate Ticket Generation
- [ ] Keep ticket generation in pure helper functions (no DOM, no side effects outside local scope).
- [ ] Add one dedicated function for single ticket generation and one for all players.
- [ ] Verify uniqueness assumptions are explicitly documented in code comments.

### 6. Harden Validation and Guard Clauses
- [ ] Centralize ticket structure validation logic.
- [ ] Add early returns where invalid state is possible.
- [ ] Ensure start flow gracefully self-heals missing tickets before drawing.

### 7. Reduce UI Query Repetition
- [ ] Cache high-frequency selectors in local variables where safe.
- [ ] Avoid repeated `querySelector` calls inside tight loops when an element can be resolved once.
- [ ] Keep DOM IDs/selectors in one place (`domstrings`).

### 8. Clarify Game Loop Lifecycle
- [ ] Encapsulate interval start/stop into small helpers:
  - [ ] `startDrawLoop()`
  - [ ] `stopDrawLoop()`
- [ ] Ensure only one interval can run at a time.
- [ ] Ensure terminal states (winner or no winner) always stop interval.

### 9. Improve Function Naming Consistency
- [ ] Use consistent verb style for public methods (for example `loadDecks`, `resetTicketMarks`, `getGameState`).
- [ ] Keep backward compatibility where needed, or update all call sites in one pass.

### 10. Add Lightweight Testability Hooks
- [ ] Keep pure logic functions free from DOM so they can be tested separately.
- [ ] Add a small optional debug export pattern (if needed) for local unit-style checks.
- [ ] Add a "logic verification" section to [README-function-usage.md](README-function-usage.md) or [README.md](README.md) after refactor.

## Definition of Done
- [ ] No user-visible regression in game behavior.
- [ ] No overlap of module responsibilities.
- [ ] No duplicated core logic paths.
- [ ] All constants centralized and reused.
- [ ] Manual regression checklist passes end-to-end.

### 11. Introduce `map`, `call`, `apply`, and `bind` into Real Gameplay Code

The current app uses only classic `for` loops and object methods. This task introduces all four function methods into actual gameplay code paths inside `app.js`. Each sub-task identifies the exact location and the change required.

#### 11a. `map` — Replace ball-roller `for` loop in `LoadRoller`

**Where:** `BingoController.LoadRoller()` — currently uses a `for` loop to push numbers 1–90 into `data.ballRoller`.

**Change:** Replace the `for` loop with `Array.apply` to create an array of length 90, then use `.map` to produce values 1–90.

```js
// Before
data.ballRoller = [];
for (var i = 1; i <= 90; i++) {
    data.ballRoller.push(i);
}

// After
data.ballRoller = Array.apply(null, { length: 90 }).map(function(_, i) {
    return i + 1;
});
```

- [ ] Replace the `for` loop in `LoadRoller` with the `map` version above.
- [ ] Verify `data.ballRoller` still contains exactly 90 values (1–90) after the change.

---

#### 11b. `map` — Replace `for` loop in `GetTicketState`

**Where:** `BingoController.GetTicketState()` — currently uses nested `for` loops to deep-copy the `ticketPopulator` array.

**Change:** Use `.map` at both the player level and the row level to produce the same deep copy.

```js
// Before
var players = [];
for (var player = 0; player < data.ticketPopulator.length; player++) {
    var rows = [];
    for (var row = 0; row < data.ticketPopulator[player].length; row++) {
        rows.push(data.ticketPopulator[player][row].slice());
    }
    players.push(rows);
}
return players;

// After
return data.ticketPopulator.map(function(playerRows) {
    return playerRows.map(function(row) {
        return row.slice();
    });
});
```

- [ ] Replace the nested `for` loop in `GetTicketState` with the `.map` version above.
- [ ] Confirm the returned value still passes the `[4][3][6]` shape check.

---

#### 11c. `bind` — Lock the draw-loop callback to `GlobalController` context

**Where:** `GlobalController` — the `setInterval` callback is an anonymous function that calls `BCtrl` and `UICtrl` directly.

**Change:** Extract the draw-tick logic into a named private function `drawTick`, then bind it explicitly so context is fixed.

```js
// Before
drawIntervalId = setInterval(function() {
    var pick = BCtrl.SetRandomPick();
    // ... rest of tick logic
}, 1000);

// After — extract named function above setInterval call
var drawTick = function() {
    var pick = BCtrl.SetRandomPick();
    if (pick === null) {
        stopDrawLoop();
        alert('No winner - all balls drawn!');
        return;
    }
    var gameState = BCtrl.GetGameState();
    UICtrl.updatePickedNumbers(gameState.pickedBalls);
    BCtrl.CheckTicketLine(gameState.lastPicked);
    if (checkWin()) {
        stopDrawLoop();
    }
}.bind(GlobalController);

drawIntervalId = setInterval(drawTick, 1000);
```

- [ ] Extract tick logic from the anonymous `setInterval` callback into a named `drawTick` function.
- [ ] Apply `.bind(GlobalController)` when assigning `drawTick`.
- [ ] Confirm game still draws and stops correctly on win or empty pool.

---

#### 11d. `call` — Invoke `announce` helper with player context for win alert

**Where:** `GlobalController.checkWin()` — currently calls `alert()` with a string literal.

**Change:** Introduce a small `announce` helper that uses `this.playerName` and invoke it via `.call` with a player context object.

```js
// New helper (private, inside GlobalController IIFE)
var announce = function(message) {
    alert(this.playerName + ' — ' + message);
};

// Inside checkWin(), replace the alert call:
// Before
alert('BINGO! Player ' + (winState.player + 1) + ' row ' + (winState.row + 1) + ' complete!');

// After
var playerContext = { playerName: 'Player ' + (winState.player + 1) };
announce.call(playerContext, 'BINGO! Row ' + (winState.row + 1) + ' complete!');
```

- [ ] Add `announce` as a private function inside `GlobalController`.
- [ ] Replace the `alert` string literal in `checkWin` with the `.call` version above.
- [ ] Verify the alert still displays the correct player number and row number.

---

#### 11e. `apply` — Pass ball-roller array to `displayNumbers` via `apply`

**Where:** `GlobalController.startGame()` — currently calls `UICtrl.displayNumbers(bingodata.ballRoller)` directly.

**Change:** Wrap the call using `.apply` to pass the roller array as an argument array, demonstrating how `apply` spreads arguments.

```js
// Before
UICtrl.displayNumbers(bingodata.ballRoller);

// After
UICtrl.displayNumbers.apply(UICtrl, [bingodata.ballRoller]);
```

- [ ] Replace the `displayNumbers` call in `startGame` with the `.apply` version above.
- [ ] Verify the roller numbers still render correctly on game start.

---

#### Completion Checklist for Task 11
- [ ] All five sub-tasks above are implemented in `app.js`.
- [ ] Browser console shows no new errors.
- [ ] Load Decks → Start Game → Draw to win (or no winner) works end-to-end.
- [ ] Update [README-function-usage.md](../../../README-function-usage.md) section "Where They Are Used In The App" to list each new usage with its file location.

---

## Suggested Implementation Order
1. Constants and naming cleanup.
2. Validation + helper extraction.
3. Draw-loop lifecycle helpers.
4. UI query cleanup.
5. **Task 11 — Introduce `map`, `call`, `apply`, `bind`.**
6. Final regression run.
