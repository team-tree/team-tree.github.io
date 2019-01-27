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

    GRID_LENGTH: 0,
    GRID_HEIGHT: 0,

    CURRENT_LEVEL: 0,
    CURRENT_MOVES: 0,
    TOTAL_MOVES: 0,

    GAME_BORDER: 0x808080,
    GAME_FLOOR: 0x496345,
    GAME_PLATFORM: 0xdeb76e,
    GAME_BACKGROUND: 0x808080,
    GAME_GRID: 0x757575,

    GRAVITY_FRAMES: 10,
    END_FRAMES: 4,
    FADE_FRAMES: 2,

    // Timers
    END_TIMER: "",
    FADE_OUT_TIMER: "",
    FADE_IN_TIMER: "",

/*
    fade : function() {
        "use strict";

        PS.fade( PS.ALL, PS.ALL, 15 );
        PS.borderFade(PS.ALL, PS.ALL, 15);
        PS.borderColor(PS.ALL, PS.ALL, PS.COLOR_WHITE);
        PS.color(PS.ALL, PS.ALL, PS.COLOR_WHITE);
        PS.gridShadow ( 1, PS.COLOR_WHITE );
        PS.timerStop(Board.FADE_OUT_TIMER);


    },
*/

    end : function() {
        "use strict";

        if(P1.POS_X == P2.POS_X && P1.POS_Y == P2.POS_Y){

            //Board.FADE_OUT_TIMER = PS.timerStart(Board.FADE_FRAMES, Board.fade);
            if(Board.CURRENT_LEVEL == 2){
                PS.statusText("You finished the game in " + Board.TOTAL_MOVES + " moves");
                PS.statusColor(PS.COLOR_GREEN);
                PS.color(PS.ALL, PS.ALL, Board.GAME_FLOOR);
                PS.glyph(0, 0, "");
                PS.glyph(1, 0, "");

                PS.audioPlay("fx_tada");

                PS.timerStop(Board.END_TIMER);
                PS.timerStop(P1.GRAVITY_TIMER);
                PS.timerStop(P2.GRAVITY_TIMER);

            } else {

                PS.timerStop(Board.END_TIMER);
                PS.timerStop(P1.GRAVITY_TIMER);
                PS.timerStop(P2.GRAVITY_TIMER);


                Board.CURRENT_LEVEL += 1;

                PS.audioPlay("fx_powerup8");

                PS.init();
            }
        } else {

            P1.render();
            P2.render();

        }
    }

};


var Levels = {

    GRID_SIZES: [8, 10, 11],

    GROUND_LINE: [
                    [6,7],
                    [8,9],
                    []
                 ],
    PLATFORMS_X: [
                    [0,7],
                    [0,1,4,6,8,9,9,9],
                    [0,1,3,4,5,6,7,2,3,4,5,5,6,7,8,2,3,4,5,6,7,8,2,3,4,5,6,7,8]
                 ],
    PLATFORMS_Y: [
                    [5,5],
                    [7,7,5,4,3,2,3,7],
                    [2,2,6,6,6,6,6,8,8,8,8,7,8,8,8,9,9,9,9,9,9,9,10,10,10,10,10,10,10]
                 ],
    P1_START: [
                [2,2],
                [9,1],
                [0,1]
              ],
    P2_START: [
                [5,0],
                [9,6],
                [4,5]
              ],

    render : function(level_num) {
        "use strict";

        // Draw gorund lines
        for(var i = 0; i < Levels.GROUND_LINE[level_num].length; i++){

            PS.color(PS.ALL, Levels.GROUND_LINE[level_num][i], Board.GAME_FLOOR);
        }

        for(var j = 0; j < Levels.PLATFORMS_X[level_num].length; j++){

            PS.color(Levels.PLATFORMS_X[level_num][j], Levels.PLATFORMS_Y[level_num][j], Board.GAME_FLOOR);
        }

        // Initialize P1
        P1.POS_X = Levels.P1_START[level_num][0];
        P1.POS_Y = Levels.P1_START[level_num][1];

        // Initialize P2
        P2.POS_X = Levels.P2_START[level_num][0];
        P2.POS_Y = Levels.P2_START[level_num][1];
    }

}


var P1 = {

    // Player position
    POS_X: 0,
    POS_Y: 0,

    // Player movement
    VELOCITY_X: 0,
    VELOCITY_Y: 0,
    MAX_VELOCITY: 5,

    // Timers
    GRAVITY_TIMER: "",

    // Functions
    moveX : function() {
        "use strict";

        // Check if in grid
        if(P1.POS_X + P1.VELOCITY_X < Board.GRID_LENGTH && P1.POS_X + P1.VELOCITY_X >= 0) {

            if(PS.color(P1.POS_X + P1.VELOCITY_X, P1.POS_Y) != Board.GAME_FLOOR) {

                // Change initial position to background color
                PS.color(P1.POS_X, P1.POS_Y, Board.GAME_BACKGROUND);

                P1.POS_X = P1.POS_X + P1.VELOCITY_X;

                // Change new position to black
                P1.render();

            }
        }
    },

    moveY : function() {
        "use strict";

        // Check if in grid
        if(P1.POS_Y + P1.VELOCITY_Y < Board.GRID_HEIGHT && P1.POS_Y + P1.VELOCITY_Y >= 0) {

            // Change initial position to background color
            PS.color(P1.POS_X, P1.POS_Y, Board.GAME_BACKGROUND);

            P1.POS_Y = P1.POS_Y + P1.VELOCITY_Y;

            // Change new position to black
            P1.render();
        }
    },


    render : function() {
        "use strict";

        PS.color(P1.POS_X, P1.POS_Y, PS.COLOR_BLACK);


    },


    gravity : function() {
        "use strict";

        // Check if in the player fell into the abyss
        if((P1.POS_Y + 1) == Board.GRID_HEIGHT){

            PS.timerStop(Board.END_TIMER);
            PS.timerStop(P1.GRAVITY_TIMER);
            PS.timerStop(P2.GRAVITY_TIMER);

            PS.init();
        } else // Check if there is floor below

        if(PS.color(P1.POS_X, (P1.POS_Y + 1)) != Board.GAME_FLOOR){
            P1.VELOCITY_Y = 1;

            P1.moveY();

            //Testing
            //PS.debug("gravity passed : "+P1.VELOCITY_Y+"\n");

        } else {

            P1.VELOCITY_Y = 0;
        }
    }
};

var P2 = {

    // Player position
    POS_X: 0,
    POS_Y: 0,

    // Player movement
    VELOCITY_X: 0,
    VELOCITY_Y: 0,

    // Timers
    GRAVITY_TIMER: "",

    // Functions
    moveX : function() {
        "use strict";

        if(P2.POS_X + P2.VELOCITY_X < Board.GRID_LENGTH && P2.POS_X + P2.VELOCITY_X >= 0) {

            if(PS.color(P2.POS_X + P2.VELOCITY_X, P2.POS_Y) != Board.GAME_FLOOR) {

                // Change initial position to background color
                PS.color(P2.POS_X, P2.POS_Y, Board.GAME_BACKGROUND);

                P2.POS_X = P2.POS_X + P2.VELOCITY_X;

                // Change new position to white
                P2.render();

            }
        }
    },

    moveY : function() {
        "use strict";

        if(P2.POS_Y + P2.VELOCITY_Y < Board.GRID_HEIGHT && P2.POS_Y + P2.VELOCITY_Y >= 0) {

            // Change initial position to background color
            PS.color(P2.POS_X, P2.POS_Y, Board.GAME_BACKGROUND);

            P2.POS_Y = P2.POS_Y + P2.VELOCITY_Y;

            // Change new position to white
            P2.render();
        }
    },


    render : function() {
        "use strict";

        PS.color(P2.POS_X, P2.POS_Y, PS.COLOR_WHITE);

    },

    gravity : function() {
        "use strict";

        // Check if in the player fell into the abyss
        if((P2.POS_Y + 1) == Board.GRID_HEIGHT){

            PS.timerStop(Board.END_TIMER);
            PS.timerStop(P1.GRAVITY_TIMER);
            PS.timerStop(P2.GRAVITY_TIMER);

            PS.init();
        }

        // Check if there is floor below
        if(PS.color(P2.POS_X, (P2.POS_Y + 1)) != Board.GAME_FLOOR){
            P2.VELOCITY_Y = 1;

            P2.moveY();

            //Testing
            //PS.debug("gravity passed : "+P1.VELOCITY_Y+"\n");

        } else {

            P2.VELOCITY_Y = 0;
        }

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

    Board.GRID_LENGTH = Levels.GRID_SIZES[Board.CURRENT_LEVEL];
    Board.GRID_HEIGHT = Levels.GRID_SIZES[Board.CURRENT_LEVEL];


    PS.gridSize(Board.GRID_LENGTH, Board.GRID_HEIGHT);

    PS.gridColor(Board.GAME_GRID);

    PS.color(PS.ALL, PS.ALL, Board.GAME_BACKGROUND);

    PS.border(PS.ALL, PS.ALL, 0);


    PS.statusText( "Move using WASD keys" );

    //Load Audio
    PS.audioLoad("fx_powerup8");
    PS.audioLoad("fx_pop");
    PS.audioLoad("fx_tada");


    // Initialize game floor
    Levels.render(Board.CURRENT_LEVEL);


    // Resert and info button
    PS.glyph(0, 0, "↺");
    PS.color(0, 0, 0xdeb76e);
    PS.glyph(1, 0, "ⓘ");
    PS.color(1, 0, 0xdeb76e);
    Board.CURRENT_MOVES = 0;

/*
    // Reset fade
    if(Board.FADE_OUT_TIMER != "") {

        PS.gridShadow(0, PS.COLOR_WHITE);
        PS.fade(PS.ALL, PS.ALL, 0);
        PS.borderFade(PS.ALL, PS.ALL, 0);
    }
*/

    // Timers
    P1.GRAVITY_TIMER = PS.timerStart(Board.GRAVITY_FRAMES, P1.gravity);
    P2.GRAVITY_TIMER = PS.timerStart(Board.GRAVITY_FRAMES, P2.gravity);
    Board.END_TIMER = PS.timerStart(Board.END_FRAMES, Board.end);

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

	// Rest button
	if(x == 0 && y == 0){

        PS.timerStop(Board.END_TIMER);
        PS.timerStop(P1.GRAVITY_TIMER);
        PS.timerStop(P2.GRAVITY_TIMER);


        PS.audioPlay("fx_pop");

        PS.init();
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



PS.enter = function( x, y, data, options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.enter() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch enters a bead.

	// Info button
	if(x == 1 && y == 0){

        PS.statusText("Level par: 4, Current move: "+ Board.CURRENT_MOVES);
	}
};




PS.exit = function( x, y, data, options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line to inspect x/y parameters:

	// PS.debug( "PS.exit() @ " + x + ", " + y + "\n" );

	// Add code here for when the mouse cursor/touch exits a bead.
    if(x == 1 && y == 0){

        PS.statusText( "Move using WASD, overlap white and black" );
    }
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

	// Uncomment the following code line to inspect first three parameters:

	//PS.debug( "PS.keyDown(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

	// Add code here for when a key is pressed.


	// A key
	if (key == 97 || key == 1005){


        // Set velocities
        P1.VELOCITY_X = -1;
        P2.VELOCITY_X = -1;


        // Move
        P1.moveX();


        // Same for P2
        P2.moveX();

        // Increment move count
        Board.CURRENT_MOVES += 1;
        Board.TOTAL_MOVES += 1;


        //PS.debug("P1x = "+P1.POS_X+" P2x = "+P2.POS_X+" P1y = "+P1.POS_Y+" P2y = "+P2.POS_Y+"\n");


    }

    // D key
    if (key == 100 || key == 1007){


        // Set velocities
        P1.VELOCITY_X = 1;
        P2.VELOCITY_X = 1;


        // Move
        P1.moveX();
        P2.moveX();

        // Increment move count
        Board.CURRENT_MOVES += 1;
        Board.TOTAL_MOVES += 1;


        //PS.debug("P1x = "+P1.POS_X+" P2x = "+P2.POS_X+" P1y = "+P1.POS_Y+" P2y = "+P2.POS_Y+"\n");



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
