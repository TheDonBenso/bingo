# UI Design Specification (Bingo Game)

## Objective
Design a clear, engaging Bingo interface that:
- Separates game control (top) from gameplay (bottom)
- Visually represents number flow (available → picked)
- Displays 4 players in a structured grid
- Reflects game state through visual feedback

---

# 1. Layout Overview

## Structure

The UI is divided into two main sections:

### Top Section (Game Control + Ball Flow)
- Title
- Controls (Start, Load Decks)
- Ball Roller (1–90 grid)
- Picked Balls Display (live updates)

### Bottom Section (Players Area)
- 4-player grid layout
- Each player has:
  - 3 decks
  - Each deck contains numbers

---

# 2. Top Section Design

## 2.1 Ball Roller (Available Numbers)

### Description
- Displays numbers 1–90 in a grid
- Numbers change state as they are drawn

### Structure

```html
<div class="ball-roller">
  <div class="ball" id="num_1">1</div>
</div>
