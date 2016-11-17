
//----------------------------------------------------------------------//

var chromaticAberrationShader = 
{
    uniforms: 
    {
        "tDiffuse": { type: "t", value: null }
    },

    vertexShader: 
    [
        "varying vec2 vUv;",
        "void main() {",
            "vUv = uv;",
            "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
        "}"
    ].join("\n"),

    fragmentShader: 
    [
        "uniform sampler2D tDiffuse;",
        "varying vec2 vUv;",

        "void main() {",
            "vec4 r = texture2D( tDiffuse, vUv );",
            "vec4 g = texture2D( tDiffuse, vUv + vec2(0.01,0) );",
            "vec4 b = texture2D( tDiffuse, vUv + vec2(-0.01,0) );",
            "vec4 c = vec4(r.r, g.g, b.b, 1.0);",
            "c.a = 1.0;",
            "gl_FragColor = c;",
        "}"
    ].join("\n")
};

//----------------------------------------------------------------------//

var negativeShader = 
{
    uniforms: 
    {
        "tDiffuse": { type: "t", value: null }
    },

    vertexShader: 
    [
        "varying vec2 vUv;",
        "void main() {",
            "vUv = uv;",
            "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
        "}"
    ].join("\n"),

    fragmentShader: 
    [
        "uniform sampler2D tDiffuse;",
        "varying vec2 vUv;",

        "void main() {",
            "vec4 c = texture2D( tDiffuse, vUv );",
            "c = vec4(1.0-c.x, 1.0-c.y, 1.0-c.z, 1.0);",
            "c.a = 1.0;",
            "gl_FragColor = c;",
        "}"
    ].join("\n")
};

//----------------------------------------------------------------------//

var lineBlurShader = 
{
    uniforms: 
    {
        "tDiffuse": { type: "t", value: null },
        "offset": { type: "v2", value: new THREE.Vector2( 0.01, 0.0 ) },
        "tintColor": { type: "v4", value: new THREE.Vector4( 1.0, 1.0, 1.0, 1.0 ) },
        "fadeColor": { type: "v4", value: new THREE.Vector4( 1.0, 1.0, 1.0, 0.0) }
    },

    vertexShader: 
    [
        "varying vec2 vUv;",
        "void main() {",
            "vUv = uv;",
            "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
        "}"
    ].join("\n"),

    fragmentShader: 
    [
        "uniform sampler2D tDiffuse;",
        "uniform vec2 offset;",
        "uniform vec4 tintColor;",
        "uniform vec4 fadeColor;",

        "varying vec2 vUv;",

        "void main() {",
            "vec4 c = texture2D( tDiffuse, vUv + 2.0*offset );",
            "c += texture2D( tDiffuse, vUv + 1.0*offset );",
            "c += texture2D( tDiffuse, vUv - 1.0*offset );",
            "c += texture2D( tDiffuse, vUv - 2.0*offset );",
            "c = c * tintColor * (1.0/4.0);",
            "c = (1.0-fadeColor.w)*c + (fadeColor.w)*fadeColor;",
            "c.a = 1.0;",
            "gl_FragColor = c;",
        "}"
    ].join("\n")
};

//----------------------------------------------------------------------//

var standardRenderer = undefined;
var lineBlurRenderer = undefined; 

function createLineBlurRenderer()
{
    var composer = new THREE.EffectComposer( standardRenderer );

    // Add initial render pass
    var renderPass = new THREE.RenderPass( currentScene, currentCamera );
    composer.addPass( renderPass );

    var effect = new THREE.ShaderPass(lineBlurShader);
    composer.addPass( effect );

    effect = new THREE.ShaderPass(lineBlurShader);
    composer.addPass( effect );

    //effect = new THREE.ShaderPass(lineBlurShader);
    //effect = new THREE.ShaderPass(negativeShader);
    effect = new THREE.ShaderPass(chromaticAberrationShader);
    composer.addPass( effect );

    effect.renderToScreen = true;
    lineBlurRenderer = composer;
}

//----------------------------------------------------------------------//

function blurScript(node)
{
    if (standardRenderer === undefined) standardRenderer = currentRenderer;

    if (lineBlurRenderer === undefined) {
        createLineBlurRenderer();
        currentCamera = currentScene.getObjectByName("testCam");
    }

    currentRenderer = lineBlurRenderer;

    var renderPass = lineBlurRenderer.passes[0];
    renderPass["camera"] = currentCamera;

    var effect = lineBlurRenderer.passes[1];
    var blurVal = Math.sin(frameStartTime);
    blurVal = blurVal * blurVal * blurVal;
    if (blurVal < 0.0) blurVal = 0.0;
    var theta = frameStartTime * 2.55;
    effect.uniforms[ 'offset' ].value = 
        new THREE.Vector2(Math.cos(theta)*blurVal*0.2, Math.sin(theta)*blurVal*0.2);


    effect = lineBlurRenderer.passes[2];
    blurVal = Math.sin(frameStartTime);
    blurVal = blurVal * blurVal * blurVal;
    if (blurVal < 0.0) blurVal = 0.0;
    var theta = frameStartTime * 25.55;
    effect.uniforms[ 'offset' ].value = 
        new THREE.Vector2(Math.cos(theta)*blurVal*0.1, Math.sin(theta)*blurVal*0.1);

    /*
    effect = lineBlurRenderer.passes[3];
    blurVal = Math.sin(frameStartTime);
    blurVal = blurVal * blurVal * blurVal;
    if (blurVal < 0.0) blurVal = 0.0;
    var theta = frameStartTime * 2.55;
    effect.uniforms[ 'offset' ].value = 
        new THREE.Vector2(Math.cos(theta)*blurVal*0.05, Math.sin(theta)*blurVal*0.05);
    effect.uniforms[ 'tintColor' ].value =
        new THREE.Vector4(1,0,0,1);
    effect.uniforms[ 'fadeColor' ].value =
        new THREE.Vector4(1,1,1,0.5);
    */

    if (blurVal == 0) currentRenderer = standardRenderer;
}








