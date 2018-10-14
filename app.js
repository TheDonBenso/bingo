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
        var DomStrings = {
            btnstart : '.btn_start'

        };

        //update cards


        return{
            
            getDomStrings: function(){
                return DomStrings;
            }
        };
});

var GlobalController= (function(BCtrl, UICtrl){
    
    //setup eventlisteners0

    var setupListeners = function(){

        var DOM = UICtrl.getDomStrings();
         
        document.querySelector(DOM.btnstart).addEventListener('click', startGame);

    };

var updateDecks;

var startGame = function(){
    console.log("right here!");
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