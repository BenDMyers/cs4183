
function targetFun(node)
{
	var t = frameStartTime * node.userData["speed"];
	node.position.y = Math.cos(t);
}

function cameraTrack(node)
{
	var target = currentScene.getObjectByName(node.userData["target"]);
	node.lookAt(target.position);
}

var numberKeys = ['0', '1', '2', '3'];

function cameraSwitch(node)
{
	for (var i=0; i<numberKeys.length; i++)
	{
		if (pressedKeys[numberKeys[i].charCodeAt(0)])
		{
			var camName = "camera" + numberKeys[i];
			var cam = currentScene.getObjectByName(camName);
			if (cam !== undefined)
			{
				currentCamera = cam;
			}
		}
	}
}

function cameraMove(node)
{
	var spline = node.userData["spline"];
	if (spline === undefined)
	{
		var points = node.userData["points"];
		var splinePoints = [];
		for (var i=0; i<points.length; i+=3)
		{
			var p = new THREE.Vector3(points[i], points[i+1], points[i+2]);
			splinePoints.push(p);
		}
		spline = new THREE.CatmullRomCurve3(splinePoints);
		node.userData["spline"] = spline;
	}

	var t = frameStartTime * node.userData["speed"];
	var p = spline.getPoint(t);
	node.position.copy(p);
	node.lookAt(new THREE.Vector3(0,0,0));
}













