The repository for the Sprint 1 assignment in CS 4183 under [Dr. David Cline](http://www.cs.okstate.edu/~clined/)

**Created by me**
- orbit.js
- orbit.json

**Created by instructor but improved by me**
- cs4143engine0.html

**Created by instructor**
- scene1aPhongMaterial.json
- scene1bPointLight.json
- scene1cAmbientLight.json
- scene1dHemisphereLight.json
- scene1eBasicMaterial.json
- scene1fGlobe.json
- scene1fscript.js
- scene1gScript.js
- scene1gSpotLight.json

**Assets**
- Earth texture provided by Dr. Cline.
- Sun texture from [smash!ngapps](http://www.smashingapps.com/2014/03/28/free-high-quality-texture-packs.html).

> # Sprint 1: Lights and Basic Materials
>
> CS 4183 : Video Game Design (CS 4143) 
> Dr. David Cline
>
> Three.js has a number of light sources and materials that allow you to specify light sources and surface properties of objects in the scene. In this sprint, you will extend the base game engine to load and render a more extensive set of light sources and object properties specified in an input file. This will involve adding functionality to the parser in the engine code.
>
> ## Sprint Backlog Item 1 - Light sources
>
> Implement parser functions to create different kinds of lights. Use the code from the parser that loads directional lights as an example. Your code must be able to load the following kinds of lights, along with their supporting properties:
>
> * Ambient lights
>
> * Point lights
>
> * Hemisphere lights
>
> * Spot lights
>
> Make sure that your engine can load the example files related to each of these light types.
>
> Hint: typically, you would add a function for each of the light types, and also add code in parseSceneNode to call those functions.
>
> ## Sprint Backlog Item 2 - Material types
>
> As released, the parser only supports MeshLambertMaterial. Implement parser functions to load and render different kinds of materials. In particular, you should be able to load the following materials:
>
> * MeshBasicMaterial
>
> * MeshPhongMaterial
>
> Make sure that your engine can load the example files related to the materials.
>
> ## Sprint Backlog Item 3 - New Scenes
>
> Make a scene or scenes that demonstrate the new capabilities of the engine, including lights and both new types of materials.
>
> One of the scenes must animate the scene in some way using a script.
>
> ## Sprint Backlog Item 4 - Web Deployment and Handin
>
> Get your latest engine install working from a web server, such as CSX.
>
> Demonstrate your scenes to the instructor, running from this web server.
>
> Zip up your sprint files (code and scenes) into a single .zip file (not .rar!) and turn it in to D2L.
