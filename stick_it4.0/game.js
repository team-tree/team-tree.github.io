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

var HUB_IMAGE = null;

var HUB  = {

	GRID_HEIGHT: 16,
	GRID_LENGTH: 16,
	IN_HUB: false,

    // Start position in the hub
    left: 0,
    top: 27,
    width: 16,
    height: 42,

    // Placed platforms
    PLATFORMS_X: [],
    PLATFORMS_Y: [],

    // Exit coordinates
    EXITED: [],
    DOORS_DONE_X: [20,20,21,21,21,22,22],
    DOORS_DONE_Y: [14,13,14,13,12,14,13],

    // Doors
    DOORS_X: [4,4,11,11,4,4,17,17,21,21,25,25,31,31,7,7,14,14,32,32],
    DOORS_Y: [37,36,33,32,21,20,26,25,28,29,26,25,41,40,9,8,10,9,17,16],
    DOOR_TIMER: "",
    DOOR_FRAMES: 7,

	loadHUB : function () {
        "use strict";

        HUB.IMAGE = PS.imageLoad("images/hub_world.bmp", HUB.storeImage);
        PS.gridSize(HUB.GRID_LENGTH, HUB.GRID_HEIGHT);
    },

    storeImage : function (image) {
        "use strict";

        if ( image !== PS.ERROR ) {
            HUB_IMAGE = image;
            HUB.render();
        }
    },

    render : function () {
        "use strict";

        //bug fix
        LEVELS.CURRENT_LEVEL = 2;

        PS.gridSize(HUB.GRID_LENGTH, HUB.GRID_HEIGHT);
        PS.border(PS.ALL, PS.ALL, 0);
        PS.data(PS.ALL, PS.ALL, 0);

        // renders image to grid
        var flag = PS.imageBlit(HUB_IMAGE, 0, 0, HUB);

        HUB.IN_HUB = true;
        HUB.EXITED = [];


        if (flag == true){

            HUB.IN_HUB = true;
        }

        // draw platforms
        if(HUB.PLATFORMS_X.length > 0) {

            for (var i = 0; i < HUB.PLATFORMS_X.length; i += 1) {

                if (HUB.inCamera(HUB.PLATFORMS_X[i], HUB.PLATFORMS_Y[i])) {

                    if(HUB.PLATFORMS_X[i] != -1) {

                        PS.color(HUB.PLATFORMS_X[i] - HUB.left, HUB.PLATFORMS_Y[i] - HUB.top, PLAYER.PLATFORM_COLOR);
                    }
                }
            }
        }

        // Lock completed level doors
        if(HUB.DOORS_DONE_X.length > 0) {

            for (var j = 0; j < HUB.DOORS_DONE_X.length; j += 1) {

                if(HUB.DOORS_DONE_X[j] > 0 && HUB.DOORS_DONE_Y[j] > 0) {

                    if (HUB.inCamera(HUB.DOORS_DONE_X[j], HUB.DOORS_DONE_Y[j])) {

                        PS.color(HUB.DOORS_DONE_X[j] - HUB.left, HUB.DOORS_DONE_Y[j] - HUB.top, LEVELS.DOORFRAME_COLOR);
                        PS.data(HUB.DOORS_DONE_X[j] - HUB.left, HUB.DOORS_DONE_Y[j] - HUB.top, "done");
                    }
                }
            }
        }
        if(HUB.DOORS_DONE_X.length == 27){

            for(var m = 0; m < 7; m += 1){

                HUB.DOORS_X.push(HUB.DOORS_DONE_X[m]);
                HUB.DOORS_Y.push(HUB.DOORS_DONE_Y[m]);

                HUB.DOORS_DONE_X[m] = 0;
                HUB.DOORS_DONE_Y[m] = 0;
            }
        }

        PLAYER.render();
    },

    moveCameraX : function () {
        "use strict";

        // move left
        if(PLAYER.POS_X < 4 && HUB.left != 0){

            HUB.left -= 1;
            HUB.width -= 1;
            PLAYER.POS_X += 1;

            HUB.render()
        }

        //move right
        else if(HUB.width - (PLAYER.POS_X + HUB.left) < 4 && HUB.width < HUB_IMAGE.width){

            HUB.left += 1;
            HUB.width += 1;
            PLAYER.POS_X -= 1;

            HUB.render();
        }


    },

    moveCameraY: function () {
        "use strict";

        // move up
        if(PLAYER.POS_Y < 4 && HUB.top != 0){

            HUB.top -= 1;
            HUB.height -= 1;
            PLAYER.POS_Y += 1;

            HUB.render();
        }

        //move down
        else if(PLAYER.POS_Y > 13 && HUB.height < HUB_IMAGE.height){

            HUB.top += 1;
            HUB.height += 1;
            PLAYER.POS_Y -= 1;

            HUB.render();
        }
    },

    inCamera : function (x, y) {
        "use strict";

        if(x < HUB.width && x >= HUB.left){
            if(y <= HUB.height && y >= HUB.top){

                return true
            }
            else return false;
        }
        else return false;
    },

    checkDoor : function () {
        "use strict";
        for(var i = 0; i < HUB.DOORS_X.length; i += 1){

            if((PLAYER.POS_X + HUB.left) == HUB.DOORS_X[i] && (PLAYER.POS_Y + HUB.top) == HUB.DOORS_Y[i]){

                // Set level number
                if(i == 0 || i == 1){

                    HUB.IN_HUB = false;
                    HUB.PLATFORMS_X = [];
                    HUB.PLATFORMS_Y = [];

                    // Store exiting coordinates
                    HUB.EXITED[0] = PLAYER.POS_X;
                    HUB.EXITED[1] = PLAYER.POS_Y;

                    LEVELS.CURRENT_LEVEL = 0;
                    LEVELS.render();


                    PS.timerStop(HUB.DOOR_TIMER);
                    HUB.DOOR_TIMER = "";
                    return true;
                }
                else{

                    HUB.IN_HUB = false;
                    HUB.PLATFORMS_X = [];
                    HUB.PLATFORMS_Y = [];

                    // Store exiting coordinates
                    HUB.EXITED[0] = PLAYER.POS_X;
                    HUB.EXITED[1] = PLAYER.POS_Y;



                    LEVELS.CURRENT_LEVEL = Math.floor(i / 2);
                    PS.timerStop(HUB.DOOR_TIMER);
                    HUB.DOOR_TIMER = "";


                    LEVELS.render();
                    return true;

                }
            }

        }
    }

};

var LEVELS = {

    GRID_BACKGROUND_COLOR: 0xFFC8B6,
	GRASS_COLOR: 0X35c74c,
	SKY_COLOR: 0xa6fff6,
	DOOR_COLOR: 0X000000,
	DOORFRAME_COLOR: 0Xfff83f,
	STONE_COLOR: 0x7F7F7F,

	CURRENT_LEVEL: 0,

	// Timers
	END_TIMER: "",
	END_FRAMES: 10,

    WIDTH: [13,14,16,11,9,13,12,16,16,16],
	HEIGHT: [14,6,16,12,12,15,16,16,13,14],

	// x and y values
	P_START: [
	            [1,12],  // tutorial 1
	            [1,4],   // tutorial 2
	            [2,12],  // bridge level
                [1,10],  // three pillars
                [1,10],  // zipper
                [3,11],  // vertical level
                [1,1],   // falling
                [8,1],   // sphere
	            [1,1],   // slingshot
	            [1,10]  // right and up
             ],
	DOOR_POS: [
	            [11,2],
	            [12,4],
	            [14,12],
                [5,2],
                [7,2],
                [10,3],
                [10,14],
                [8,14],
	            [13,11],
	            [8,6]
              ],

	GRASS_X: [
	            [10,11,12,10,11,12,10,11,12,10,11,12,10,11,12,5,6,7,8,9,10,11,12,5,6,7,8,9,10,11,12,5,6,7,8,9,10,11,12,5,6,7,8,9,10,11,12,5,6,7,8,9,10,11,12,0,1,2,3,4,5,6,7,8,9,10,11,12],
	            [0,1,2,3,4,5,6,7,8,9,10,11,12,13,0,1,2,3,4,5,6,7,8,9,10,11,12,13,0,1,2,3,4,5,6,7,8,9,10,11,12,13],
	            [0,1,2,3,4,11,12,13,14,15,0,1,2,3,4,11,12,13,14,15,0,1,2,3,4,11,12,13,14,15],
                [1,9,5],
                [6,2,6,2,6,2],
                [8,9,10,11,12,8,9,10,11,12,8,9,10,11,12,8,9,10,11,12],
                [2,4,6],
                [7,8,10,4,7,10,4,6,7,9,10,2,3,4,6,7,10,6,8,9,10,11,12,4,5,3,5,7,8,9,10,5,10,10],
                [6,10],
	            [5,6,15,5,6,15,5,6,15,5,6,15,5,6,15,5,6,15,5,6,15,5,6,7,8,9,10,11,15,5,6,7,8,9,10,11,15,15,15,15,0,1,2,3,4,5,15,0,1,2,3,4,5,15]

              ],
    GRASS_Y: [
                [3,3,3,4,4,4,5,5,5,6,6,6,7,7,7,8,8,8,8,8,8,8,8,9,9,9,9,9,9,9,9,10,10,10,10,10,10,10,10,11,11,11,11,11,11,11,11,12,12,12,12,12,12,12,12,13,13,13,13,13,13,13,13,13,13,13,13,13],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,5,5,5,5,5,5,5,5,5,5,5,5,5,5],
                [13,13,13,13,13,13,13,13,13,13,14,14,14,14,14,14,14,14,14,14,15,15,15,15,15,15,15,15,15,15],
                [7,7,11],
                [3,4,5,6,7,8],
                [4,4,4,4,4,5,5,5,5,5,13,13,13,13,13,14,14,14,14,14],
                [6,9,12],
                [4,4,5,6,6,6,7,7,7,7,7,8,8,8,8,8,8,9,9,9,9,9,9,10,10,11,11,11,11,11,11,12,12,13],
                [6,6],
                [0,0,0,1,1,1,2,2,2,3,3,3,4,4,4,5,5,5,6,6,6,7,7,7,7,7,7,7,7,8,8,8,8,8,8,8,8,9,10,11,12,12,12,12,12,12,12,13,13,13,13,13,13,13]

              ],
    STONE_X: [
                [],
                [],
                [],
                [3,4,5,6,7,0,2,8,10,0,1,2,3,4,6,7,8,9,10],
                [0,1,2,7,8,0,1,6,7,8,0,1,2,7,8,0,1,6,7,8,0,1,2,7,8,0,1,6,7,8,0,1,2,3,4,5,6,7,8],
                [0,1,2,3,4,5,6,7,0,1,2,3,4,5,6,7],
                [4,6,8,4,6,8,0,1,2,4,6,8,0,1,2,4,6,8,0,1,2,4,6,8,0,1,2,6,8,0,1,4,6,8,0,1,2,4,6,8,0,1,2,4,8,0,1,2,6,8,0,1,2,4,6,8,0,1,2,4,6,0,1,2,4,8,0,1,2,4,6,8,0,1,2,4,6,8,0,1,2,4,6,8,9,10,11],
                [6,8,9,4,5,10,11,3,12,2,13,2,13,1,14,1,14,1,14,1,14,2,13,2,13,3,12,4,5,10,11,6,7,8,9],
                [6,6,0,1,2,6,6,6,6,10,10,10,10,10,10,11,12,13,14,15],
                []
             ],
    STONE_Y: [
                [],
                [],
                [],
                [3,3,3,3,3,7,7,7,7,11,11,11,11,11,11,11,11,11,11],
                [3,3,3,3,3,4,4,4,4,4,5,5,5,5,5,6,6,6,6,6,7,7,7,7,7,8,8,8,8,8,11,11,11,11,11,11,11,11,11],
                [13,13,13,13,13,13,13,13,14,14,14,14,14,14,14,14],
                [0,0,0,1,1,1,2,2,2,2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,5,5,5,5,5,6,6,6,6,6,7,7,7,7,7,7,8,8,8,8,8,9,9,9,9,9,10,10,10,10,10,10,11,11,11,11,11,12,12,12,12,12,13,13,13,13,13,13,14,14,14,14,14,14,15,15,15,15,15,15,15,15,15],
                [2,2,2,3,3,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13,14,14,14,14,15,15,15,15],
                [0,1,2,2,2,2,3,4,5,7,8,9,10,11,12,12,12,12,12,12],

                []
             ],

    PLATFORMS_X: [],
    PLATFORMS_Y: [],

    INIT_PLATFORMS_X: [
                        [9,9,9,9,9,4,4,4,4,4],
                        [4,4,4,9,9,9],
                        [],
                        [],
                        [],
                        [],
                        [4,6,8],
                        [],
                        [],
                        []
                      ],
    INIT_PLATFORMS_Y: [
                        [3,4,5,6,7,8,9,10,11,12],
                        [2,3,4,2,3,4],
                        [],
                        [],
                        [],
                        [],
                        [5,8,11],
                        [],
                        [],
                        []
                      ],



    render : function() {
        "use strict";

        // check if final level is complete
        if(LEVELS.CURRENT_LEVEL >= LEVELS.HEIGHT.length){

            PS.color(PS.ALL, PS.ALL, PLAYER.ACTIVE_COLOR);
            PS.borderColor(PS.ALL, PS.ALL, PLAYER.ACTIVE_COLOR);
            PS.gridColor(LEVELS.SKY_COLOR);
            PS.statusColor(LEVELS.GRASS_COLOR);
            PS.gridShadow(1, PS.COLOR_WHITE);

            HUB.IN_HUB = false;

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
            PS.gridColor(LEVELS.GRID_BACKGROUND_COLOR);
            PS.data(PS.ALL, PS.ALL, 0);
            PS.color(PS.ALL, PS.ALL, LEVELS.SKY_COLOR);
            PS.border(PS.ALL, PS.ALL, 0);

            if(LEVELS.CURRENT_LEVEL == 0  || LEVELS.CURRENT_LEVEL == 1){

                PS.statusText("WASD to move, Space bar to leave a mark");

            } else {

                PS.statusText("Stick it!");
            }


            // Create grass
            for (var i = 0; i < LEVELS.GRASS_X[LEVELS.CURRENT_LEVEL].length; i++) {

                if(LEVELS.GRASS_X[LEVELS.CURRENT_LEVEL].length > 0) {

                    PS.color(LEVELS.GRASS_X[LEVELS.CURRENT_LEVEL][i], LEVELS.GRASS_Y[LEVELS.CURRENT_LEVEL][i], LEVELS.GRASS_COLOR);
                }
            }

            // Create stone
            for (var j = 0; j < LEVELS.STONE_X[LEVELS.CURRENT_LEVEL].length; j++) {

                if(LEVELS.STONE_X[LEVELS.CURRENT_LEVEL].length > 0) {

                    PS.color(LEVELS.STONE_X[LEVELS.CURRENT_LEVEL][j], LEVELS.STONE_Y[LEVELS.CURRENT_LEVEL][j], LEVELS.STONE_COLOR);
                }
            }


            // Create exit door
            LEVELS.makeDoor(LEVELS.DOOR_POS[LEVELS.CURRENT_LEVEL][0], LEVELS.DOOR_POS[LEVELS.CURRENT_LEVEL][1]);

            // Place created platforms
            if (LEVELS.PLATFORMS_X.length > 0) {

                for (var m = 0; m < LEVELS.PLATFORMS_X.length; m++) {

                    if(LEVELS.PLATFORMS_X[m] != -1) {

                        PS.color(LEVELS.PLATFORMS_X[m], LEVELS.PLATFORMS_Y[m], PLAYER.PLATFORM_COLOR);
                    }
                }
            }

            if (LEVELS.INIT_PLATFORMS_X[LEVELS.CURRENT_LEVEL].length > 0){
                for (var k = 0; k < LEVELS.INIT_PLATFORMS_X[LEVELS.CURRENT_LEVEL].length; k ++){

                    PS.color(LEVELS.INIT_PLATFORMS_X[LEVELS.CURRENT_LEVEL][k], LEVELS.INIT_PLATFORMS_Y[LEVELS.CURRENT_LEVEL][k], PLAYER.PLATFORM_COLOR);
                }
            }

            // Place the player on the level
            PLAYER.POS_X = LEVELS.P_START[LEVELS.CURRENT_LEVEL][0];
            PLAYER.POS_Y = LEVELS.P_START[LEVELS.CURRENT_LEVEL][1];
            PLAYER.render();
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

    // Level end condition
    end : function () {
        "use strict";

        if(PS.data(PLAYER.POS_X, PLAYER.POS_Y) == "door"){

            // empty platform array
            LEVELS.PLATFORMS_X = [];
            LEVELS.PLATFORMS_Y = [];

            PLAYER.STUCK = false;

            PLAYER.POS_X = HUB.EXITED[0] + 1;
            PLAYER.POS_Y = HUB.EXITED[1] - 1;

            // to remove coordinates of the door for the completed level
            for(var i = 0; i < HUB.DOORS_X.length; i += 1){

                if(HUB.DOORS_X[i] == HUB.EXITED[0] + HUB.left){

                    if(HUB.DOORS_Y[i] == HUB.EXITED[1] + HUB.top || HUB.DOORS_Y[i] == HUB.EXITED[1] + 1 + HUB.top || HUB.DOORS_Y[i] == HUB.EXITED[1] - 1 + HUB.top){

                        HUB.DOORS_DONE_X.push(HUB.DOORS_X[i]);
                        HUB.DOORS_DONE_Y.push(HUB.DOORS_Y[i]);

                        HUB.DOORS_X[i] = 0;
                        HUB.DOORS_Y[i] = 0;
                    }
                }
            }

            PLAYER.VELOCITY_X = 0;
            PLAYER.VELOCITY_Y = 0;


            HUB.render();
            HUB.DOOR_TIMER = PS.timerStart(HUB.DOOR_FRAMES, HUB.checkDoor);
            PS.audioPlay("fx_powerup2");

        }

    }
};

var PLAYER = {

	ACTIVE_COLOR: 0Xff9084,
	PLATFORM_COLOR: 0Xffd1cd,
	STUCK_BORDER_COLOR: 0xFF5148,

	POS_X: 1,
	POS_Y: 8,

	VELOCITY_X: 0,
    VELOCITY_Y: 0,


    // Flag to change if the player sticks to the platforms
    STUCK: false,
    ERASE_COUNT: 0,

    // Timer variables
    GRAVITY_TIMER: "",
    GRAVITY_FRAMES: 12,
    STUCK_TIMER: "",
    STUCK_FRAMES: 10,

    render : function() {
        "use strict";

        PS.color(PLAYER.POS_X, PLAYER.POS_Y, PLAYER.ACTIVE_COLOR);

        if(PLAYER.STUCK == true){

            PS.border(PLAYER.POS_X, PLAYER.POS_Y, 3);
            PS.borderColor(PLAYER.POS_X, PLAYER.POS_Y, PLAYER.STUCK_BORDER_COLOR);
        }
        else if(PLAYER.STUCK == false){

            PS.border(PLAYER.POS_X, PLAYER.POS_Y, 0);
        }

    },
    moveX : function () {
        "use strict";
        var next_pos = PLAYER.POS_X + PLAYER.VELOCITY_X;


        // check if in grid
        if((next_pos >= 0) && (next_pos < LEVELS.WIDTH[LEVELS.CURRENT_LEVEL])) {

            // check if the next bead is not a grass
            if (PS.color(next_pos, PLAYER.POS_Y) != LEVELS.GRASS_COLOR && PS.color(next_pos, PLAYER.POS_Y) != LEVELS.STONE_COLOR) {

                // stick if the next bead is a platform bead
                if (PS.color(next_pos, PLAYER.POS_Y) == PLAYER.PLATFORM_COLOR) {

                    PLAYER.STUCK = true;
                    PLAYER.stick();

                    // erase blocks
                    PLAYER.erase(next_pos, PLAYER.POS_Y);
                    PLAYER.ERASE_COUNT += 1;
                }

                // check if the player is on a door frame bead
                else if(PS.data(PLAYER.POS_X, PLAYER.POS_Y) == "doorframe"){


                    // Change color of the old position
                    PS.color(PLAYER.POS_X, PLAYER.POS_Y, LEVELS.DOORFRAME_COLOR);
                    PS.border(PLAYER.POS_X, PLAYER.POS_Y, 0);

                    // Set the new position
                    PLAYER.POS_X = next_pos;

                    // Finish erasing
                    if(PLAYER.ERASE_COUNT != 0){

                        PLAYER.endErase();
                    }

                    // Change color of new position
                    PLAYER.render();


                }

                // check if the player is on a door bead
                else if(PS.data(PLAYER.POS_X, PLAYER.POS_Y) == "door"){


                    // Change color of the old position
                    PS.color(PLAYER.POS_X, PLAYER.POS_Y, LEVELS.DOOR_COLOR);
                    PS.border(PLAYER.POS_X, PLAYER.POS_Y, 0);

                    // Set the new position
                    PLAYER.POS_X = next_pos;

                    // Finish erasing
                    if(PLAYER.ERASE_COUNT != 0){

                        PLAYER.endErase();
                    }

                    // Change color of new position
                    PLAYER.render();

                }

                // check if the player is on a locked door
                else if(PS.data(PLAYER.POS_X, PLAYER.POS_Y) == "done"){


                    // Change color of the old position
                    PS.color(PLAYER.POS_X, PLAYER.POS_Y, LEVELS.DOORFRAME_COLOR);
                    PS.border(PLAYER.POS_X, PLAYER.POS_Y, 0);

                    // Set the new position
                    PLAYER.POS_X = next_pos;

                    // Finish erasing
                    if(PLAYER.ERASE_COUNT != 0){

                        PLAYER.endErase();
                    }

                    // Change color of new position
                    PLAYER.render();

                }




                else {

                    // Change color of the old position
                    PS.color(PLAYER.POS_X, PLAYER.POS_Y, LEVELS.SKY_COLOR);
                    PS.border(PLAYER.POS_X, PLAYER.POS_Y, 0);

                    // Set the new position
                    PLAYER.POS_X = next_pos;


                    // Finish erasing
                    if(PLAYER.ERASE_COUNT != 0){

                        PLAYER.endErase();
                    }

                    // Change color of new position
                    PLAYER.render();

                }
            }
        }
        // Camera movement
        if(HUB.IN_HUB == true){
            HUB.moveCameraX();
        }

    },

    moveY : function () {
        "use strict";
        var next_pos = PLAYER.POS_Y + PLAYER.VELOCITY_Y;

        // check if in grid
        if((next_pos >= 0) && (next_pos < LEVELS.HEIGHT[LEVELS.CURRENT_LEVEL])) {

            // check if the next bead is not a grass
            if (PS.color(PLAYER.POS_X, next_pos) != LEVELS.GRASS_COLOR && PS.color(PLAYER.POS_X, next_pos) != LEVELS.STONE_COLOR) {

                // stick if the next bead is a platform bead
                if (PS.color(PLAYER.POS_X, next_pos) == PLAYER.PLATFORM_COLOR) {

                    PLAYER.STUCK = true;
                    PLAYER.stick();

                    // erase blocks
                    PLAYER.erase(PLAYER.POS_X, next_pos);
                    PLAYER.ERASE_COUNT += 1;


                }

                // check if the player is on a door frame bead
                else if(PS.data(PLAYER.POS_X, PLAYER.POS_Y) == "doorframe"){


                    // Change color of the old position
                    PS.color(PLAYER.POS_X, PLAYER.POS_Y, LEVELS.DOORFRAME_COLOR);
                    PS.border(PLAYER.POS_X, PLAYER.POS_Y, 0);

                    // Set the new position
                    PLAYER.POS_Y = next_pos;

                    // Finish erasing
                    if(PLAYER.ERASE_COUNT != 0){

                        PLAYER.endErase();
                    }

                    // Change color of new position
                    PLAYER.render();
                }

                // check if the player is on a door bead
                else if(PS.data(PLAYER.POS_X, PLAYER.POS_Y) == "door"){


                    // Change color of the old position
                    PS.color(PLAYER.POS_X, PLAYER.POS_Y, LEVELS.DOOR_COLOR);
                    PS.border(PLAYER.POS_X, PLAYER.POS_Y, 0);

                    // Set the new position
                    PLAYER.POS_Y = next_pos;

                    // Finish erasing
                    if(PLAYER.ERASE_COUNT != 0){

                        PLAYER.endErase();
                    }

                    // Change color of new position
                    PLAYER.render();
                }

                // check if the player is on a door bead
                else if(PS.data(PLAYER.POS_X, PLAYER.POS_Y) == "done"){


                    // Change color of the old position
                    PS.color(PLAYER.POS_X, PLAYER.POS_Y, LEVELS.DOORFRAME_COLOR);
                    PS.border(PLAYER.POS_X, PLAYER.POS_Y, 0);

                    // Set the new position
                    PLAYER.POS_Y = next_pos;

                    // Finish erasing
                    if(PLAYER.ERASE_COUNT != 0){

                        PLAYER.endErase();
                    }

                    // Change color of new position
                    PLAYER.render();
                }

                else {

                    // Change color of the old position
                    PS.color(PLAYER.POS_X, PLAYER.POS_Y, LEVELS.SKY_COLOR);
                    PS.border(PLAYER.POS_X, PLAYER.POS_Y, 0);

                    // Set the new position
                    PLAYER.POS_Y = next_pos;

                    // Finish erasing
                    if(PLAYER.ERASE_COUNT != 0){

                        PLAYER.endErase();
                    }

                    // Change color of new position
                    PLAYER.render();

                }
            }
        }
        // Camera movement
        if(HUB.IN_HUB == true){
            HUB.moveCameraY();
        }

    },

    jump : function () {
        "use strict";

        var tempX, tempY;

        if((PLAYER.POS_Y + 1) < LEVELS.HEIGHT[LEVELS.CURRENT_LEVEL]) {

            if ((PS.color(PLAYER.POS_X, (PLAYER.POS_Y + 1)) == LEVELS.GRASS_COLOR) || (PS.color(PLAYER.POS_X, (PLAYER.POS_Y + 1)) == PLAYER.PLATFORM_COLOR) || (PS.color(PLAYER.POS_X, (PLAYER.POS_Y + 1)) == LEVELS.STONE_COLOR)) {


                for (var m = 0; m < 3; m++) {

                    tempX = PLAYER.POS_X;
                    tempY = PLAYER.POS_Y;


                    PS.fade(PLAYER.POS_X, PLAYER.POS_Y, 8, {onEnd: PLAYER.endJumpFade, params: [tempX, tempY]});

                    PLAYER.VELOCITY_Y = -1;

                    PLAYER.moveY();

                }
            }
        }

    },

    erase : function (x, y) {
        "use strict";

        // Erasing a platform
        if(PLAYER.ERASE_COUNT == 0){

            PLAYER.endErase();
            PS.audioPlay("fx_squish");
        }

        else if(PLAYER.ERASE_COUNT == 1){

            PS.data(x, y, 1);
            PS.border(x, y, 5);
            PS.borderColor(x, y, LEVELS.SKY_COLOR);
            PS.audioPlay("xylo_a4");
        }

        else if(PLAYER.ERASE_COUNT == 2 && PS.data(x, y) == 1){

            PS.data(x, y, 2);
            PS.border(x, y, 15);
            PS.borderColor(x, y, LEVELS.SKY_COLOR);
            PS.audioPlay("xylo_bb4");
        }

        else if(PLAYER.ERASE_COUNT == 3 && PS.data(x, y) == 2){

            PS.data(x, y, 3);
            PS.border(x, y, 0);

        }

        else{

            PLAYER.endErase();
        }

        // delete the platform
        if(PS.data(x, y) == 3){

            PS.color(x, y, LEVELS.SKY_COLOR);
            PS.audioPlay("perc_bongo_low");

            for(var i = 0; i < LEVELS.PLATFORMS_X.length; i++){

                if(LEVELS.PLATFORMS_X[i] == x && LEVELS.PLATFORMS_Y[i] == y){

                    LEVELS.PLATFORMS_X[i] = -1;
                    LEVELS.PLATFORMS_Y[i] = -1;

                }
            }

            //delete platforms for hub
            if(HUB.IN_HUB) {

                for (var j = 0; j < HUB.PLATFORMS_X.length; j++) {

                    if (HUB.PLATFORMS_X[j] - HUB.left == x && HUB.PLATFORMS_Y[j] - HUB.top == y) {

                        HUB.PLATFORMS_X[j] = -1;
                        HUB.PLATFORMS_Y[j] = -1;

                    }
                }
            }
        }
    },

    endErase : function () {
        "use strict";

        PS.border(PS.ALL, PS.ALL, 0);
        PLAYER.ERASE_COUNT = 0;

        if(LEVELS.PLATFORMS_X.length > 0) {

            for (var i = 0; i < LEVELS.PLATFORMS_X.length; i++) {

                if(LEVELS.PLATFORMS_X[i] != -1) {

                    PS.data(LEVELS.PLATFORMS_X[i], LEVELS.PLATFORMS_Y[i], 0)
                }
            }
        }

        PLAYER.render();

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
        PLAYER.STUCK = false;
        PLAYER.render();


        if(PLAYER.GRAVITY_TIMER == ""){

            PLAYER.GRAVITY_TIMER = PS.timerStart(PLAYER.GRAVITY_FRAMES, PLAYER.gravity);

            PS.timerStop(PLAYER.STUCK_TIMER);
            PLAYER.STUCK_TIMER = "";
        }

    },

    // Checks if there are grass or platform beads around the player
    lookAroundPlatform : function () {
        "use strict";

        if(PLAYER.POS_X == LEVELS.P_START[LEVELS.CURRENT_LEVEL][0] && PLAYER.POS_Y == LEVELS.P_START[LEVELS.CURRENT_LEVEL][1] && HUB.IN_HUB == false){

            return false
        } else {

            for (var i = -1; i < 2; i += 2) {

                // Check if in grid
                if ((PLAYER.POS_X + i) >= 0 && (PLAYER.POS_X + i) < LEVELS.WIDTH[LEVELS.CURRENT_LEVEL]) {

                    var current_x = PLAYER.POS_X + i; // Store current x that is being checked

                    if (PS.color(current_x, PLAYER.POS_Y) == PLAYER.PLATFORM_COLOR) {

                        return true;
                    }

                    else if (PS.color(current_x, PLAYER.POS_Y) == LEVELS.GRASS_COLOR) {

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
        }

    },

    gravity : function () {
        "use strict";

        // Check if in the player fell into the abyss
        if((PLAYER.POS_Y + 1) == LEVELS.HEIGHT[LEVELS.CURRENT_LEVEL] && HUB.IN_HUB == false) {

            PS.audioPlay("fx_bloink");


            LEVELS.render();

        } else if(PS.color(PLAYER.POS_X, (PLAYER.POS_Y + 1)) != LEVELS.GRASS_COLOR && PS.color(PLAYER.POS_X, (PLAYER.POS_Y + 1)) != LEVELS.STONE_COLOR){

            PLAYER.VELOCITY_Y = 1;

            PLAYER.moveY();

            if(HUB.IN_HUB){

                HUB.moveCameraY();
            }

        } else {

            PLAYER.VELOCITY_Y = 0;

        }
        PLAYER.render();
    }

};



PS.init = function( system, options ) {
	"use strict"; // Do not remove this directive!

	// Uncomment the following code line
	// to verify operation:

	//PS.debug( "PS.init() called\n" );

    PS.statusText( "Stick It!" );


    HUB.loadHUB();

    // Audio
    PS.audioLoad("fx_tada");
    PS.audioLoad("fx_tick");
    PS.audioLoad("fx_squish");
    PS.audioLoad("xylo_a4");
    PS.audioLoad("xylo_bb4");
    PS.audioLoad("perc_bongo_low");
    PS.audioLoad("fx_powerup2");
    PS.audioLoad("fx_bucket");

    // Timers
    PLAYER.GRAVITY_TIMER = PS.timerStart(PLAYER.GRAVITY_FRAMES, PLAYER.gravity);
    LEVELS.END_TIMER = PS.timerStart(LEVELS.END_FRAMES, LEVELS.end);
    HUB.DOOR_TIMER = PS.timerStart(HUB.DOOR_FRAMES, HUB.checkDoor);

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
            PS.border(PLAYER.POS_X, PLAYER.POS_Y, 0);

            if(HUB.IN_HUB == true){

                HUB.PLATFORMS_X.push(HUB.left + PLAYER.POS_X);
                HUB.PLATFORMS_Y.push(HUB.top + PLAYER.POS_Y);

            } else {

                // Put platform coordinates in the array
                LEVELS.PLATFORMS_X.push(PLAYER.POS_X);
                LEVELS.PLATFORMS_Y.push(PLAYER.POS_Y);
            }


            // Place player on created platform in hub world
            if(HUB.IN_HUB){

                if(PS.color(PLAYER.POS_X, PLAYER.POS_Y - 1) == LEVELS.SKY_COLOR && PLAYER.POS_Y > 1) {

                    // Play sound
                    PS.audioPlay("fx_tick");
                    PLAYER.POS_Y -= 1;

                    PLAYER.render();
                } else {

                    // Play sound
                    PS.audioPlay("fx_bucket");

                    HUB.PLATFORMS_X.pop();
                    HUB.PLATFORMS_Y.pop();
                    PS.color(PLAYER.POS_X, PLAYER.POS_Y, PLAYER.ACTIVE_COLOR);
                    PLAYER.render();
                }

                HUB.moveCameraY();


            } else {

                // Play sound
                PS.audioPlay("fx_tick");

                // Place player on initial position
                PLAYER.POS_X = LEVELS.P_START[LEVELS.CURRENT_LEVEL][0];
                PLAYER.POS_Y = LEVELS.P_START[LEVELS.CURRENT_LEVEL][1];
                PLAYER.STUCK = false;
                PLAYER.render();
            }
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
