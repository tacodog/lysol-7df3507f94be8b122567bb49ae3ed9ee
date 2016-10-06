'use strict';
/* globals _, engine */
// stub window for serverside check
if (!window) {
    window = {};
};
window.initGame = function () {
    console.log('initgame');
    // you're really better off leaving this line alone, i promise.
    var command =
        '5 3 \n 1 1 s\n ffffff\n 2 1 w \n flfffffrrfffffff\n 0 3 w\n LLFFFLFLFL';

    var _currentState = {
        bounds: [],
        robos: []
    };

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
            robos.push({
                x: parseInt(roboTokens[0]),
                y: parseInt(roboTokens[1]),
                o: roboTokens[2],
                command: roboTokens[3],
                dead: false
            });
        });

        // replace this with a correct object
        var parsed = {
            bounds: bounds,
            robos: robos
        };

        _currentState = parsed;
        return parsed;
    };

    var _deadRobotAt = function(x, y, robos) {
        var robosAt = _.filter(robos, function(robo) {
            return robo.x == x && robo.y == y;
        });

        var result = false;
        _.each(robosAt, function(robo) {
            if (robo.dead) {
                result = true;
                return false;
            }
        });
        return result;
    };

    var _forward = function(robo, robos) {
        var deadRobotStinks = _deadRobotAt(robo.x, robo.y, robos);
        var oldRobo = robo; // in case it needs to back off that ledge my friend
        var newX = robo.x, newY = robo.y;

        switch(robo.o) {
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
            newX < 0 || newX > _currentState.bounds[0] ||
            newY < 0 || newY > _currentState.bounds[1];

        if (!deadRobotStinks) {
            if (outOfBounds) {
                robo.dead = true;
            } else {
                robo.x = newX;
                robo.y = newY;
            }
        }

        return robo;
    };

    var _turn = function(robo, right) {
        // I could use a switch, but what fun is that?
        var directions = (right) ? 'wsen' : 'nesw';

        // Just shift the index of the string, and wrap it around if we need to.
        var newDirection = directions[directions.indexOf(robo.o) - 1];
        if (typeof newDirection == 'undefined') {
            newDirection = directions[directions.length-1]; // wrap around
        }

        robo.o = newDirection;
        return robo;
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

        _.forEach(robos, function(robo, index, _robos) {
            // it's dead
            if (robo.dead) {
                return true;
            }
            var commandToken = robo.command.split('')[0];

            // Handle each command, and if we deplete it, just do nothing.
            switch(commandToken) {
                case 'f':
                    robo = _forward(robo, robos);
                    break;

                case 'l':
                    robo = _turn(robo);
                    break;

                case 'r':
                    // second arg = true means turn right.
                    robo = _turn(robo, true);
                    break;

                case undefined:
                    // no commands left, noop
                    break;

                default:
                    throw 'Unknown command.';
            }
            robo.command = robo.command.slice(1); // pull it off the command stack
            _robos[index] = robo;
        });

        _currentState.robos = robos;

        // return the mutated robos object from the input to match the new state
        return _.filter(robos, function(robo) {
            return !robo.dead;
        });
    };
    // mission summary function
    var missionSummary = function (robos) {
        //
        // task #3
        //
        // summarize the mission and inject the results into the DOM elements referenced in readme.md
        //
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

