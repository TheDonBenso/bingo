/* 
setup MVC style
*/

var BingoController = ( function(){
//Populate Cards

//populate rolling basket with 90 balls 
var data = {

    ballRoller : [],
    pickedBalls : [], 
    nextPickIndex : 0,
    ticketPopulator :  
      [     [], 
            [],
            []
    ]   

}

// Fisher-Yates shuffle utility
var shuffle = function(array){
    for(var i = array.length - 1; i > 0; i--){
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

//setup arrays 

//3 arrays for each card
//

return {
    //ball roller will have numbers 1-90 in random order, this method initializes and shuffles it
    LoadRoller : function(){
        data.ballRoller = [];
        for(var i = 1; i <= 90; i++){
            data.ballRoller.push(i);
        }
        shuffle(data.ballRoller);
        data.pickedBalls = [];
        data.nextPickIndex = 0;
    }, 
    
    //this method draws the next ball sequentially from the shuffled roller
    SetRandomPick : function(){
        if(data.nextPickIndex < data.ballRoller.length){
            var pick = data.ballRoller[data.nextPickIndex];
            data.pickedBalls.push(pick);
            data.nextPickIndex++;
            return pick;
        }
        return null;
    },
    
    // Get current game state
    GetGameState : function(){
        return {
            pickedBalls: data.pickedBalls.slice(),
            lastPicked: data.pickedBalls.length > 0 ? data.pickedBalls[data.pickedBalls.length - 1] : null,
            totalPicked: data.pickedBalls.length,
            ballsRemaining: data.ballRoller.length - data.nextPickIndex
        };
    },
    
    //this method shall check the random number picked from above and checks through a ticket
    //in the deck
    CheckTicketLine: function(num){
        var matches = [];
        for(var row = 0; row < data.ticketPopulator.length; row++){
            var line = data.ticketPopulator[row];
            for(var col = 0; col < line.length; col++){
                if(line[col] === num){
                    matches.push({ row: row, col: col });
                }
            }
        }
        return matches;
    },

    
    //loads the players decks with a ticket filled with 18 randomly selected numbers
    LoadDecks : function(){
        var randomTicket = [];
        
        for(x = 0; x<3; x++)
        {
            randomTicket.splice(0, 6);
            for(i=0;i<6;i++)
            {
                 var pick = Math.random() * 100;
                if(1<=pick<=90)
                {                     
                    randomTicket[i] = Math.round(pick);                    
                }
            }

            data.ticketPopulator[x] = randomTicket.slice(0); 
        }
    },

    //clears all the numbers in a deck, may use this when restarting the game
    //use this function when you want to load a new ticketline
    ClearDecks : function(){

        console.log("clearing array");
        data.ticketPopulator[0].splice(0, 6);
        data.ticketPopulator[1].splice(0, 6);
        data.ticketPopulator[2].splice(0, 6);

    },

    GetData : function(){
        return data;
    }
}

})();

var UIController = (function(){
        //getDomStrings
        var domstrings = {
                btnstart : '#btnStart',
                btnLoadDecks: '#btnLoadDecks',
                deck: '.deck',
                numberbox: '.numberbox',
                bingo_roller_numbers : '.bingo_roller_numbers',
                bingo_picked_numbers: '.bingo_picked_numbers'

        }

        // Helper: Create a number DOM element
        var createNumberElement = function(value, className) {
            var numberEl = document.createElement('div');
            numberEl.className = 'number ' + (className || '');
            numberEl.id = 'num_' + value;
            numberEl.textContent = value;
            return numberEl;
        };

        //update cards

        return {
            displayNumbers: function(rollers){
                var container = document.querySelector(domstrings.bingo_roller_numbers);
                // Clear existing content
                container.innerHTML = '';
                
                // Create and append number elements for each ball in roller
                for(var i = 0; i < rollers.length; i++) {
                    var numberEl = createNumberElement(rollers[i]);
                    container.appendChild(numberEl);
                }
            },

            updatePickedNumbers: function(pickedBalls) {
                // Update roller numbers (top section)
                var rollerContainer = document.querySelector(domstrings.bingo_roller_numbers);
                
                // Remove previous latest state from roller
                var prevLatest = rollerContainer.querySelector('.latest');
                if(prevLatest) {
                    prevLatest.classList.remove('latest');
                }
                
                // Update all picked balls in roller
                for(var i = 0; i < pickedBalls.length; i++) {
                    var numEl = rollerContainer.querySelector('#num_' + pickedBalls[i]);
                    if(numEl) {
                        numEl.classList.add('drawn');
                    }
                }
                
                // Add latest class to the most recent pick in roller
                if(pickedBalls.length > 0) {
                    var lastNum = pickedBalls[pickedBalls.length - 1];
                    var lastEl = rollerContainer.querySelector('#num_' + lastNum);
                    if(lastEl) {
                        lastEl.classList.add('latest');
                    }
                }
                
                // Sync ticket numbers (deck cards) with picked balls
                this.updateTicketNumbers(lastNum);
            },

            updateTicketNumbers: function(lastPickedNum) {
                // Find all ticket number elements and update their state
                var allTicketNumbers = document.querySelectorAll('.deck .number');
                
                allTicketNumbers.forEach(function(ticketEl) {
                    var numberValue = parseInt(ticketEl.textContent);
                    var rollerContainer = document.querySelector(domstrings.bingo_roller_numbers);
                    var rollerNum = rollerContainer.querySelector('#num_' + numberValue);
                    
                    if(rollerNum) {
                        // If the number is drawn in roller, mark it in tickets
                        if(rollerNum.classList.contains('drawn')) {
                            ticketEl.classList.add('drawn');
                        }
                        // If it's the latest in roller, mark it in tickets
                        if(rollerNum.classList.contains('latest')) {
                            ticketEl.classList.add('latest');
                        }
                    }
                });
            },

            LoadDecks: function(decks, decknumber){
                console.log(decks);
                for(var i=0; i<3; i++){
                    console.log(i);
                    var deckSelector = '#player_' + decknumber + '_deck_' + (i+1);
                    var deckElement = document.querySelector(deckSelector);
                    
                    // Clear existing content
                    deckElement.innerHTML = '';
                    
                    for(var x=0; x<decks[i].length; x++){
                        console.log(x);
                        var numberEl = createNumberElement(decks[i][x], 'numberbox');
                        numberEl.id = 'ticket_' + decknumber + '_' + i + '_' + x;
                        deckElement.appendChild(numberEl);
                    }
                }

                console.log("finished loading");
            },
            
            getDOMstrings: function(){
                return domstrings;
            },
            
            // Validate event listeners are properly connected
            validateEventListeners: function(){
                var results = {
                    btnStart: !!document.querySelector(domstrings.btnstart),
                    btnLoadDecks: !!document.querySelector(domstrings.btnLoadDecks),
                    rollerContainer: !!document.querySelector(domstrings.bingo_roller_numbers)
                };
                console.log('Event Listeners Validation:', results);
                return results;

        } 
       
        
})();

var GlobalController= (function(BCtrl, UICtrl){
      var bingodata = BCtrl.GetData();

    // Tracks which cells have been matched: matchedCells[row][col] = true
    var matchedCells = [
        [false, false, false, false, false, false],
        [false, false, false, false, false, false],
        [false, false, false, false, false, false]
    ];

    var checkWin = function(){
        for(var row = 0; row < matchedCells.length; row++){
            var rowComplete = true;
            for(var col = 0; col < matchedCells[row].length; col++){
                if(!matchedCells[row][col]){
                    rowComplete = false;
                    break;
                }
            }
            if(rowComplete){
                alert('BINGO! Row ' + (row + 1) + ' complete!');
                return true;
            }
        }
        return false;
    };

    // Setup event listeners with proper error handling
    var setupListeners = function(){
        var dom = UICtrl.getDOMstrings();
        
        // Start Game button
        var btnStart = document.querySelector(dom.btnstart);
        if(btnStart) {
            btnStart.addEventListener('click', startGame);
        } else {
            console.error('Start Game button not found with selector:', dom.btnstart);
        }
        
        // Load Decks button
        var btnLoadDecks = document.querySelector(dom.btnLoadDecks);
        if(btnLoadDecks) {
            btnLoadDecks.addEventListener('click', loadDecks);
        } else {
            console.error('Load Decks button not found with selector:', dom.btnLoadDecks);
        }
    };

    var loadDecks = function(){
        BCtrl.LoadDecks();
        console.log('Decks loaded:', BCtrl.GetData().ticketPopulator);
        UICtrl.LoadDecks(BCtrl.GetData().ticketPopulator, 1);
    };

    var resetGame = function(){
        // Reset all UI state for new game
        for(var r = 0; r < matchedCells.length; r++){
            for(var c = 0; c < matchedCells[r].length; c++){
                matchedCells[r][c] = false;
            }
        }
        // Clear visual states from all numbers
        var allNumbers = document.querySelectorAll('.number');
        allNumbers.forEach(function(numEl){
            numEl.classList.remove('drawn', 'latest');
        });
        console.log('Game reset - ready for new game');
    };

    var startGame = function(){
        console.log('Starting new game...');
        
        // Reset game state before starting
        resetGame();
        
        //load the ball roller with the numbers 1-90
        BCtrl.LoadRoller();       
        UICtrl.displayNumbers(bingodata.ballRoller);
        console.log('Ball roller loaded with', bingodata.ballRoller.length, 'balls');

        // Pick balls one at a time until a win or all 90 drawn
        var interval = setInterval(function(){
            if(bingodata.ballRoller.filter(Boolean).length === 0){
                clearInterval(interval);
                alert('No winner — all balls drawn!');
                return;
            }

            // Draw the next ball
            BCtrl.SetRandomPick();
            var gameState = BCtrl.GetGameState();
            var lastPick = gameState.lastPicked;
            
            // Step 3: Introduce State Sync
            // After each number draw:
            // - Update UI state for both roller and tickets
            // - Remove previous .latest
            // - Add .drawn + .latest to current number
            UICtrl.updatePickedNumbers(gameState.pickedBalls);
            console.log('Ball drawn:', lastPick);
            
            var matches = BCtrl.CheckTicketLine(lastPick);

            for(var m = 0; m < matches.length; m++){
                matchedCells[matches[m].row][matches[m].col] = true;
            }

            if(checkWin()){
                clearInterval(interval);
            }
        }, 1000);
    };


    return {
        init: function() {
            console.log('Initializing Bingo Game...');
            setupListeners();
            
            // Validate event listeners are properly connected
            var validated = UICtrl.validateEventListeners();
            if(!validated.btnStart || !validated.btnLoadDecks) {
                console.warn('⚠️  Some event listeners may not be properly connected!');
                console.warn('Start Button:', validated.btnStart ? '✓' : '✗');
                console.warn('Load Decks Button:', validated.btnLoadDecks ? '✓' : '✗');
            } else {
                console.log('✓ All event listeners successfully connected');
            }
        }
    }
})(BingoController, UIController);

/*
Initialize the controller
*/

GlobalController.init();