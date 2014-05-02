module.exports = function (grunt) {
    grunt.initConfig({
        jasmine: {
            pivotal: {
                src: 'modules/**/*.js'
            }
        },

        'docco_husky': {
            project_name: 'moloko',
            files: ['modules/**/*.js']
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-docco-husky');

    grunt.registerTask('default', ['jasmine', 'docco_husky']);
};