module.exports = function(grunt) {
	"use strict";

	var ENVIRONMENTS = {
		DEV: "DEV",
		PROD: "PROD"
	};

	var fs = require('fs');
	var vm = require('vm');
	var _includeInThisScope = function (path) {
		var code = fs.readFileSync(path);
		vm.runInThisContext(code, path);
	}.bind(this);


	// load what we need
	grunt.loadNpmTasks('grunt-template');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	_includeInThisScope("grunt-templates/filePaths.js");
	_includeInThisScope("grunt-templates/env-specific-constants.js");


	var _createD3PieFiles = function() {
		var fs = require("fs");
		config.template.d3pieBundle.data = {
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
	var _setBuildEnvironment = function(env) {
		var packageFile = grunt.file.readJSON("package.json");

		config.template.indexFile.options.data.C = _CONSTANTS[env];
		config.template.indexFile.options.data.VERSION = packageFile.version;

		//config.template.recreateRequireConfig.options.data.C = ENV_CONSTANTS;
		//config.template.main.options.data.componentList = _getRequireConfigJSComponentList({ bundled: false });
	};

	var config = {
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
						MAIN_CSS_FILEPATH: "",
						CORE_LIBS_FILEPATH: "",
						componentList: null
					}
				},
				files: {
					'index.html':                      ['source-templates/template-index.html'],
					'core/require.config.js':          ['source-templates/template-require.config.js']
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
	grunt.registerTask('setBuildEnv_DEV', function() { _setBuildEnvironment(ENVIRONMENTS.DEV); });
	grunt.registerTask('setBuildEnv_PROD', function() { _setBuildEnvironment(ENVIRONMENTS.PROD); });
	grunt.registerTask('default', ['createD3PieFiles', 'uglify:d3pie']);
	grunt.registerTask('dev', ["setBuildEnv_DEV"]);
	grunt.registerTask('prod');
};