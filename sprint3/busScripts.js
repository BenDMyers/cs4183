// KEYBOARD CONSTANTS
var SPACE_BAR = 32;
var UP_ARROW = 38;
var DOWN_ARROW = 40;
var LEFT_ARROW = 37;
var RIGHT_ARROW = 39;
var COMMA_KEY = 222;
var PERIOD_KEY = 191;
var A_KEY = 65;
var D_KEY = 68;
var Q_KEY = 81;
var S_KEY = 83;
var W_KEY = 87;
var Z_KEY = 90;

function drive(node)
{
    if(pressedKeys[UP_ARROW] == true) // FORWARD
    {
        // DETERMINE WHEELS' ROTATIONAL VELOCITY
        node.userData["wheelAngularVelocity"] = Math.min(node.userData["wheelAngularVelocity"] + frameDuration, 1.0);

        // ACTUALLY ROTATE THE WHEELS
        var children = node.children;
        var wheels = children.wheelsNode;
        if(wheels !== undefined)
        {
            for (var i = 0; i < wheels.children.length; i++)
            {
                wheels.children[i].rotateOnAxis(XAXIS, node["wheelAngularVelocity"] * frameDuration);
            }
            console.log("WAV: " + node.userData["wheelAngularVelocity"] + " | Wheel angle: " + wheels.children[0].rotate);
        }

        // MOVE THE BUS
        // node.position.z
    }
}
