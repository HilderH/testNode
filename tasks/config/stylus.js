module.exports = function(grunt){

    grunt.config.set('stylus', {
        dev: {
            files: [{
                expand: true,
                cwd: 'assets/styles/',
                src: ['style.styl'],
                dest: '.tmp/public/styles/',
                ext: '.css'
            }]
        }
    });

    grunt.loadNpmTasks('grunt-contrib-stylus');

}