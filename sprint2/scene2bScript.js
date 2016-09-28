
var fnum = 0;

function blinkScript(sceneNode)
{
    // Constants
    fnum++;
    var material = sceneNode.material;
    var texture = material.map;
    var frame = 0;
    if (fnum%12 >= 6) frame = 1;
    var offsetx = texture.repeat.x * frame;
    texture.offset.x = offsetx;
    material.rotation += 0.01;
}


