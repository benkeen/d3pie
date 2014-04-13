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

	// select the default one (for local dev work, really)
	pageHelper.initPage();

	$(function() {
		$("#aboutPageSlides").slidesjs({
			width: 940,
			height: 320,
			navigation: true
		});
	});

	prettyPrint();
});