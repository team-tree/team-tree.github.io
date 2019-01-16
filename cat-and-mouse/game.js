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
    FRAME_RATE: 50, // animation frame rate; 6/60ths = 10 fps
    MOUSE_TIMER: "",
    REPRODUCTION_COUNT: 0,

    // Colors
    MOUSE_COLOR: 0xe86b0c,
    FLOOR_COLOR: 0xf9d29d,
    BORDER_COLOR: 0x7f543e,

    // Functions

    // Moves the mouse by one square if there is a blank square around it
    move : function(x, y) {

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
            PS.color(x, y, MOUSE.FLOOR_COLOR);

            // Change data as well
            PS.data(tuple[0], tuple[1], MOUSE.MOUSE_COLOR);
            PS.data(x, y, MOUSE.FLOOR_COLOR);

            //Testing
            //PS.debug(tuple[0] +", " + tuple[1]);

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

        var current_x, current_y, no_mice;


        current_x = 0;
        current_y = 0;
        no_mice = true;



        // double loop to go through all the grid
        while (current_y < MOUSE.GRID_HEIGHT) {

            //Testing
            //PS.debug("y = " + current_y + "\n");

            while (current_x < MOUSE.GRID_LENGTH) {


                // Check if it is a mouse
                if (PS.data(current_x, current_y) == MOUSE.MOUSE_COLOR) {


                    // Check if it is time to reproduce
                    if (MOUSE.REPRODUCTION_COUNT >= 3){
                        MOUSE.reproduce(current_x, current_y);
                        MOUSE.REPRODUCTION_COUNT = 0;
                    }

                    //Move mouse
                    MOUSE.move(current_x, current_y);
                    current_x += 1;

                    //Update no_mice variable
                    no_mice = false;

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
        if (no_mice){

            var count = Math.floor((MOUSE.GRID_HEIGHT * MOUSE.GRID_LENGTH) / 5);

            for(var k = 0; k < count; k += 1){

                MOUSE.born();
            }

        }
    }
};

var CAT = {

    // Frame rate and timer
    FRAME_RATE: 15, // animation frame rate; 8/60ths =  fps
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

    // Functions

    move : function(x, y) {

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

                        // Move towards the first mouse you see
                        else if (PS.data(current_x, current_y) == MOUSE.MOUSE_COLOR) {
                            // Testing
                            //PS.debug("Second if statement passed");
                            //console.log("second if");

                            CAT.eat(x, y, current_x, current_y);

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

            //Testing
            //PS.debug(tuple[0] +", " + tuple[1]);

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

    },

    // Creates a new cat on the grid
    born : function(x, y){

        // Assign position
        CAT.POS_X = x;
        CAT.POS_Y = y;

        // Add to active cats
        CAT.CATS_X.push(x);
        CAT.CATS_Y.push(y);

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
            //coordinates = CAT.move(cat_x, cat_y);

            // Testing
            //PS.debug(coordinates[0] + ", " + coordinates[1] + "\n");
            if (coordinates = CAT.move(cat_x, cat_y)) {

                // Store new position of the cat
                CAT.CATS_X[i] = coordinates[0];
                CAT.CATS_Y[i] = coordinates[1];
                i += 1;
            }
            else {
                i +=1;
            }
        }
    }
};

/*
PS.init( system, options )
Called once after engine is initialized but before event-polling begins.
This function doesn't have to do anything, although initializing the grid dimensions with PS.gridSize() is recommended.
If PS.grid() is not called, the default grid dimensions (8 x 8 beads) are applied.
Any value returned is ignored.
[system : Object] = A JavaScript object containing engine and host platform information properties; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/



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



    PS.statusText( "Click a square to drop cat" );

	// Add any other initialization code you need here.





    CAT.CAT_TIMER = PS.timerStart(CAT.FRAME_RATE, CAT.tick);
    MOUSE.MOUSE_TIMER = PS.timerStart(MOUSE.FRAME_RATE, MOUSE.tick);

    /*
    //Testing
    PS.color(3, 4, MOUSE.MOUSE_COLOR);
    PS.color(0, 0, MOUSE.MOUSE_COLOR);
    PS.color(2, 1, MOUSE.MOUSE_COLOR);
    PS.color(3, 5, MOUSE.MOUSE_COLOR);
    PS.color(0, 1, MOUSE.MOUSE_COLOR);
    PS.color(2, 4, MOUSE.MOUSE_COLOR);

    PS.data(3, 4, MOUSE.MOUSE_COLOR);
    PS.data(0, 0, MOUSE.MOUSE_COLOR);
    PS.data(2, 1, MOUSE.MOUSE_COLOR);
    PS.data(3, 5, MOUSE.MOUSE_COLOR);
    PS.data(0, 1, MOUSE.MOUSE_COLOR);
    PS.data(2, 4, MOUSE.MOUSE_COLOR);
    */

};



/*
PS.touch ( x, y, data, options )
Called when the left mouse button is clicked over bead(x, y), or when bead(x, y) is touched.
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.touch() event handler:



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



/*
PS.release ( x, y, data, options )
Called when the left mouse button is released, or when a touch is lifted, over bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.release() event handler:

/*

PS.release = function( x, y, data, options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.release() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse button/touch is released over a bead.
};

*/

/*
PS.enter ( x, y, button, data, options )
Called when the mouse cursor/touch enters bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.enter() event handler:



PS.enter = function( x, y, data, options ) {
	"use strict"; // Do not remove this directive!

    // Check if the bead is a cat, a mouse, or floor
    if (data == MOUSE.FLOOR_COLOR){

        // Change color of bead to hover
        PS.color(x, y, CAT.CAT_COLOR_HOVER);
    }
    // Show faint cat color when hovering over beads

	// Uncomment the following code line to inspect x/y parameters:

	//PS.debug( "PS.enter() @ " + x + ", " + y + "," + data + "\n" );

	// Add code here for when the mouse cursor/touch enters a bead.
};



/*
PS.exit ( x, y, data, options )
Called when the mouse cursor/touch exits bead(x, y).
This function doesn't have to do anything. Any value returned is ignored.
[x : Number] = zero-based x-position (column) of the bead on the grid.
[y : Number] = zero-based y-position (row) of the bead on the grid.
[data : *] = The JavaScript value previously associated with bead(x, y) using PS.data(); default = 0.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.exit() event handler:



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
