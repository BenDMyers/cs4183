var fnum = 0;
var root = currentScene.getObjectByName("rootNode");

// KEYBOARD CONSTANTS
var Q_KEY = 81;
var P_KEY = 80;
var SPACE = 32;

console.log(root.userData["gameState"]);

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
        node.userData["speed"] = Math.min(node.userData["speed"] + frameDuration/3.0, 1.0);
        var frameRate = 60.0;
        var x = 5.0 * Math.cos(node.userData["speed"] * fnum/(frameRate*-3) + 4.71239);
        var z = 5.0 * Math.sin(node.userData["speed"] * fnum/(frameRate*-3) + 4.71239);
        node.position.x = x;
        node.position.z = z;
    }
}
