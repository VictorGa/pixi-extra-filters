precision highp float;

uniform vec2 iResolution;
uniform sampler2D uSampler;
uniform vec2 iMouse;
uniform float blur;
varying vec2 vTextureCoord;

float Threshold = 0.0+iMouse.y/iResolution.y*1.0;
float Intensity = 2.0-iMouse.x/iResolution.x*2.0;
float BlurSize = 6.0-iMouse.x/iResolution.x*6.0;

vec4 BlurColor (in vec2 Coord, in sampler2D Tex, in float MipBias)
{
	vec2 TexelSize = MipBias/vec2(1.0, 1.0);;

    vec4  Color = texture2D(Tex, Coord, MipBias);
    Color += texture2D(Tex, Coord + vec2(TexelSize.x,0.0), MipBias);
    Color += texture2D(Tex, Coord + vec2(-TexelSize.x,0.0), MipBias);
    Color += texture2D(Tex, Coord + vec2(0.0,TexelSize.y), MipBias);
    Color += texture2D(Tex, Coord + vec2(0.0,-TexelSize.y), MipBias);
    Color += texture2D(Tex, Coord + vec2(TexelSize.x,TexelSize.y), MipBias);
    Color += texture2D(Tex, Coord + vec2(-TexelSize.x,TexelSize.y), MipBias);
    Color += texture2D(Tex, Coord + vec2(TexelSize.x,-TexelSize.y), MipBias);
    Color += texture2D(Tex, Coord + vec2(-TexelSize.x,-TexelSize.y), MipBias);

    return Color/9.0;
}


void main(void)
{
	vec2 uv = vTextureCoord.xy*vec2(1.0,-1.0);

    vec4 Color = texture2D(uSampler, uv);

    vec4 Highlight = clamp(BlurColor(uv, uSampler, BlurSize)-Threshold,0.0,1.0)*1.0/(1.0-Threshold);

    gl_FragColor = 1.0-(1.0-Color)*(1.0-Highlight*Intensity); //Screen Blend Mode
}
