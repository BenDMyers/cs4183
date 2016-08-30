function distance(bullet, enemy)
{
	var x1 = bullet.position.x;
	var x2 = enemy.position.x;
	var y1 = bullet.position.y;
	var y2 = enemy.position.y;
	return Math.sqrt(Math.pow(x2-x1, 2) + Math.pow(y2-y1, 2));
}

function sceneControl(sceneNode)
{
	var elapsedTime = getElapsedTime();
	var userData = sceneNode["userData"];

	var children = sceneNode.children;

	//sceneNode.getObjectByName("ship").userData.win = "" + sceneNode.getObjectByName("ship").userData.win;
	//debug("children " + children.length + "\n");
	if(elapsedTime > 30 && sceneNode.getObjectByName("ship").userData.win === "play")
	{
		debug("A");
		sceneNode.getObjectByName("ship").userData.win = "lose";
		sceneNode.getObjectByName("lose").children[0].material.color = [1, 0, 0];
		sceneNode.getObjectByName("lose").children[1].material.color = [1, 0, 0];
		sceneNode.getObjectByName("lose").children[0].position.z = 1;
		sceneNode.getObjectByName("lose").children[1].position.z = 1;
		sceneNode.getObjectByName("clock").material.color = [0, 0, 0];
	}
	else if(sceneNode.getObjectByName("ship").userData.win === "lose" || sceneNode.getObjectByName("ship").userData.win === "win")
	{
		debug("B");
		//debug(sceneNode.getObjectByName("ship").userData.win);
	}
	else if(elapsedTime < 30 && sceneNode.getObjectByName("ship").userData.win === "play")
	{
		//debug("C");
		for (var i=0; i<children.length; i++)
		{
			var child = children[i];
			if (child.name === "clock")
			{
				child.scale.x = 1 - (elapsedTime/30);
				child.position.x = 5 - (elapsedTime/30);
				if(elapsedTime > 10 && elapsedTime < 20)
				{
					child.material.color = [1, 1, 0];
				}
				if(elapsedTime < 30 && elapsedTime > 20)
				{
					child.material.color = [1, 0, 0];
				}
			}
			if (child.name === "ship")
			{
				//debug("you\n");
				if(pressedKeys[37])
				{
					child.position.x = child.position.x - 0.1;
				}
				if(pressedKeys[39])
				{
					child.position.x = child.position.x + 0.1;
				}
			}
			if(child.name === "bullet")
			{
				//debug(child.userData.firing + "\n");
				if(!(child.userData.firing))
				{
					child.position.x = sceneNode.getObjectByName("ship").position.x;
				}
				if(pressedKeys[32] && !(child.userData.firing))
				{
					child.userData.firing = true;
					child.position.x = sceneNode.getObjectByName("ship").position.x;
					child.position.y = sceneNode.getObjectByName("ship").position.y;
				}
				for(var e = 0; e < sceneNode.getObjectByName("enemies").children.length; e++)
				{
					var enemy = sceneNode.getObjectByName("enemies").children[e];
					if(distance(child, enemy) < 0.1 && child.userData.firing)
					{
						//debug(distance(child, enemy) + "\n");
						child.userData.firing = false;
						//child.userData.collided = true;
						child.position.x = sceneNode.getObjectByName("ship").position.x;
						child.position.y = sceneNode.getObjectByName("ship").position.y;
						enemy.material.color = [0, 0, 0];
						enemy.userData.hit = true;
						var genocide = true;
						for(var E = 0; E < sceneNode.getObjectByName("enemies").children.length; E++)
						{
							var ENEMY = sceneNode.getObjectByName("enemies").children[E];
							if(!(ENEMY.userData.hit))
							{
								genocide = false;
							}
						}
						if(genocide)
						{
							sceneNode.getObjectByName("ship").userData.win = "win";
							sceneNode.getObjectByName("win").children[0].material.color = [0, 1, 0];
							sceneNode.getObjectByName("win").children[1].material.color = [0, 1, 0];
							sceneNode.getObjectByName("win").children[0].position.z = 0.2;
							sceneNode.getObjectByName("win").children[1].position.z = 0.2;
						}
					}
				}
				if(child.userData.firing)
				{
					child.position.y = child.position.y + 0.13;
					if(child.position.y > 5)
					{
						child.userData.firing = false;
						child.position.x = sceneNode.getObjectByName("ship").position.x;
						child.position.y = sceneNode.getObjectByName("ship").position.y;
						debug("Bullet returned!\n");
					}
				}
			}
			if(child.name === "enemies")
			{
				var enemies = child.children;
				//debug("Length: " + enemies.length + "\n");
				for (var j = 0; j < enemies.length; j++)
				{

					var enemy = enemies[j];
					//debug("enemy" + j + ", " + enemy.position.x + "\n");
					var x = Math.cos(elapsedTime*1.15);
					//debug(elapsedTime + "\n");
					x = 1.5 * x*x * enemy.userData.dir;
					enemy.position.x = enemy.userData.baseX + x;
				}
			}
		}
	}
	else
	{
		debug("D");
	}
}
