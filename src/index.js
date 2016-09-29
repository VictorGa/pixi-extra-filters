module.exports = {
    GlowFilter: require('./filters/glow/GlowFilter'),
    OutlineFilter: require('./filters/outline/OutlineFilter'),
    BulgePinchFilter: require('./filters/bulgepinch/BulgePinchFilter'),
    ColorReplaceFilter: require('./filters/colorreplace/ColorReplaceFilter'),
    SimpleLightmapFilter:
        require('./filters/simplelightmap/SimpleLightmapFilter'),
    RadialBlur: require('./filters/radialblur/RadialblurFilter'),
    RadialBlurMask: require('./filters/radialblurmask/RadialblurMaskFilter'),
    HashedBlur: require('./filters/hashedblur/HashedblurFilter')
};

for (var filter in module.exports) {
    PIXI.filters[filter] = module.exports[filter];
}
