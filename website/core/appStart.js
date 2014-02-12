require([
	"constants",
	"mediator",
	"utils",
	"aboutPage",
	"generatorPage",
	"downloadPage",
	"documentationPage",
	"handlebarsHelpers"
], function(C, mediator, utils, aboutPage, generatorPage, downloadPage, documentationPage) {
	"use strict";

	// initialize our pages
	aboutPage.init();
	generatorPage.init();
	downloadPage.init();
	documentationPage.init();

	// select the default one (for local dev work, really)
	utils.selectPage("about");
});