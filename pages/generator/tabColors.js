define([
	"constants",
	"mediator",
	"hbs!colorsTabTemplate"
], function(C, mediator, colorsTabTemplate) {
	"use strict";

	var _MODULE_ID = "colorsTab";
	var _previousBackgroundColor = null;
	var _backgroundColorManuallyChanged = null;


	var _render = function(config) {
		$("#colorsTab").html(colorsTabTemplate({ config: config }));

		$("#deleteColorZone").sortable({
			connectWith: "#segmentColors",
			over: function() {
				console.log("....");
			}
		});

		$("#addColorLink").on("click", function(e) {
			e.preventDefault();
		});

		$("#backgroundColorGroup").colorpicker().on("changeColor", _onBackgroundColorChangeViaColorPicker);
		$("#segmentColors").sortable({
			handle: ".handle",
			connectWith: "#deleteColorZone",
			update: function() {
				mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.NO_ANIMATION);
			}
		});
		$("input[name=backgroundColor]").on("change", function() {
			console.log("...")
			mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.NO_ANIMATION);
		});

	};

	var _onBackgroundColorChangeViaColorPicker = function(e) {
		var newValue = e.color.toHex();
		if (_previousBackgroundColor !== newValue && newValue.length === 7 && !_backgroundColorManuallyChanged) {
			$("#backgroundColor2")[0].checked = true;
			mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.NO_ANIMATION);
			_previousBackgroundColor = newValue;
		}
		_backgroundColorManuallyChanged = false;
	};

	var _getTabData = function() {
		var colors = [];

		var colorElements = $("#segmentColors").find("span.color");
		for (var i=0; i<colorElements.length; i++) {
			colors.push(_rgb2hex($(colorElements[i]).css("background-color")));
		}

		var backgroundColor = null;
		var selectedBackgroundColorType = $("input[name=backgroundColor]:checked").val();
		console.log("!", selectedBackgroundColorType);

		if (selectedBackgroundColorType === "solid") {
			backgroundColor = $("#backgroundColor").val();
		}

		return {
			pieInnerRadius: $("#pieInnerRadius").val() + "%", // ???
			backgroundColor: backgroundColor,
			colors: colors
		};
	};



	var _rgb2hex = function(rgb) {
		function hex(x) {
			return ("0" + parseInt(x).toString(16)).slice(-2);
		}
		if (rgb.search("rgb") == -1) {
			return rgb;
		} else {
			rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
			return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
		}
	}


	mediator.register(_MODULE_ID);

	return {
		render: _render,
		getTabData: _getTabData
	};
});