
var fnum = 0;

function rotateScript(sceneNode)
{
    // Constants
    fnum++;
    var rotationSpeed = sceneNode.userData["rotationSpeed"];
    var frameRate = 60.0;
    var rs = Math.cos(fnum*0.002);
    sceneNode.rotateOnAxis(YAXIS, rs*rotationSpeed/frameRate);
}



function bounceScript(sceneNode)
{
    // Constants
    var bounceBottom = sceneNode.userData["bounceBottom"];
    var bounceHeight = sceneNode.userData["bounceHeight"];

    var y = Math.cos(fnum*0.015);
    y = Math.pow(Math.abs(y), 0.8) * bounceHeight;
    sceneNode.position.y = y + bounceBottom;
}

