# UI System (CSS + Dynamic DOM Builder)

## Objective
Establish a scalable UI system that:
- Uses a consistent design system (CSS tokens + components)
- Eliminates hardcoded HTML for players and decks
- Dynamically renders all players and tickets from data

---

# PART 1: CSS DESIGN SYSTEM

## 1. Design Principles

- Consistency over creativity
- Reusable components (balls, cards, grids)
- State-driven styling (no inline styles)
- Clear visual hierarchy

---

## 2. Design Tokens

Define global variables:

```css
:root {
  --color-bg: #121212;
  --color-surface: #1e1e1e;
  --color-primary: #2e7d32;
  --color-accent: #f9a825;
  --color-text: #ffffff;
  --color-muted: #aaaaaa;

  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;

  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-round: 50%;

  --font-main: 'Inter', sans-serif;
}
```
## 3. Layout System
# Main Sections
```css
.top {  
	padding: var(--spacing-md);
}

.bottom {  
	display: grid;  
	grid-template-columns: 1fr 1fr;  
	gap: var(--spacing-lg);
}
```
# Players Grid
```css
.players-grid {  
	display: grid;  
	grid-template-columns: repeat(2, 1fr);  
	gap: var(--spacing-md);
}
```
# 4. Ball Component (Core Visual Element)
```css
.ball {  
	width: 40px;  
	height: 40px;  
	border-radius: var(--radius-round);  
	display: flex;  
	align-items: center;  
	justify-content: center;  
	font-weight: bold;  
	background: var(--color-surface);  
	color: var(--color-text);  
	box-shadow: 0 2px 5px rgba(0,0,0,0.3);
}
```
# Ball States
```css
.ball .drawn {  
	background: var(--color-primary);
}

.ball.latest {  
	background: var(--color-accent);  
	color: #000;  
	animation: pulse 0.8s infinite;
}

@keyframes pulse {  
	0% { transform: scale(1); }
	50% { transform: scale(1.15); }  
	100% { transform: scale(1); }}
```
# 5. Deck / Card System
```css
.player {  
	background: var(--color-surface);  
	padding: var(--spacing-md);  
	border-radius: var(--radius-md);
}

.deck {  
	display: grid;  
	grid-template-columns: repeat(6, 1fr);  
	gap: var(--spacing-sm);  
	margin-bottom: var(--spacing-md);
}
```
# 6. Number Cell
```css
.cell {  
	background: #2a2a2a;  
	padding: var(--spacing-sm);  
	text-align: center;  
	border-radius: var(--radius-sm);
}

.cell.matched {  
	background: var(--color-primary);  
	color: #fff;
}

.cell.winning {  
	background: var(--color-accent);  
	color: #000;
}
```
# 7. Picked Balls Row
```css
.picked-balls {  
	display: flex;  
	flex-wrap: wrap;  
	gap: var(--spacing-sm);  
	margin-top: var(--spacing-md);
}
```
# Expected Outcome (CSS)
 Consistent look across all components
 Reusable styling (balls, cells, players)
 Clear visual states for gameplay
