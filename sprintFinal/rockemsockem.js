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
    if(node.userData["pose"] === "poised" && node.userData["cooldown"] == 0 && pressedKeys[node.userData["attackKey"]])
    {
        node.userData["pose"] = "swinging";
    }
    else if(node.userData["pose"] === "swinging")
    {
        currentScene.getObjectByName(node.userData["arm"]).rotateOnAxis(ZAXIS, frameDuration);
    }
}
