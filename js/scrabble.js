/*
	 File: https://vanhauml.github.io/Comp4610_a9/js/scrabble.js
     Assignment 9: Implementing a Bit of Scrabble with Drag-and-Drop
	 Course: COMP4610 GUI I
	 Name: Van Ha, Senior UMass Lowell EE/CS Student
	 Email: van_ha@student.uml.edu
	 Copyright 2018 by Van Ha
	 Date Updated: 12/19/2018

	Javascript file for Implementing a Bit of Scrabble with Drag-and-Drop.
	Extensive use of jQuery UI and its draggable and droppable widgets.
*/

/* 	Data structure for tiles, their value, and quantity.
	Had to change the _ to - to represent a blank since
	github threw an error about not being able to find
	the "_.jpg" but "-.jpg" works.
*/

tiles = {	"A" : {"value" : 1, "quantity" : 9},
			"B" : {"value" : 3, "quantity" : 2},
			"C" : {"value" : 3, "quantity" : 2},
			"D" : {"value" : 2, "quantity" : 4},
			"E" : {"value" : 1, "quantity" : 12},
			"F" : {"value" : 4, "quantity" : 2},
			"G" : {"value" : 2, "quantity" : 3},
			"H" : {"value" : 4, "quantity" : 2},
			"I" : {"value" : 1, "quantity" : 9},
			"J" : {"value" : 8, "quantity" : 1},
			"K" : {"value" : 5, "quantity" : 1},
			"L" : {"value" : 1, "quantity" : 4},
			"M" : {"value" : 3, "quantity" : 2},
			"N" : {"value" : 1, "quantity" : 6},
			"O" : {"value" : 1, "quantity" : 8},
			"P" : {"value" : 3, "quantity" : 2},
			"Q" : {"value" : 10, "quantity" : 1},
			"R" : {"value" : 1, "quantity" : 6},
			"S" : {"value" : 1, "quantity" : 4},
			"T" : {"value" : 1, "quantity" : 6},
			"U" : {"value" : 1, "quantity" : 4},
			"V" : {"value" : 4, "quantity" : 2},
			"W" : {"value" : 4, "quantity" : 2},
			"X" : {"value" : 8, "quantity" : 1},
			"Y" : {"value" : 4, "quantity" : 2},
			"Z" : {"value" : 10, "quantity" : 1},
			"-" : {"value" : 0, "quantity" : 2}
};

// Keeps track of which tile in the rack has been used
var tilesInPlay = {	"r0": false,
					"r1": false,
					"r2": false,
					"r3": false,
					"r4": false,
					"r5": false,
					"r6": false,
};

// Variables to track scores and word
var totalScore = 0;
var score = 0;
var word = {};
var wordList = {};

// Start of script when DOM loads
$(function(){
	// Reads words from file into dictionary
	// Source: https://johnresig.com/blog/dictionary-lookups-in-javascript/
	$.get( "words", function( txt ) {
		// Get an array of all the words
		var words = txt.split( "\n" );
	 
		// And add them as properties to the dictionary lookup
		// This will allow for fast lookups later
		for ( var i = 0; i < words.length; i++ ) {
			wordList[words[i]] = true;
		}
	});

	get_full_rack();
	start();

});


// Initializes the game
function start() {
	$(".tile").draggable({
		snapMode: "inner",
		revert: "invalid"
	});

	/* 	Allows only one draggable on each droppable and rearranging
		of letters.
	*/
	$(".board_block").droppable( {
		drop: function(event, ui) {
			$(this).droppable("option", "accept", ui.draggable);

			// Puts tile in play
			var tile_index = ui.draggable.attr("data-index");
			var rackSlot = "r" + tile_index;
			tilesInPlay[rackSlot] = true;

			var tileUsed = $(ui.draggable).attr("id");
			var letterUsed = $("#t" + tile_index).attr("data-value");
			var block = $(this).attr("id");

			word[block] = {};
			word[block]["letterUsed"] = letterUsed;
			word[block]["tileUsed"] = tileUsed;

			ui.draggable.position({
			  of: $(this),
			  using: function(pos) {
				$(this).animate(pos, 150, "linear");
			  }
			});
		  },

		/* Issue with out event function when dragging over any droppable and thus deleting
		   associated tile on that block. Put check in to make sure draggable is same tile
		   as one on the board before deleting it out of word data structure
		*/
		out: function(event, ui) {
			var elem;
			var dragLetter = ui.draggable.attr("data-value");
			var dragTile = ui.draggable.attr("id")

			elem = $($(this));
			var id = elem.attr("id");
			var wordElem = word[id];
			
			if (wordElem !== undefined && wordElem["letterUsed"] == dragLetter && wordElem["tileUsed"] == dragTile) {
				delete word[id];
			}
			$(this).droppable("option", "accept", ".tile");
		}
	});
}

//  Returns letter when given a reference index
function number_to_letter(number) {
	var letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K",
					"L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W",
					"X", "Y", "Z", "-"];
	
	return letters[number];
}

// Gets full rack of 7 tiles
function get_full_rack() {
	var tile;
	for (var i = 0; i < 7; i++) {
		tile = get_tile();
		var elem = "#r" + i;
		var content = "<img class='tile' id= 't" + i + "' data-index= '" + i + "' data-value= '"+ tile + "' src='img/" + tile + ".jpg' alt=" + tile +">";
		$(elem).append(content);
	}
}

// Gets a tile and updates quantity of that tile
function get_tile() {
	var index = Math.floor(Math.random() * Object.keys(tiles).length);
	var tile = number_to_letter(index);
	
	while (tiles[tile].quantity < 1) {
		index = Math.floor(Math.random() * Object.keys(tiles).length);
		tile = number_to_letter(index);
	}

	var tile = number_to_letter(index);
	tiles[tile].quantity--;
	return tile;

}

// Scores the word, updates total Score, and starts new round
function scoreWord() {
	score = 0;
	var doubleWordScore = 1;
	var wordToValidate = "";
	
	/* Checks if letters are in consecutive board blocks before scoring.
		Also validates against word list
	*/
	if(isConsecutive()) {
		$("#message").html("");

		$.each(word, function(key, value) {
			var blockID = "#" + key;
			var letterVal =  tiles[value.letterUsed].value;
			var doubleLetterVal = $(blockID).attr("data-letterVal");
			doubleWordScore *= $(blockID).attr("data-wordVal");
			score += letterVal * doubleLetterVal;
			wordToValidate += value["letterUsed"];
		});

		wordToValidate = wordToValidate.toLowerCase();

		if (wordList[wordToValidate]) {
			score *= doubleWordScore;
			totalScore += score;

			// Updates score on page
			$("#scoreBox").html("<h2>" + score + " </h2>");
			$("#totalScoreBox").html("<h2>" + totalScore + " </h2>");

			newRound();
		}
		else {
			// Error message if word is not in dictionary
			$("#message").html("<h2>" + wordToValidate + " Is Not a Valid Word</h2>");
		}
		
	}
	else {
		// Error message if letters are not contiguous
		$("#message").html("<h2>Letters Must Be In Consecutive Slots</h2>");
	}

}

// Check that tiles are in consecutive slots on the board
function isConsecutive() {
	var indexes = [];
	var wordLength = Object.keys(word).length;
	$.each(word, function(key,value) {
		var blockID = "#" + key;
		indexes.push($(blockID).attr("data-index"));
	});
	var indexLength = Math.max.apply(Math, indexes) - Math.min.apply(Math,indexes) + 1;
	return wordLength == indexLength;
}

// Creates New Round by clearing board and getting additional tiles to fill rack
function newRound() {
	$.each(tilesInPlay, function(key,value) {
		if (value == true) {
			/* Places tile used back in bag to be picked again since user can play
				indefinitely so tiles must not run out.
			*/
			var tileIndex = key[1];
			var oldTile = $("#t" + tileIndex).attr("data-value");			;
			tiles[oldTile]["quantity"]++;

			var new_tile = get_tile();
			var index = key[1];
			$("#" + key).html("<img class='tile' id= 't" + index + "' data-index= '" + index + "' data-value= '" + 
				new_tile + "' src='img/" + new_tile + ".jpg' alt=" + new_tile +">")
			tilesInPlay[key] = false;
		}
	});
	word = {};
	$(".board_block").droppable("destroy");
	start();
}

// Resets game
function resetGame() {
	location.reload();
}