var fnum = 0;

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
    fnum++;
    var frameRate = 60.0;
    var x = 5.0 * Math.cos(fnum/(frameRate*3) + 4.71239);
    var z = 5.0 * Math.sin(fnum/(frameRate*3) + 4.71239);
    node.position.x = x;
    node.position.z = z;
}
