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

// function blur()
// {
//     if(root.gameState !== "playing")
//     {
//         root.userData["blur"] = Math.min(root.userData["blur"] + frameDuration, 2.0)
//         hblur = new THREE.ShaderPass( THREE.HorizontalBlurShader );
//         hblur.uniforms['h'].value = root.userData["blur"];
//         hblur.renderToScreen();
//         composer.addPass( hblur );
//         vblur = new THREE.ShaderPass( THREE.VerticalBlurShader );
//         hblur.uniforms['v'].value = root.userData["blur"];
//         vblur.renderToScreen = true;
//         composer.addPass( vblur );
//         composer.render();
//     }
// }

function readout()
{
    var READOUT = document.createElement( 'div' );
    // READOUT.innerHTML = getReadout();
    if(root.userData["gameState"] === "waiting")
    {
        READOUT.innerHTML = instructions();
    }
    else if (root.userData["gameState"] === "redDeath")
    {
        READOUT.innerHTML = redDeath();
    }
    else if (root.userData["gameState"] === "blueDeath")
    {
        READOUT.innerHTML = blueDeath();
    }
    else
    {
        READOUT.innerHTML = "";
    }
    READOUT.style["position"] = "absolute";
    READOUT.style["width"] = "100%";
    READOUT.style["text-align"] = "center";
    READOUT.style["bottom"] = "0px";
    READOUT.style["color"] = "#ffffff"
    document.body.insertBefore(READOUT, document.body.firstChild);
}

function instructions()
{
    return "<h1>Q - Red Attack | Space - Start | P - Blue Attack</h1>";
}

function redDeath()
{
    return "<h1>Blue wins!</h1>";
}

function blueDeath()
{
    return "<h1>Red wins!</h1>";
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
    if(root.userData["gameState"].endsWith("Death") && node.userData["pose"] === "poised")
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
            var hit = new Audio("hit.mp3");
            hit.play();
            node.userData["pose"] = "unswinging";
            console.log(node.name + " IS UNSWINGING ME RIGHT ROUND LIKE A RECORD BABY");
            var damage = Math.floor(Math.random() * (30 - 10)) + 10;
            currentScene.getObjectByName(node.userData["enemy"]).userData["health"] -= damage;
            console.log(node.userData["enemy"] + " Health: " + currentScene.getObjectByName(node.userData["enemy"]).userData["health"]);
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
    if(node.userData["health"] <= 0 && !node.userData["dead"])
    {
        var head = currentScene.getObjectByName(node.name + "Head");
        head.position.y = Math.min(head.position.y + frameDuration*5, 1.25);
        if(head.position.y == 1.25)
        {
            node.userData["dead"] = true;
            var ding = new Audio("Ding Sound Effect.mp3");
            ding.play();
        }
    }
}
