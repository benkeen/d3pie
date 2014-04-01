module.exports = function(grunt) {
	"use strict";

	// load what we need
	grunt.loadNpmTasks('grunt-template');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');


	var _createD3PieFiles = function() {
		var fs = require("fs");

		config.template.options.data._defaultSettings = fs.readFileSync("d3pie-source/_default-settings.js", 'utf8');
		config.template.options.data._helpers         = fs.readFileSync("d3pie-source/_helpers.js", 'utf8');
		config.template.options.data._labels          = fs.readFileSync("d3pie-source/_labels.js", 'utf8');
		config.template.options.data._math            = fs.readFileSync("d3pie-source/_math.js", 'utf8');
		config.template.options.data._segments        = fs.readFileSync("d3pie-source/_segments.js", 'utf8');
		config.template.options.data._text            = fs.readFileSync("d3pie-source/_text.js", 'utf8');
		config.template.options.data._validate        = fs.readFileSync("d3pie-source/_validate.js", 'utf8');

		grunt.task.run("template");
	};


	var config = {
		template: {
			options: { data: {} },
			bundle: {
				files: {
					'd3pie/d3pie.js': ['d3pie-source/d3pie-source.js']
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
				src: 'd3pie/d3pie.js',
				dest: 'd3pie/d3pie.min.js'
			}
		}
	};

	grunt.initConfig(config);

	grunt.registerTask('createD3PieFiles', _createD3PieFiles);
	grunt.registerTask('default', ['createD3PieFiles', 'uglify:d3pie']);
};