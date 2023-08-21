const Encore = require('@symfony/webpack-encore');

// Manually configure the runtime environment if not already configured yet by the "encore" command.
// It's useful when you use tools that rely on webpack.config.js file.
if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}

Encore
    .setOutputPath('public/build/')
    .setPublicPath('/build')
    .addEntry('app', './assets/app.js')
    .addEntry('training', './assets/training.js')
    .enableSingleRuntimeChunk()
    .cleanupOutputBeforeBuild()
    .enableBuildNotifications()
    .enableSourceMaps(!Encore.isProduction())
    .enableVersioning(Encore.isProduction())
    .configureBabelPresetEnv((config) => {
        config.useBuiltIns = 'usage';
        config.corejs = 3;
    }) 

    .configureBabel(function(babelConfig) {
        // add additional presets
    }, {
        // node_modules is not processed through Babel by default
        // but you can allow some specific modules to be processed
        includeNodeModules: ['vue-select', 'axios', 'bootstrap-vue'],
    })

    .enableVueLoader(() => {}, {
        useJsx: true
    })
    .enablePostCssLoader()
    .enableSassLoader(function (options) {}, {
        resolveUrlLoader: false
    })
;

module.exports = Encore.getWebpackConfig();
