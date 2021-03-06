
var Game = function(){
	this.playersGuess = null;
	this.pastGuesses = [];
	this.winningNumber = generateWinningNumber();
	}

function newGame() {
	//Game class Methods on the Game Constructor Functions 
	//`.prototype` newGame function returns an empty, new game instance
    return new Game();
}

function generateWinningNumber(){
	
	return Math.ceil(Math.random() * 100);
}

function shuffle(arr){

 for(var i = arr.length-1; i > 0; i--) {
       var randomIndex = Math.floor(Math.random() * (i + 1));
    
       var temp = arr[i];
    
       arr[i] = arr[randomIndex];
    
       arr[randomIndex] = temp;
    }
    return arr;
}

Game.prototype.difference = function(){
	return Math.abs(this.playersGuess - this.winningNumber);
}	

Game.prototype.isLower = function(){
	return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function(num){
	if(num < 1 || num > 100 || typeof num !== 'number'){
		throw "That is an invalid guess.";
	} 
	this.playersGuess = num;
    return this.checkGuess();
}	 


Game.prototype.checkGuess = function(){
	if(this.playersGuess === this.winningNumber){
		// 'disable' the #submit and #hint buttons
		$('#hint, #submit').prop("disabled",true);
        $('#subtitle').text("Press the Reset button to play again!");
        
        return 'You Win!';

	} else {
		//If the player's guess is a duplicate, change the h1 #title tag and tell them to guess again.
		if(this.pastGuesses.indexOf(this.playersGuess) > -1){
			return "You have already guessed that number.";
		} else {		
			this.pastGuesses.push(this.playersGuess);
		
			//add the guess to the #guesses 'ul' element so the user can see what guesses they have already submitted.
			$('#guess-list li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);

			if(this.pastGuesses.length === 5) {
				// 'disable' the #submit and #hint buttons
				$('#hint, #submit').prop("disabled",true);
				//Use the h2 #subtitle to tell them to click the Reset button
				$('#subtitle').text("Press the Reset button to play again!");

                return 'You Lose.';
            
			}else {
				//use a combination of the output of the submitPlayersGuess and lower functions 
				//to craft a message telling the user how hot or cold they are, 
				//and if they should guess higher or lower
				var diff = this.difference();
                if(this.isLower()) {
                    $('#subtitle').text("Guess Higher!");
                } else {
                    $('#subtitle').text("Guess Lower!");
                }

				if(diff <10){
					return "You\'re burning up!";
				} else if(diff <25){
					return "You\'re lukewarm.";
				} else if(diff <50){
					return "You\'re a bit chilly.";
				} else {
					return "You\'re ice cold!";
				}
			}		
		}	
	}
}

Game.prototype.provideHint = function(){
	var arr = [this.winningNumber, generateWinningNumber(), generateWinningNumber()];
	return shuffle(arr);
}

function makeAGuess(game){
	//When a user presses the submit button, extract the value from the input, #player-input.
	var guess = $('#player-input').val();
	
	//player has submitted their guess, clear the input element
	$('#player-input').val("");
	
	//Pass the submitted value into playersGuessSubmission
	var output = game.playersGuessSubmission(parseInt(guess,10));
    $('#title').text(output);
	// //console.log the output.
	// console.log(output);
}


$(document).ready(function() {
    var game = new Game();
    
    $('#submit').click(function(e) {
       makeAGuess(game);
    })

    $('#player-input').keypress(function(event) {
        if ( event.which == 13 ) {
           makeAGuess(game);
        }
    })

	//When the 'hint' button is pressed, 
	//use #title to show the three list options generated by your provideHint function.
    $('#hint').click(function() {
        var hints = game.provideHint();
        $('#title').text('The winning number is '+hints[0]+', '+hints[1]+', or '+hints[2]);
    });

    //When the 'reset' button is pressed, create a new game instance. 
	//Reset the #title and #subtitle, and .guess list elements to their default values. 
	//You'll also need to make sure that your #submit and #hint buttons aren't disabled.
    $('#reset').click(function() {
        game = newGame();
        $('#title').text('Play the Guessing Game!');
        $('#subtitle').text('Guess a number between 1-100!')
        $('.guess').text('-');
        $('#hint, #submit').prop("disabled",false);

    })
})