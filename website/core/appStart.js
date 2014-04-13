require([
	"constants",
	"mediator",
	"utils",
	"pageHelper",
	"aboutPage",
	"generatorPage",
	"downloadPage",
	"howToUsePage",
	"documentationPage",
	"handlebarsHelpers"
], function(C, mediator, utils, pageHelper, aboutPage, generatorPage, downloadPage, howToUsePage, documentationPage) {
	"use strict";

	// initialize our pages
	aboutPage.init();
	generatorPage.init();
	downloadPage.init();
	howToUsePage.init();
	documentationPage.init();

	// load the appropriate page
	pageHelper.initPage();

	prettyPrint();
});