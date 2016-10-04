precision highp float;

uniform vec2 iResolution;
uniform sampler2D uSampler;
uniform vec2 iMouse;
uniform float blur;
varying vec2 vTextureCoord;

const float RADIUS = 0.8;
const float SOFTNESS = 0.6;
const float OPACITY = 0.5;

void main(void)
{
	vec2 uv = vTextureCoord.xy;

	vec4 bounds = vec4(0.0, 0.0, iResolution.x, iResolution.y);
	vec4 rect = bounds / vec4(iResolution.x, iResolution.y, iResolution.x, iResolution.y);
	vec2 pos = (uv - rect.xy) / rect.zw;

    vec2 center = vec2(((cos(iMouse.x * 1.25) + 1.0) / 4.0) + 0.25,
                       ((sin(iMouse.y * 0.89) + 1.0) / 4.0) + 0.2);
	float len = length(pos - center);
	float vignette = smoothstep(RADIUS, RADIUS - SOFTNESS, len);
                   vec4 color = texture2D(uSampler, uv);

	gl_FragColor = color;//vec4(mix(color.rgb, vec3(color.rgb * vignette), OPACITY), 1.0);
}
