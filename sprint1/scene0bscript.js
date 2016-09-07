
function sceneControl(sceneNode)
{
	var elapsedTime = getElapsedTime();
	var userData = sceneNode["userData"];

	var children = sceneNode.children;
	//debug("children " + children.length + "\n");
	for (var i=0; i<children.length; i++)
	{
		var child = children[i];
		if (child instanceof THREE.Mesh)
		{
			var x = Math.cos(elapsedTime*1.15*(1.0+i*0.1) + 2.0*i);
			x = 2.0*x*x*x;

			var y = Math.sin(elapsedTime*1.27 + 2.0*i);
			y = 2.0*y*y*y;

			child.position.x = x;
			child.position.y = y;

			var s = 0.2 + 0.1 * Math.cos(elapsedTime+i);
			child.scale.set(s,s,s)
		}
	}
}

