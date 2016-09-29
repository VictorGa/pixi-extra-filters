precision highp float;

//Based on shader toy: https://www.shadertoy.com/view/XsfSDs by jcant0n

uniform vec2 iResolution;
uniform sampler2D uSampler;
uniform vec2 iMouse;
uniform float blur;

const int nsamples = 30;

varying vec2 vTextureCoord;
// Hashed blur
// David Hoskins.
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

// Can go down to 10 or so, and still be usable, probably...
#define ITERATIONS 30

// Set this to 0.0 to stop the pixel movement.
#define TIME iGlobalTime

#define TAU  6.28318530718

//-------------------------------------------------------------------------------------------
// Use last part of hash function to generate new random radius and angle...
vec2 Sample(inout vec2 r)
{
    r = fract(r * vec2(33.3983, 43.4427));
    return r-.5;
    //return sqrt(r.x+.001) * vec2(sin(r.y * TAU), cos(r.y * TAU))*.5; // <<=== circular sampling.
}

//-------------------------------------------------------------------------------------------
#define HASHSCALE 443.8975
vec2 Hash22(vec2 p)
{
	vec3 p3 = fract(vec3(p.xyx) * HASHSCALE);
    p3 += dot(p3, p3.yzx+19.19);
    return fract(vec2((p3.x + p3.y)*p3.z, (p3.x+p3.z)*p3.y));
}

//-------------------------------------------------------------------------------------------
vec3 Blur(vec2 uv, float radius)
{
	radius = radius * .04;

    vec2 circle = vec2(radius) * vec2((iResolution.y / iResolution.x), 1.0);

	// Remove the time reference to prevent random jittering if you don't like it.
	vec2 random = Hash22(uv);

    // Do the blur here...
	vec3 acc = vec3(0.0);
	for (int i = 0; i < ITERATIONS; i++)
    {
		acc += texture2D(uSampler, uv + circle * Sample(random), radius*10.0).xyz;
    }
	return acc / float(ITERATIONS);
}

void main(void)
{
    vec2 uv = vTextureCoord.xy;

        float radius = 1.0 * (blur);
//        if (iMouse.w >= 1.0)
//        {
//        	radius = iMouse.x*2.0/iResolution.x;
//        }
        radius = pow(radius, 2.0);

//        if (mod(iGlobalTime, 15.0) < 10.0 || iMouse.w >= 1.0)
//        {
//    		fragColor = vec4(Blur(uv * vec2(1.0, -1.0), radius), 1.0);
//        }else
//        {
//            fragColor = vec4(Blur(uv * vec2(1.0, -1.0), abs(sin(uv.y*.8+2.85))*4.0), 1.0);
//        }

            		gl_FragColor = vec4(Blur(uv, radius), 1.0);

}

