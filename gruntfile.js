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

	_includeInThisScope("website/grunt-templates/filePaths.js");
	_includeInThisScope("website/grunt-templates/env-specific-constants.js");


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
	var setEnv_Dev = function() {
		config.template.indexFile.options.data.C = _CONSTANTS.DEV;
		config.template.indexFile.options.data.D3PIE_VERSION = packageFile.version;
	};

	var setEnv_Prod = function() {
		config.template.indexFile.options.data.C = _CONSTANTS.PROD;
		config.template.indexFile.options.data.D3PIE_VERSION = packageFile.version;
	};

	var config = {
		clean: ["build"],

		template: {
			d3pieBundle: {
				options: { data: {} },
				files: {
					"d3pie/d3pie.js": ["d3pie-source/d3pie-source.js"]
				}
			},
			indexFile: {
				options: {
					data: {
						C: null,
						VERSION: "",
						SITE_CSS: "",
						CORE_JS: ""
					}
				},
				files: {
					"index.html": ["website/grunt-templates/template-index.html"]
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
				src: "d3pie/d3pie.js",
				dest: "d3pie/d3pie.min.js"
			},

			coreJS: {
				files: {
					"build/core-libs.min.js": [
						"website/libs/jquery.js",
						"website/libs/jquery-ui.js",
						"website/libs/jquery.slides.js",
						"website/libs/d3.min.js",
						"d3pie-source/_default-settings.js",
						"website/libs/modernizr.js",
						"website/libs/handlebars.prod.js",
						"d3pie/d3pie.js",
						"website/libs/bootstrap.min.js",
						"website/libs/bootstrap-colorpicker.js",
						"website/libs/three.js",
						"website/libs/prettify.js",
						"website/libs/require.js"
					]
				},
				options: {
					compress: true,
					mangle: {
						except: ["jQuery", "Backbone"]
					}
				}
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
					name: "core/appStart.js",
					out: "build/appStartBuild.js",
					baseUrl: "website/",
					mainConfigFile: "website/core/require.config.js"
				}
			}
		},

		md5: {
			coreCSS: {
				files: {
					"build/core.css": "build/core.css"
				},
				options: {
					encoding: null,
					keepBasename: true,
					keepExtension: true,
					after: function(fileChanges, options) {
						config.template.indexFile.options.data.SITE_CSS = fileChanges[0].newPath;
					}
				}
			},
			coreJS: {
				files: {
					"build/core-libs.min.js": "build/core-libs.min.js"
				},
				options: {
					encoding: null,
					keepBasename: true,
					keepExtension: true,
					after: function(fileChanges, options) {
						config.template.indexFile.options.data.CORE_JS = fileChanges[0].newPath;
					}
				}
			}
		}
	};

	grunt.initConfig(config);
	grunt.registerTask("createD3PieFiles", _createD3PieFiles);
	grunt.registerTask("setEnv_Dev", setEnv_Dev);
	grunt.registerTask("setEnv_Prod", setEnv_Prod);

	// the default task is to regenerate the d3pie.js and d3pie.min.js files based on the latest files in d3pie-source/
	grunt.registerTask("default", ["createD3PieFiles", "uglify:d3pie"]);

	// tasks for building the website. There are only 2 options: dev and prod
	grunt.registerTask("dev", [
		"setEnv_Dev",
		"template:indexFile"
	]);

	grunt.registerTask("prod", [
		"setEnv_Prod",   // set the build environment constants
		"clean",         // wipe out the build folder
		"cssmin",        // bundle the CSS into a single file
		"md5:coreCSS",   // rename the file to include it's file hash
		//"uglify:coreJS", // bundle the core JS
		//"md5:coreJS",    // rename the JS lib file
		"requirejs",     // run the requireJS task to bundle up everything into a single file
		"template:indexFile" // alright! Now re-generate the index file
	]);
};