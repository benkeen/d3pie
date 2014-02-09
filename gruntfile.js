module.exports = function(grunt) {
	"use strict";

	var fs = require("fs");

	var _createD3PieFiles = function() {
		config.template.options.data.core = fs.readFileSync("d3pie-source/core.js", 'utf8');
		config.template.options.data.defaultSettings = fs.readFileSync("d3pie-source/defaultSettings.js", 'utf8');
		config.template.options.data.helpers = fs.readFileSync("d3pie-source/helpers.js", 'utf8');
		config.template.options.data.labels = fs.readFileSync("d3pie-source/labels.js", 'utf8');
		config.template.options.data.math = fs.readFileSync("d3pie-source/math.js", 'utf8');
		config.template.options.data.segments = fs.readFileSync("d3pie-source/segments.js", 'utf8');
		config.template.options.data.validate = fs.readFileSync("d3pie-source/validate.js", 'utf8');

		grunt.task.run("template");
	};


	var config = {
		template: {
			options: {
				data: {}
			},
			bundle: {
				files: {
					'd3pie/jquery.d3pie.js': ['d3pie-source/source-template.js']
				}
			}
		}
	};

	grunt.initConfig(config);
	grunt.loadNpmTasks('grunt-template');

	grunt.registerTask('createD3PieFiles', _createD3PieFiles);
	grunt.registerTask('default', ['createD3PieFiles']);
};