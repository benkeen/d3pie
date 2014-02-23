define([
	"constants",
	"mediator",
	"utils",
	"hbs!footerTabTemplate"
], function(C, mediator, utils, footerTabTemplate) {
	"use strict";

	var _MODULE_ID = "footerTab";
	var _previousFooterText = null;

	var _render = function(tabEl, config) {
		$(tabEl).html(footerTabTemplate({ config: config }));

		$("#footerText").on("keyup", function() {
			if (_previousFooterText !== this.value) {
				mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.NO_ANIMATION);
				_previousFooterText = this.value;
			}
		});

		utils.addColorpicker("footerColor");
	};


	var _getTabData = function() {
		return {
			text:     $("#footerText").val(),
			color:    $("#footerColor").val(),
			fontSize: $("#footerFontSize").val(),
			font:     $("#footerFont").val(),
			location: $("#footerLocation").val()
		};
	};

	mediator.register(_MODULE_ID);

	return {
		render: _render,
		getTabData: _getTabData
	};
});