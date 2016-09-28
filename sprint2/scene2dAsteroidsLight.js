
//-------------------------------------------------------------------------//
// GLOBAL VARIABLES
//-------------------------------------------------------------------------//

// KEYBOARD CONSTANTS
var SPACE_BAR = 32;
var UP_ARROW = 38;
var LEFT_ARROW = 37;
var RIGHT_ARROW = 39;
var A_KEY = 65;
var D_KEY = 68;
var W_KEY = 87;

// PLAY STATE
var PLAYING = 0;
var KILLED = 1;
var GAME_OVER = 2;
var GAME_STATE = PLAYING;
var POINTS = 0;

var KILL_TIMER = 0;
var KILL_WAIT = 4;
var KILL_REPULSION = 250;
var KILL_WAIT_DECELERATION = 0.99;
var NUM_LIVES = 4;

// CONSTANTS RELATED TO THE SHIP
var SHIP_TURN_RATE = 5.0;
var SHIP_ACCEL_RATE = 600.0;
var SHIP_DECEL_RATE = 0.4;

// CONSTANTS RELATED TO SHOTS
var MAX_SHOTS = 4;
var SHOT_SPEED = 550.0;
var SHOT_LIFE = 1.0;

// CONSTANTS RELATED TO PARTICLES
var PARTICLE_SPEED = 30.0;
var PARTICLE_BOUNCE = 500.0;
var NUM_PARTICLES = 150; 
var PARTICLES_PER_EXPLOSION = 25; 
var PARTICLES_SHIP_EXPLOSION = 50;

// CONSTANTS RELATED TO ASTEROIDS
var ROIDS_AT_LEVEL0 = 5;
var MAX_STARTING_ROIDS = 20;
var ROID_SPEED = 100;
var ROID_ROTATION = 2;
var ROID_BOUNCE = 200;
var ROIDS_PER_SPLIT = 2;

// LEVEL TIMER
var LEVEL_WAIT = 3.0;
var LEVEL_TIMER = LEVEL_WAIT;
var CURR_LEVEL = 0;

// READOUT
var READOUT = document.createElement( 'div' );
READOUT.innerHTML = getReadout();
READOUT.style["position"] = "absolute";
READOUT.style["width"] = "100%";
READOUT.style["text-align"] = "center";
READOUT.style["bottom"] = "0px";
READOUT.style["color"] = "#ff0"
document.body.insertBefore(READOUT, document.body.firstChild);

// AUDIO STUFF
var SHOT_AUDIO = new Audio('shot.wav');
SHOT_AUDIO.volume = 0.05;

var THRUST_AUDIO = new Audio('thrust.wav');
THRUST_AUDIO.volume = 0.05;

var BOOM_AUDIO = new Audio('boom.wav');
BOOM_AUDIO.volume = 0.1;

//-------------------------------------------------------------------------//
// GET THE READOUT
//-------------------------------------------------------------------------//

function getReadout()
{
	var s = "<pre>Bounceroids by David Cline." +
		    "     Level:" + CURR_LEVEL +
		    
		    "     Points:" + POINTS; 
	if (NUM_LIVES <= 0) 
	        s += "     (GAME OVER)</pre>";
	else
	        s += "     Lives:" + NUM_LIVES + "</pre>";
	return s;
}

//-------------------------------------------------------------------------//
// GETS A CHILD BY NAME W/O SEARCHING ENTIRE TREE
//-------------------------------------------------------------------------//

function getChildByName(sceneNode, childName)
{
	var children = sceneNode.children;
	for (var i=0; i<children.length; i++) {
		if (children[i].name == childName) return children[i];
	}
	return undefined;
}

//-------------------------------------------------------------------------//
// APPLIES TOROIDAL BOUNDARY CONDITION TO NODE
//-------------------------------------------------------------------------//

function toroidalBoundary(position, left, right, top, bottom)
{
	if (position.x > right)  position.x -= (right-left);
    if (position.x < left)   position.x += (right-left);
    if (position.y > top)    position.y -= (top-bottom);
    if (position.y < bottom) position.y += (top-bottom);
}

//-------------------------------------------------------------------------//
// DETECT COLLISION BETWEEN NODES (CIRCULAR)
//-------------------------------------------------------------------------//

function collision(a, b, scale)
{
	var pa = a.position;
	var pb = b.position;
	var d2 = (pa.x-pb.x)*(pa.x-pb.x) + (pa.y-pb.y)*(pa.y-pb.y);
	if (d2 < (a.scale.x+b.scale.x)*(a.scale.x+b.scale.x)*0.25*scale) return true;
	return false;
}

//-------------------------------------------------------------------------//
// UPDATE THE SHIP
//-------------------------------------------------------------------------//

function updateShip(asteroidNode, particleNode, ship, left, right, top, bottom)
{
    var material = ship.material;
    var texture = material.map;

    // Set the current sprite frame
    var spriteFrame = 0;
    if (frameNum%10 >= 5 && (pressedKeys[UP_ARROW] || pressedKeys[W_KEY])) 
    	spriteFrame = 1;
    var offsetx = texture.repeat.x * spriteFrame;
    texture.offset.x = offsetx;

    // Rotation
    if (pressedKeys[LEFT_ARROW] || pressedKeys[A_KEY]) {
    	material.rotation += SHIP_TURN_RATE * frameDuration;
    }
    if (pressedKeys[RIGHT_ARROW] || pressedKeys[D_KEY]) {
    	material.rotation -= SHIP_TURN_RATE * frameDuration;
    }
    var rotation = material.rotation;

    // Accelerate the ship
    var velocity = ship.userData["velocity"];
    if (pressedKeys[UP_ARROW] || pressedKeys[W_KEY]) {
        velocity[0] -= (frameDuration * SHIP_ACCEL_RATE * Math.sin(rotation));
        velocity[1] += (frameDuration * SHIP_ACCEL_RATE * Math.cos(rotation));
        THRUST_AUDIO.play();
    }
    else {
    	THRUST_AUDIO.pause();
    }
    var deceleration = 1.0 - (1.0-SHIP_DECEL_RATE)*frameDuration; // drag
    velocity[0] *= deceleration;
    velocity[1] *= deceleration;

    // Update the ship position
    ship.position.x += frameDuration * velocity[0];
    ship.position.y += frameDuration * velocity[1];
    toroidalBoundary(ship.position, left, right, top, bottom);

    // Collision of ship with asteroids
    var asteroids = asteroidNode.children;
    if (GAME_STATE == PLAYING) {
        for (var i=asteroids.length-1; i>=0; i--) {
            var asteroid = asteroids[i];
            if (collision(ship, asteroid, 0.9)) {
                explodeParticles(asteroid, particleNode, PARTICLES_PER_EXPLOSION);
                explodeParticles(ship, particleNode, PARTICLES_SHIP_EXPLOSION);
                asteroids.splice(i,1);

                // Reset the ship
                ship.position.x = 0;
                ship.position.y = 0;
                ship.material.rotation = 0;
                ship.userData["velocity"][0] = 0;
                ship.userData["velocity"][1] = 0;
                ship.visible = false;

                KILL_TIMER = KILL_WAIT;
                GAME_STATE = KILLED;
                NUM_LIVES--;
                if (NUM_LIVES == 0) PLAY_STATE = GAME_OVER;
                READOUT.innerHTML = getReadout();

                BOOM_AUDIO.load();
                BOOM_AUDIO.play();
                THRUST_AUDIO.pause();

                break;
            }
        }
    }
} 

//-------------------------------------------------------------------------//
// SPLIT AN ASTEROID
//-------------------------------------------------------------------------//

function splitAsteroid(prototypeNode, asteroidNode, asteroid)
{
	// Find the successor to asteroid
	prototypes = prototypeNode.children;
	var proto;
	for (var i=0; i<prototypes.length-1; i++) {
		if (prototypes[i].name == asteroid.name) {
			proto = prototypes[i+1];
			break;
		}
	}
	if (proto === undefined) return;

	// Clone the prototype and put it near the current location of the asteroic
    for (var i = 0; i < ROIDS_PER_SPLIT; i++)
    {
    	var roid = proto.clone();
    	roid.visible = true;
    	roid.material = Object.create(roid.material);  // make individual copy of material
    	roid.position.x = asteroid.position.x + (Math.random() - 0.5) * asteroid.scale.x * 0.5;
    	roid.position.y = asteroid.position.y + (Math.random() - 0.5) * asteroid.scale.x * 0.5;
    	roid.userData["rotation"] = (Math.random() - 0.5) * ROID_ROTATION;
    	roid.userData["velocity"][0] = asteroid.userData["velocity"][0];
    	roid.userData["velocity"][1] = asteroid.userData["velocity"][1];
    	asteroidNode.children.push(roid);
    }
}

//-------------------------------------------------------------------------//
// UPDATE THE SHOTS
//-------------------------------------------------------------------------//

var CURR_SHOT = 0;

function updateShots(ship, asteroidNode, particleNode, prototypeNode,
	shotsNode, left, right, top, bottom)
{
	var shots = shotsNode.children;

	// Make the initial shots
	while (shots.length < MAX_SHOTS) {
		shots[0].visible = false;
		var shot = shots[0].clone();
		shot.userData["velocity"][0] = -10;
		shots.push(shot);
	}

	// Update the position of the shots
	for (var i=0; i<shots.length; i++) {
		var shot = shots[i];
		var velocity = shot.userData["velocity"];
		shot.position.x += velocity[0] * frameDuration;
		shot.position.y += velocity[1] * frameDuration;
		toroidalBoundary(shot.position, left, right, top, bottom);
		shot.userData["time"] -= frameDuration;
		if (!(shot.userData["time"] > 0)) shot.visible = false;
	}

	// Add shots based on keyboard
	if (pressedKeys[SPACE_BAR] && shots[CURR_SHOT].visible == false && ship.visible == true) {
		shot = shots[CURR_SHOT];
		shot.visible = true;
		shot.userData["time"] = SHOT_LIFE;
		
		// Compute the direction the ship is facing
		var rot = ship.material.rotation;
		var rad = 0.5*ship.scale.x + 3;
		var dx  = -Math.sin(rot);
		var dy  = Math.cos(rot);
		
		// Compute the initial position of the shot
		shot.position.x = ship.position.x + dx * rad;
		shot.position.y = ship.position.y + dy * rad;
		
		// Compute the initial velocity of the shot
		shot.userData["velocity"][0] = dx * SHOT_SPEED + ship.userData["velocity"][0];
		shot.userData["velocity"][1] = dy * SHOT_SPEED + ship.userData["velocity"][1];

		SHOT_AUDIO.load();
		SHOT_AUDIO.play();
	} 
	if (pressedKeys[SPACE_BAR]) {
		CURR_SHOT = (CURR_SHOT+1)%MAX_SHOTS;
		pressedKeys[SPACE_BAR] = false;
	}

	// Collide shots with Asteroids
	var asteroids = asteroidNode.children;
	for (var i=0; i<shots.length; i++) {
		if (shots[i].visible == false) continue;
		for (var j=asteroids.length-1; j>=0; j--) {
			if (collision(shots[i], asteroids[j], 0.9)) {
				POINTS += 10;
				READOUT.innerHTML = getReadout();
				explodeParticles(asteroids[j], particleNode, PARTICLES_PER_EXPLOSION);
				splitAsteroid(prototypeNode, asteroidNode, asteroids[j]);
				asteroids.splice(j,1);
				shots[i].visible = false;
				if (asteroids.length == 0) {
					CURR_LEVEL++;
					LEVEL_TIMER = LEVEL_WAIT;
				}
				BOOM_AUDIO.load();
				BOOM_AUDIO.play();
				break;
			}
		}
	}
}

//------------------------------------------------------------------------//
// UPDATE THE PARTICLES
//-------------------------------------------------------------------------//

var SHOT_PARTICLE = 0;

function updateParticles(ship, asteroidNode, shotNode, particleNode, left, right, top, bottom)
{
	var particles = particleNode.children;
	while (particles.length < NUM_PARTICLES) {
		var particle = particles[0].clone();
		particles.push(particle);
		particle.userData["velocity"][0] = (Math.random() - 0.5) * PARTICLE_SPEED;
		particle.userData["velocity"][1] = (Math.random() - 0.5) * PARTICLE_SPEED;
		particle.userData["desVelocity"][0] = particle.userData["velocity"][0];
		particle.userData["desVelocity"][1] = particle.userData["velocity"][1];
		particle.position.x = left   + (Math.random() * (right-left));
		particle.position.y = bottom + (Math.random() * (top-bottom));
    }

    var asteroids = asteroidNode.children;
    for (var j=-1; j<asteroids.length; j++)
    {
    	var asteroid = ship;
    	if (j >= 0) asteroid = asteroids[j];

	    var dv = [0,0];
	    var d;
	    var s = asteroid.scale.x*0.8;
	    s = s*s;
	    var istart = frameNum%2;
	    for (var i=istart; i<particles.length; i+=2) {
			var particle = particles[i];
			
			dv[0] = particle.position.x - asteroid.position.x;
			if (dv[0]*dv[0] < s) {
				var velocity = particle.userData["velocity"];
				dv[1] = particle.position.y - asteroid.position.y;
				d = dv[0]*dv[0] + dv[1]*dv[1];
				if (d < s) {
					d = Math.sqrt(d);
					velocity[0] += (dv[0]/d) * PARTICLE_BOUNCE * frameDuration * 2;
					velocity[1] += (dv[1]/d) * PARTICLE_BOUNCE * frameDuration * 2;
				}
			}
		}
	}

	for (var i=0; i<particles.length; i++) {
		var particle = particles[i];
		var velocity = particle.userData["velocity"];

		particle.position.x += velocity[0] * frameDuration;
		particle.position.y += velocity[1] * frameDuration;

		velocity[0] *= (1.0 - (frameDuration * 0.5));
		velocity[1] *= (1.0 - (frameDuration * 0.5));
        velocity[0] += (frameDuration * 0.5) * particle.userData["desVelocity"][0];
        velocity[1] += (frameDuration * 0.5) * particle.userData["desVelocity"][1];

		toroidalBoundary(particle.position, left, right, top, bottom);
	}

	var shots = shotNode.children;
    for (var i=0; i<shots.length; i++)
    {
        if (Math.random() > 0.3) continue; 
        var shot = shots[i];
        if (shot.visible == false) continue;
        var particle = particles[SHOT_PARTICLE];
        particle.position.x = shot.position.x;
        particle.position.y = shot.position.y;
        particle.userData["velocity"][0] = shot.userData["velocity"][0]*0.2;
        particle.userData["velocity"][1] = shot.userData["velocity"][1]*0.2;
        SHOT_PARTICLE = (SHOT_PARTICLE+1) % 50; 
    }
}

//-------------------------------------------------------------------------//
// EXPLOSION PARTICLES
//-------------------------------------------------------------------------//

var EXPLOSION_PARTICLE = 0;

function explodeParticles(center, particleNode, numParticles)
{
    // Move a few particles to near the explosion point
    var particles = particleNode.children;
    var x = center.position.x;
    var y = center.position.y;
    var vx = center.userData["velocity"][0];
    var vy = center.userData["velocity"][1];

    for (var i = 0; i < numParticles; i++)
    {
    	var index = EXPLOSION_PARTICLE;
        var particle = particles[index];
        var dx = (Math.random()-0.5) * 30.0;
        var dy = (Math.random()-0.5) * 30.0;
        particle.position.x = x + dx;
        particle.position.y = y + dy;
        
        var scale = (i%2) + 1.0;
        //if (i % 2 == 0) scale = 3.0;
        var d = Math.sqrt(dx*dx + dy*dy);
        var velocity = particle.userData["velocity"];
        velocity[0] = vx + scale * 120.0 * (dx / d);
        velocity[1] = vy + scale * 120.0 * (dy / d);

        EXPLOSION_PARTICLE++;
        if (EXPLOSION_PARTICLE >= particles.length) {
        	EXPLOSION_PARTICLE = 50;
        }
    }
}

//-------------------------------------------------------------------------//
// CREATE ASTEROIDS FOR LEVEL
//-------------------------------------------------------------------------//

function createAsteroidsForLevel(level, prototypes, asteroids, left, right, top, bottom)
{
	var roids = asteroids.children;
	var protos = prototypes.children;
	var numRoids = 2*level + ROIDS_AT_LEVEL0;

	debug(roids.length);

	while (roids.length < numRoids)
	{
		var proto = protos[roids.length % protos.length];
		proto.visible = false;
		var roid = proto.clone();
		roid.visible = true;

		roid.position.x = left;
		roid.position.y = bottom;
		if (roids.length % 2 == 0) roid.position.y = bottom + Math.random() * (top-bottom);
		else                       roid.position.x = left   + Math.random() * (right-left);

		roid.material = Object.create(roid.material);  // make individual copy of material

		roid.userData["velocity"][0] = (Math.random() - 0.5) * ROID_SPEED;
		roid.userData["velocity"][1] = (Math.random() - 0.5) * ROID_SPEED;
		roid.userData["rotation"] = (Math.random() - 0.5) * ROID_ROTATION;

		roids.push(roid);
    }

    READOUT.innerHTML = getReadout();
}

//-------------------------------------------------------------------------//
// UPDATE ASTEROIDS
//-------------------------------------------------------------------------//

function killRepulsion(asteroidNode)
{
    var dx,dy,d;
    var scale = 0.0;
    var asteroids = asteroidNode.children;

    KILL_TIMER -= frameDuration;

    for (var i=0; i<asteroids.length; i++) {
    	var asteroid = asteroids[i];
    	dx = asteroid.position.x;
    	dy = asteroid.position.y;
    	d = dx*dx + dy*dy+ 1.0;
    	dx /= d;
    	dy /= d;
    	dx *= KILL_REPULSION;
    	dy *= KILL_REPULSION;
    	//
    	dx = (dx + asteroid.userData["velocity"][0]) * KILL_WAIT_DECELERATION;
    	dy = (dy + asteroid.userData["velocity"][1]) * KILL_WAIT_DECELERATION;
    	asteroid.userData["velocity"][0] = dx;
    	asteroid.userData["velocity"][1] = dy;
    }

    if (KILL_TIMER < 0) {
    	GAME_STATE = PLAYING;
    }
}

//-------------------------------------------------------------------------//
// UPDATE ASTEROIDS
//-------------------------------------------------------------------------//

function updateAsteroids(asteroids, left, right, top, bottom)
{
	// update position and rotation, based on velocity
	var roids = asteroids.children;
	for (var i=0; i<roids.length; i++) {
		var roid = roids[i];
		var velocity = roid.userData["velocity"];
		roid.position.x += velocity[0] * frameDuration;
		roid.position.y += velocity[1] * frameDuration;
		toroidalBoundary(roid.position, left, right, top, bottom);
		//
		var material = roid.material;
		material.rotation += roid.userData["rotation"] * frameDuration;
		//
		if (frameNum%120 == 0) {
			texture = material.map;
			var offset = texture.repeat.x * (frameNum/120);
			offset -= Math.floor(offset);
			texture.offset.x = offset;
		}
	}

	// asteroids repel each-other
	var dv = [0,0];
	var d;
    for (var i=0; i < roids.length-1; i++)
    {
        var a = roids[i];
        for (var j=i+1; j < roids.length; j++)
        {
            var b = roids[j];
            if (collision(a,b,1.0))
            {
            	dv[0] = b.position.x - a.position.x;
            	dv[1] = b.position.y - a.position.y;
            	d = Math.sqrt(dv[0]*dv[0] + dv[1]*dv[1]);
            	dv[0] /= d;
            	dv[1] /= d;
            	//
                a.userData["velocity"][0] -= dv[0] * ROID_BOUNCE * frameDuration;
                a.userData["velocity"][1] -= dv[1] * ROID_BOUNCE * frameDuration;
                b.userData["velocity"][0] += dv[0] * ROID_BOUNCE * frameDuration;
                b.userData["velocity"][1] += dv[1] * ROID_BOUNCE * frameDuration;
            }
        }
    }
}

//-------------------------------------------------------------------------//
// MAIN SCRIPT THAT CONTROLS EVERYTHING
//-------------------------------------------------------------------------//

function asteroidsMain(scene)
{
	LEVEL_TIMER -= frameDuration;
	var ship   = getChildByName(scene, "ship");
	var left   = getChildByName(scene, "left").position.x;
	var right  = getChildByName(scene, "right").position.x;
	var top    = getChildByName(scene, "top").position.y;
	var bottom = getChildByName(scene, "bottom").position.y;
	var shots  = getChildByName(scene, "shots");
	var particles = getChildByName(scene, "particles");

	var asteroidPrototypes = getChildByName(scene, "asteroidPrototypes");
	var asteroids = getChildByName(scene, "asteroids");

	if (asteroids.children.length == 0 && LEVEL_TIMER < 0) {
		createAsteroidsForLevel(CURR_LEVEL, asteroidPrototypes, asteroids, left, right, top, bottom);
	}

	if (GAME_STATE == PLAYING && NUM_LIVES > 0) {
		ship.visible = true;
		updateShip(asteroids, particles, ship, left, right, top, bottom);
	}

	updateShots(ship, asteroids, particles, asteroidPrototypes, shots, left, right, top, bottom);
	updateParticles(ship, asteroids, shots, particles, left, right, top, bottom);
	updateAsteroids(asteroids, left, right, top, bottom);

	if (GAME_STATE == KILLED && NUM_LIVES > 0) {
		killRepulsion(asteroids);
	}
}

//-------------------------------------------------------------------------//
