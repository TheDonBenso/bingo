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
        return Array.apply(null, { length: rows }).map(function() {
            return Array.apply(null, { length: cols }).map(function() {
                return false;
            });
        });
    };

    var createEmptyPlayerMarks = function(playerCount, rows, cols) {
        return Array.apply(null, { length: playerCount }).map(function() {
            return createEmptyMarks(rows, cols);
        });
    };

    // Step 5: build one ticket as a strict 3x6 grid with unique values
    var generateUniqueTicket = function(rows, cols) {
        var totalCells = rows * cols;

        var pool = Array.apply(null, { length: 90 }).map(function(_, i) {
            return i + 1;
        });

        shuffle(pool);

        var values = pool.slice(0, totalCells);

        return Array.apply(null, { length: rows }).map(function(_, r) {
            return Array.apply(null, { length: cols }).map(function(_, c) {
                return values[r * cols + c];
            });
        });
    };

    var generateTicketsForPlayers = function(playerCount, rows, cols) {
        return Array.apply(null, { length: playerCount }).map(function() {
            return generateUniqueTicket(rows, cols);
        });
    };

    return {
        LoadRoller: function() {
            data.ballRoller = Array.apply(null, { length: 90 }).map(function(_, i) {
                return i + 1;
            });
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
            var mappedMatches = data.ticketPopulator.map(function(playerRows, player) {
                return playerRows.map(function(rowValues, row) {
                    return rowValues.map(function(cellValue, col) {
                        if (cellValue !== num) {
                            return null;
                        }

                        data.ticketMarks[player][row][col] = true;
                        return { player: player, row: row, col: col };
                    });
                });
            });

            var firstPassFlatten = Array.prototype.concat.apply([], mappedMatches);
            var secondPassFlatten = Array.prototype.concat.apply([], firstPassFlatten);

            return secondPassFlatten.filter(function(match) {
                return match !== null;
            });
        },

        ResetTicketMarks: function() {
            data.ticketMarks = createEmptyPlayerMarks(4, 3, 6);
        },

        HasValidTicket: function() {
            if (data.ticketPopulator.length !== 4) {
                return false;
            }

            var playerChecks = data.ticketPopulator.map(function(playerRows) {
                if (!playerRows || playerRows.length !== 3) {
                    return false;
                }

                var rowChecks = playerRows.map(function(rowValues) {
                    return !!rowValues && rowValues.length === 6;
                });

                return rowChecks.every(function(isValidRow) {
                    return isValidRow;
                });
            });

            return playerChecks.every(function(isValidPlayer) {
                return isValidPlayer;
            });
        },

        HasWinningRow: function() {
            var winningCandidates = data.ticketMarks.map(function(playerMarks, player) {
                return playerMarks.map(function(rowMarks, row) {
                    var rowValues = data.ticketPopulator[player] && data.ticketPopulator[player][row];
                    if (!rowMarks || !rowValues || rowMarks.length !== 6 || rowValues.length !== 6) {
                        return null;
                    }

                    var isComplete = rowMarks.map(function(mark) {
                        return !!mark;
                    }).every(function(mark) {
                        return mark;
                    });

                    if (isComplete) {
                        return { won: true, player: player, row: row };
                    }

                    return null;
                });
            });

            var flattenedCandidates = Array.prototype.concat.apply([], winningCandidates);
            var winners = flattenedCandidates.filter(function(candidate) {
                return candidate !== null;
            });

            if (winners.length > 0) {
                return winners[0];
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
            return data.ticketPopulator.map(function(playerRows) {
                return playerRows.map(function(row) {
                    return row.slice();
                });
            });
        },

        GetTicketMarks: function() {
            return data.ticketMarks.map(function(playerRows) {
                return playerRows.map(function(rowMarks) {
                    return rowMarks.slice();
                });
            });
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

            rollers
                .map(function(value) {
                    return createNumberElement(value);
                })
                .forEach(function(numberEl) {
                    container.appendChild(numberEl);
                });
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
            Array.prototype.forEach.call(previousLatestTickets, function(ticketEl) {
                ticketEl.classList.remove('latest');
            });

            pickedBalls.forEach(function(drawnNumber) {
                var rollerNumber = rollerContainer.querySelector('#num_' + drawnNumber);
                if (rollerNumber) {
                    rollerNumber.classList.add('drawn');
                }
            });

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

            Array.prototype.map.call(allTicketNumbers, function(ticketEl) {
                var numberValue = parseInt(ticketEl.getAttribute('data-number'), 10);
                var rollerNum = document.querySelector('#num_' + numberValue);

                if (rollerNum && rollerNum.classList.contains('drawn')) {
                    ticketEl.classList.add('drawn');
                }

                if (lastPickedNum !== null && numberValue === lastPickedNum) {
                    ticketEl.classList.add('latest');
                }

                return ticketEl;
            });
        },

        // Render every player ticket from state only (no placeholder markup)
        LoadDecks: function(playerDecks) {
            playerDecks.map(function(playerRows, player) {
                return playerRows.map(function(rowValues, row) {
                    var deckSelector = '#player_' + (player + 1) + '_deck_' + (row + 1);
                    var deckElement = document.querySelector(deckSelector);
                    if (!deckElement) {
                        return null;
                    }

                    deckElement.innerHTML = '';

                    return rowValues.map(function(value, col) {
                        var numberEl = document.createElement('div');
                        numberEl.className = 'number numberbox';
                        numberEl.id = 'ticket_' + (player + 1) + '_r' + row + '_c' + col;
                        numberEl.setAttribute('data-number', value);
                        numberEl.textContent = value;
                        deckElement.appendChild(numberEl);
                        return numberEl;
                    });
                });
            });
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

    var announce = function(message) {
        alert(this.playerName + ' — ' + message);
    };

    var checkWin = function() {
        var winState = BCtrl.HasWinningRow();
        if (winState.won) {
            var playerContext = { playerName: 'Player ' + (winState.player + 1) };
            announce.call(playerContext, 'BINGO! Row ' + (winState.row + 1) + ' complete!');
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
        UICtrl.displayNumbers.apply(UICtrl, [bingodata.ballRoller]);
        UICtrl.updatePickedNumbers([]);

        var drawTick = function() {
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
        }.bind(GlobalController);

        drawIntervalId = setInterval(drawTick, 1000);
    };

    return {
        init: function() {
            setupListeners();
            UICtrl.validateEventListeners();
        }
    };
})(BingoController, UIController);

GlobalController.init();