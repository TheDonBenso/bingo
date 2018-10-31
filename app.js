/* 
setup MVC style
*/

var BingoController = ( function(){
//Populate Cards

//populate rolling basket with 90 balls 
var data = {

    ballRoller : [],
    pickedBalls : [], 
    ticketPopulator :  
      [  [], [],[]]
        

}
//setup arrays 

//3 arrays for each card
//

return {
    //ball roller will have hold numbers 1 to 90, array starts empty, this methods loads no 1-90
    LoadRoller : function(){

        for(i=1; i<=90; i++)
        {
            data.ballRoller[i] = i;
        }
    }, 
    
    //this method acts as the random selector of the ball from the roller. 
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
    //this method shall check the random number picked from above and checks through a ticket
    //in the deck
    CheckTicketLine: function(num){


    },

    //this method is for testing sake
    GetBallRoller: function(){
        return {
            ballRoller: data.ballRoller
        }
    },

    //loads the players decks with a ticket filled with 18 randomly selected numbers
    LoadDecks : function(){
        var randomTicket = [];
        
        for(x = 0; x<3; x++)
        {
            randomTicket.splice(0, randomTicket.length);
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
        console.log(randomTicket);
    },

    GetData : function(){
        return data;
    }
}

})();

var UIController = (function(){
        //getDomStrings
        var domstrings = {
                btnstart : '.btn_start',
                deck: '.deck',
                numberbox: '.numberbox',
                btn_start_decks: '.btn_start_decks'

        }

        //update cards

        return {
            displayNumbers: function(rollers){
                var str_rollers = "";
                for(x=1; x<=90;x++)
                {
                    str_rollers += rollers[x]+", "
                    //displayontohtml
                }

                document.querySelector('.bingo_roller_numbers').textContent = str_rollers;
            },

            LoadDecks: function(decks){


            },
            
            getDOMstrings: function(){
                return domstrings;
            }


        } 
       
        
})();

var GlobalController= (function(BCtrl, UICtrl){
      var bingodata = BCtrl.GetData();

    //setup eventlisteners0

    var setupListeners = function(){
        //Problem 1: currently, dom isn't working, I still get the error "uncaught typeerror: _____"
       // var dom = UICtrl.getDOMstrings(); 
        

        document.querySelector('.btn_start').addEventListener('click',startGame);
 
        document.querySelector('.btn_start_decks').addEventListener('click',loadDecks);
    };

    var loadDecks = function(){
        console.log(bingodata.ticketPopulator);
        BCtrl.LoadDecks();
       console.log(bingodata.ticketPopulator);
       UICtrl.LoadDecks(bingodata.ticketPopulator);
       

    };

    var startGame = function(){
        //load the ball roller with the numbers 1-90
      
        console.log(bingodata);

        console.log(bingodata.ticketPopulator);

        
        BCtrl.LoadRoller();       
       
        UICtrl.displayNumbers(bingodata.ballRoller);
                
        //randomize each players deck 
        //  BCtrl.loadDecks;
        
        //initialize the random number generator
        //place results onto the picked class line 17 of index.html
        //start picking your random numbers
        //restyle picked numbers on the players decks
       
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