
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

function rotateScript2(sceneNode)
{
    // Constants
    fnum++;
    var rotationSpeed = sceneNode.userData["rotationSpeed"];
    var frameRate = 60.0;
    var rs = Math.cos(fnum*0.002);
    sceneNode.rotateOnAxis(YAXIS, rotationSpeed);
}

function orbitScript(sceneNode)
{
    // Constants
    fnum++;
    var dist = sceneNode.userData["dist"];
    var frameRate = 60.0;
    var x = dist * Math.cos(fnum/frameRate);
    var z = dist * Math.sin(fnum/frameRate);
    sceneNode.position.x = -x;
    sceneNode.position.z = z;
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
