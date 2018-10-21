/* 
setup MVC style
*/

var BingoController = (function(){
//Populate Cards

//populate rolling basket with 90 balls 
var data = {

    ballRoller : [1,2,3,4,5,6,7,8,9,10,
                    11,12,13,14,15,16,17,18,19,20,
                        21,22,23,24,25,26,27,28,29,30,
                            31,32,33,34,35,36,37,38,39,40,
                                41,42,43,44,45,46,47,48,49,50,
                                    51,52,53,54,55,56,57,58,59,60,
                                        61,62,63,64,65,66,67,68,69,70, 
                                            71,72,73,74,75,76,77,78,79,80,
                                                81,82,83,84,85,86,87,88,89,90],

    pickedBalls : [],

    ticketpopulator :   [   [], //deck1
                                [], //deck2
                                    [] //deck3
                        ]
};
//setup arrays 

//3 arrays for each card
//

return {


    SetRandomPick : function(){
      var pick
        do{
            pick = Math.random() * 100;
            
            if(1<pick<90)
            {
                data.pickedBalls.push(pick);
                data.ballRoller.splice(pick+1,1);
             }
        }
        while(1 < pick < 90);
       

    },

    CheckTicketLine: function(num){},


    


};

});

var UIController = (function(){
        //getDomStrings
        var domstrings = {
                btnstart : '.btn_start',
                deck: '.deck',
                numberbox: '.numberbox',
                btn_start_decks: '.btn_start_decks'

        };

        //update cards

        return {
            getDOMstrings: function(){
                return domstrings;
            }
        };  
       
        
});

var GlobalController= (function(BCtrl, UICtrl){
    
    //setup eventlisteners0

    var setupListeners = function(){

        var dom = UICtrl.getDOMstrings; 

        document.querySelector(UICtrl.domstrings.btnstart).addEventListener('click',startGame);
         
        document.querySelector(UICtrl.domstrings.btn_start_decks).addEventListener('click',loadDecks);

    };

    var loadDecks = function(){
        alert("Decks ready!");
    };

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