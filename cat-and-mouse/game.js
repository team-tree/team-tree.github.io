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
    FRAME_RATE: 6, // animation frame rate; 6/60ths = 10 fps

    // Colors
    MOUSE_COLOR: 0xe86b0c,
    FLOOR_COLOR: 0xf9d29d,
    BORDER_COLOR: 0x7f543e,

    // Functions

    // Moves the mouse by one square if there is a blank square around it
    move : function(new_x, new_y, old_x, old_y){
        "use strict";

        if (PS.data(new_x, new_y) === MOUSE.FLOOR_COLOR) {
            // delete mouse
            PS.data(old_x, old_y, MOUSE.FLOOR_COLOR);
            PS.color(old_x, old_y, MOUSE.FLOOR_COLOR);
            // replace mouse
            PS.data(new_x, new_y, MOUSE.FLOOR_COLOR);
            PS.color(new_x, new_y, MOUSE.FLOOR_COLOR);
        }
    },

    reproduce : function(x, y){
        "use strict";

        for (var i = y - 1; i < y + 2; i++) {
            for (var j = x - 1; j < x + 2; j++) {
                if (PS.data(j, i) === MOUSE.FLOOR_COLOR) {
                    PS.data(x + 1, y + 1, MOUSE.MOUSE_COLOR);
                    PS.color(x + 1, y + 1, MOUSE.MOUSE_COLOR);
                }

            }
        }


    },

    born : function(x, y){
        "use strict";

    },

    tick : function(){
        "use strict";
        //while ()
        //MOUSE.reproduce()
    }
}

var CAT = {

    // Frame rate
    FRAME_RATE: 8, // animation frame rate; 8/60ths =  fps
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

    // Moves the mouse by one square if there is a blank square around it
    move : function(x, y){
        "use strict";

        //Array that holds possible movable squares
        var movable_x = [];
        var movable_y = [];


        // Double for loop to go through all the beads around the cat
        for (var i = x - 1; i <= x + 1; i++){
            for (var j = y - 1; j <= y + 1; y++){


                if (x < MOUSE.GRID_LENGTH && y < MOUSE.GRID_HEIGHT){
                    // check for mice
                    if (PS.data(i, j) == MOUSE.MOUSE_COLOR){
                        movable_x.push(i);
                        movable_y.push(j);
                    }
                }
            }
        }
    },

    // Move towards mouse and destroy it
    eat : function(cat_x, cat_y, mouse_x, mouse_y){
        "use strict";
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
    }
}
/*
PS.init( system, options )
Called once after engine is initialized but before event-polling begins.
This function doesn't have to do anything, although initializing the grid dimensions with PS.gridSize() is recommended.
If PS.grid() is not called, the default grid dimensions (8 x 8 beads) are applied.
Any value returned is ignored.
[system : Object] = A JavaScript object containing engine and host platform information properties; see API documentation for details.
[options : Object] = A JavaScript object with optional data properties; see API documentation for details.
*/

// UNCOMMENT the following code BLOCK to expose the PS.init() event handler:



PS.init = function( system, options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line
	// to verify operation:

    PS.debug( "PS.init() called\n" );

	// Set up grid size
    PS.gridSize(MOUSE.GRID_LENGTH, MOUSE.GRID_HEIGHT);

    // Initialize board
    PS.color(PS.ALL, PS.ALL, MOUSE.FLOOR_COLOR);
    PS.data(PS.ALL, PS.ALL, MOUSE.FLOOR_COLOR);

    // Mouse 1
    PS.data(MOUSE.GRID_LENGTH - 3, MOUSE.GRID_HEIGHT - 2, MOUSE.MOUSE_COLOR );
    PS.color(MOUSE.GRID_LENGTH - 3, MOUSE.GRID_HEIGHT - 2, MOUSE.MOUSE_COLOR );
    // Mouse 2
    PS.data(MOUSE.GRID_LENGTH - 4, MOUSE.GRID_HEIGHT - 6, MOUSE.MOUSE_COLOR );
    PS.color(MOUSE.GRID_LENGTH - 4, MOUSE.GRID_HEIGHT - 6, MOUSE.MOUSE_COLOR );
    // Mouse 3
    PS.data(MOUSE.GRID_LENGTH - 8, MOUSE.GRID_HEIGHT - 4, MOUSE.MOUSE_COLOR );
    PS.color(MOUSE.GRID_LENGTH - 8, MOUSE.GRID_HEIGHT - 4, MOUSE.MOUSE_COLOR );


    // This is also a good place to display
	// your game title or a welcome message
	// in the status line above the grid.
	// Uncomment the following code line and
	// change the string parameter as needed.

    PS.statusText( "Click a square to drop cat." );

	// Add any other initialization code you need here.
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



    // Create cat and change color of the bead
    CAT.born(x, y);
    PS.color(x, y, CAT.CAT_COLOR);

    // Store color info of the bead in data
    PS.data(x, y, CAT.CAT_COLOR)

	// Uncomment the following code line
	// to inspect x/y parameters:

    PS.debug( "PS.touch() @ " + CAT.CATS_X + ", " + CAT.CATS_Y + "\n" );

	// Add code here for mouse clicks/touches
	// over a bead.
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

/*

PS.keyDown = function( key, shift, ctrl, options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyDown(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is pressed.
};

*/

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



PS.input = function( sensors, options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code lines to inspect first parameter:

//	 var device = sensors.wheel; // check for scroll wheel
//
	 if ( device ) {
	   PS.debug( "PS.input(): " + device + "\n" );
	 }

	// Add code here for when an input event is detected.
    MOUSE.move(x + 1, y + 1, x, y);
//};



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
