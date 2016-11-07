
function rotateScript(sceneNode)
{
    var rotationSpeed = sceneNode.userData["rotationSpeed"];
    sceneNode.rotateOnAxis(YAXIS, rotationSpeed*frameDuration);
}

