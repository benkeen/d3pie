/**
 * Custom module for requireJS, to allow intelligent loading of uncompiled/pre-compliled Handlebar
 * templates. This relies on grunt to update the require.config.js paths for all Handlebar files to link
 * to the precompiled JS, minified version.
 */
define([
	"constants",
	"handlebars"
], function(C, Handlebars) {

	var loadResource = function(resourceName, parentRequire, callback, config) {
		var isPrecompiled = C.MINIMIZED;

		// if this is PROD, the handlebar templates have already been precompiled and are available
		// in AMD format, in the same folder with a "hbs-" prefix;
		var component = "text!" + resourceName;
		if (isPrecompiled) {
			component = resourceName;
		}

		parentRequire([component], function(template) {
			if (!isPrecompiled) {
				template = Handlebars.compile(template);
			}
			callback(template);
		});
	};

	return {
		load: loadResource
	};
});