require([
	"constants",
	"primaryTabs",
	"sidebar"
], function(C, primaryTabs, sidebar) {
	"use strict";

	primaryTabs.init();
	sidebar.init();

	// now fade in the three sections: nav, main content & footer row
	$("#primaryTabs,#mainContent, #footerRow").hide().removeClass("hidden").fadeIn(400);
});