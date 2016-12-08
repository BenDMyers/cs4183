var fnum = 0;
var root = currentScene.getObjectByName("rootNode");
var camera = currentScene.getObjectByName("camera1");

var composer = new THREE.EffectComposer( currentRenderer );
composer.addPass( new THREE.RenderPass( currentScene, camera ) );

// KEYBOARD CONSTANTS
var Q_KEY = 81;
var P_KEY = 80;
var SPACE = 32;

// console.log(root.userData["gameState"]);

function blur()
{
    if(root.gameState !== "playing")
    {
        root.userData["blur"] = Math.min(root.userData["blur"] + frameDuration, 2.0)
        hblur = new THREE.ShaderPass( THREE.HorizontalBlurShader );
        hblur.uniforms['h'].value = root.userData["blur"];
        hblur.renderToScreen();
        composer.addPass( hblur );
        vblur = new THREE.ShaderPass( THREE.VerticalBlurShader );
        hblur.uniforms['v'].value = root.userData["blur"];
        vblur.renderToScreen = true;
        composer.addPass( vblur );
        composer.render();
    }
}

function start()
{
    if(root.userData["gameState"] === "waiting" && pressedKeys[SPACE])
    {
        root.userData["gameState"] = "playing";
    }
}

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
    if(root.userData["gameState"] !== "waiting")
    {
        fnum++;
        node.userData["speed"] = Math.min(node.userData["speed"] + frameDuration/3.0, 1.0);
        var frameRate = 60.0;
        var x = 5.0 * Math.cos(node.userData["speed"] * fnum/(frameRate*-3) + 4.71239);
        var z = 5.0 * Math.sin(node.userData["speed"] * fnum/(frameRate*-3) + 4.71239);
        node.position.x = x;
        node.position.z = z;
    }
}

function attack(node)
{
    if(root.userData["gameState"] === "waiting")
    {
        return;
    }
    if(node.userData["pose"] === "poised" && node.userData["cooldown"] <= 0 && pressedKeys[node.userData["attackKey"]] && root.userData["gameState"] === "playing")
    {
        node.userData["pose"] = "swinging";
        console.log(node.name + " IS SWINGING ME RIGHT ROUND LIKE A RECORD BABY");
    }
    else if(node.userData["pose"] === "swinging")
    {
        currentScene.getObjectByName(node.userData["arm"]).rotateOnAxis(ZAXIS, 5*frameDuration);
        node.userData["rotationAmount"] += 5*frameDuration;
        if(node.userData["rotationAmount"] >= 1)
        {
            node.userData["pose"] = "unswinging";
            console.log(node.name + " IS UNSWINGING ME RIGHT ROUND LIKE A RECORD BABY");
            currentScene.getObjectByName(node.userData["enemy"]).userData["health"] -= Math.floor(Math.random() * (30 - 10)) + 10;
            if(root.userData["gameState"] === "playing" && currentScene.getObjectByName(node.userData["enemy"]).userData["health"] <= 0)
            {
                root.userData["gameState"] == node.userData["enemy"] + "Death";
                console.log(root.userData["gameState"]);
            }
        }
    }
    else if(node.userData["pose"] === "unswinging")
    {
        currentScene.getObjectByName(node.userData["arm"]).rotateOnAxis(ZAXIS, -5*frameDuration);
        node.userData["rotationAmount"] -= 5*frameDuration;
        if(node.userData["rotationAmount"] <= 0)
        {
            console.log(node.name + " IS IN COOLDOWN");
            node.userData["pose"] = "cooldown";
            node.userData["cooldown"] = 10;
            node.userData["held"] = pressedKeys[node.userData["attackKey"]];
        }
    }
    else if(node.userData["pose"] === "cooldown")
    {
        node.userData["cooldown"] -= 1;
        if(node.userData["held"] && !pressedKeys[node.userData["attackKey"]])
        {
            node.userData["held"] = false;
        }
        if(node.userData["cooldown"] < 0 && !node.userData["held"])
        {
            node.userData["pose"] = "poised";
            console.log(node.name + " IS POISED FOR ATTACK");
        }
    }
}

function death(node)
{
    if(node.userData["health"] <= 0)
    {
        var head = currentScene.getObjectByName(node.name + "Head");
        head.position.y = Math.min(head.position.y + frameDuration*5, 1.25);
        if(head.position.y == 1.25)
        {
            var ding = new Audio("Ding Sound Effect.mp3");
            ding.play();
        }
    }
}
