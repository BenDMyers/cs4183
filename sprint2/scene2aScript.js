
var fnum = 0;

function rotateScript(sceneNode)
{
    // Constants
    fnum++;
    var rotationSpeed = sceneNode.userData["rotationSpeed"];
    sceneNode.rotateOnAxis(YAXIS, rotationSpeed/60.0);
}

function bounceScript(sceneNode)
{
    // Constants
    var bounceBottom = sceneNode.userData["bounceBottom"];
    var bounceHeight = sceneNode.userData["bounceHeight"];
    var index = sceneNode.userData["index"];
    if (index === undefined) index = 0.0;

    var y = Math.cos(fnum*(0.005+index*0.001));
    y = Math.pow(Math.abs(y), 0.8) * bounceHeight + bounceBottom;
    
    var x = 2.5 * Math.cos(index*1.24 + fnum*0.001);
    var z = 1.5 * Math.sin(index*1.24 + fnum*0.001);

    sceneNode.position.x = x;
    sceneNode.position.y = y;
    sceneNode.position.z = z;
}

function cameraScript(sceneNode)
{
    var fov = 20 + Math.cos(fnum*0.0002) * 6.0;
    sceneNode.fov = fov;
}

