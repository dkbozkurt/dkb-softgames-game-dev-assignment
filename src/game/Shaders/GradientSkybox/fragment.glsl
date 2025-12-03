uniform vec3 uTopColor;
uniform vec3 uBottomColor;
uniform float uPercentage;
varying vec3 vWorldPosition;

void main() {
    // Normalize the world position with respect to the Y-axis
    float h = vWorldPosition.y / 50.0 + 0.5; // Assumes the skybox radius is 50

    // Adjust the smoothstep range to make the transition smoother
    float mixValue = smoothstep(uPercentage - 0.25, uPercentage + 0.25, h);

    // Ensure full coverage when uPercentage is at extremes
    if (uPercentage <= 0.0) {
        mixValue = 1.0; // Fully top color
    } else if (uPercentage >= 1.0) {
        mixValue = 0.0; // Fully bottom color
    }

    // Interpolate between the bottom and top colors based on mixValue
    gl_FragColor = vec4( mix( uBottomColor, uTopColor, mixValue ), 1.0 );
}
