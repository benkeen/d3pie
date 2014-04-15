require([
	"constants",
	"mediator",
	"utils",
	"pageHelper",
	"aboutPage",
	"generatorPage",
	"downloadPage",

	"helpPage",
	"quickStartPage",
	"documentationPage",
	"examplesPage",

	"handlebarsHelpers"
], function(C, mediator, utils, pageHelper, aboutPage, generatorPage, downloadPage, helpPage, quickStartPage,
			documentationPage, examplesPage) {
	"use strict";

	// initialize our pages
	aboutPage.init();
	generatorPage.init();
	downloadPage.init();

	helpPage.init();
	quickStartPage.init();
	documentationPage.init();
	examplesPage.init();

	// load the appropriate page
	pageHelper.initPage();

	prettyPrint();
});