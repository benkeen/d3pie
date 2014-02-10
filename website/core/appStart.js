require([
	"constants",
	"mediator",
	"utils",
	"pageHelper",
	"aboutPage",
	"generatorPage",
	"downloadPage",
	"documentationPage",
	"handlebarsHelpers"
], function(C, mediator, utils, pageHelper, aboutPage, generatorPage, downloadPage, documentationPage) {
	"use strict";

	// initialize our pages
	aboutPage.init();
	generatorPage.init();
	downloadPage.init();
	documentationPage.init();

	// select the default one (for local dev work, really)
	pageHelper.selectPage("about");
});