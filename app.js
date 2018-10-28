/* 
setup MVC style
*/

var BingoController = (function(){
//Populate Cards

//populate rolling basket with 90 balls 
var data = {

    ballRoller : [0,1],
    pickedBalls : [0,1],

    ticketpopulator :   [   [0,1], //deck1
                                [0,1], //deck2
                                    [0,1] //deck3
                        ],

    getballroller: function(){
        return this.ballroller;
    }
};
//setup arrays 

//3 arrays for each card
//

return {

    LoadRoller : function(){

        for(i=1; i<=90; i++)
        {
            data.ballRoller[i] = i;
        }
    }, 

    SetRandomPick : function(){
      var pick
        do{
            pick = Math.random() * 100;
            
            if(1<pick<90)
            {
                data.pickedBalls.push(pick);
                data.ballRoller.splice(pick+1,1);
                break;
             }
        }
        while(1 < pick < 90);
       

    },

    CheckTicketLine: function(num){


    },

    GetBallRoller: function(){
        return {
            ballRoller: data.ballRoller
        }
    },

    LoadDecks : function(){
        var randomTicket = [];
        
        for(x = 0; x<18; x++)
        {
             var pick = Math.random() * 100;
            
            if(1<=pick<=90)
            {            
  
               if( (x+1) % 3 === 0 ){
                   data.ticketpopulator[2].map(pick).sort();
               } else if ((x+1)%2 ===0){
                   data.ticketpopulator[1].map(pick).sort();
               } else {
                   data.ticketpopulator[0].map(pick).sort();
               }

            }
        }
       



        console.log(randomTicket);
        
    }


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
            displayNumbers: function(rollers){
                var str_rollers = "";
                for(x=1; x<=90;x++)
                {
                    str_rollers += rollers.ballRoller[x]+", "
                    //displayontohtml
                }

                document.querySelector('.bingo_roller_numbers').textContent = str_rollers;
            },

            getDOMstrings: function(){
                return domstrings;
            }


        };  
       
        
});

var GlobalController= (function(BCtrl, UICtrl){
    
    //setup eventlisteners0

    var setupListeners = function(){

       // var dom = UICtrl.getDOMstrings(); 
        

        document.querySelector('.btn_start').addEventListener('click',startGame);
 
        document.querySelector('.btn_start_decks').addEventListener('click',loadDecks);
    };

    var loadDecks = function(){
        alert("Decks ready!");
    };

    var startGame = function(){
        //randomize each players deck
        BCtrl.LoadRoller;
        BCtrl.loadDecks;

        var getballroller = BCtrl.data.getballroller;
        var getboundballroller = getballroller.bind(BCtrl.data);
        UICtrl.displayNumbers(getboundballroller)
        //place results onto the decks
        //initialize the random number generator
        //start picking your random numbers
        //restyle picked numbers from the decks
        console.log(BCtrl.testingBall);
       // BCtrl.GetBallRoller.ballRoller = [];
      //  console.log(BCtrl.GetBallRoller.ballRoller);
       
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