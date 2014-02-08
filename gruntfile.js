module.exports = function(grunt) {
	"use strict";

	var config = {
		includes: {
			files: {
				options: {
					debug: true,
					template: "d3pie-source/gruntWrapper.js",
					filenameSuffix: "js",
					includePath: "d3pie-source"
				},
				files: {
//					src: "d3pie-source/*",
					dest: "d3pie/jquery.d3pie.js"
				}
			}
		}
	};

	grunt.initConfig(config);
	grunt.loadNpmTasks('grunt-includes');


	grunt.registerTask('default', ['includes']);
};