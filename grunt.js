module.exports = function (grunt) {
    grunt.initConfig({
        jasmine: {
            src: 'modules/**/*.js'
        }
    });

    grunt.loadNpmTasks('grunt-jasmine-runner');

    grunt.registerTask('default', 'jasmine');
};