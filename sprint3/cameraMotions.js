function moveCamera(sceneNode)
{
    if(pressedKeys[87] == true/* || pressedKeys[38] == true*/) // UP
    {
        sceneNode.position.y = sceneNode.position.y + frameDuration;
    }
    if(pressedKeys[83] == true || pressedKeys[40] == true) // DOWN
    {
        sceneNode.position.y = sceneNode.position.y - frameDuration;
    }
    if(pressedKeys[65] == true || pressedKeys[37] == true) // LEFT
    {
        sceneNode.position.x = sceneNode.position.x - frameDuration;
    }
    if(pressedKeys[68] == true || pressedKeys[39] == true) // RIGHT
    {
        sceneNode.position.x = sceneNode.position.x + frameDuration;
    }
    if(pressedKeys[81] == true || pressedKeys[222] == true) // FORWARD
    {
        sceneNode.position.z = sceneNode.position.z - frameDuration;
    }
    if(pressedKeys[90] == true || pressedKeys[191] == true) // BACKWARDS
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
