/*
setup MVC style
*/

var BingoController = (function() {
    // Data layer: ticket numbers and ticket marks are kept separate from UI
    var data = {
        ballRoller: [],
        pickedBalls: [],
        ticketPopulator: [],
        ticketMarks: []
    };

    var shuffle = function(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    };

    var createEmptyMarks = function(rows, cols) {
        var marks = [];
        for (var r = 0; r < rows; r++) {
            var row = [];
            for (var c = 0; c < cols; c++) {
                row.push(false);
            }
            marks.push(row);
        }
        return marks;
    };

    var createEmptyPlayerMarks = function(playerCount, rows, cols) {
        var players = [];
        for (var player = 0; player < playerCount; player++) {
            players.push(createEmptyMarks(rows, cols));
        }
        return players;
    };

    // Step 5: build one ticket as a strict 3x6 grid with unique values
    var generateUniqueTicket = function(rows, cols) {
        var totalCells = rows * cols;
        var pool = [];
        var values = [];
        var index = 0;

        for (var n = 1; n <= 90; n++) {
            pool.push(n);
        }

        shuffle(pool);

        for (var i = 0; i < totalCells; i++) {
            values.push(pool[i]);
        }

        var ticket = [];
        for (var r = 0; r < rows; r++) {
            var row = [];
            for (var c = 0; c < cols; c++) {
                row.push(values[index]);
                index++;
            }
            ticket.push(row);
        }

        return ticket;
    };

    var generateTicketsForPlayers = function(playerCount, rows, cols) {
        var players = [];
        for (var player = 0; player < playerCount; player++) {
            players.push(generateUniqueTicket(rows, cols));
        }
        return players;
    };

    return {
        LoadRoller: function() {
            data.ballRoller = [];
            for (var i = 1; i <= 90; i++) {
                data.ballRoller.push(i);
            }
            shuffle(data.ballRoller);
            data.pickedBalls = [];
            data.ticketMarks = createEmptyPlayerMarks(4, 3, 6);
        },

        SetRandomPick: function() {
            if (data.ballRoller.length > 0) {
                var pick = data.ballRoller.shift();
                data.pickedBalls.push(pick);
                return pick;
            }
            return null;
        },

        GetGameState: function() {
            return {
                pickedBalls: data.pickedBalls.slice(),
                lastPicked: data.pickedBalls.length > 0 ? data.pickedBalls[data.pickedBalls.length - 1] : null,
                totalPicked: data.pickedBalls.length,
                ballsRemaining: data.ballRoller.length
            };
        },

        CheckTicketLine: function(num) {
            var matches = [];
            for (var player = 0; player < data.ticketPopulator.length; player++) {
                for (var row = 0; row < data.ticketPopulator[player].length; row++) {
                    for (var col = 0; col < data.ticketPopulator[player][row].length; col++) {
                        if (data.ticketPopulator[player][row][col] === num) {
                            data.ticketMarks[player][row][col] = true;
                            matches.push({ player: player, row: row, col: col });
                        }
                    }
                }
            }
            return matches;
        },

        ResetTicketMarks: function() {
            data.ticketMarks = createEmptyPlayerMarks(4, 3, 6);
        },

        HasValidTicket: function() {
            if (data.ticketPopulator.length !== 4) {
                return false;
            }

            for (var player = 0; player < 4; player++) {
                if (!data.ticketPopulator[player] || data.ticketPopulator[player].length !== 3) {
                    return false;
                }

                for (var row = 0; row < 3; row++) {
                    if (!data.ticketPopulator[player][row] || data.ticketPopulator[player][row].length !== 6) {
                        return false;
                    }
                }
            }

            return true;
        },

        HasWinningRow: function() {
            for (var player = 0; player < data.ticketMarks.length; player++) {
                for (var row = 0; row < data.ticketMarks[player].length; row++) {
                    var rowMarks = data.ticketMarks[player][row];
                    var rowValues = data.ticketPopulator[player][row];
                    if (!rowMarks || !rowValues || rowMarks.length !== 6 || rowValues.length !== 6) {
                        continue;
                    }

                    var complete = true;
                    for (var col = 0; col < rowMarks.length; col++) {
                        if (!rowMarks[col]) {
                            complete = false;
                            break;
                        }
                    }

                    if (complete) {
                        return { won: true, player: player, row: row };
                    }
                }
            }

            return { won: false, player: -1, row: -1 };
        },

        // Step 5 ticket generation: unique numbers, no duplicates, 3x6 data grid
        LoadDecks: function() {
            data.ticketPopulator = generateTicketsForPlayers(4, 3, 6);
            data.ticketMarks = createEmptyPlayerMarks(4, 3, 6);
        },

        ClearDecks: function() {
            data.ticketPopulator = [];
            data.ticketMarks = [];
        },

        GetTicketState: function() {
            var players = [];
            for (var player = 0; player < data.ticketPopulator.length; player++) {
                var rows = [];
                for (var row = 0; row < data.ticketPopulator[player].length; row++) {
                    rows.push(data.ticketPopulator[player][row].slice());
                }
                players.push(rows);
            }
            return players;
        },

        GetTicketMarks: function() {
            var players = [];
            for (var player = 0; player < data.ticketMarks.length; player++) {
                var rows = [];
                for (var row = 0; row < data.ticketMarks[player].length; row++) {
                    rows.push(data.ticketMarks[player][row].slice());
                }
                players.push(rows);
            }
            return players;
        },

        GetData: function() {
            return data;
        }
    };
})();

var UIController = (function() {
    var domstrings = {
        btnstart: '#btnStart',
        btnLoadDecks: '#btnLoadDecks',
        bingo_roller_numbers: '.bingo_roller_numbers'
    };

    var createNumberElement = function(value, className) {
        var numberEl = document.createElement('div');
        numberEl.className = 'number ' + (className || '');
        numberEl.id = 'num_' + value;
        numberEl.textContent = value;
        return numberEl;
    };

    return {
        displayNumbers: function(rollers) {
            var container = document.querySelector(domstrings.bingo_roller_numbers);
            if (!container) {
                return;
            }

            container.innerHTML = '';

            for (var i = 0; i < rollers.length; i++) {
                container.appendChild(createNumberElement(rollers[i]));
            }
        },

        updatePickedNumbers: function(pickedBalls) {
            var rollerContainer = document.querySelector(domstrings.bingo_roller_numbers);
            if (!rollerContainer) {
                return;
            }

            var previousLatestRoller = rollerContainer.querySelector('.latest');
            if (previousLatestRoller) {
                previousLatestRoller.classList.remove('latest');
            }

            var previousLatestTickets = document.querySelectorAll('.deck .number.latest');
            for (var t = 0; t < previousLatestTickets.length; t++) {
                previousLatestTickets[t].classList.remove('latest');
            }

            for (var i = 0; i < pickedBalls.length; i++) {
                var drawnNumber = pickedBalls[i];
                var rollerNumber = rollerContainer.querySelector('#num_' + drawnNumber);
                if (rollerNumber) {
                    rollerNumber.classList.add('drawn');
                }
            }

            var lastNum = null;
            if (pickedBalls.length > 0) {
                lastNum = pickedBalls[pickedBalls.length - 1];
                var latestRoller = rollerContainer.querySelector('#num_' + lastNum);
                if (latestRoller) {
                    latestRoller.classList.add('latest');
                }
            }

            this.updateTicketNumbers(lastNum);
        },

        updateTicketNumbers: function(lastPickedNum) {
            var allTicketNumbers = document.querySelectorAll('.deck .number');

            for (var i = 0; i < allTicketNumbers.length; i++) {
                var ticketEl = allTicketNumbers[i];
                var numberValue = parseInt(ticketEl.getAttribute('data-number'), 10);
                var rollerNum = document.querySelector('#num_' + numberValue);

                if (rollerNum && rollerNum.classList.contains('drawn')) {
                    ticketEl.classList.add('drawn');
                }

                if (lastPickedNum !== null && numberValue === lastPickedNum) {
                    ticketEl.classList.add('latest');
                }
            }
        },

        // Render every player ticket from state only (no placeholder markup)
        LoadDecks: function(playerDecks) {
            for (var player = 0; player < playerDecks.length; player++) {
                for (var row = 0; row < 3; row++) {
                    var deckSelector = '#player_' + (player + 1) + '_deck_' + (row + 1);
                    var deckElement = document.querySelector(deckSelector);
                    if (!deckElement) {
                        continue;
                    }

                    deckElement.innerHTML = '';

                    for (var col = 0; col < 6; col++) {
                        var value = playerDecks[player][row][col];
                        var numberEl = document.createElement('div');
                        numberEl.className = 'number numberbox';
                        numberEl.id = 'ticket_' + (player + 1) + '_r' + row + '_c' + col;
                        numberEl.setAttribute('data-number', value);
                        numberEl.textContent = value;
                        deckElement.appendChild(numberEl);
                    }
                }
            }
        },

        getDOMstrings: function() {
            return domstrings;
        },

        validateEventListeners: function() {
            return {
                btnStart: !!document.querySelector(domstrings.btnstart),
                btnLoadDecks: !!document.querySelector(domstrings.btnLoadDecks),
                rollerContainer: !!document.querySelector(domstrings.bingo_roller_numbers)
            };
        }
    };
})();

var GlobalController = (function(BCtrl, UICtrl) {
    var bingodata = BCtrl.GetData();
    var drawIntervalId = null;

    var checkWin = function() {
        var winState = BCtrl.HasWinningRow();
        if (winState.won) {
            alert('BINGO! Player ' + (winState.player + 1) + ' row ' + (winState.row + 1) + ' complete!');
            return true;
        }
        return false;
    };

    var setupListeners = function() {
        var dom = UICtrl.getDOMstrings();

        var btnStart = document.querySelector(dom.btnstart);
        if (btnStart) {
            btnStart.addEventListener('click', startGame);
        }

        var btnLoadDecks = document.querySelector(dom.btnLoadDecks);
        if (btnLoadDecks) {
            btnLoadDecks.addEventListener('click', loadDecks);
        }
    };

    var loadDecks = function() {
        BCtrl.LoadDecks();
        UICtrl.LoadDecks(BCtrl.GetTicketState());
    };

    var startGame = function() {
        if (drawIntervalId) {
            clearInterval(drawIntervalId);
            drawIntervalId = null;
        }

        if (!BCtrl.HasValidTicket()) {
            loadDecks();
        }

        BCtrl.ResetTicketMarks();
        BCtrl.LoadRoller();
        UICtrl.displayNumbers(bingodata.ballRoller);
        UICtrl.updatePickedNumbers([]);

        drawIntervalId = setInterval(function() {
            var pick = BCtrl.SetRandomPick();
            if (pick === null) {
                clearInterval(drawIntervalId);
                drawIntervalId = null;
                alert('No winner - all balls drawn!');
                return;
            }

            var gameState = BCtrl.GetGameState();
            UICtrl.updatePickedNumbers(gameState.pickedBalls);

            BCtrl.CheckTicketLine(gameState.lastPicked);

            if (checkWin()) {
                clearInterval(drawIntervalId);
                drawIntervalId = null;
            }
        }, 1000);
    };

    return {
        init: function() {
            setupListeners();
            UICtrl.validateEventListeners();
        }
    };
})(BingoController, UIController);

GlobalController.init();