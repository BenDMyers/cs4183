
function rotateScript(sceneNode)
{
    // Constants
    var rotationSpeed = sceneNode.userData["rotationSpeed"];
    var frameRate = 60.0;
    sceneNode.rotateOnAxis(YAXIS, rotationSpeed/frameRate);
}

