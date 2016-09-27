precision highp float;

//Based on shader toy: https://www.shadertoy.com/view/XsfSDs by jcant0n

uniform vec2 iResolution;
uniform sampler2D uSampler;
uniform vec2 iMouse;
uniform float blur;

const int nsamples = 30;

varying vec2 vTextureCoord;

void main(void)
{
    vec2 center = iMouse.xy / iResolution.xy;
    vec2 uv = vTextureCoord.xy;
//    vec2 center = iMouse - (uv / iResolution);
    vec4 color = vec4(0.0);

    if(distance(uv, center) < 0.2)
        {
	        gl_FragColor = texture2D(uSampler, uv);
        }
    else
        {
         float blurStart = 1.0;
         float blurWidth = 0.02;
         float precompute = blur * (1.0 / float(nsamples - 1));

         uv -= center;
         for(int i = 0; i < nsamples; i++)
         {
               float scale = blurStart + (float(i)* precompute);
               color += texture2D(uSampler, uv * scale + center);
         }
         color /= float(nsamples);
         gl_FragColor = color;
     }
}
