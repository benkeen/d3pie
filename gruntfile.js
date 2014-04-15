module.exports = function(grunt) {
	"use strict";

	var fs = require('fs');
	var vm = require('vm');
	var _includeInThisScope = function (path) {
		var code = fs.readFileSync(path);
		vm.runInThisContext(code, path);
	}.bind(this);
	var packageFile = grunt.file.readJSON("package.json");

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-template');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-requirejs');
	grunt.loadNpmTasks('grunt-md5');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-handlebars');


	_includeInThisScope("grunt-templates/filePaths.js");
	_includeInThisScope("grunt-templates/env-specific-constants.js");


	var _createD3PieFiles = function() {
		var fs = require("fs");
		config.template.d3pieBundle.options.data = {
			_defaultSettings: fs.readFileSync("d3pie-source/_default-settings.js", 'utf8'),
			_helpers:         fs.readFileSync("d3pie-source/_helpers.js", 'utf8'),
			_labels:          fs.readFileSync("d3pie-source/_labels.js", 'utf8'),
			_math:            fs.readFileSync("d3pie-source/_math.js", 'utf8'),
			_segments:        fs.readFileSync("d3pie-source/_segments.js", 'utf8'),
			_text:            fs.readFileSync("d3pie-source/_text.js", 'utf8'),
			_validate:        fs.readFileSync("d3pie-source/_validate.js", 'utf8')
		};
		grunt.task.run("template:d3pieBundle");
	};

	/**
	 * The first step of the build process. This sets various settings in the main grunt config for the current build environment.
	 * These govern how the subsequent tasks behave.
	 */
	var buildDev = function() {
		config.template.indexFile.options.data.C = _CONSTANTS.DEV;
		config.template.indexFile.options.data.D3PIE_VERSION = packageFile.version;
		grunt.task.run("template:indexFile");
	};

	var buildProd = function() {
		config.template.indexFile.options.data.C = _CONSTANTS.DEV;
		grunt.task.run("requirejs");
	};

	var config = {
		clean: ["build"],

		template: {
			d3pieBundle: {
				options: { data: {} },
				files: {
					'd3pie/d3pie.js': ['d3pie-source/d3pie-source.js']
				}
			},
			indexFile: {
				options: {
					data: {
						C: null,
						VERSION: "",
						componentList: null
					}
				},
				files: {
					'index.html': ['grunt-templates/template-index.html']
				}
			}

			//'core/require.config.js':          ['source-templates/template-require.config.js']

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
		},

		handlebars: {
			compile: {
				options: {
					amd: true,
					namespace: false
				},
				files: {} // populated by md5 task
			}
		},

		cssmin: {
			target: {
				files: {
					'build/core.css': [
						'website/css/site.css',
						'website/css/bootstrap.css',
						'website/css/bootstrap-colorpicker.css',
						'website/css/prettify.css',
						'website/css/slides.css'
					]
				}
			}
		},
		requirejs: {
			compile: {
				options: {
					name: "core/appStart",
					baseUrl: "website/",
					mainConfigFile: "website/core/require.config.js",
					out: "build/appStart.js"
				}
			}
		},

		md5: {

		}
	};

	grunt.initConfig(config);
	grunt.registerTask("createD3PieFiles", _createD3PieFiles);

	// the default task is to regenerate the d3pie.js and d3pie.min.js files based on the latest files in d3pie-source/
	grunt.registerTask("default", ["createD3PieFiles", "uglify:d3pie"]);

	// tasks for building the website. There are only 2 options: dev and prod
	grunt.registerTask("dev", [

	]);
	grunt.registerTask("prod", [
		"clean",

		// bundle the CSS
		"cssmin",

		// rename
		"md5:css"
	]);
};