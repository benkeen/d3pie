module.exports = function(grunt) {
	"use strict";

	var fs = require("fs");
	var vm = require("vm");
	var _includeInThisScope = function (path) {
		var code = fs.readFileSync(path);
		vm.runInThisContext(code, path);
	}.bind(this);
	var packageFile = grunt.file.readJSON("package.json");

	grunt.loadNpmTasks("grunt-contrib-clean");
	grunt.loadNpmTasks("grunt-template");
	grunt.loadNpmTasks("grunt-contrib-watch");
	grunt.loadNpmTasks("grunt-contrib-uglify");
	grunt.loadNpmTasks("grunt-contrib-requirejs");
	grunt.loadNpmTasks("grunt-md5");
	grunt.loadNpmTasks("grunt-contrib-copy");
	grunt.loadNpmTasks("grunt-contrib-cssmin");
	grunt.loadNpmTasks("grunt-contrib-handlebars");
	grunt.loadNpmTasks('grunt-contrib-jshint');

	_includeInThisScope("website/grunt-templates/file-paths.js");
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
			_tooltips:        fs.readFileSync("d3pie-source/_tooltips.js", 'utf8'),
			_validate:        fs.readFileSync("d3pie-source/_validate.js", 'utf8')
		};
		grunt.task.run("template:d3pieBundle");
		grunt.task.run("uglify:d3pie");
	};

	/**
	 * The first step of the build process. This sets various settings in the main grunt config for the current build environment.
	 * These govern how the subsequent tasks behave.
	 */
	var setEnv_Dev = function() {
		config.template.indexFile.options.data.C = _CONSTANTS.DEV;
		config.template.indexFile.options.data.D3PIE_VERSION = packageFile.version;
		config.template.devRequireConfig.options.data.handlebarsLib = _CONSTANTS.DEV.HANDLEBARS_LIB;
		config.template.devRequireConfig.options.data.baseUrl = _CONSTANTS.DEV.BASE_URL;
		var lines = [];
		for (var i in _requireJSModulePaths) {
			var file = _requireJSModulePaths[i].replace(/\.js$/, "");
			lines.push('\t\t"' + i + '": "' + file + '"');
		}
		config.template.devRequireConfig.options.data.moduleStr = lines.join(",\n");
		config.template.constants.options.data.VERSION = packageFile.version;
		config.template.constants.options.data.MINIMIZED = _CONSTANTS.DEV.MINIMIZED;
		config.template.constants.options.data.DEBUG = _CONSTANTS.DEV.DEBUG;
	};

	var setEnv_Prod = function() {
		var info = _getHandlebarsFileMap();

		config.template.indexFile.options.data.C = _CONSTANTS.PROD;
		config.template.indexFile.options.data.D3PIE_VERSION = packageFile.version;
		config.template.prodRequireConfig.options.data.handlebarsLib = _CONSTANTS.PROD.HANDLEBARS_LIB;
		config.template.prodRequireConfig.options.data.baseUrl = _CONSTANTS.PROD.BASE_URL;
		config.template.prodRequireConfig.options.data.moduleStr = info.allModules;
		config.template.constants.options.data.VERSION = packageFile.version;
		config.template.constants.options.data.MINIMIZED = _CONSTANTS.PROD.MINIMIZED;
		config.template.constants.options.data.DEBUG = _CONSTANTS.PROD.DEBUG;
		config.handlebars.compile.files = info.handlebarsMap;
	};

	var _getHandlebarsFileMap = function() {
		var obj = {};
		var allModules = [];
		for (var i in _requireJSModulePaths) {
			var path = _requireJSModulePaths[i];

			if (/\.hbs$/.test(_requireJSModulePaths[i])) {
				var parts = _requireJSModulePaths[i].split("/");
				parts[parts.length - 1] = "hbs-" + parts[parts.length - 1].replace(/\.hbs$/, ".js");
				var hbsFileNameAndPath = parts.join("/");

				obj["build/" + hbsFileNameAndPath] = "website/" + path;

				var requireJSModuleName1 = "build/" + hbsFileNameAndPath.replace(/\.js$/, "");
				allModules.push('"' + i + '": "' + requireJSModuleName1 + '"');
			} else {
				var requireJSModuleName2 = "build/" + _requireJSModulePaths[i].replace(/\.js$/, "");
				allModules.push('"' + i + '": "' + requireJSModuleName2 + '"');
			}
		}

		return {
			handlebarsMap: obj,
			allModules: allModules.join(",\n")
		}
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
						CORE_JS: "",
						APP_START_FILE: ""
					}
				},
				files: {
					"index.html": ["website/grunt-templates/template-index.html"]
				}
			},
			devRequireConfig: {
				options: {
					data: { }
				},
				files: {
					"website/core/require.config.js": ["website/grunt-templates/template-require.config.js"]
				}
			},
			prodRequireConfig: {
				options: {
					data: { }
				},
				files: {
					"build/core/require.config.js": ["website/grunt-templates/template-require.config.js"]
				}
			},
			constants: {
				options: { data: {} },
				files: {
					"website/core/constants.js": ["website/grunt-templates/template-constants.js"]
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
				files: {
					"d3pie/d3pie.min.js": "d3pie/d3pie.js"
				},
				options: {
					banner: "/*!\n" +
						"* d3pie\n" +
						"* @author Ben Keen\n" +
						"* @version " + packageFile.version + "\n" +
						"* @date June 2014\n" +
						"* @repo http://github.com/benkeen/d3pie\n" +
						"*/\n"
				}
			},

			coreJS: {
				files: {
					"build/core-libs.min.js": [
						"website/libs/jquery.js",
						"website/libs/jquery-ui.js",
						"website/libs/jquery.slides.js",
						"d3pie-source/_default-settings.js",
						"website/libs/modernizr.js",
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
			},

			appStart: {
				files: {
					"build/core/appStart.js": ["build/core/appStart.js"]
				},
				options: {
					compress: true
				}
			}
		},

		handlebars: {
			compile: {
				options: {
					amd: true,
					namespace: false
				},
				files: {}
			}
		},

		cssmin: {
			target: {
				files: {
					'build/css/core.css': [
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
					name: "build/core/appStart.js",
					out: "build/core/appStartBuild.js",
					baseUrl: "./",
					mainConfigFile: "build/core/require.config.js"
				}
			}
		},

		md5: {
			coreCSS: {
				files: {
					"build/css/core.css": "build/css/core.css"
				},
				options: {
					encoding: null,
					keepBasename: true,
					keepExtension: true,
					after: function(fileChanges, options) {
						// store the new CSS filename in the index file template script
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
			},
			appStart: {
				files: {
					"build/core/appStartBuild.js": "build/core/appStartBuild.js"
				},
				options: {
					encoding: null,
					keepBasename: true,
					keepExtension: true,
					after: function(fileChanges, options) {
						config.template.indexFile.options.data.APP_START_FILE = fileChanges[0].newPath;
					}
				}
			}
		},

		copy: {
			core: {
				expand: true,
				cwd: "website",
				src: ['**'],
				dest: 'build/'
			}
		},
        jshint: {
            all: ['d3pie-source/*.js']
        }
	};

	grunt.initConfig(config);
	grunt.registerTask("createD3PieFiles", _createD3PieFiles);
	grunt.registerTask("setEnv_Dev", setEnv_Dev);
	grunt.registerTask("setEnv_Prod", setEnv_Prod);

	// the default task is to regenerate the d3pie.js and d3pie.min.js files based on the latest files in d3pie-source/
	grunt.registerTask("default", ["jshint","createD3PieFiles", "uglify:d3pie"]);

	// tasks for building the website. There are only 2 options: dev and prod
	grunt.registerTask("dev", [
    "jshint",
		"setEnv_Dev",
		"template:indexFile",
		"template:devRequireConfig",
		"template:constants"
	]);

	grunt.registerTask("prod", [
    "jshint",
		"setEnv_Prod", // set the build environment constants
		"clean",       // wipe out the build folder
		"template:constants", // create the constants file
		"cssmin",      // bundle the CSS into a single file
		"md5:coreCSS", // rename the file to include its file hash
		"uglify:coreJS", // bundle the core JS
		"md5:coreJS",   // rename the JS lib file

		// now copy EVERYTHING in the /website folder over to /build. We're about to do terrible things to it
		"copy:core",
		"handlebars",
		"template:prodRequireConfig",
		"uglify:appStart",
		"requirejs", // run the requireJS task to bundle up everything into a single file
		"md5:appStart",

		"template:indexFile" // alright! Now re-generate the index file
	]);
};
