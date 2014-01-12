/**
 * Contains all the logic for the actual generator.
 */
define([
	"constants",
	"pieChartGenerator",
	"hbs!titleTab",
	"hbs!sizeTab",
	"hbs!dataTab",
	"hbs!labelsTab",
	"hbs!stylesTab",
	"hbs!effectsTab",
	"hbs!eventsTab",
	"hbs!miscTab"
], function(C, pieChartGenerator, titleTab, sizeTab, dataTab, labelsTab, stylesTab, effectsTab, eventsTab, miscTab) {
	"use strict";

	// stores the current configuration of the pie chart. It's updated onload, and whenever the user
	// chooses a different example, or changes an individual setting. It's what's used to pass to d3pie.js
	// to actually render the
	var _currentPieSettings = {};
	var _isCreated = false;

	// used for tracking the state of each field and knowing when to trigger a repaint of the pie chart
	var _previousTitle = null;
	var _previousTitleColor = null;
	var _previousSubtitleColor = null;
	var _titleColorManuallyChanged = null;
	var _subtitleColorManuallyChanged = null;

	/**
	 * Our initialization function. Called on page load.
	 * @private
	 */
	var _init = function() {

		// always initialize the sidebar with whatever's in the selected example (always first item right now)
		_currentPieSettings = C.EXAMPLE_PIES[2].config;

		// render the generator tabs
		$("#titleTab").html(titleTab({ config: _currentPieSettings }));
		$("#sizeTab").html(sizeTab({ config: _currentPieSettings }));
		$("#dataTab").html(dataTab({ config: _currentPieSettings }));
		$("#labelsTab").html(labelsTab({ config: _currentPieSettings }));
		$("#stylesTab").html(stylesTab({ config: _currentPieSettings }));
		$("#effectsTab").html(effectsTab({ config: _currentPieSettings }));
		$("#eventsTab").html(eventsTab({ config: _currentPieSettings }));
		$("#miscTab").html(miscTab({ config: _currentPieSettings }));

		// log the state of various fields
		_previousTitle = _currentPieSettings.header.title.text;
		_previousTitleColor = _currentPieSettings.header.title.color;
		_previousSubtitleColor = _currentPieSettings.header.subtitle.text;

		_addEventHandlers();

		// render the pie!
		_renderWithAnimation()

		// focus on the title field, just to be nice
		setTimeout(function() { $("#pieTitle").focus(); }, 100);
	};

	/**
	 * Our main event handler assignment function. Bit klutzy - it would be nice to update this for some sort of
	 * binding, but it's simple & will do for now.
	 * @private
	 */
	var _addEventHandlers = function() {

		// general event handlers used in multiple places
		$(".changeUpdateNoAnimation").on("change", _renderWithNoAnimation);


		// 1. Title tab
		$("#pieTitle").on("keyup", function() {
			if (_previousTitle !== this.value) {
				_renderWithNoAnimation();
				_previousTitle = this.value;
			}
		});

		// bit confusing, but necessary. The color can be changed via two methods: by editing the input field
		// or by selecting a color via the colorpicker. The former still triggers a "changed" event on the colorpicker
		// so we need to tell it that the user just did it manually. That prevents unnecessary re-draws.
		$("#titleColor").on("input", function() {
			var newValue = this.value;
			_titleColorManuallyChanged = true;
			if (_previousTitleColor !== newValue && newValue.length === 7) {
				_renderWithNoAnimation();
				_previousTitleColor = newValue;
			}
		});
		$("#titleColorGroup").colorpicker().on("changeColor", _onTitleColorChangeViaColorpicker);

		$("#subtitleColor").on("input", function() {
			var newValue = this.value;
			_subtitleColorManuallyChanged = true;
			if (_previousSubtitleColor !== newValue && newValue.length === 7) {
				_renderWithNoAnimation();
				_previousSubtitleColor = newValue;
			}
		});
		$("#subtitleColorGroup").colorpicker().on("changeColor", _onSubtitleColorChangeViaColorpicker);


		// TODO this can be generalized
		$("#titleFontSize,#subtitleFontSize").on("keyup", _onKeyupNumberFieldUpdateNoAnimation);

		// 2. size tab
		$("#pieInnerRadius").on("change", _onChangeInnerRadius);
		$("#pieOuterRadius").on("change", _onChangeOuterRadius);

		// 4. labels tab
		$("#labelColorGroup").colorpicker();
		$("#labelPercentageColorGroup").colorpicker();
		$("#labelSegmentValueColor").colorpicker();

		$("#labelFormatExample").on("change", function() {
			$("#labelFormat").val(this.value);
		});

		// 5. Styles tab
		$("#backgroundColorGroup").colorpicker();

		// 6. Effects tab
		$("#loadEffect").on("change", _renderWithAnimation);
	};

	var _onTitleColorChangeViaColorpicker = function(e) {
		var newValue = e.color.toHex();
		if (_previousTitleColor !== newValue && newValue.length === 7 && !_titleColorManuallyChanged) {
			_renderWithNoAnimation();
			_previousTitleColor = newValue;
		}
		_titleColorManuallyChanged = false;
	};

	var _onSubtitleColorChangeViaColorpicker = function(e) {
		var newValue = e.color.toHex();
		if (_previousSubtitleColor !== newValue && newValue.length === 7 && !_subtitleColorManuallyChanged) {
			_renderWithNoAnimation();
			_previousSubtitleColor = newValue;
		}
		_subtitleColorManuallyChanged = false;
	};

	var _onChangeInnerRadius = function(e) {
		$("#pieInnerRadiusDisplayValue").html(e.target.value + "%");
		_renderWithNoAnimation();
	};

	var _onChangeOuterRadius = function(e) {
		$("#pieOuterRadiusDisplayValue").html(e.target.value + "%");
		_renderWithNoAnimation();
	};

	var _onKeyupNumberFieldUpdateNoAnimation = function(e) {
		var val = e.target.value;

		// check it's not empty and contains only numbers
		if (/[^\d]/.test(val) || val === "") {
			$(e.target).addClass("hasError");
			return;
		}

		$(e.target).removeClass("hasError");
		_renderWithNoAnimation();
	};

	var _renderWithNoAnimation = function() {
		_renderPie(false, _getConfigObject());
	};

	var _renderWithAnimation = function() {
		_renderPie(true, _getConfigObject());
	};

	var _renderPie = function(includeStartAnimation, config) {

		// if we don't want to include the start animation, just override the values in the UI. This is useful for
		// automatically showing the user's latest changes to the pie settings and not having to see the animation
		// each and every time
		if (!includeStartAnimation) {
			config.effects.loadEffect = "none";
		}

		if (_isCreated) {
			$("#generatorPieChart").data("d3pie").destroy();
		}

		$("#generatorPieChart").d3pie(config);
		_isCreated = true;
	};

	/**
	 * Parses the generator fields and get the latest values.
	 * @private
	 */
	var _getConfigObject = function() {
		return {
			header:  _getTitleTabData(),
			size:    _getSizeData(),
			data:    _getDataTabData(),
			labels:  _getLabelsTabData(),
			styles:  _getStylesTabData(),
			effects: _getEffectsTabData(),
			misc:    _getMiscTabData()
		};
	};

	var _getTitleTabData = function() {
		return {
			title: {
				text:     $("#pieTitle").val(),
				color:    $("#titleColor").val(),
				fontSize: $("#titleFontSize").val() + "px",
				font:     $("#titleFont").val()
			},
			subtitle: {
				text:     $("#pieSubtitle").val(),
				color:    $("#subtitleColor").val(),
				fontSize: $("#subtitleFontSize").val() + "px",
				font:     $("#subtitleFont").val()
			},
			location: $("#titleLocation").val()
		};
	};

	var _getSizeData = function() {
		return {
			canvasWidth:    $("#canvasWidth").val(),
			canvasHeight:   $("#canvasHeight").val(),
			pieInnerRadius: $("#pieInnerRadius").val() + "%",
			pieOuterRadius: $("#pieOuterRadius").val() + "%"
		};
	};

	var _getDataTabData = function() {
		var data = [];
		var trs = $("#data-table tbody tr");
		for (var i=0; i<trs.length; i++) {
			data.push({
				label:   $(trs[i]).find(".dataLabel").val(),
				value:   parseInt($(trs[i]).find(".dataValue").val(), 10), // TODO - need validation
				tooltip: $(trs[i]).find(".dataTooltip").val()
			})
		}
		return data;
	};

	var _getLabelsTabData = function() {
		return {
			location: $("#labelLocation").val(),
			format:   $("#labelFormat").val(),
			enableTooltips: $("#enableTooltips")[0].checked,
			labelColor: $("#labelColor").val(),
			labelPercentageColor: $("#labelPercentageColor").val(),
			labelSegmentValueColor: $("#labelSegmentValueColor").val()
		};
	};

	var _getStylesTabData = function() {
		return {
			pieInnerRadius: $("#pieInnerRadius").val() + "%",
			backgroundColor: null,
			colors: ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00", "#635222", "#009900", "#003300"]
		};
	};

	var _getEffectsTabData = function() {
		return {
			loadEffect: $("#loadEffect").val(),
			loadEffectSpeed: $("#loadEffectSpeed").val(),
			highlightSegmentOnMouseover: $("#highlightSegmentOnMouseover")[0].checked,
			pullOutSegmentOnClick: $("#pullOutSegmentOnClick")[0].checked,
			labelFadeInTime: 400
		};
	};

	var _getMiscTabData = function() {
		return {

		};
	};

	return {
		init: _init
	}
});