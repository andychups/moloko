module.exports = function (grunt) {
    grunt.initConfig({
        jasmine: {
            pivotal: {
                src: 'modules/**/*.js'
    //            options: {
    //                specs: 'spec/*Spec.js',
    //                helpers: 'spec/*Helper.js'
    //            }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jasmine');

    grunt.registerTask('default', 'jasmine');
};