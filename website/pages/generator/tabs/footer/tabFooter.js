define([
	"constants",
	"mediator",
	"hbs!footerTabTemplate"
], function(C, mediator, footerTabTemplate) {
	"use strict";

	var _MODULE_ID = "footerTab";

	// used for tracking the state of each field and knowing when to trigger a repaint of the pie chart
	var _previousFooterText = null;
	var _previousFooterColor = null;
	var _footerColorManuallyChanged = null;


	var _render = function(config) {
		$("#footerTab").html(footerTabTemplate({ config: config }));

		$("#footerText").on("keyup", function() {
			if (_previousFooterText !== this.value) {
				mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.NO_ANIMATION);
				_previousFooterText = this.value;
			}
		});

		var $footerColor = $("#footerColor");
		$footerColor.on("input", function() {
			var newValue = this.value;
			_footerColorManuallyChanged = true;
			if (_previousTitleColor !== newValue && newValue.length === 7) {
				mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.NO_ANIMATION);
				_previousTitleColor = newValue;
			}
		});
		$footerColor.on("focus", function() {
			$("#footerColorGroup").colorpicker("show");
		});
		$("#footerColorGroup").colorpicker().on("changeColor", _onFooterColorChangeViaColorpicker);
	};

	var _onFooterColorChangeViaColorpicker = function(e) {
		var newValue = e.color.toHex();
		if (_previousFooterColor !== newValue && newValue.length === 7 && !_footerColorManuallyChanged) {
			mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.NO_ANIMATION);
			_previousFooterColor = newValue;
		}
		_footerColorManuallyChanged = false;
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