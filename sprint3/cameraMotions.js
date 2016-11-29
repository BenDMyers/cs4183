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

function moveCamera(sceneNode)
{
    if(pressedKeys[W_KEY] == true/* || pressedKeys[38] == true*/) // UP
    {
        sceneNode.position.y = sceneNode.position.y + frameDuration;
    }
    if(pressedKeys[S_KEY] == true/* || pressedKeys[DOWN_ARROW] == true*/) // DOWN
    {
        sceneNode.position.y = sceneNode.position.y - frameDuration;
    }
    if(pressedKeys[A_KEY] == true || pressedKeys[LEFT_ARROW] == true) // LEFT
    {
        sceneNode.position.x = sceneNode.position.x - frameDuration;
    }
    if(pressedKeys[D_KEY] == true || pressedKeys[RIGHT_ARROW] == true) // RIGHT
    {
        sceneNode.position.x = sceneNode.position.x + frameDuration;
    }
    if(pressedKeys[Q_KEY] == true || pressedKeys[COMMA_KEY] == true) // FORWARD
    {
        sceneNode.position.z = sceneNode.position.z - frameDuration;
    }
    if(pressedKeys[Z_KEY] == true || pressedKeys[PERIOD_KEY] == true) // BACKWARDS
    {
        sceneNode.position.z = sceneNode.position.z + frameDuration;
    }
}

function watch(sceneNode, target)
{
    if(pressedKeys[16] == true) // SHIFT
    {
        sceneNode.lookAt(target);
    }
}
