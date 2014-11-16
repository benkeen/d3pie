define([
	"constants",
	"mediator",
	"utils",
	"hbs!tooltipsTabTemplate"
], function(C, mediator, utils, tooltipsTabTemplate) {
	"use strict";

	var _MODULE_ID = "labelsTab";

	var _render = function(tabEl, config) {
		$(tabEl).html(tooltipsTabTemplate({
			config: config
		}));

		utils.addColorpicker("tooltipColor");
		utils.addColorpicker("tooltipBackgroundColor");

		$("#tooltipFadeInSpeed").on("input change", _onChangeFadeInSpeed);
	};

	var _onChangeFadeInSpeed = function (e) {
		$("#fadeInSpeedDisplayValue").html(e.target.value + " ms");
	};

	var _getTabData = function() {
		return {
      tooltips: {
        enabled: $("#showLabelLines")[0].checked,
	      type: "placeholder",
	      string: $("#tooltip").val(),
	      styles: {
		      fadeInSpeed: parseInt($("#tooltipFadeInSpeed").val(), 10),
		      backgroundColor: $("#tooltipBackgroundColor").val(),
		      backgroundOpacity: parseFloat($("#tooltipBackgroundOpacity").val()),
		      color: $("#tooltipColor").val(),
		      borderRadius: parseInt($("#tooltipBorderRadius").val(), 10),
		      font: $("#tooltipFont").val(),
		      fontSize: $("#tooltipFontSize").val(),
		      padding: $("#tooltipPadding").val()
	      }
      }
		};
	};


	mediator.register(_MODULE_ID);

	return {
		render: _render,
		getTabData: _getTabData
	};
});
