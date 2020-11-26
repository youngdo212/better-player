module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    svgstore: {
      options: {
        prefix: 'better-player-',
      },
      default: {
        files: {
          'dist/better-player.svg': ['src/icons/*.svg'],
        },
      },
    },
  });

  grunt.loadNpmTasks('grunt-svgstore');

  grunt.registerTask('default', ['svgstore']);
};
