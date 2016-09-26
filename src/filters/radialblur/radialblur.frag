precision highp float;

uniform vec2 iResolution;
uniform sampler2D uSampler;
uniform vec2 iMouse;

const int nsamples = 30;

void main(void)
{
        vec2 center = iMouse.xy / iResolution.xy;
    	float blurStart = 1.0;
        float blurWidth = 0.04;

    	vec2 uv = vTextureCoord.xy;

        uv -= center;
        float precompute = blurWidth * (1.0 / float(nsamples - 1));

        vec4 color = vec4(0.0);
        for(int i = 0; i < nsamples; i++)
        {
            float scale = blurStart + (float(i)* precompute);
            color += texture2D(uSampler, uv * scale + center);
        }

        color /= float(nsamples);
        gl_FragColor = color;
}
