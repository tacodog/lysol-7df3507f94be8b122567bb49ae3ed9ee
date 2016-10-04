# Rover code challenge
## Installation
Point a webserver at the root of this repo. Visit your local machine in the browser. You should see a grid of dot characters.
## Submission
Fork this repo and submit a pull request when you've completed the challenge.
## Problem summary
The surface of Mars can be modelled by a rectangular grid around which robots are able to move according to instructions provided from Earth. You are to write a program that determines each sequence of robot positions and reports the final position of the robot. 

A robot position consists of a grid coordinate (a pair of integers: x-coordinate  followed by ycoordinate) and an orientation (N, S, E, W for north, south, east, and  west). 

A robot instruction is a string of the letters “L”, “R”, and “F” which represent,  respectively, the instructions: 

- Left : the robot turns left 90 degrees and remains on the current grid point. 
- Right : the robot turns right 90 degrees and remains on the current grid point. 
- Forward : the robot moves forward one grid point in the direction of the current orientation and maintains the same orientation. 

The direction North corresponds to the direction from grid point (x, y) to grid point (x, y-1). There is also a possibility that additional command types maybe required in the future and provision should be made for this. 

Since the grid is rectangular and bounded, a robot that moves “off” an edge of the grid is lost forever. However, lost robots leave a warning tile that prohibits future robots from dropping off the world at the same grid point. The warning tile is left at the last grid position the robot occupied before disappearing over the edge. An instruction to  move “off” the world from a grid point from which a robot has been previously lost is simply ignored by the current robot.

## Input 

The first line of input is the upper-right coordinates of the rectangular world, the upper-left coordinates are assumed to be 0, 0. 

The remaining input consists of a sequence of robot positions and instructions (two lines per robot). 

A position consists of two integers specifying the initial coordinates of the robot and an orientation (N, S, E, W), all separated by white space on one line. A robot  instruction is a string of the letters “L”, “R”, and “F” on one line. 

Each robot is processed sequentially, i.e., finishes executing the robot instructions before the next robot begins execution. 

The maximum value for any coordinate is 50. All instruction strings will be less than 100 characters in length.

## Tasks
### #1 Parse Input

On line 7 there is a function called 'parseInput'. It is called with the variable 'command', which is set on line 3.

This function needs to return an object, based on data parsed from the input command.

Sample return:

`{bounds: [20,20],
robos: [
    {
        x: 2,
        y: 2,
        o: 'W',
        command: 'frlfrlfrl'
    }
]}`

This object will be used in the rest of the tasks.

### #2 Write rover driving logic
On line 36 there is a function called 'tickRobos'. The input is the robots array from the parsed command you wrote in task #1.

This function needs to deal with a single unit of time in the robots command sequence. You need to edit each robot in the input robos array as if it just executed the first command (left-most character) in it's command stack. You will need to edit x/y coordinates, orientation values, and finally remove the command from the top of the command stack. Return the edited robot object at the end of this function so the gameboard gets rendered properly.

If you've written this correctly you should be able to visit the index.html file in a browser and watch the robots follow the behavior you just wrote for them. There is also a simple acceptance test to verify that you've completed the task according to the rules. *If you change the initial command this test will fail and you won't know if you've written successful business logic.*

### #3 Summarize mission
Edit your tickRobos function to call 'missionSummary' and pass the final robots array to it when the robot with the longest original command completes its command stack or all robots have left the playfield.

In the missionSummary function, you need to populate 2 DOM elements with data about the mission. The first DOM element is an unordered list with the ID 'robots'. Make a list item for each surviving robot and include the robots details in the following format:
Position: 3, 5 | Orientation: W

The second DOM element has an ID of 'lostRobots'. I need you to build a list item for every robot and inject it into the unordered list as a string similar to: 'I died going S from coordinates: 1, 3', where S is the final orientation and 1, 3 is the last on-world location of the robot (aka the warning tile).

### Caveats, rules

Please let me know if any directions don't make sense (jabyrd3@gmail.com). Feel free to ask questions. Feel free to break this up and hack it to hell to solve it if you want. Cheating is allowed and encouraged. Have fun.