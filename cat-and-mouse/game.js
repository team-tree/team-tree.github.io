/*
The following comment lines are for JSHint <https://jshint.com>, a tool for monitoring code quality.
You may find them useful if your development environment is configured to support JSHint.
If you don't use JSHint (or are using it with a configuration file), you can safely delete these lines.
*/

/* jshint browser : true, devel : true, esversion : 5, freeze : true */
/* globals PS : true */


var MOUSE = {

    // Game dimensions
    GRID_HEIGHT: 10,
    GRID_LENGTH: 10,
    FRAME_RATE: 50,
    MOUSE_TIMER: "",
    REPRODUCTION_COUNT: 0,

    // Colors
    MOUSE_COLOR: 0xe86b0c,
    FLOOR_COLOR: 0xf9d29d,
    BORDER_COLOR: 0x7f543e,
    BG_COLOR: 0xF9D2AC,

    // Functions

    // Moves the mouse by one square if there is a blank square around it
    move : function(x, y) {

        var movable_x = []; // arrays to store movable positions
        var movable_y = [];

        for (var i = -1; i < 2; i += 1){


            // Check if in grid
            if ((x+i) >= 0 && (x+i) < MOUSE.GRID_LENGTH) {

                var current_x = x + i; // Store current x that is being checked

                for (var j = -1; j < 2; j += 1) {

                    // Check if in grid
                    if ((y+j) >= 0 && (y+j) < MOUSE.GRID_HEIGHT) {

                        var current_y = y + j; // Store current y that is being checked

                        if (i == x && j == y){
                            // do nothing if it is checking itself
                        }

                        // Store coordinates that are not occupied
                        else if (PS.data(current_x, current_y) == MOUSE.FLOOR_COLOR) {

                            movable_x.push(current_x);
                            movable_y.push(current_y);
                        }
                    }
                    else {
                        j += 1;
                    }
                }
            }
            else {
                i += 1;
            }
        }
        // check if there is anywhere to move
        if (movable_x.length > 0){
            var random = (PS.random(movable_x.length) - 1); // to pick randomly out of movable tiles
            var tuple = [movable_x[random], movable_y[random]];

            // Change colors to indicate movement
            PS.color(tuple[0], tuple[1], MOUSE.MOUSE_COLOR);
            PS.color(x, y, MOUSE.FLOOR_COLOR);

            // Change data as well
            PS.data(tuple[0], tuple[1], MOUSE.MOUSE_COLOR);
            PS.data(x, y, MOUSE.FLOOR_COLOR);


            // Return a tuple with the coordinates
            if (tuple[0] != null && tuple[1] != null) {
                return tuple
            }
            else {
                var initial = [x, y];
                return initial;
            }


        }
    },

    reproduce : function(x, y){
        "use strict";

        var movable_x = []; // arrays to store movable positions
        var movable_y = [];

        for (var i = -1; i < 2; i += 1){


            // Check if in grid
            if ((x+i) >= 0 && (x+i) < MOUSE.GRID_LENGTH) {

                //Testing
                //PS.debug("x = " + x + " i = " + i + "\n");

                var current_x = x + i; // Store current x that is being checked

                for (var j = -1; j < 2; j += 1) {



                    // Check if in grid
                    if ((y+j) >= 0 && (y+j) < MOUSE.GRID_HEIGHT) {

                        //Testing
                        //PS.debug("y = " + y + " j = " + j + "\n");


                        var current_y = y + j; // Store current y that is being checked

                        if (i == x && j == y){
                            // do nothing if it is checking itself
                        }

                        // Store coordinates that are not occupied
                        else if (PS.data(current_x, current_y) == MOUSE.FLOOR_COLOR) {

                            movable_x.push(current_x);
                            movable_y.push(current_y);
                        }
                    }
                    else {
                        j += 1;
                    }
                }
            }
            else {
                i += 1;
            }
        }

        // check if there is anywhere to move
        if (movable_x.length > 0){
            var random = (PS.random(movable_x.length) - 1); // to pick randomly out of movable tiles
            var tuple = [movable_x[random], movable_y[random]];

            // Change colors to indicate movement
            PS.color(tuple[0], tuple[1], MOUSE.MOUSE_COLOR);


            // Change data as well
            PS.data(tuple[0], tuple[1], MOUSE.MOUSE_COLOR);


        }

    },

    born : function(){
        "use strict";

        var random_x = (PS.random(MOUSE.GRID_LENGTH) - 1);
        var random_y = (PS.random(MOUSE.GRID_HEIGHT) - 1);

        //Set color
        PS.color(random_x, random_y, MOUSE.MOUSE_COLOR);

        //Set data
        PS.data(random_x, random_y, MOUSE.MOUSE_COLOR);
    },

    tick : function(){
        "use strict";

        var current_x, current_y, empty_board;


        current_x = 0;
        current_y = 0;
        empty_board = true;



        // double loop to go through all the grid
        while (current_y < MOUSE.GRID_HEIGHT) {


            while (current_x < MOUSE.GRID_LENGTH) {


                // Check if it is a mouse
                if (PS.data(current_x, current_y) == MOUSE.MOUSE_COLOR) {


                    // Check if it is time to reproduce
                    if (MOUSE.REPRODUCTION_COUNT >= 2){
                        MOUSE.reproduce(current_x, current_y);
                        MOUSE.REPRODUCTION_COUNT = 0;
                    }

                    //Move mouse
                    MOUSE.move(current_x, current_y);
                    current_x += 1;

                    //Update no_mice variable
                    empty_board = false;

                }
                // Check if there are cats
                else if (PS.data(current_x, current_y) == CAT.CAT_COLOR){

                    empty_board = false
                    current_x += 1;

                } else {

                    current_x += 1;

                }
            }

            current_y += 1;
            current_x = 0;
        }

        //Increment reproduction count
        MOUSE.REPRODUCTION_COUNT += 1;

        //Check if there are any mice and create if there aren't any
        if (empty_board){

            var count = Math.floor((MOUSE.GRID_HEIGHT * MOUSE.GRID_LENGTH) / 3);

            for(var k = 0; k < count; k += 1){

                MOUSE.born();
            }

        }
    }
};

var CAT = {

    // Frame rate and timer
    FRAME_RATE: 10,
    CAT_TIMER: "",
    // Position
    POS_X: null,
    POS_Y: null,

    // Colors
    CAT_COLOR: 0x0d86ff,
    CAT_COLOR_HOVER: 0x84B7FF,

    // Active Cats
    CATS_X: [],
    CATS_Y: [],
    CATS_HUNGER: [],

    // Functions

    move : function(x, y) {

        var movable_x = []; // arrays to store movable positions
        var movable_y = [];

        for (var i = -1; i < 2; i += 1){


            // Check if in grid
            if ((x+i) >= 0 && (x+i) < MOUSE.GRID_LENGTH) {

                var current_x = x + i; // Store current x that is being checked

                for (var j = -1; j < 2; j += 1) {

                    // Check if in grid
                    if ((y+j) >= 0 && (y+j) < MOUSE.GRID_HEIGHT) {

                        var current_y = y + j; // Store current y that is being checked

                        if (i == x && j == y){
                            // do nothing if it is checking itself
                        }

                        // Move towards the first mouse you see
                        else if (PS.data(current_x, current_y) == MOUSE.MOUSE_COLOR) {

                            CAT.eat(x, y, current_x, current_y);
                            PS.audioPlay("fx_squish");

                            // make it into a tuple the return
                            var tuple = [current_x, current_y];
                            return tuple;
                        }
                        // If it is not a mouse store the coordinates in an array
                        else if (PS.data(current_x, current_y) == MOUSE.FLOOR_COLOR) {

                            movable_x.push(current_x);
                            movable_y.push(current_y);
                        }
                    }
                    else {
                        j += 1;
                    }
                }
            }
            else {
                i += 1;
            }
        }

        // No mouse eaten so hunger incremented
        CAT.starve(x, y);

        // check if there is anywhere to move
        if (movable_x.length > 0){
            var random = (PS.random(movable_x.length) - 1); // to pick randomly out of movable tiles
            var tuple = [movable_x[random], movable_y[random]];

            // Change colors to indicate movement
            PS.color(tuple[0], tuple[1], CAT.CAT_COLOR);
            PS.color(x, y, MOUSE.FLOOR_COLOR);

            // Change data as well
            PS.data(tuple[0], tuple[1], CAT.CAT_COLOR);
            PS.data(x, y, MOUSE.FLOOR_COLOR);


            // Return a tuple with the coordinates
            if (tuple[0] != null && tuple[1] != null) {

                return tuple
            }
            else {
                var initial = [x, y];
                return initial;
            }


        }
    },

    // Move towards mouse and destroy it
    eat : function(cat_x, cat_y, mouse_x, mouse_y){
        "use strict";

        // Set colors
        PS.color(cat_x, cat_y, MOUSE.FLOOR_COLOR);
        PS.color(mouse_x, mouse_y, CAT.CAT_COLOR);

        // Set data
        PS.data(cat_x, cat_y, MOUSE.FLOOR_COLOR);
        PS.data(mouse_x, mouse_y, CAT.CAT_COLOR);

        for (var i = 0; i < CAT.CATS_X.length; i += 1){

            if (cat_x == CAT.CATS_X[i] && cat_y == CAT.CATS_Y[i]){

                CAT.CATS_HUNGER[i] = 0;
            }
        }



    },

    // Increase starve count
    starve : function(x, y) {
        "use strict";

        for (var i = 0; i < CAT.CATS_X.length; i += 1){

            if (x == CAT.CATS_X[i] && y == CAT.CATS_Y[i]){

                CAT.CATS_HUNGER[i] += 1;
            }
        }
    },

    // Creates a new cat on the grid
    born : function(x, y){
        "use strict";

        // Assign position
        CAT.POS_X = x;
        CAT.POS_Y = y;

        // Add to active cats
        CAT.CATS_X.push(x);
        CAT.CATS_Y.push(y);

        // Hunger
        CAT.CATS_HUNGER.push(0);


    },
    // Destroys a cat on the grid
    die : function(x, y){
        "use strict";

        // Remove from active cats
        for (var i = 0; i < CAT.CATS_X.length; i += 1){

            if (x == CAT.CATS_X[i] && y == CAT.CATS_Y[i]) {

                // Change color
                PS.color(CAT.CATS_X[i], CAT.CATS_Y[i], MOUSE.FLOOR_COLOR);

                // Channge data
                PS.data(CAT.CATS_X[i], CAT.CATS_Y[i], MOUSE.FLOOR_COLOR);

                // Remove from arrays
                CAT.CATS_X.splice(i, 1);
                CAT.CATS_Y.splice(i, 1);
                CAT.CATS_HUNGER.splice(i, 1);

            }
        }
    },

    tick : function(){
        "use strict";

        var len, i, cat_x, cat_y;
        var coordinates = [1, 1];

        len = CAT.CATS_X.length;

        i = 0;
        while (i < len){

            // Choose the cat to move and move it
            cat_x = CAT.CATS_X[i];
            cat_y = CAT.CATS_Y[i];


            // Check if cat starves
            if (CAT.CATS_HUNGER[i] > 5){

                CAT.die(cat_x, cat_y);
            }

            // Check if it can move
            else if (coordinates = CAT.move(cat_x, cat_y)) {

                // Store new position of the cat
                CAT.CATS_X[i] = coordinates[0];
                CAT.CATS_Y[i] = coordinates[1];

                //Incremnts
                i += 1;
            }
            else {
                i +=1;
            }
        }
    }
};


PS.init = function( system, options ) {
	"use strict"; // Do not remove this directive!

    var GCat = CAT; // god cat variable


	// Set up grid size
    PS.gridSize(MOUSE.GRID_LENGTH, MOUSE.GRID_HEIGHT);

    // Clear any arrays that could be full
    GCat.CATS_X = [];
    GCat.CATS_Y = [];

    //Load Audıo
    PS.audioLoad("fx_blip"); // click audio
    PS.audioLoad("fx_squish"); //mouse getting eaten

    // Initialize board
    PS.color(PS.ALL, PS.ALL, MOUSE.FLOOR_COLOR);
    PS.data(PS.ALL, PS.ALL, MOUSE.FLOOR_COLOR);

    // Set border color
    PS.borderColor(PS.ALL, PS.ALL, MOUSE.BORDER_COLOR);

    // Set background color
    PS.gridColor(MOUSE.BG_COLOR);

    // Status Text
    PS.statusText( "Click a square to drop cat" );

    // Timers
    CAT.CAT_TIMER = PS.timerStart(CAT.FRAME_RATE, CAT.tick);
    MOUSE.MOUSE_TIMER = PS.timerStart(MOUSE.FRAME_RATE, MOUSE.tick);


};


PS.touch = function( x, y, data, options ) {
	"use strict"; // Do not remove this directive!


    if (PS.data(x, y) != CAT.CAT_COLOR) {
        // Create cat and change color of the bead
        CAT.born(x, y);
        PS.color(x, y, CAT.CAT_COLOR);

        // Store color info of the bead in data
        PS.data(x, y, CAT.CAT_COLOR)

        //Play audio
        PS.audioPlay("fx_blip");
    }
};


PS.enter = function( x, y, data, options ) {
	"use strict"; // Do not remove this directive!

    // Check if the bead is a cat, a mouse, or floor
    if (data == MOUSE.FLOOR_COLOR){

        // Change color of bead to hover
        PS.color(x, y, CAT.CAT_COLOR_HOVER);
    }
};





PS.exit = function( x, y, data, options ) {
	"use strict"; // Do not remove this directive!

    PS.color(x, y, data);

	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch exits a bead.
};



/*
PS.exitGrid ( options )
Called when the mouse cursor/touch exits the grid perimeter.
This function doesn't have to do anything. Any value returned is ignored.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.exitGrid() event handler:

/*

PS.exitGrid = function( options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to verify operation:

	// PS.debug( "PS.exitGrid() called\n" );

	// Add code here for when the mouse cursor/touch moves off the grid.
};

*/

/*
PS.keyDown ( key, shift, ctrl, options )
Called when a key on the keyboard is pressed.
This function doesn't have to do anything. Any value returned is ignored.
[key : Number] = ASCII code of the released key, or one of the PS.KEY_* constants documented in the API.
[shift : Boolean] = true if shift key is held down, else false.
[ctrl : Boolean] = true if control key is held down, else false.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.keyDown() event handler:



PS.keyDown = function( key, shift, ctrl, options ) {
	"use strict"; // Do not remove this directive!

    // Change grid according to number keys on the keyboard

    // Key 4
    if (key == 52){

        MOUSE.GRID_HEIGHT = 4;
        MOUSE.GRID_LENGTH = 4;

        // Stop timer so we dont keep creating new ones

        PS.timerStop(CAT.CAT_TIMER);
        PS.timerStop(MOUSE.MOUSE_TIMER);

        // initialize the borad again
        PS.init();

    }
    // Key 5
    if (key == 53){

        MOUSE.GRID_HEIGHT = 5;
        MOUSE.GRID_LENGTH = 5;

        // Stop timer so we dont keep creating new ones
        PS.timerStop(CAT.CAT_TIMER);
        PS.timerStop(MOUSE.MOUSE_TIMER);

        // initialize the borad again
        PS.init()
    }
    // Key 6
    if (key == 54){

        MOUSE.GRID_HEIGHT = 6;
        MOUSE.GRID_LENGTH = 6;

        // Stop timer so we dont keep creating new ones
        PS.timerStop(CAT.CAT_TIMER);
        PS.timerStop(MOUSE.MOUSE_TIMER);

        // initialize the borad again
        PS.init()
    }
    // Key 7
    if (key == 55){
        MOUSE.GRID_HEIGHT = 7;
        MOUSE.GRID_LENGTH = 7;

        // Stop timer so we dont keep creating new ones
        PS.timerStop(CAT.CAT_TIMER);
        PS.timerStop(MOUSE.MOUSE_TIMER);

        // initialize the borad again
        PS.init()
    }
    // Key 8
    if (key == 56){

        MOUSE.GRID_HEIGHT = 8;
        MOUSE.GRID_LENGTH = 8;

        // Stop timer so we dont keep creating new ones
        PS.timerStop(CAT.CAT_TIMER);
        PS.timerStop(MOUSE.MOUSE_TIMER);

        // initialize the borad again
        PS.init()
    }
    // Key 9
    if (key == 57){

        MOUSE.GRID_HEIGHT = 9;
        MOUSE.GRID_LENGTH = 9;

        // Stop timer so we dont keep creating new ones
        PS.timerStop(CAT.CAT_TIMER);
        PS.timerStop(MOUSE.MOUSE_TIMER);

        // initialize the borad again
        PS.init()
    }

	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyDown(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is pressed.
};


/*
PS.keyUp ( key, shift, ctrl, options )
Called when a key on the keyboard is released.
This function doesn't have to do anything. Any value returned is ignored.
[key : Number] = ASCII code of the released key, or one of the PS.KEY_* constants documented in the API.
[shift : Boolean] = true if shift key is held down, else false.
[ctrl : Boolean] = true if control key is held down, else false.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.keyUp() event handler:

/*

PS.keyUp = function( key, shift, ctrl, options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyUp(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is released.
};

*/

/*
PS.input ( sensors, options )
Called when a supported input device event (other than those above) is detected.
This function doesn't have to do anything. Any value returned is ignored.
[sensors : Object] = A JavaScript object with properties indicating sensor status; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
NOTE: Currently, only mouse wheel events are reported, and only when the mouse cursor is positioned directly over the grid.
*/

// UNCOMMENT the following code BLOCK to expose the PS.input() event handler:

/*

PS.input = function( sensors, options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code lines to inspect first parameter:

//	 var device = sensors.wheel; // check for scroll wheel
//
//	 if ( device ) {
//	   PS.debug( "PS.input(): " + device + "\n" );
//	 }

	// Add code here for when an input event is detected.
};

*/

/*
PS.shutdown ( options )
Called when the browser window running Perlenspiel is about to close.
This function doesn't have to do anything. Any value returned is ignored.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
NOTE: This event is generally needed only by applications utilizing networked telemetry.
*/

// UNCOMMENT the following code BLOCK to expose the PS.shutdown() event handler:

/*

PS.shutdown = function( options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to verify operation:

	// PS.debug( "“Dave. My mind is going. I can feel it.”\n" );

	// Add code here to tidy up when Perlenspiel is about to close.
};

*/
