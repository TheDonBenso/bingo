# Bingo

A browser-based Bingo game built with vanilla JavaScript, HTML, and CSS.

## What The Game Does

- Creates and displays 4 player tickets.
- Each player ticket has 3 rows and 6 numbers per row.
- Builds a shuffled roller of numbers from 1 to 90.
- Draws one number at a time and highlights matches on both the roller and tickets.
- Detects a winner when any player completes a full row.

## How To Play

1. Open [Index.html](Index.html) in your browser.
2. Click **Load Decks** to generate player tickets.
3. Click **Start Game** to begin drawing numbers.
4. Wait for a completed row to trigger the Bingo win message.

## Technical Notes

- Uses an MVC-style module structure in [app.js](app.js):
  - `BingoController` for game state and logic
  - `UIController` for rendering and DOM updates
  - `GlobalController` for event wiring and game flow
- Tickets and marks are maintained as separate state structures for reliable win detection.
- Number draw and ticket updates are synchronized each round.

