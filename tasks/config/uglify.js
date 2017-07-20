/**
 * `uglify`
 *
 * ---------------------------------------------------------------
 *
 * Minify client-side JavaScript files using UglifyJS.
 *
 * For usage docs see:
 *   https://github.com/gruntjs/grunt-contrib-uglify
 *
 */
module.exports = function(grunt) {

  grunt.config.set('uglify', {
    dist: {
      src: ['.tmp/public/concat/production.js'],
      dest: '.tmp/public/min/production.min.js'
    },
  	distPrivate: {
  		src: ['.tmp/public/concat/productionPrivate.js'],
  		dest: '.tmp/public/min/productionPrivate.min.js'
  	}
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
};
