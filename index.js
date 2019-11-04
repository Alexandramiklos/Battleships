var view = {
  displayMessage: function(message) {
    var messageArea = document.querySelector("#messageArea");
    messageArea.innerHTML = message;
  },
  displayHit: function(location) {
    var cell = document.getElementById(location);
    //the location is created from the row and column and matches an id of a <td> element
    cell.setAttribute("class", "hit");
  },
  displayMiss: function(location) {
    var cell = document.getElementById(location);
    cell.setAttribute("class", "miss");
  }
};
//view.displayMiss("00");
// view.displayHit("34");
// view.displayMiss("55");
// view.displayHit("12");
// view.displayMiss("25");
// view.displayHit("26");
// view.displayMessage("Tap tap, is this thing on?");

var model = {
  boardSize: 7,
  numShips: 3,//The number of ships in the game.
  shipLength: 3,//The number of locations in each ship.
  shipsSunk: 0,

  ships: [ { locations: [0, 0, 0], hits: ["", "", ""] },
           { locations: [0, 0, 0], hits: ["", "", ""] },
           { locations: [0, 0, 0], hits: ["", "", ""] } ],

  generateShipLocations: function() {
  var locations;
  for (var i = 0; i < this.numShips; i++) {
    do {
      locations = this.generateShip();
    } while (this.collision(locations));
    this.ships[i].locations = locations;
  }
 },

   generateShip: function() {
    var direction = Math.floor(Math.random() * 2);
    var row, col;
    //the code to generate a starting location for the ship on the board.
    if (direction === 1) {
    // Generate a starting location for a horizontal ship
      row = Math.floor(Math.random() * this.boardSize);
      col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
    } else {
    // Generate a starting location for a vertical ship
      row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
      col = Math.floor(Math.random() * this.boardSize);
    }
    var newShipLocations = [];
    for (var i = 0; i < this.shipLength; i++) {
      if (direction === 1) {
        newShipLocations.push(row + "" + (col + i));
      }else {
        newShipLocations.push((row + i) + "" + col);
      }
    }
    return newShipLocations;
  },
      //we use parentheses to make sure i is added to col before it’s converted to a string

  fire: function(guess) {
    //Examine each ship and see if it occupies that location.
    for (var i = 0; i < this.numShips; i++) {
      var ship = this.ships[i];
      //var locations = ship.locations;
      // var index = locations.indexOf(guess);//indexOf method searches an array for a matching
      //value and returns its index, or -1 if it can't find it.
      var index = ship.locations.indexOf(guess);
      //We’ve combined the two lines commented above into a single line.
      if (index >= 0) {
        ship.hits[index] = "hit";
        view.displayHit(guess);
        view.displayMessage("HIT!");
        if (this.isSunk(ship)) {
            view.displayMessage("You sank my battleship!");
            this.shipsSunk++;
          }
        return true;
      // if we get an index greater than or
      //equal to zero, the user's guess is in the
     //location's array, and we have a hit.
      }
    }
    view.displayMiss(guess);
    view.displayMessage("You missed.");
    return false;
   //If it does, you have a hit, and we’ll mark the corresponding item
  //in the hits array (and let the view know we got a hit). We’ll also
  //return true from the method, meaning we got a hit.
  },

  //This method takes a ship, and
  //then checks every possible
  //location for a hit
  isSunk: function(ship) {
    for (var i = 0; i < this.shipLength; i++)  {
      if (ship.hits[i] !== "hit") {
        return false;
      }
    }
      return true;
  },
  collision: function(locations) {
    for(var i = 0; i < this.numShips; i++) {
      var ship = model.ships[i];
      for(var j = 0; j < locations.length; j++) {
        if (ship.locations.indexOf(locations[j]) >= 0) {
          return true;
        }
      }
    }
    return false;
    //no collision
  }
};
//model.fire("53");
var controller = {
  guesses: 0,
  processGuess: function(guess) {
    var location = parseGuess(guess);
    if (location) {
      this.guesses++;
      var hit = model.fire(location);
      if (hit && model.shipsSunk === model.numShips) {
        view.displayMessage("You sank all my battleships, in " +
        this.guesses + " guesses");
      }
    }
  }
};
// helper function to parse a guess from the user

function parseGuess(guess) {
	var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

	if (guess === null || guess.length !== 2) {
		alert("Oops, please enter a letter and a number on the board.");
	} else {
		var firstChar = guess.charAt(0);
		var row = alphabet.indexOf(firstChar);
		var column = guess.charAt(1);

		if (isNaN(row) || isNaN(column)) {
			alert("Oops, that isn't on the board.");
		} else if (row < 0 || row >= model.boardSize ||
		           column < 0 || column >= model.boardSize) {
			alert("Oops, that's off the board!");
		} else {
			return row + column;
		}
	}
	return null;
};
function init() {
  var fireButton = document.getElementById("fireButton");
  fireButton.onclick = handleFireButton;
  var guessInput = document.getElementById("guessInput");
  guessInput.onkeypress = handleKeyPress;
  //handles key press events from the HTML input field
  model.generateShipLocations();
  //We’re calling model.generateShipLocations
//from the init function so it happens right
//when you load the game, before you start
//playing. 
}
function handleKeyPress(e) {
  var fireButton = document.getElementById("fireButton");
  if (e.keyCode === 13) {
    fireButton.click();
    return false;
  }
}
function handleFireButton() {
// code to get the value from the form
  var guessInput = document.getElementById("guessInput");
  var guess = guessInput.value;
  controller.processGuess(guess);
  guessInput.value ="";//This little line just resets the form input element to be the empty string.
}
window.onload = init;

// console.log(parseGuess("A0"));
// console.log(parseGuess("B6"));
// controller.processGuess("A0");
// controller.processGuess("A6");
// controller.processGuess("B6");
// controller.processGuess("C6");
