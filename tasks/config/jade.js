// tasks/config/jade.js
// --------------------------------
// handlebar task configuration.

module.exports = function(grunt) {

  // We use the grunt.config api's set method to configure an
  // object to the defined string. In this case the task
  // 'handlebars' will be configured based on the object below.
  grunt.config.set('jade', {
    dev: {
      // We will define which template files to inject
      // in tasks/pipeline.js

      files: {
        'assets/templates/Chat/chat.js': ['assets/js/private/components/Chat/**/*.jade']
      }
    }
  });

  // load npm module for jade.
  grunt.loadNpmTasks('grunt-contrib-jade');
};