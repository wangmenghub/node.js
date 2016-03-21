/**
 * Grunt文件
 * 作者: 卢培培
 * 日期: 2015-04-30
 * 技术参考: http://www.gruntjs.net
 */

module.exports = function (grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            build: {
                src: ['config.development.js', 'config.production.js']
            }
        },
        copy: {
            config: {
                src: [!process.env.NODE_ENV || process.env.NODE_ENV == 'development' ? 'config.development.js' : 'config.production.js'],
                dest: 'config.js'
            }

        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');

    grunt.registerTask('develop', 'Config your develop environment', ['copy:config']);
    grunt.registerTask('build', 'Only for deploy the project on server', ['copy:config', 'clean:build']);

};