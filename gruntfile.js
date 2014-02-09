module.exports = function(grunt) {
	"use strict";

	// load what we need
	grunt.loadNpmTasks('grunt-template');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');


	var _createD3PieFiles = function() {
		var fs = require("fs");

		config.template.options.data.core = fs.readFileSync("d3pie-source/core.js", 'utf8');
		config.template.options.data.defaultSettings = fs.readFileSync("d3pie-source/default-settings.js", 'utf8');
		config.template.options.data.helpers = fs.readFileSync("d3pie-source/helpers.js", 'utf8');
		config.template.options.data.labels = fs.readFileSync("d3pie-source/labels.js", 'utf8');
		config.template.options.data.math = fs.readFileSync("d3pie-source/math.js", 'utf8');
		config.template.options.data.segments = fs.readFileSync("d3pie-source/segments.js", 'utf8');
		config.template.options.data.text = fs.readFileSync("d3pie-source/text.js", 'utf8');
		config.template.options.data.validate = fs.readFileSync("d3pie-source/validate.js", 'utf8');

		grunt.task.run("template");
	};


	var config = {
		template: {
			options: { data: {} },
			bundle: {
				files: {
					'd3pie/jquery.d3pie.js': ['d3pie-source/source-template.js']
				}
			}
		},
		watch: {
			scripts: {
				files: "d3pie-source/*.js",
				tasks: ["createD3PieFiles"]
			}
		},
		uglify: {
			d3pie: {
				src: 'd3pie/jquery.d3pie.js',
				dest: 'd3pie/jquery.d3pie.min.js'
			}
		}
	};

	grunt.initConfig(config);

	grunt.registerTask('createD3PieFiles', _createD3PieFiles);
	grunt.registerTask('default', ['createD3PieFiles']);
	grunt.registerTask('dev', ['createD3PieFiles', 'uglify:d3pie']);
};