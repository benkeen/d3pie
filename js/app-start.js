require([
	"constants",
	"primaryTabs",
	"hbs!sidebarTemplate"
], function(C, primaryTabs, sidebarTemplate) {

	primaryTabs.init();

	$("#sidebar").html(sidebarTemplate());

});