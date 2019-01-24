/*
game.js for Perlenspiel 3.3.x
Last revision: 2018-10-14 (BM)

Perlenspiel is a scheme by Professor Moriarty (bmoriarty@wpi.edu).
This version of Perlenspiel (3.3.x) is hosted at <https://ps3.perlenspiel.net>
Perlenspiel is Copyright © 2009-18 Worcester Polytechnic Institute.
This file is part of the standard Perlenspiel 3.3.x devkit distribution.

Perlenspiel is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published
by the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

Perlenspiel is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You may have received a copy of the GNU Lesser General Public License
along with the Perlenspiel devkit. If not, see <http://www.gnu.org/licenses/>.
*/

/*
This JavaScript file is a template for creating new Perlenspiel 3.3.x games.
By default, all event-handling function templates are COMMENTED OUT (using block-comment syntax), and are therefore INACTIVE.
Uncomment and add code to the event handlers required by your project.
Any unused event-handling function templates can be safely deleted.
Refer to the tutorials and documentation at <https://ps3.perlenspiel.net> for details.
*/

/*
The following comment lines are for JSHint <https://jshint.com>, a tool for monitoring code quality.
You may find them useful if your development environment is configured to support JSHint.
If you don't use JSHint (or are using it with a configuration file), you can safely delete these lines.
*/

/* jshint browser : true, devel : true, esversion : 5, freeze : true */
/* globals PS : true */

// Global namespaces
var Board = {

    GRID_HEIGHT: 8,
    GRID_LENGTH: 8,

    GAME_BG: 0x808080

};

var P1 = {

    // Player position
    POS_X: 0,
    POS_Y: 0,

    // Player movement
    VELOCITY_X: 0,
    VELOCITY_Y: 0,
    MAX_VELOCITY: 5,

    // Functions
    moveX : function() {
        "use strict";

        // Check if in grid
        if(P1.POS_X + P1.VELOCITY_X < Board.GRID_LENGTH && P1.POS_X + P1.VELOCITY_X >= 0) {

            // Change initial position to white
            PS.color(P1.POS_X, P1.POS_Y, PS.COLOR_WHITE);

            P1.POS_X = P1.POS_X + P1.VELOCITY_X;

            // Change new position to black
            PS.color(P1.POS_X, P1.POS_Y, PS.COLOR_BLACK);
        }
    },

    moveY : function() {
        "use strict";

        // Check if in grid
        if(P1.POS_Y + P1.VELOCITY_Y < Board.GRID_HEIGHT && P1.POS_Y + P1.VELOCITY_Y >= 0) {

            // Change initial position to white
            PS.color(P1.POS_X, P1.POS_Y, PS.COLOR_WHITE);

            P1.POS_Y = P1.POS_Y + P1.VELOCITY_Y;

            // Change new position to black
            PS.color(P1.POS_X, P1.POS_Y, PS.COLOR_BLACK);
        }
    },

    turnAround : function(velocity) {
        "use strict";

        velocity = -velocity;

        return velocity;
    },

    stop : function(velocity_x, velocity_y) {
        "use strict";

        velocity_x = 0;
        velocity_y = 0;

    }

};

var P2 = {

    // Player position
    POS_X: 0,
    POS_Y: 0,

    // Player movement
    VELOCITY_X: 0,
    VELOCITY_Y: 0,
    MAX_VELOCITY: 5,

    // Functions
    moveX : function() {
        "use strict";

        if(P2.POS_X + P2.VELOCITY_X < Board.GRID_LENGTH && P2.POS_X + P2.VELOCITY_X >= 0) {

            // Change initial position to white
            PS.color(P2.POS_X, P2.POS_Y, PS.COLOR_WHITE);

            P2.POS_X = P2.POS_X + P2.VELOCITY_X;

            // Change new position to black
            PS.color(P2.POS_X, P2.POS_Y, PS.COLOR_BLACK);
        }
    },

    moveY : function() {
        "use strict";

        if(P2.POS_Y + P2.VELOCITY_Y < Board.GRID_HEIGHT && P2.POS_Y + P2.VELOCITY_Y >= 0) {

            // Change initial position to white
            PS.color(P2.POS_X, P2.POS_Y, PS.COLOR_WHITE);

            P2.POS_Y = P2.POS_Y + P2.VELOCITY_Y;

            // Change new position to black
            PS.color(P2.POS_X, P2.POS_Y, PS.COLOR_BLACK);
        }
    },

    turnAround : function(velocity) {
        "use strict";

        velocity = -velocity;

        return velocity;
    },

    stop : function(velocity_x, velocity_y) {
        "use strict";

        velocity_x = 0;
        velocity_y = 0;

    }

};

// Initialize Players



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

	// PS.debug( "PS.init() called\n" );


    PS.gridSize(Board.GRID_HEIGHT, Board.GRID_LENGTH);
    PS.gridColor(Board.GAME_BG);



    PS.statusText( "Move using WASD keys" );

	// Initialize P1
	P1.POS_X = 2;
	P1.POS_Y = 2;
	PS.color(P1.POS_X, P1.POS_Y, PS.COLOR_BLACK);

	// Initialize P2
	P2.POS_X = 5;
	P2.POS_Y = 6;
    PS.color(P2.POS_X, P2.POS_Y, PS.COLOR_BLACK);

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

	// Uncomment the following code line
	// to inspect x/y parameters:

	// PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );

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

/*

PS.enter = function( x, y, data, options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.enter() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch enters a bead.
};

*/

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

/*

PS.exit = function( x, y, data, options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch exits a bead.
};

*/

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

	// Uncomment the following code line to inspect first three parameters:

	//PS.debug( "PS.keyDown(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is pressed.


	// W key
	if (key == 119){

        // Set velocities
        P1.VELOCITY_Y = -1;
        P2.VELOCITY_Y = -1;

	    // Move
	    P1.moveY();
        P2.moveY();

        //PS.debug("P1x = "+P1.POS_X+" P2x = "+P2.POS_X+" P1y = "+P1.POS_Y+" P2y = "+P2.POS_Y+"\n");

        // Change colors
        PS.color(P1.POS_X, P1.POS_Y, PS.COLOR_BLACK);
        PS.color(P2.POS_X, P2.POS_Y, PS.COLOR_BLACK);


    }

	// A key
	if (key == 97){

        // Set velocities
        P1.VELOCITY_X = -1;
        P2.VELOCITY_X = -1;

        // Move
        P1.moveX();
        P2.moveX();

        //PS.debug("P1x = "+P1.POS_X+" P2x = "+P2.POS_X+" P1y = "+P1.POS_Y+" P2y = "+P2.POS_Y+"\n");

        // Change colors
        PS.color(P1.POS_X, P1.POS_Y, PS.COLOR_BLACK);
        PS.color(P2.POS_X, P2.POS_Y, PS.COLOR_BLACK);

    }

	// S key
    if (key == 115){

        // Set velocities
        P1.VELOCITY_Y = 1;
        P2.VELOCITY_Y = 1;

        // Move
        P1.moveY();
        P2.moveY();

        //PS.debug("P1x = "+P1.POS_X+" P2x = "+P2.POS_X+" P1y = "+P1.POS_Y+" P2y = "+P2.POS_Y+"\n");

        // Change colors
        PS.color(P1.POS_X, P1.POS_Y, PS.COLOR_BLACK);
        PS.color(P2.POS_X, P2.POS_Y, PS.COLOR_BLACK);

    }

    // D key
    if (key == 100){


        // Set velocities
        P1.VELOCITY_X = 1;
        P2.VELOCITY_X = 1;

        // Move
        P1.moveX();
        P2.moveX();

        //PS.debug("P1x = "+P1.POS_X+" P2x = "+P2.POS_X+" P1y = "+P1.POS_Y+" P2y = "+P2.POS_Y+"\n");


        PS.color(P1.POS_X, P1.POS_Y, PS.COLOR_BLACK);
        PS.color(P2.POS_X, P2.POS_Y, PS.COLOR_BLACK);

    }
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



PS.keyUp = function( key, shift, ctrl, options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to inspect first three parameters:

	// PS.debug( "PS.keyUp(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is released.
};



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
