'use strict';
/* globals _, engine */
// stub window for serverside check
if (!window) {
    window = {};
};

//// Classes

var GameState = function(bounds) {
    this.bounds = bounds;
    this.deadRobos = [];
};

GameState.prototype.deadRoboAt = function(x, y) {
    var robosAt = _.filter(this.deadRobos, function(robo) {
        return robo.x === x && robo.y === y;
    });
    return robosAt.length > 0;
};

var Robo = function(x, y, o, command) {
    this.x = x;
    this.y = y;
    this.o = o;
    this.command = command;
    this.dead = false;
    this.longestCommand = false; 
};

Robo.prototype.trimCommand = function() {
    this.command = this.command.slice(1);
};

Robo.prototype.processCommand = function() {
    var commandToken = this.command.split('')[0];

    // Handle each command, and if we deplete it, just do nothing.
    switch(commandToken) {
        case 'f':
            this.forward();
            break;

        case 'l':
            this.turn();
            break;

        case 'r':
            // second arg = true means turn right.
            this.turn(true);
            break;

        case undefined:
            // no commands left, noop
            break;

        default:
            throw 'Unknown command.';
    }
};

Robo.prototype.turn = function(right) {
    // I could use a switch, but what fun is that?
    var directions = (right) ? 'wsen' : 'nesw';

    // Just shift the index of the string, and wrap it around if we need to.
    var newDirection = directions[directions.indexOf(this.o) - 1];
    if (typeof newDirection === 'undefined') {
        newDirection = directions[directions.length-1]; // wrap around
    }

    this.o = newDirection;
    this.trimCommand();
};

Robo.prototype.forward = function() {
    var newX = this.x, newY = this.y;

    switch(this.o) {
        case 'n':
            newY--;
            break;

        case 's':
            newY++;
            break;

        case 'w':
            newX--;
            break;

        case 'e':
            newX++;
            break;
    }

    var outOfBounds =
        newX < 0 || newX > currentState.bounds[0] ||
        newY < 0 || newY > currentState.bounds[1];
    var deadRobotHere = currentState.deadRoboAt(this.x, this.y);

    if (!deadRobotHere && outOfBounds) {
        this.dead = true;
    }

    if (!outOfBounds) {
        this.x = newX;
        this.y = newY;
    }
    this.trimCommand();
};

/////

// GameState instance kept in global scope we use to track boundaries and lost robots.
var currentState;

window.initGame = function () {
    console.log('initgame');
    // you're really better off leaving this line alone, i promise.
    var command =
        '5 3 \n 1 1 s\n ffffff\n 2 1 w \n flfffffrrfffffff\n 0 3 w\n LLFFFLFLFL';

    // this function parses the input string so that we have useful names/parameters
    // to define the playfield and robots for subsequent steps
    var parseInput = function (input) {
        //
        // task #1
        //
        // replace the 'parsed' var below to be the string 'command' parsed into an object we can pass to genworld();
        // genworld expects an input object in the form { 'bounds': [3, 8], 'robos': [{x: 2, y: 1, o: 'W', command: 'rlrlff'}]}
        // where bounds represents the top right corner of the plane and each robos object represents the
        // x,y coordinates of a robot and o is a string representing their orientation. a sample object is provided below
        //

        var input = input.toLowerCase().replace(/\n/, ' ');
        var tokens = _.words(input);
        var bounds = [];
        var robos = [];
        bounds.push(parseInt(tokens.shift())); // x
        bounds.push(parseInt(tokens.shift())); // y
        _.forEach(_.chunk(tokens, 4), function(roboTokens) {
            robos.push(new Robo(
                parseInt(roboTokens[0]), // x
                parseInt(roboTokens[1]), // y
                roboTokens[2], // o
                roboTokens[3])); // command
        });

        // Find the longest starting command
        var longestCommandIndex = 0;
        _.forEach(robos, function(robo, index) {
            if (robo.command.length > robos[longestCommandIndex].command.length) {
                longestCommandIndex = index;
            }
        });
        robos[longestCommandIndex].longestCommand = true;

        // replace this with a correct object
        var parsed = {
            bounds: bounds,
            robos: robos
        };

        currentState = new GameState(bounds);
        currentState.bounds = bounds;

        return parsed;
    };

    // this function replaces the robos after they complete one instruction
    // from their commandset
    var tickRobos = function (robos) {
        console.log('tickrobos');
        // 
        // task #2
        //
        // in this function, write business logic to move robots around the playfield
        // the 'robos' input is an array of objects; each object has 4 parameters.
        // This function needs to edit each robot in the array so that its x/y coordinates
        // and orientation parameters match the robot state after 1 command has been completed. 
        // Also, you need to remove the command the robot just completed from the command list.
        // example input:
        //
        // robos[0] = {x: 2, y: 2, o: 'N', command: 'frlrlrl'}
        //
        //                   - becomes -
        // 
        // robos[0] = {x: 2, y: 1, o: 'N', command: 'rlrlrl'} 
        //
        // if a robot leaves the bounds of the playfield, it should be removed from the robos
        // array. It should leave a 'scent' in it's place. If another robot–for the duration
        // of its commandset–encounters this 'scent', it should refuse any commands that would
        // cause it to leave the playfield.

        var displaySummary = false;
        var newRobos = [];
        _.forEach(robos, function(robo, index, _robos) {
            robo.processCommand();

            if (robo.dead) {
                currentState.deadRobos.push(robo);
            } else {
                newRobos.push(robo);
            }

            // If the robot with the longest original command finishes, or all robots die:
            // (This never happens with the default command)
            if (robo.command.length === 0 && robo.longestCommand) {
                displaySummary = true;
            }
        });

        // If all robots die: (this also never happens with the default command)
        if (newRobos.length === 0 || displaySummary) {
            missionSummary(robos);
        }

        // return the mutated robos object from the input to match the new state
        return newRobos;
    };
    // mission summary function
    var missionSummary = function (robos) {
        //
        // task #3
        //
        // summarize the mission and inject the results into the DOM elements referenced in readme.md
        //

        var livingUl = document.getElementById('robots');
        _.each(robos, function(robo) {
            var li = document.createElement('li');
            var text = document.createTextNode(
                'Position ' + robo.x.toString() + ', ' + robo.y.toString() +
                ' | Orientation: ' + robo.o.toUpperCase());
            li.appendChild(text);
            livingUl.appendChild(li);
        });

        var deadUl = document.getElementById('lostRobots');
        _.each(currentState.deadRobos, function(robo) {
            var li = document.createElement('li');
            var text = document.createTextNode(
                'I died going ' + robo.o.toUpperCase() +
                ' from coordinates: ' + robo.x.toString() + ', ' + robo.y.toString());
            li.appendChild(text);
            deadUl.appendChild(li);
        });

        return;
    };

    // leave this alone please
    window.rover = {
        parse: parseInput,
        tick: tickRobos,
        summary: missionSummary,
        command: command
    };
};

