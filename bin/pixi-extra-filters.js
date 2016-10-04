(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){


/**
* @author Julien CLEREL @JuloxRox
* original filter https://github.com/evanw/glfx.js/blob/master/src/filters/warp/bulgepinch.js by Evan Wallace : http://madebyevan.com/
*/

/**
* @filter Bulge / Pinch
* @description Bulges or pinches the image in a circle.
* @param center The x and y coordinates of the center of the circle of effect.
* @param radius The radius of the circle of effect.
* @param strength -1 to 1 (-1 is strong pinch, 0 is no effect, 1 is strong bulge)
*
* @class BulgePinchFilter
* @extends AbstractFilter
* @constructor
*/

function BulgePinchFilter() {
    PIXI.Filter.call(this,
        // vertex shader
       // vertex shader
        "#define GLSLIFY 1\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nvarying vec2 vTextureCoord;\n\nvoid main(void){\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}\n",
            // fragment shader
        "#define GLSLIFY 1\nuniform float radius;\nuniform float strength;\nuniform vec2 center;\nuniform sampler2D uSampler;\nuniform vec4 dimensions;\nvarying vec2 vTextureCoord;\nvoid main()\n{\n    vec2 coord = vTextureCoord * dimensions.xy;\n    coord -= center;\n    float distance = length(coord);\n    if (distance < radius) {\n        float percent = distance / radius;\n        if (strength > 0.0) {\n            coord *= mix(1.0, smoothstep(0.0, radius /     distance, percent), strength * 0.75);\n        } else {\n            coord *= mix(1.0, pow(percent, 1.0 + strength * 0.75) * radius / distance, 1.0 - percent);\n        }\n    }\n    coord += center;\n    gl_FragColor = texture2D(uSampler, coord / dimensions.xy);\n    vec2 clampedCoord = clamp(coord, vec2(0.0), dimensions.xy);\n    if (coord != clampedCoord) {\n    gl_FragColor.a *= max(0.0, 1.0 - length(coord - clampedCoord));\n    }\n}\n"
    );
}

BulgePinchFilter.prototype = Object.create(PIXI.Filter.prototype);
BulgePinchFilter.prototype.constructor = BulgePinchFilter;
module.exports = BulgePinchFilter;

Object.defineProperties(BulgePinchFilter.prototype, {
    /**
     * The radius of the circle of effect.
     *
     * @property radius
     * @type Number
     */
    radius: {
        get: function ()
        {
            return this.uniforms.radius;
        },
        set: function (value)
        {
            this.uniforms.radius = value;
        }
    },
    /**
     * The strength of the effect. -1 to 1 (-1 is strong pinch, 0 is no effect, 1 is strong bulge)
     *
     * @property strength
     * @type Number
     */
    strength: {
        get: function ()
        {
            return this.uniforms.strength;
        },
        set: function (value)
        {
            this.uniforms.strength = value;
        }
    },
    /**
     * The x and y coordinates of the center of the circle of effect.
     *
     * @property center
     * @type Point
     */
    center: {
        get: function ()
        {
            return this.uniforms.center;
        },
        set: function (value)
        {
            this.uniforms.center = value;
        }
    }
});

},{}],2:[function(require,module,exports){


/**
 * ColorReplaceFilter, originally by mishaa, updated by timetocode
 * http://www.html5gamedevs.com/topic/10640-outline-a-sprite-change-certain-colors/?p=69966
 *
 * @class
 * @param originalColor {FloatArray32} The color that will be changed, as a 3 component RGB e.g. new Float32Array(1.0, 1.0, 1.0)
 * @param newColor {FloatArray32} The resulting color, as a 3 component RGB e.g. new Float32Array(1.0, 0.5, 1.0)
 * @param epsilon {float} Tolerance/sensitivity of the floating-point comparison between colors (lower = more exact, higher = more inclusive)
 *
 * @example
 *  // replaces true red with true blue
 *  someSprite.shader = new ColorReplaceFilter(
 *   new Float32Array([1, 0, 0]),
 *   new Float32Array([0, 0, 1]),
 *   0.001
 *  );
 *  // replaces the RGB color 220, 220, 220 with the RGB color 225, 200, 215
 *  someOtherSprite.shader = new ColorReplaceFilter(
 *   new Float32Array([220/255.0, 220/255.0, 220/255.0]),
 *   new Float32Array([225/255.0, 200/255.0, 215/255.0]),
 *   0.001
 *  );
 *
 */
function ColorReplaceFilter(originalColor, newColor, epsilon) {
    PIXI.Filter.call(this,
        // vertex shader
        // vertex shader
        "#define GLSLIFY 1\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nvarying vec2 vTextureCoord;\n\nvoid main(void){\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}\n",
        // fragment shader
        "#define GLSLIFY 1\nvarying vec2 vTextureCoord;\nuniform sampler2D texture;\nuniform vec3 originalColor;\nuniform vec3 newColor;\nuniform float epsilon;\nvoid main(void) {\n    vec4 currentColor = texture2D(texture, vTextureCoord);\n    vec3 colorDiff = originalColor - (currentColor.rgb / max(currentColor.a, 0.0000000001));\n    float colorDistance = length(colorDiff);\n    float doReplace = step(colorDistance, epsilon);\n    gl_FragColor = vec4(mix(currentColor.rgb, (newColor + colorDiff) * currentColor.a, doReplace), currentColor.a);\n}\n"
    );

    this.uniforms.originalColor = originalColor;
    this.uniforms.newColor = newColor;
    this.uniforms.epsilon = epsilon;
};

ColorReplaceFilter.prototype = Object.create(PIXI.Filter.prototype);
ColorReplaceFilter.prototype.constructor = ColorReplaceFilter;
module.exports = ColorReplaceFilter;

Object.defineProperty(ColorReplaceFilter.prototype, 'originalColor', {
  set: function (value) {
    var r = ((value & 0xFF0000) >> 16) / 255,
        g = ((value & 0x00FF00) >> 8) / 255,
        b = (value & 0x0000FF) / 255;
    this.uniforms.originalColor = { x: r, y: g, z: b };
  }
});

Object.defineProperty(ColorReplaceFilter.prototype, 'newColor', {
  set: function (value) {
    var r = ((value & 0xFF0000) >> 16) / 255,
        g = ((value & 0x00FF00) >> 8) / 255,
        b = (value & 0x0000FF) / 255;
    this.uniforms.newColor = { x: r, y: g, z: b };
  }
});

Object.defineProperty(ColorReplaceFilter.prototype, 'epsilon', {
  set: function (value) {
    this.uniforms.epsilon = value;
  }
});

},{}],3:[function(require,module,exports){


/**
 * GlowFilter, originally by mishaa
 * http://www.html5gamedevs.com/topic/12756-glow-filter/?hl=mishaa#entry73578
 * http://codepen.io/mishaa/pen/raKzrm
 *
 * @class
 * @param viewWidth {number} The width of the view to draw to, usually renderer.width.
 * @param viewHeight {number} The height of the view to draw to, usually renderer.height.
 * @param outerStrength {number} The strength of the glow outward from the edge of the sprite.
 * @param innerStrength {number} The strength of the glow inward from the edge of the sprite.
 * @param color {number} The color of the glow.
 * @param quality {number} A number between 0 and 1 that describes the quality of the glow.
 *
 * @example
 *  someSprite.filters = [
 *      new GlowFilter(renderer.width, renderer.height, 15, 2, 1, 0xFF0000, 0.5)
 *  ];
 */
function GlowFilter(viewWidth, viewHeight, distance, outerStrength, innerStrength, color, quality) {
    PIXI.Filter.call(this,
        // vertex shader
        // vertex shader
        "#define GLSLIFY 1\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nvarying vec2 vTextureCoord;\n\nvoid main(void){\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}\n",
        // fragment shader
        "#define GLSLIFY 1\nvarying vec2 vTextureCoord;\nvarying vec4 vColor;\n\nuniform sampler2D uSampler;\n\nuniform float distance;\nuniform float outerStrength;\nuniform float innerStrength;\nuniform vec4 glowColor;\nuniform float pixelWidth;\nuniform float pixelHeight;\nvec2 px = vec2(pixelWidth, pixelHeight);\n\nvoid main(void) {\n    const float PI = 3.14159265358979323846264;\n    vec4 ownColor = texture2D(uSampler, vTextureCoord);\n    vec4 curColor;\n    float totalAlpha = 0.0;\n    float maxTotalAlpha = 0.0;\n    float cosAngle;\n    float sinAngle;\n    for (float angle = 0.0; angle <= PI * 2.0; angle += ' + (1 / quality / distance).toFixed(7) + ') {\n       cosAngle = cos(angle);\n       sinAngle = sin(angle);\n       for (float curDistance = 1.0; curDistance <= ' + distance.toFixed(7) + '; curDistance++) {\n           curColor = texture2D(uSampler, vec2(vTextureCoord.x + cosAngle * curDistance * px.x, vTextureCoord.y + sinAngle * curDistance * px.y));\n           totalAlpha += (distance - curDistance) * curColor.a;\n           maxTotalAlpha += (distance - curDistance);\n       }\n    }\n    maxTotalAlpha = max(maxTotalAlpha, 0.0001);\n\n    ownColor.a = max(ownColor.a, 0.0001);\n    ownColor.rgb = ownColor.rgb / ownColor.a;\n    float outerGlowAlpha = (totalAlpha / maxTotalAlpha)  * outerStrength * (1. - ownColor.a);\n    float innerGlowAlpha = ((maxTotalAlpha - totalAlpha) / maxTotalAlpha) * innerStrength * ownColor.a;\n    float resultAlpha = (ownColor.a + outerGlowAlpha);\n    gl_FragColor = vec4(mix(mix(ownColor.rgb, glowColor.rgb, innerGlowAlpha / ownColor.a), glowColor.rgb, outerGlowAlpha / resultAlpha) * resultAlpha, resultAlpha);\n}\n"
    );

    this.uniforms.distance = distance;
    this.uniforms.glowColor = new Float32Array([0, 0, 0, 1]);

    quality = Math.pow(quality, 1/3);
    this.quality = quality;

    this.uniforms.distance.value *= quality;

    viewWidth *= quality;
    viewHeight *= quality;

    this.color = color;
    this.outerStrength = outerStrength;
    this.innerStrength = innerStrength;
    this.viewWidth = viewWidth;
    this.viewHeight = viewHeight;
};

GlowFilter.prototype = Object.create(PIXI.Filter.prototype);
GlowFilter.prototype.constructor = GlowFilter;
module.exports = GlowFilter;

Object.defineProperties(GlowFilter.prototype, {
    color: {
        get: function () {
            return PIXI.utils.rgb2hex(this.uniforms.glowColor);
        },
        set: function(value) {
            PIXI.utils.hex2rgb(value, this.uniforms.glowColor);
        }
    },

    outerStrength: {
        get: function () {
            return this.uniforms.outerStrength;
        },
        set: function (value) {
            this.uniforms.outerStrength = value;
        }
    },

    innerStrength: {
        get: function () {
            return this.uniforms.innerStrength;
        },
        set: function (value) {
            this.uniforms.innerStrength = value;
        }
    },

    viewWidth: {
        get: function () {
            return 1 / this.uniforms.pixelWidth;
        },
        set: function(value) {
            this.uniforms.pixelWidth = 1 / value;
        }
    },

    viewHeight: {
        get: function () {
            return 1 / this.uniforms.pixelHeight;
        },
        set: function(value) {
            this.uniforms.pixelHeight = 1 / value;
        }
    }
});

},{}],4:[function(require,module,exports){


/**
 * OutlineFilter, originally by mishaa
 * http://www.html5gamedevs.com/topic/10640-outline-a-sprite-change-certain-colors/?p=69966
 * http://codepen.io/mishaa/pen/emGNRB
 *
 * @class
 * @param viewWidth {number} The width of the view to draw to, usually renderer.width.
 * @param viewHeight {number} The height of the view to draw to, usually renderer.height.
 * @param thickness {number} The tickness of the outline.
 * @param color {number} The color of the glow.
 *
 * @example
 *  someSprite.shader = new OutlineFilter(renderer.width, renderer.height, 9, 0xFF0000);
 */
function HashedblurFilter(iResolution, iMouse) {
    PIXI.Filter.call(this,
        // vertex shader
        // vertex shader
        "#define GLSLIFY 1\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 filterMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec2 vFilterCoord;\n\nvoid main(void)\n{\n   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n   vFilterCoord = ( filterMatrix * vec3( aTextureCoord, 1.0)  ).xy;\n   vTextureCoord = aTextureCoord;\n}\n",
        // fragment shader
        "precision highp float;\n#define GLSLIFY 1\n\n//Based on shader toy: https://www.shadertoy.com/view/XsfSDs by jcant0n\n\nuniform vec2 iResolution;\nuniform sampler2D uSampler;\nuniform vec2 iMouse;\nuniform float blur;\n\nconst int nsamples = 30;\n\nvarying vec2 vTextureCoord;\n// Hashed blur\n// David Hoskins.\n// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.\n\n// Can go down to 10 or so, and still be usable, probably...\n#define ITERATIONS 30\n\n// Set this to 0.0 to stop the pixel movement.\n#define TIME iGlobalTime\n\n#define TAU  6.28318530718\n\n//-------------------------------------------------------------------------------------------\n// Use last part of hash function to generate new random radius and angle...\nvec2 Sample(inout vec2 r)\n{\n    r = fract(r * vec2(33.3983, 43.4427));\n    return r-.5;\n    //return sqrt(r.x+.001) * vec2(sin(r.y * TAU), cos(r.y * TAU))*.5; // <<=== circular sampling.\n}\n\n//-------------------------------------------------------------------------------------------\n#define HASHSCALE 443.8975\nvec2 Hash22(vec2 p)\n{\n\tvec3 p3 = fract(vec3(p.xyx) * HASHSCALE);\n    p3 += dot(p3, p3.yzx+19.19);\n    return fract(vec2((p3.x + p3.y)*p3.z, (p3.x+p3.z)*p3.y));\n}\n\n//-------------------------------------------------------------------------------------------\nvec3 Blur(vec2 uv, float radius)\n{\n\tradius = radius * .04;\n\n    vec2 circle = vec2(radius) * vec2((iResolution.y / iResolution.x), 1.0);\n\n\t// Remove the time reference to prevent random jittering if you don't like it.\n\tvec2 random = Hash22(uv);\n\n    // Do the blur here...\n\tvec3 acc = vec3(0.0);\n\tfor (int i = 0; i < ITERATIONS; i++)\n    {\n\t\tacc += texture2D(uSampler, uv + circle * Sample(random), radius*10.0).xyz;\n    }\n\treturn acc / float(ITERATIONS);\n}\n\nvoid main(void)\n{\n    vec2 uv = vTextureCoord.xy;\n\n        float radius = 1.0 * (blur);\n//        if (iMouse.w >= 1.0)\n//        {\n//        \tradius = iMouse.x*2.0/iResolution.x;\n//        }\n        radius = pow(radius, 2.0);\n\n//        if (mod(iGlobalTime, 15.0) < 10.0 || iMouse.w >= 1.0)\n//        {\n//    \t\tfragColor = vec4(Blur(uv * vec2(1.0, -1.0), radius), 1.0);\n//        }else\n//        {\n//            fragColor = vec4(Blur(uv * vec2(1.0, -1.0), abs(sin(uv.y*.8+2.85))*4.0), 1.0);\n//        }\n\n            \t\tgl_FragColor = vec4(Blur(uv, radius), 1.0);\n\n}\n\n",
        {
            iResolution: { type: 'v2', value: { x: 1920, y: 1080 } },
            iMouse: { type: 'v2', value: { x: 10, y: 10.8 } },
            blur: {
                type: 'f',
                value: 0.01
            }
        }
    );

    this.iResolution = [1000, 556];
    this.iMouse = [10, 10];
    this.blur = 0.01;
};

HashedblurFilter.prototype = Object.create(PIXI.Filter.prototype);
HashedblurFilter.prototype.constructor = HashedblurFilter;
module.exports = HashedblurFilter;

Object.defineProperties(HashedblurFilter.prototype, {
    iMouse: {
        get: function () {
            return this.uniforms.iMouse;
        },
        set: function (value) {
            this.uniforms.iMouse = value;
        }
    },

    iResolution: {
        get: function () {
            return this.uniforms.iResolution;
        },
        set: function(value) {
            this.uniforms.iResolution = value;
        }
    },

    blur: {
        get: function () {
            return this.uniforms.blur;
        },
        set: function(value) {
            this.uniforms.blur = value;
        }
    }
});

},{}],5:[function(require,module,exports){


/**
 * OutlineFilter, originally by mishaa
 * http://www.html5gamedevs.com/topic/10640-outline-a-sprite-change-certain-colors/?p=69966
 * http://codepen.io/mishaa/pen/emGNRB
 *
 * @class
 * @param viewWidth {number} The width of the view to draw to, usually renderer.width.
 * @param viewHeight {number} The height of the view to draw to, usually renderer.height.
 * @param thickness {number} The tickness of the outline.
 * @param color {number} The color of the glow.
 *
 * @example
 *  someSprite.shader = new OutlineFilter(renderer.width, renderer.height, 9, 0xFF0000);
 */
function LuminanceFilter(iResolution, iMouse) {
    PIXI.Filter.call(this,
        // vertex shader
        // vertex shader
        "#define GLSLIFY 1\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 filterMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec2 vFilterCoord;\n\nvoid main(void)\n{\n   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n   vFilterCoord = ( filterMatrix * vec3( aTextureCoord, 1.0)  ).xy;\n   vTextureCoord = aTextureCoord;\n}\n",
        // fragment shader
        "precision highp float;\n#define GLSLIFY 1\n\nuniform vec2 iResolution;\nuniform sampler2D uSampler;\nuniform vec2 iMouse;\nuniform float blur;\nvarying vec2 vTextureCoord;\n\nfloat Threshold = 0.0+iMouse.y/iResolution.y*1.0;\nfloat Intensity = 2.0-iMouse.x/iResolution.x*2.0;\nfloat BlurSize = 6.0-iMouse.x/iResolution.x*6.0;\n\nvec4 BlurColor (in vec2 Coord, in sampler2D Tex, in float MipBias)\n{\n\tvec2 TexelSize = MipBias/vec2(1.0, 1.0);;\n\n    vec4  Color = texture2D(Tex, Coord, MipBias);\n    Color += texture2D(Tex, Coord + vec2(TexelSize.x,0.0), MipBias);\n    Color += texture2D(Tex, Coord + vec2(-TexelSize.x,0.0), MipBias);\n    Color += texture2D(Tex, Coord + vec2(0.0,TexelSize.y), MipBias);\n    Color += texture2D(Tex, Coord + vec2(0.0,-TexelSize.y), MipBias);\n    Color += texture2D(Tex, Coord + vec2(TexelSize.x,TexelSize.y), MipBias);\n    Color += texture2D(Tex, Coord + vec2(-TexelSize.x,TexelSize.y), MipBias);\n    Color += texture2D(Tex, Coord + vec2(TexelSize.x,-TexelSize.y), MipBias);\n    Color += texture2D(Tex, Coord + vec2(-TexelSize.x,-TexelSize.y), MipBias);\n\n    return Color/9.0;\n}\n\nvoid main(void)\n{\n\tvec2 uv = vTextureCoord.xy*vec2(1.0,-1.0);\n\n    vec4 Color = texture2D(uSampler, uv);\n\n    vec4 Highlight = clamp(BlurColor(uv, uSampler, BlurSize)-Threshold,0.0,1.0)*1.0/(1.0-Threshold);\n\n    gl_FragColor = 1.0-(1.0-Color)*(1.0-Highlight*Intensity); //Screen Blend Mode\n}\n",
        {
            iResolution: { type: 'v2', value: { x: 1920, y: 1080 } },
            iMouse: { type: 'v2', value: { x: 10, y: 10.8 } }
        }
    );

    this.iResolution = [1000, 556];
    this.iMouse = [10, 10];
};

LuminanceFilter.prototype = Object.create(PIXI.Filter.prototype);
LuminanceFilter.prototype.constructor = LuminanceFilter;
module.exports = LuminanceFilter;

Object.defineProperties(LuminanceFilter.prototype, {
    iMouse: {
        get: function () {
            return this.uniforms.iMouse;
        },
        set: function (value) {
            this.uniforms.iMouse = value;
        }
    },

    iResolution: {
        get: function () {
            return this.uniforms.iResolution;
        },
        set: function(value) {
            this.uniforms.iResolution = value;
        }
    }

});

},{}],6:[function(require,module,exports){


/**
 * OutlineFilter, originally by mishaa
 * http://www.html5gamedevs.com/topic/10640-outline-a-sprite-change-certain-colors/?p=69966
 * http://codepen.io/mishaa/pen/emGNRB
 *
 * @class
 * @param viewWidth {number} The width of the view to draw to, usually renderer.width.
 * @param viewHeight {number} The height of the view to draw to, usually renderer.height.
 * @param thickness {number} The tickness of the outline.
 * @param color {number} The color of the glow.
 *
 * @example
 *  someSprite.shader = new OutlineFilter(renderer.width, renderer.height, 9, 0xFF0000);
 */
function OutlineFilter(viewWidth, viewHeight, thickness, color) {
    thickness = thickness || 1;
    PIXI.Filter.call(this,
        // vertex shader
        // vertex shader
        "#define GLSLIFY 1\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nvarying vec2 vTextureCoord;\n\nvoid main(void){\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}\n",
        // fragment shader
        "#define GLSLIFY 1\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform float thickness;\nuniform vec4 outlineColor;\nuniform float pixelWidth;\nuniform float pixelHeight;\nvec2 px = vec2(pixelWidth, pixelHeight);\n\nvoid main(void) {\n    const float PI = 3.14159265358979323846264;\n    vec4 ownColor = texture2D(uSampler, vTextureCoord);\n    vec4 curColor;\n    float maxAlpha = 0.;\n    for (float angle = 0.; angle < PI * 2.; angle += %THICKNESS% ) {\n        curColor = texture2D(uSampler, vec2(vTextureCoord.x + thickness * px.x * cos(angle), vTextureCoord.y + thickness * px.y * sin(angle)));\n        maxAlpha = max(maxAlpha, curColor.a);\n    }\n    float resultAlpha = max(maxAlpha, ownColor.a);\n    gl_FragColor = vec4((ownColor.rgb + outlineColor.rgb * (1. - ownColor.a)) * resultAlpha, resultAlpha);\n}\n".replace(/%THICKNESS%/gi, (1.0 / thickness).toFixed(7))
    );

    this.uniforms.pixelWidth = 1 / (viewWidth || 1);
    this.uniforms.pixelHeight = 1 / (viewHeight || 1);
    this.uniforms.thickness = thickness;
    this.uniforms.outlineColor = new Float32Array([0, 0, 0, 1]);
    if (color) {
        this.color = color;
    }
};

OutlineFilter.prototype = Object.create(PIXI.Filter.prototype);
OutlineFilter.prototype.constructor = OutlineFilter;
module.exports = OutlineFilter;

Object.defineProperties(OutlineFilter.prototype, {
    color: {
        get: function () {
            return PIXI.utils.rgb2hex(this.uniforms.outlineColor);
        },
        set: function (value) {
            PIXI.utils.hex2rgb(value, this.uniforms.outlineColor);
        }
    },

    viewWidth: {
        get: function () {
            return 1 / this.uniforms.pixelWidth;
        },
        set: function(value) {
            this.uniforms.pixelWidth = 1 / value;
        }
    },

    viewHeight: {
        get: function () {
            return 1 / this.uniforms.pixelHeight;
        },
        set: function(value) {
            this.uniforms.pixelHeight = 1 / value;
        }
    }
});

},{}],7:[function(require,module,exports){


/**
 * OutlineFilter, originally by mishaa
 * http://www.html5gamedevs.com/topic/10640-outline-a-sprite-change-certain-colors/?p=69966
 * http://codepen.io/mishaa/pen/emGNRB
 *
 * @class
 * @param viewWidth {number} The width of the view to draw to, usually renderer.width.
 * @param viewHeight {number} The height of the view to draw to, usually renderer.height.
 * @param thickness {number} The tickness of the outline.
 * @param color {number} The color of the glow.
 *
 * @example
 *  someSprite.shader = new OutlineFilter(renderer.width, renderer.height, 9, 0xFF0000);
 */
function RadialblurFilter() {
    PIXI.Filter.call(this,
        // vertex shader
        // vertex shader
        "#define GLSLIFY 1\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 filterMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec2 vFilterCoord;\n\nvoid main(void)\n{\n   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n   vFilterCoord = ( filterMatrix * vec3( aTextureCoord, 1.0)  ).xy;\n   vTextureCoord = aTextureCoord;\n}\n",
        // fragment shader
        "precision highp float;\n#define GLSLIFY 1\n\n//Based on shader toy: https://www.shadertoy.com/view/XsfSDs by jcant0n\n\nuniform vec2 iResolution;\nuniform sampler2D uSampler;\nuniform vec2 iMouse;\nuniform float blur;\nvarying vec2 vTextureCoord;\n\nconst int nsamples = 50;\n\nvoid main(void)\n{\n    vec2 center = iMouse.xy / iResolution.xy;\n\n    \tfloat blurStart = 1.0;\n        //float blurWidth = 0.1;\n\n    \tvec2 uv = vTextureCoord.xy;\n\n        uv -= center;\n        float precompute = blur * (1.0 / float(nsamples - 1));\n\n        vec4 color = vec4(0.0);\n        for(int i = 0; i < nsamples; i++)\n        {\n            float scale = blurStart + (float(i)* precompute);\n            color += texture2D(uSampler, uv * scale + center);\n        }\n\n        color /= float(nsamples);\n        gl_FragColor = color;\n}\n",
        {
            iResolution: { type: 'v2', value: { x: 1920, y: 1080 } },
            iMouse: { type: 'v2', value: { x: 10, y: 10.8 } },
            blur: {
                type: 'f',
                value: 0.01
            }
        }
    );

    this.iResolution = [1000, 556];
    this.iMouse = [10, 10];
    this.blur = 0.01;
};

RadialblurFilter.prototype = Object.create(PIXI.Filter.prototype);
RadialblurFilter.prototype.constructor = RadialblurFilter;
module.exports = RadialblurFilter;

Object.defineProperties(RadialblurFilter.prototype, {
    iMouse: {
        get: function () {
            return this.uniforms.iMouse;
        },
        set: function (value) {
            this.uniforms.iMouse = value;
        }
    },

    iResolution: {
        get: function () {
            return this.uniforms.iResolution;
        },
        set: function(value) {
            this.uniforms.iResolution = value;
        }
    },

    blur: {
        get: function () {
            return this.uniforms.blur;
        },
        set: function(value) {
            this.uniforms.blur = value;
        }
    }
});

},{}],8:[function(require,module,exports){


/**
 * OutlineFilter, originally by mishaa
 * http://www.html5gamedevs.com/topic/10640-outline-a-sprite-change-certain-colors/?p=69966
 * http://codepen.io/mishaa/pen/emGNRB
 *
 * @class
 * @param viewWidth {number} The width of the view to draw to, usually renderer.width.
 * @param viewHeight {number} The height of the view to draw to, usually renderer.height.
 * @param thickness {number} The tickness of the outline.
 * @param color {number} The color of the glow.
 *
 * @example
 *  someSprite.shader = new OutlineFilter(renderer.width, renderer.height, 9, 0xFF0000);
 */
function RadialblurMaskFilter(iResolution, iMouse) {
    PIXI.Filter.call(this,
        // vertex shader
        // vertex shader
        "#define GLSLIFY 1\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 filterMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec2 vFilterCoord;\n\nvoid main(void)\n{\n   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n   vFilterCoord = ( filterMatrix * vec3( aTextureCoord, 1.0)  ).xy;\n   vTextureCoord = aTextureCoord;\n}\n",
        // fragment shader
        "precision highp float;\n#define GLSLIFY 1\n\n//Based on shader toy: https://www.shadertoy.com/view/XsfSDs by jcant0n\n\nuniform vec2 iResolution;\nuniform sampler2D uSampler;\nuniform vec2 iMouse;\nuniform float blur;\n\nconst int nsamples = 30;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    vec2 center = iMouse.xy / iResolution.xy;\n    vec2 uv = vTextureCoord.xy;\n//    vec2 center = iMouse - (uv / iResolution);\n    vec4 color = vec4(0.0);\n\n    if(distance(uv, center) < 0.2)\n        {\n\t        gl_FragColor = texture2D(uSampler, uv);\n        }\n    else\n        {\n         float blurStart = 1.0;\n         float blurWidth = 0.02;\n         float precompute = blur * (1.0 / float(nsamples - 1));\n\n         uv -= center;\n         for(int i = 0; i < nsamples; i++)\n         {\n               float scale = blurStart + (float(i)* precompute);\n               color += texture2D(uSampler, uv * scale + center);\n         }\n         color /= float(nsamples);\n         gl_FragColor = color;\n     }\n}\n",
        {
            iResolution: { type: 'v2', value: { x: 1920, y: 1080 } },
            iMouse: { type: 'v2', value: { x: 10, y: 10.8 } },
            blur: {
                type: 'f',
                value: 0.01
            }
        }
    );

    this.iResolution = [1000, 556];
    this.iMouse = [10, 10];
    this.blur = 0.01;
};

RadialblurMaskFilter.prototype = Object.create(PIXI.Filter.prototype);
RadialblurMaskFilter.prototype.constructor = RadialblurMaskFilter;
module.exports = RadialblurMaskFilter;

Object.defineProperties(RadialblurMaskFilter.prototype, {
    iMouse: {
        get: function () {
            return this.uniforms.iMouse;
        },
        set: function (value) {
            this.uniforms.iMouse = value;
        }
    },

    iResolution: {
        get: function () {
            return this.uniforms.iResolution;
        },
        set: function(value) {
            this.uniforms.iResolution = value;
        }
    },

    blur: {
        get: function () {
            return this.uniforms.blur;
        },
        set: function(value) {
            this.uniforms.blur = value;
        }
    }
});

},{}],9:[function(require,module,exports){


/**
* SimpleLightmap, originally by Oza94
* http://www.html5gamedevs.com/topic/20027-pixijs-simple-lightmapping/
* http://codepen.io/Oza94/pen/EPoRxj
*
* @class
* @param lightmapTexture {PIXI.Texture} a texture where your lightmap is rendered
* @param ambientColor {Array} An RGBA array of the ambient color
* @param [resolution] {Array} An array for X/Y resolution
*
* @example
*  var lightmapTex = new PIXI.RenderTexture(renderer, 400, 300);
*
*  // ... render lightmap on lightmapTex
*
*  stageContainer.filters = [
*    new SimpleLightmapFilter(lightmapTex, [0.3, 0.3, 0.7, 0.5], [1.0, 1.0])
*  ];
*/
function SimpleLightmapFilter(lightmapTexture, ambientColor, resolution) {
    PIXI.Filter.call(this,
        // vertex shader
        // vertex shader
        "precision mediump float;\n#define GLSLIFY 1\n\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform float thickness;\nuniform vec4 outlineColor;\nuniform float pixelWidth;\nuniform float pixelHeight;\nvec2 px = vec2(pixelWidth, pixelHeight);\n\nvoid main(void) {\n    const float PI = 3.14159265358979323846264;\n    vec4 ownColor = texture2D(uSampler, vTextureCoord);\n    vec4 curColor;\n    float maxAlpha = 0.;\n    for (float angle = 0.; angle < PI * 2.; angle +=  + (1 / thickness).toFixed(7) + ) {\n        curColor = texture2D(uSampler, vec2(vTextureCoord.x + thickness * px.x * cos(angle), vTextureCoord.y + thickness * px.y * sin(angle)));\n        maxAlpha = max(maxAlpha, curColor.a);\n    }\n    float resultAlpha = max(maxAlpha, ownColor.a);\n    gl_FragColor = vec4((ownColor.rgb + outlineColor.rgb * (1. - ownColor.a)) * resultAlpha, resultAlpha);\n}\n",
        // fragment shader
        "#define GLSLIFY 1\nvarying vec4 vColor;\nvarying vec2 vTextureCoord;\nuniform sampler2D u_texture; //diffuse map\nuniform sampler2D u_lightmap;   //light map\nuniform vec2 resolution; //resolution of screen\nuniform vec4 ambientColor; //ambient RGB, alpha channel is intensity\nvoid main() {\n    vec4 diffuseColor = texture2D(u_texture, vTextureCoord);\n    vec2 lighCoord = (gl_FragCoord.xy / resolution.xy);\n    vec4 light = texture2D(u_lightmap, vTextureCoord);\n    vec3 ambient = ambientColor.rgb * ambientColor.a;\n    vec3 intensity = ambient + light.rgb;\n    vec3 finalColor = diffuseColor.rgb * intensity;\n    gl_FragColor = vColor * vec4(finalColor, diffuseColor.a);\n}\n"
    );
    this.uniforms.u_lightmap = lightmapTexture;
    this.uniforms.resolution = new Float32Array(resolution || [1.0, 1.0]);
    this.uniforms.ambientColor =  new Float32Array(ambientColor);
}

SimpleLightmapFilter.prototype = Object.create(PIXI.Filter.prototype);
SimpleLightmapFilter.prototype.constructor = SimpleLightmapFilter;

Object.defineProperties(SimpleLightmapFilter.prototype, {
    texture: {
        get: function () {
            return this.uniforms.u_lightmap;
        },
        set: function (value) {
            this.uniforms.u_lightmap = value;
        }
    },
    color: {
        get: function () {
            return this.uniforms.ambientColor;
        },
        set: function (value) {
            this.uniforms.ambientColor = new Float32Array(value);
        }
    },
    resolution: {
        get: function () {
            return this.uniforms.resolution;
        },
        set: function (value) {
            this.uniforms.resolution = new Float32Array(value);
        }
    }
});

module.exports = SimpleLightmapFilter;

},{}],10:[function(require,module,exports){


/**
 * OutlineFilter, originally by mishaa
 * http://www.html5gamedevs.com/topic/10640-outline-a-sprite-change-certain-colors/?p=69966
 * http://codepen.io/mishaa/pen/emGNRB
 *
 * @class
 * @param viewWidth {number} The width of the view to draw to, usually renderer.width.
 * @param viewHeight {number} The height of the view to draw to, usually renderer.height.
 * @param thickness {number} The tickness of the outline.
 * @param color {number} The color of the glow.
 *
 * @example
 *  someSprite.shader = new OutlineFilter(renderer.width, renderer.height, 9, 0xFF0000);
 */
function VignetteFilter(iResolution, iMouse) {
    PIXI.Filter.call(this,
        // vertex shader
        // vertex shader
        "#define GLSLIFY 1\nattribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\nuniform mat3 filterMatrix;\n\nvarying vec2 vTextureCoord;\nvarying vec2 vFilterCoord;\n\nvoid main(void)\n{\n   gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n   vFilterCoord = ( filterMatrix * vec3( aTextureCoord, 1.0)  ).xy;\n   vTextureCoord = aTextureCoord;\n}\n",
        // fragment shader
        "precision highp float;\n#define GLSLIFY 1\n\nuniform vec2 iResolution;\nuniform sampler2D uSampler;\nuniform vec2 iMouse;\nuniform float blur;\nvarying vec2 vTextureCoord;\n\nconst float RADIUS = 0.8;\nconst float SOFTNESS = 0.6;\nconst float OPACITY = 0.5;\n\nconst vec4 bgColor = vec4(0.5, 0.15, 0.1, 1.0);\n\nvoid main(void)\n{\n\tvec2 uv = vTextureCoord.xy;\n\n\tvec4 bounds = vec4(0.0, 0.0, iResolution.x, iResolution.y);\n\tvec4 rect = bounds / vec4(iResolution.x, iResolution.y, iResolution.x, iResolution.y);\n\tvec2 pos = (uv - rect.xy) / rect.zw;\n\n    vec2 center = vec2(((cos(iMouse.x * 1.25) + 1.0) / 4.0) + 0.25,\n                       ((sin(iMouse.y * 0.89) + 1.0) / 4.0) + 0.2);\n\tfloat len = length(pos - center);\n\tfloat vignette = smoothstep(RADIUS, RADIUS - SOFTNESS, len);\n                   vec4 color = texture2D(uSampler, uv);\n\n\tgl_FragColor = color;//vec4(mix(color.rgb, vec3(color.rgb * vignette), OPACITY), 1.0);\n}\n",
        {
            iResolution: { type: 'v2', value: { x: 1920, y: 1080 } },
            iMouse: { type: 'v2', value: { x: 10, y: 10.8 } }
        }
    );

    this.iResolution = [1000, 556];
    this.iMouse = [10, 10];
};

VignetteFilter.prototype = Object.create(PIXI.Filter.prototype);
VignetteFilter.prototype.constructor = VignetteFilter;
module.exports = VignetteFilter;

Object.defineProperties(VignetteFilter.prototype, {
    iMouse: {
        get: function () {
            return this.uniforms.iMouse;
        },
        set: function (value) {
            this.uniforms.iMouse = value;
        }
    },

    iResolution: {
        get: function () {
            return this.uniforms.iResolution;
        },
        set: function(value) {
            this.uniforms.iResolution = value;
        }
    }

});

},{}],11:[function(require,module,exports){
module.exports = {
    GlowFilter: require('./filters/glow/GlowFilter'),
    OutlineFilter: require('./filters/outline/OutlineFilter'),
    BulgePinchFilter: require('./filters/bulgepinch/BulgePinchFilter'),
    ColorReplaceFilter: require('./filters/colorreplace/ColorReplaceFilter'),
    SimpleLightmapFilter:
        require('./filters/simplelightmap/SimpleLightmapFilter'),
    RadialBlur: require('./filters/radialblur/RadialblurFilter'),
    RadialBlurMask: require('./filters/radialblurmask/RadialblurMaskFilter'),
    HashedBlur: require('./filters/hashedblur/HashedblurFilter'),
    LuminanceFilter: require('./filters/luminance/LuminanceFilter'),
    VignetteFilter: require('./filters/vignette/VignetteFilter')
};

for (var filter in module.exports) {
    PIXI.filters[filter] = module.exports[filter];
}

},{"./filters/bulgepinch/BulgePinchFilter":1,"./filters/colorreplace/ColorReplaceFilter":2,"./filters/glow/GlowFilter":3,"./filters/hashedblur/HashedblurFilter":4,"./filters/luminance/LuminanceFilter":5,"./filters/outline/OutlineFilter":6,"./filters/radialblur/RadialblurFilter":7,"./filters/radialblurmask/RadialblurMaskFilter":8,"./filters/simplelightmap/SimpleLightmapFilter":9,"./filters/vignette/VignetteFilter":10}]},{},[11])


//# sourceMappingURL=pixi-extra-filters.js.map
