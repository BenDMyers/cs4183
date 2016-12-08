var fnum = 0;
var root = currentScene.getObjectByName("rootNode");

// KEYBOARD CONSTANTS
var Q_KEY = 81;
var P_KEY = 80;
var SPACE = 32;

function start()
{
    if(root.userData["gameState"] === "waiting" && pressedKeys[SPACE])
    {
        root.userData["gameState"] = "playing";
    }
}

function cameraTrack(node)
{
	var target = currentScene.getObjectByName(node.userData["target"]);
	if(target !== undefined)
	{
		node.lookAt(target.position);
	}
}

function cameraSpin(node)
{
    if(root.userData["gameState"] !== "waiting")
    {
        fnum++;
        var frameRate = 60.0;
        var x = 5.0 * Math.cos(fnum/(frameRate*-3) + 4.71239);
        var z = 5.0 * Math.sin(fnum/(frameRate*-3) + 4.71239);
        node.position.x = x;
        node.position.z = z;
    }
}
