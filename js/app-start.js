require([
	"constants",
	"hbs!sidebarTemplate"
], function(C, sidebarTemplate) {


	$("#sidebar").html(sidebarTemplate());

});