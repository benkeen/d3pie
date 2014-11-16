define([
	"constants",
	"mediator",
	"utils",
	"hbs!tooltipsTabTemplate"
], function(C, mediator, utils, tooltipsTabTemplate) {
	"use strict";

	var _MODULE_ID = "tooltipsTab";

	var _render = function(tabEl, config) {
		$(tabEl).html(tooltipsTabTemplate({
			config: config,
			backgroundOpacityDisplay: config.tooltips.styles.backgroundOpacity.toFixed(2)
		}));

		utils.addColorpicker("tooltipColor");
		utils.addColorpicker("tooltipBackgroundColor");

		$("#tooltipFadeInSpeed").on("input change", _onChangeFadeInSpeed);
		$("#tooltipBackgroundOpacity").on("input change", _onChangeBackgroundOpacity);
		$("#enableTooltips").on("change", _onToggleEnableTooltips);
	};

	var _onChangeFadeInSpeed = function(e) {
		$("#fadeInSpeedDisplayValue").html(e.target.value + " ms");
	};

	var _onChangeBackgroundOpacity = function(e) {
		var val = parseFloat(e.target.value);
		$("#backgroundOpacityDisplay").html(val.toFixed(2));
	};

	var _onToggleEnableTooltips = function(e) {
		if (e.target.checked) {
			$(".tooltipsSection").find("input,select").removeAttr("disabled");
		} else {
			$(".tooltipsSection").find("input,select").attr("disabled", "disabled");
		}
		mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.NO_ANIMATION);
	};

	var _getTabData = function() {
		return {
      enabled: $("#enableTooltips")[0].checked,
      type: "placeholder",
      string: $("#tooltip").val(),
      styles: {
	      fadeInSpeed: parseInt($("#tooltipFadeInSpeed").val(), 10),
	      backgroundColor: $("#tooltipBackgroundColor").val(),
	      backgroundOpacity: parseFloat($("#tooltipBackgroundOpacity").val()),
	      color: $("#tooltipColor").val(),
	      borderRadius: parseInt($("#tooltipBorderRadius").val(), 10),
	      font: $("#tooltipFont").val(),
	      fontSize: parseInt($("#tooltipFontSize").val(), 10),
	      padding: parseInt($("#tooltipPadding").val(), 10)
      }
    };
	};


	mediator.register(_MODULE_ID);

	return {
		render: _render,
		getTabData: _getTabData
	};
});
