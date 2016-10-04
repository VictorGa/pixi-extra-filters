var glslify  = require('glslify');

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
        glslify('./vignette.vert'),
        // fragment shader
        glslify('./vignette.frag'),
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
