require([
	"constants",
	"mediator",
	"utils",
	"pageHelper",
	"aboutPage",
	"generatorPage",
	"downloadPage",

	"topLevelDocPage",
	"quickStartPage",
	"documentationPage",
	"examplesPage",

	"handlebarsHelpers"
], function(C, mediator, utils, pageHelper, aboutPage, generatorPage, downloadPage,
			topLevelDocPage, quickStartPage, documentationPage, examplesPage) {
	"use strict";

	// initialize our pages
	aboutPage.init();
	generatorPage.init();
	downloadPage.init();

	topLevelDocPage.init();
	quickStartPage.init();
	documentationPage.init();
	examplesPage.init();

	// load the appropriate page
	pageHelper.initPage();

	prettyPrint();
});