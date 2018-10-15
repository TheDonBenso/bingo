/* 
setup MVC style
*/

var BingoController = (function(){
//Populate Cards

//populate rolling basket with 90 balls 

//setup arrays 
//3 arrays for each card
//


});

var UIController = (function(){
        //getDomStrings
        var domstrings = {
            btnstart : '.btn_start',
            deck: '.deck',
            numberbox: '.numberbox'

        };

        //update cards


        return{
            
            getdomstrings: function(){
                return domstrings;
            }
        };
});

var GlobalController= (function(BCtrl, UICtrl){
    
    //setup eventlisteners0

    var setupListeners = function(){

       // var dom = UICtrl.getdomstrings();
         
        document.querySelector('.btn_start').addEventListener('click',startGame);

    };

    var updateDecks;

    var startGame = function(){
        //randomize each players deck
        //place results onto the decks
        //initialize the random number generator
        //start picking your random numbers
        //restyle picked numbers from the decks
        alert("ready!");
    };


return {
    init: function() {
            setupListeners();
    }
}
})(BingoController, UIController);

/*
Initialize the controller
*/

GlobalController.init();