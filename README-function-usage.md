# Function Usage Audit: map, apply, bind, call

This file documents whether the following JavaScript functions are used in the current Bingo application:

- `Array.prototype.map`
- `Function.prototype.apply`
- `Function.prototype.bind`
- `Function.prototype.call`

## Audit Result

After checking the current codebase (`app.js`, `Index.html`, `style.css`, `README.md`), there are **no usages** of:

- `.map(`
- `.apply(`
- `.bind(`
- `.call(`

## Where They Are Used In The App

They are currently **not used anywhere** in the new application.

## Optional Examples (How They Could Be Used)

### 1) `map`
Use `map` to transform values when creating display labels.

```js
var pickedBalls = [3, 17, 42];
var labels = pickedBalls.map(function(n) {
    return 'Ball #' + n;
});
// labels => ["Ball #3", "Ball #17", "Ball #42"]
```

### 2) `call`
Use `call` to invoke a function with a specific `this` value.

```js
function announce(prefix) {
    return prefix + ' ' + this.name;
}

var player = { name: 'Player 1' };
var text = announce.call(player, 'Winner:');
// text => "Winner: Player 1"
```

### 3) `apply`
Use `apply` like `call`, but pass arguments as an array.

```js
function formatPick(a, b) {
    return 'Picked: ' + a + ', ' + b;
}

var text = formatPick.apply(null, [12, 44]);
// text => "Picked: 12, 44"
```

### 4) `bind`
Use `bind` to create a new function with fixed `this` and/or preset arguments.

```js
function onWin(message) {
    alert(this.playerName + ' - ' + message);
}

var context = { playerName: 'Player 2' };
var boundWinHandler = onWin.bind(context, 'BINGO!');
// Later:
// boundWinHandler();
```

## Notes

The current implementation mainly uses:

- classic `for` loops
- object/module methods
- event listeners without explicit `bind`

If you want, I can refactor selected parts of `app.js` to use `map`, `bind`, `call`, or `apply` in real gameplay code.
