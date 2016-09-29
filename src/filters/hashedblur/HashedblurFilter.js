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
function HashedblurFilter(iResolution, iMouse) {
    PIXI.Filter.call(this,
        // vertex shader
        // vertex shader
        glslify('./hashedblur.vert'),
        // fragment shader
        glslify('./hashedblur.frag'),
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
