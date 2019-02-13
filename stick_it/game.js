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

var HUB  = {

	GRID_HEIGHT: 10,
	GRID_LENGTH: 10,

};

var LEVELS = {

	GRASS_COLOR: 0X35c74c,
	SKY_COLOR: 0xa6fff6,
	DOOR_COLOR: 0X000000,
	DOORFRAME_COLOR: 0Xfff83f,

	CURRENT_LEVEL: 0,

	// Timers
	END_TIMER: "",
	END_FRAMES: 20,

	HEIGHT: [16,16,14],
	WIDTH: [16,16,16],
	// x and y values
	P_START: [
	            [3,12],
	            [3,13],
	            [3,11]
             ],
	DOOR_POS: [
	            [14,12],
	            [13,2],
	            [8,6]
              ],

	GRASS_X: [
	            [0,1,2,3,4,5,11,12,13,14,15,0,1,2,3,4,5,11,12,13,14,15,0,1,2,3,4,5,11,12,13,14,15],
	            [11,12,13,14,15,11,12,13,14,15,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
	            [5,6,15,5,6,15,5,6,15,5,6,15,5,6,15,5,6,15,5,6,15,5,6,7,8,9,10,11,15,5,6,7,8,9,10,11,15,15,15,15,0,1,2,3,4,5,15,0,1,2,3,4,5,15]
              ],
    GRASS_Y: [
                [13,13,13,13,13,13,13,13,13,13,13,14,14,14,14,14,14,14,14,14,14,14,15,15,15,15,15,15,15,15,15,15,15],
                [3,3,3,3,3,4,4,4,4,4,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,14,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15,15],
                [0,0,0,1,1,1,2,2,2,3,3,3,4,4,4,5,5,5,6,6,6,7,7,7,7,7,7,7,7,8,8,8,8,8,8,8,8,9,10,11,12,12,12,12,12,12,12,13,13,13,13,13,13,13]
              ],
    PLATFORMS_X: [],
    PLATFORMS_Y: [],


    render : function() {
        "use strict";

        // check if last level is complete
        if(LEVELS.CURRENT_LEVEL == 3){

            PS.color(PS.ALL, PS.ALL, PLAYER.ACTIVE_COLOR);
            PS.borderColor(PS.ALL, PS.ALL, PLAYER.ACTIVE_COLOR);
            PS.gridColor(LEVELS.SKY_COLOR);
            PS.statusColor(LEVELS.GRASS_COLOR);

            PS.audioPlay("fx_tada");

            if(PLAYER.GRAVITY_TIMER != "") {

                PS.timerStop(PLAYER.GRAVITY_TIMER);
            }

            if(PLAYER.STUCK_TIMER != "") {

                PS.timerStop(PLAYER.STUCK_TIMER);
            }

            PS.timerStop(LEVELS.END_TIMER);

        } else {

            // Set up grid
            PS.gridSize(LEVELS.WIDTH[LEVELS.CURRENT_LEVEL], LEVELS.HEIGHT[LEVELS.CURRENT_LEVEL]);
            PS.gridColor(PLAYER.PLATFORM_COLOR);
            PS.data(PS.ALL, PS.ALL, 0);
            PS.color(PS.ALL, PS.ALL, LEVELS.SKY_COLOR);
            PS.borderColor(PS.ALL, PS.ALL, LEVELS.SKY_COLOR);

            // Create ground
            for (var i = 0; i < LEVELS.GRASS_X[LEVELS.CURRENT_LEVEL].length; i++) {

                PS.color(LEVELS.GRASS_X[LEVELS.CURRENT_LEVEL][i], LEVELS.GRASS_Y[LEVELS.CURRENT_LEVEL][i], LEVELS.GRASS_COLOR);
            }

            // Place the player on the level
            PLAYER.POS_X = LEVELS.P_START[LEVELS.CURRENT_LEVEL][0];
            PLAYER.POS_Y = LEVELS.P_START[LEVELS.CURRENT_LEVEL][1];
            PLAYER.render();

            // Create exit door
            LEVELS.makeDoor(LEVELS.DOOR_POS[LEVELS.CURRENT_LEVEL][0], LEVELS.DOOR_POS[LEVELS.CURRENT_LEVEL][1]);

            // Place created platforms
            if (LEVELS.PLATFORMS_X.length > 0) {

                for (var m = 0; m < LEVELS.PLATFORMS_X.length; m++) {

                    PS.color(LEVELS.PLATFORMS_X[m], LEVELS.PLATFORMS_Y[m], PLAYER.PLATFORM_COLOR);
                }
            }
        }
    },
    makeDoor : function (x, y) {
        "use strict";


        // Door part
        PS.color(x, y, LEVELS.DOOR_COLOR);
        PS.color(x, y-1, LEVELS.DOOR_COLOR);
        PS.data(x, y, "door");
        PS.data(x, y-1, "door");


        // Door frame
        PS.color(x-1, y, LEVELS.DOORFRAME_COLOR);
        PS.color(x-1, y-1, LEVELS.DOORFRAME_COLOR);
        PS.color(x, y-2, LEVELS.DOORFRAME_COLOR);
        PS.color(x+1, y-1, LEVELS.DOORFRAME_COLOR);
        PS.color(x+1, y, LEVELS.DOORFRAME_COLOR);
        PS.data(x-1, y, "doorframe");
        PS.data(x-1, y-1, "doorframe");
        PS.data(x, y-2, "doorframe");
        PS.data(x+1, y-1, "doorframe");
        PS.data(x+1, y, "doorframe");


    },

    end : function () {
        "use strict";

        if(PS.data(PLAYER.POS_X, PLAYER.POS_Y) == "door"){

            // empty platform array
            LEVELS.PLATFORMS_X = [];
            LEVELS.PLATFORMS_Y = [];

            LEVELS.CURRENT_LEVEL += 1;
            LEVELS.render();
        }

    }
};

var PLAYER = {

	ACTIVE_COLOR: 0Xff9084,
	PLATFORM_COLOR: 0Xffd1cd,
	STUCK_BORDER_COLOR: 0xA15F32,

	POS_X: 0,
	POS_Y: 0,

	VELOCITY_X: 0,
    VELOCITY_Y: 0,

    // Platforms placed by the player
	PLATFORMS_X: [],
    PLATFORMS_Y: [],

    // Flag to change if the player sticks to the platforms
    STUCK: false,

    // Timer variables
    GRAVITY_TIMER: "",
    GRAVITY_FRAMES: 10,
    STUCK_TIMER: "",
    STUCK_FRAMES: 10,

    render : function() {
        "use strict";

        PS.color(PLAYER.POS_X, PLAYER.POS_Y, PLAYER.ACTIVE_COLOR);

        if(PLAYER.STUCK == true){

            PS.borderColor(PLAYER.POS_X, PLAYER.POS_Y, PLAYER.STUCK_BORDER_COLOR);
        }

    },
    moveX : function () {
        "use strict";
        var next_pos = PLAYER.POS_X + PLAYER.VELOCITY_X;


        // check if in grid
        if((next_pos >= 0) && (next_pos < LEVELS.WIDTH[LEVELS.CURRENT_LEVEL])) {

            // check if the next bead is not a ground
            if (PS.color(next_pos, PLAYER.POS_Y) != LEVELS.GRASS_COLOR) {

                // stick if the next bead is a platform bead
                if (PS.color(next_pos, PLAYER.POS_Y) == PLAYER.PLATFORM_COLOR) {

                    PLAYER.STUCK = true;
                    PLAYER.stick();

                }

                // check if the player is on a door bead
                else if(PS.data(PLAYER.POS_X, PLAYER.POS_Y) == "doorframe"){


                    // Change color of the old position
                    PS.color(PLAYER.POS_X, PLAYER.POS_Y, LEVELS.DOORFRAME_COLOR);
                    PS.borderColor(PLAYER.POS_X, PLAYER.POS_Y, LEVELS.SKY_COLOR);

                    // Set the new position
                    PLAYER.POS_X = next_pos;

                    // Change color of new position
                    PLAYER.render();

                }


                else {

                    // Change color of the old position
                    PS.color(PLAYER.POS_X, PLAYER.POS_Y, LEVELS.SKY_COLOR);
                    PS.borderColor(PLAYER.POS_X, PLAYER.POS_Y, LEVELS.SKY_COLOR);

                    // Set the new position
                    PLAYER.POS_X = next_pos;

                    // Change color of new position
                    PLAYER.render();


                }
            }
        }

    },

    moveY : function () {
        "use strict";
        var next_pos = PLAYER.POS_Y + PLAYER.VELOCITY_Y;

        // check if in grid
        if((next_pos >= 0) && (next_pos < LEVELS.HEIGHT[LEVELS.CURRENT_LEVEL])) {

            // check if the next bead is not a ground
            if (PS.color(PLAYER.POS_X, next_pos) != LEVELS.GRASS_COLOR) {

                // stick if the next bead is a platform bead
                if (PS.color(PLAYER.POS_X, next_pos) == PLAYER.PLATFORM_COLOR) {

                    PLAYER.STUCK = true;
                    PLAYER.stick();

                }

                // check if the player is on a door bead
                else if(PS.data(PLAYER.POS_X, PLAYER.POS_Y) == "doorframe"){


                    // Change color of the old position
                    PS.color(PLAYER.POS_X, PLAYER.POS_Y, LEVELS.DOORFRAME_COLOR);
                    PS.borderColor(PLAYER.POS_X, PLAYER.POS_Y, LEVELS.SKY_COLOR);

                    // Set the new position
                    PLAYER.POS_Y = next_pos;

                    // Change color of new position
                    PLAYER.render();
                }

                else {

                    // Change color of the old position
                    PS.color(PLAYER.POS_X, PLAYER.POS_Y, LEVELS.SKY_COLOR);
                    PS.borderColor(PLAYER.POS_X, PLAYER.POS_Y, LEVELS.SKY_COLOR);

                    // Set the new position
                    PLAYER.POS_Y = next_pos;

                    // Change color of new position
                    PLAYER.render();

                }
            }
        }

    },

    jump : function () {
        "use strict";

        var tempX, tempY;

        if((PLAYER.POS_Y + 1) < LEVELS.HEIGHT[LEVELS.CURRENT_LEVEL]) {

            if ((PS.color(PLAYER.POS_X, (PLAYER.POS_Y + 1)) == LEVELS.GRASS_COLOR) || (PS.color(PLAYER.POS_X, (PLAYER.POS_Y + 1)) == PLAYER.PLATFORM_COLOR)) {

                for (var m = 0; m < 3; m++) {

                    tempX = PLAYER.POS_X;
                    tempY = PLAYER.POS_Y;


                    PS.fade(PLAYER.POS_X, PLAYER.POS_Y, 5, {onEnd: PLAYER.endJumpFade, params: [tempX, tempY]});

                    PLAYER.VELOCITY_Y = -1;

                    PLAYER.moveY();

                }
            }
        }

    },

    endJumpFade : function (x1, y1) {
        "use strict";

        PS.fade(x1, y1, 0);
    },

    stick : function () {
        "use strict";

        PLAYER.render();

        if(PLAYER.GRAVITY_TIMER != "") {
            PS.timerStop(PLAYER.GRAVITY_TIMER);
            PLAYER.GRAVITY_TIMER = "";
        }

        PLAYER.STUCK_TIMER = PS.timerStart(PLAYER.STUCK_FRAMES, PLAYER.lookAroundStuck);



    },

    lookAroundStuck : function () {
        "use strict";

        for (var i = -1; i < 2; i += 1) {

            // Check if in grid
            if ((PLAYER.POS_X + i) >= 0 && (PLAYER.POS_X + i) < LEVELS.WIDTH[LEVELS.CURRENT_LEVEL]) {

                var current_x = PLAYER.POS_X + i; // Store current x that is being checked

                for (var j = -1; j < 2; j += 1) {

                    // Check if in grid
                    if ((PLAYER.POS_Y + j) >= 0 && (PLAYER.POS_Y + j) < LEVELS.HEIGHT[LEVELS.CURRENT_LEVEL]) {


                        var current_y = PLAYER.POS_Y + j; // Store current y that is being checked

                        if (i == PLAYER.POS_X && j == PLAYER.POS_Y) {
                            // do nothing if it is checking itself
                        }

                        else if(PS.color(current_x, current_y) == PLAYER.PLATFORM_COLOR){


                            return true;
                        }
                    }
                }
            }
        }
        if(PLAYER.GRAVITY_TIMER == ""){

            PLAYER.STUCK = false;
            PLAYER.GRAVITY_TIMER = PS.timerStart(PLAYER.GRAVITY_FRAMES, PLAYER.gravity);

            PS.timerStop(PLAYER.STUCK_TIMER);
            PLAYER.STUCK_TIMER = "";
        }

    },

    // Checks if there are ground or platform beads around the player
    lookAroundPlatform : function () {
        "use strict";

        for (var i = -1; i < 2; i += 2) {

            // Check if in grid
            if ((PLAYER.POS_X + i) >= 0 && (PLAYER.POS_X + i) < LEVELS.WIDTH[LEVELS.CURRENT_LEVEL]) {

                var current_x = PLAYER.POS_X + i; // Store current x that is being checked

                if (PS.color(current_x, PLAYER.POS_Y) == PLAYER.PLATFORM_COLOR) {

                    return true;
                }

                else if (PS.color(current_x, PLAYER.POS_Y) == LEVELS    .GRASS_COLOR) {

                    return true;
                }
            }
        }

        for (var j = -1; j < 2; j += 2) {

            // Check if in grid
            if ((PLAYER.POS_Y + j) >= 0 && (PLAYER.POS_Y + j) < LEVELS.HEIGHT[LEVELS.CURRENT_LEVEL]) {

                var current_y = PLAYER.POS_Y + j; // Store current y that is being checked

                if (PS.color(PLAYER.POS_X, current_y) == PLAYER.PLATFORM_COLOR) {

                    return true;
                }
                else if (PS.color(PLAYER.POS_X, current_y) == LEVELS.GRASS_COLOR) {

                    return true;
                }
            }
        }
        return false;

    },

    gravity : function () {
        "use strict";

        // Check if in the player fell into the abyss
        if((PLAYER.POS_Y + 1) == LEVELS.HEIGHT[LEVELS.CURRENT_LEVEL]) {

            PS.audioPlay("fx_bloink");


            LEVELS.render();

        } else if(PS.color(PLAYER.POS_X, (PLAYER.POS_Y + 1)) != LEVELS.GRASS_COLOR){

            PLAYER.VELOCITY_Y = 1;

            PLAYER.moveY();

        } else {

            PLAYER.VELOCITY_Y = 0;
            //Testing
            //PS.debug("second passed : "+PLAYER.VELOCITY_Y+"\n");
        }
    }

};



PS.init = function( system, options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line
	// to verify operation:

	//PS.debug( "PS.init() called\n" );

    PS.statusText( "Stick It!" );


    LEVELS.render();

    // Audio
    PS.audioLoad("fx_tada");

    // Timers
    PLAYER.GRAVITY_TIMER = PS.timerStart(PLAYER.GRAVITY_FRAMES, PLAYER.gravity);
    LEVELS.END_TIMER = PS.timerStart(LEVELS.END_FRAMES, LEVELS.end);

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

/*

PS.touch = function( x, y, data, options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line
	// to inspect x/y parameters:

	// PS.debug( "PS.touch() @ " + x + ", " + y + "\n" );

	// Add code here for mouse clicks/touches
	// over a bead.
};

*/

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

    // A key, left arrow
    if (key == 97 || key == 1005) {

        // Set velocity

        PLAYER.VELOCITY_X = -1;

        // Move
        PLAYER.moveX();
    }

    // D key, right arrow
    if (key == 100 || key == 1007) {

        // Set velocity
        PLAYER.VELOCITY_X = 1;

        // Move
        PLAYER.moveX();
    }

    // W key, up arrow
    if (key == 119 || key == 1006) {

        if(PLAYER.STUCK == true){

            //bug fix
            PLAYER.VELOCITY_Y = 0;

            // Set velocity
            PLAYER.VELOCITY_Y -= 1;

            // Move
            PLAYER.moveY();

        } else {

            PLAYER.jump();
        }
    }

    // S key, down arrow
    if (key == 115 || key == 1008) {


        // Set velocity
        PLAYER.VELOCITY_Y = 1;

        // Move
        PLAYER.moveY();
    }

    // Space key
    if (key == 32) {

        if(PLAYER.lookAroundPlatform()) {

            // Create a platform on player position
            PS.color(PLAYER.POS_X, PLAYER.POS_Y, PLAYER.PLATFORM_COLOR);
            PS.borderColor(PLAYER.POS_X, PLAYER.POS_Y, LEVELS.SKY_COLOR);

            // Put platform coordinates in the array
            LEVELS.PLATFORMS_X.push(PLAYER.POS_X);
            LEVELS.PLATFORMS_Y.push(PLAYER.POS_Y);

            // Place player on initial position
            PLAYER.POS_X = LEVELS.P_START[LEVELS.CURRENT_LEVEL][0];
            PLAYER.POS_Y = LEVELS.P_START[LEVELS.CURRENT_LEVEL][1];

            PLAYER.STUCK = false;
            PLAYER.render();
        }

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

    //PS.debug( "PS.keyUp(): key=" + key + ", shift=" + shift + ", ctrl=" + ctrl + "\n" );

    // A key, left arrow
    if (key == 97 || key == 1005) {

        // Set velocity
        PLAYER.VELOCITY_X = 0;

    }

    // D key, right arrow
    if (key == 100 || key == 1007) {


        // Set velocity
        PLAYER.VELOCITY_X = 0;
    }


    // S key, right arrow
    if (key == 115 || key == 1008) {


        // Set velocity
        PLAYER.VELOCITY_Y = 0;
    }


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
