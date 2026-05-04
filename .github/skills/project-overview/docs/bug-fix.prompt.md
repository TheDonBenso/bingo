# Bug Fix List — Bingo App

Work through each bug one at a time. After fixing a bug, confirm the fix before moving to the next.

---

## Bug 1 — `UIController.LoadDecks`: Loop init expression is wrong
**File:** `app.js`  
**Location:** `UIController` → `LoadDecks` function  
**Problem:** The outer `for` loop is written as `for(i<0; i<3; i++)`. The init expression `i<0` evaluates to a boolean and never assigns `i`, so `i` is `undefined` and the loop never runs correctly.  
**Fix:** Change `i<0` to `i=0`.

---

## Bug 2 — `UIController.LoadDecks`: Variable name casing mismatch
**File:** `app.js`  
**Location:** `UIController` → `LoadDecks` function  
**Problem:** The variable is declared as `newHtml` (camelCase) but later referenced as `newhtml` (all lowercase), causing a `ReferenceError` at runtime.  
**Fix:** Change `newhtml.replace(...)` to `newHtml.replace(...)`.

---

## Bug 3 — `SetRandomPick`: Chained comparison always evaluates to `true`
**File:** `app.js`  
**Location:** `BingoController` → `SetRandomPick` function  
**Problem:** JavaScript does not support chained comparisons. `1 < pick < 90` is parsed as `(1 < pick) < 90`, which always returns `true` (since `true < 90` and `false < 90` are both truthy). Balls are not correctly bounded to 1–90.  
**Fix:** Replace `1 < pick < 90` (and the `while` condition) with `pick >= 1 && pick <= 90`.

---

## Bug 4 — `SetRandomPick`: `Math.random() * 100` produces decimals, not integers
**File:** `app.js`  
**Location:** `BingoController` → `SetRandomPick` function  
**Problem:** `Math.random() * 100` produces a floating-point number. The ball roller array is indexed by integer keys (1–90), so non-integer picks will never match a valid index and `splice` will target the wrong position.  
**Fix:** Replace `Math.random() * 100` with `Math.floor(Math.random() * 90) + 1` to produce integers in range [1, 90].

---

## Bug 5 — `SetRandomPick`: Picked ball is not bounded to remaining balls
**File:** `app.js`  
**Location:** `BingoController` → `SetRandomPick` function  
**Problem:** The `do…while` loop regenerates a random number until it falls in 1–90, but it does not check whether the ball has already been picked. The same number can be pushed to `pickedBalls` multiple times.  
**Fix:** After fixing Bug 3 and Bug 4, add a check: only push and splice if `data.ballRoller[pick]` is defined (i.e., the ball hasn't already been removed).

---

## Bug 6 — `LoadDecks` in `UIController`: DOM selector targets class, not individual deck
**File:** `app.js`  
**Location:** `UIController` → `LoadDecks` function  
**Problem:** `element = domstrings.deck` resolves to the CSS class selector `.deck`. `document.querySelector(element)` will always target the *first* `.deck` in the document, so all numbers get appended to the same deck instead of being distributed across all three.  
**Fix:** Pass the specific deck element or ID into the function so each iteration targets the correct deck node.

---

## Bug 7 — `CheckTicketLine` is not implemented
**File:** `app.js`  
**Location:** `BingoController` → `CheckTicketLine` function  
**Problem:** The function body is empty. Without it, there is no way to check if a picked ball matches any number on a player's ticket.  
**Fix:** Implement `CheckTicketLine(num)` to iterate over `data.ticketPopulator` and return which deck rows (if any) contain `num`.

---

## Bug 8 — No win detection logic exists
**File:** `app.js`  
**Location:** `GlobalController` → `startGame` / game loop  
**Problem:** There is no logic to detect when a player has matched all numbers on a row (or full card), so the game never ends or declares a winner.  
**Fix:** After each call to `CheckTicketLine`, check if any row in a player's ticket is fully matched and announce the winner.
