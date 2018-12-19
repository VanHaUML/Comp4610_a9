URL: https://vanhauml.github.io/Comp4610_a9/
Assignment 9: Implementing a Bit of Scrabble with Drag-and-Drop
Course: COMP4610 GUI I
Name: Van Ha, Senior UMass Lowell EE/CS Student
Email: van_ha@student.uml.edu
Copyright 2018 by Van Ha
Date Updated: 12/19/2018

One row of the board game Scrabble has been implemented
with jQuery UI draggable and droppable widgets.
Tiles are randomly generated to populate the holder.
User can drag tiles out of tile holder onto board.
User can rearrange tiles. The droppable "out" event caused lots 
of headaches with this.
Double letter and double word score blocks have been added.
Scoring takes those bonuses into effect.
Running total score and score of last word are shown.
Submitted words are validated against a dictionary.
A new round starts when word is submitted and the word is valid
or user clicks on new round button. Only enough tiles to refill
the rack to 7 are generated and board is cleared of used tiles. 
It does not replace all tiles on the rack.
Since user has option to
play indefinitely, tiles will never run out since
they are returned to the bag after use. Total running score and
score of last valid word are shown. Tiles must be contiguous for
the word to validate. Error message will show if word is not
contiguous or not in dictionary.

In all, I believe all parts of the rubric and the extra credit of
validating against the dictionary have been implemented.
