function drive(node)
{
    if(pressedKeys[87] == true || pressedKeys[38] == true) // FORWARD
    {
        // DETERMINE WHEELS' ROTATIONAL VELOCITY
        node["wheelAngularVelocity"] = Math.min(node["wheelAngularVelocity"] + frameDuration, 1.0);

        // ACTUALLY ROTATE THE WHEELS
        for(var wheel in node["children"]["wheelsNode"])
        {
            wheel.rotateOnAxis(XAXIS, node["wheelAngularVelocity"] * frameDuration);
        }

        // MOVE THE BUS
        // node.position.z
    }
}
