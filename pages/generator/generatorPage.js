/**
 * Contains all the logic for the actual generator.
 */
define([
	"constants",
	"hbs!examplePiesTemplate",
	"hbs!generatorPageTemplate",
	"hbs!titleTab",
	"hbs!sizeTab",
	"hbs!dataTab",
	"hbs!labelsTab",
	"hbs!colorTab",
	"hbs!effectsTab",
	"hbs!eventsTab",
	"hbs!footerTab",
	"hbs!miscTab"
], function(C, examplePiesTemplate, generatorPageTemplate, titleTab, sizeTab, dataTab, labelsTab, colorTab, effectsTab,
			eventsTab, footerTab, miscTab) {
	"use strict";

	var _isCreated = false;

	// used for tracking the state of each field and knowing when to trigger a repaint of the pie chart
	var _previousTitle = null;
	var _previousSubtitle = null;
	var _previousFooterText = null;

	var _previousTitleColor = null;
	var _previousSubtitleColor = null;
	var _previousFooterColor = null;

	var _titleColorManuallyChanged = null;
	var _subtitleColorManuallyChanged = null;
	var _footerColorManuallyChanged = null;

	/**
	 * Our initialization function. Called on page load.
	 * @private
	 */
	var _init = function() {

		$("#generatorPage").html(generatorPageTemplate({
			examples: examplePiesTemplate({ examples: C.EXAMPLE_PIES })
		}));

		// always initialize the sidebar with whatever's in the selected example (always first item right now)
		_loadDemoPie(C.EXAMPLE_PIES[0]);

		// now fade in the three sections: nav, main content & footer row
		$("#generatorTabs,#mainContent,#footerRow").hide().removeClass("hidden").fadeIn(400);

		$("#exampleDropdown").on("click", "ul li a", function(e) {
			var index = parseInt($(e.target).data("index"), 10);
			_loadDemoPie(C.EXAMPLE_PIES[index]);
		});

		// focus on the title field, just to be nice
		$("#pieTitle").focus();
	};

	/**
	 * Our main event handler assignment function. Bit klutzy - it would be nice to update this for some sort of
	 * binding, but it's simple & will do for now.
	 * @private
	 */
	var _addTabEventHandlers = function() {

		// general event handlers used in multiple places
		$(".changeUpdateNoAnimation").on("change", _renderWithNoAnimation);
		$(".keyupUpdateNoAnumation").on("keyup", _onKeyupNumberFieldUpdateNoAnimation);

		// 1. Title tab
		$("#pieTitle").on("keyup", function() {
			if (_previousTitle !== this.value) {
				_renderWithNoAnimation();
				_previousTitle = this.value;
			}
		});
		$("#pieSubtitle").on("keyup", function() {
			if (_previousSubtitle !== this.value) {
				_renderWithNoAnimation();
				_previousSubtitle = this.value;
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

		// 5. Color tab
		$("#backgroundColorGroup").colorpicker();

		// 6. Effects tab
		$("#loadEffect").on("change", _renderWithAnimation);

		// Footer tab
		$("#footerText").on("keyup", function() {
			if (_previousFooterText !== this.value) {
				_renderWithNoAnimation();
				_previousFooterText = this.value;
			}
		});

		$("#footerColor").on("input", function() {
			var newValue = this.value;
			_titleColorManuallyChanged = true;
			if (_previousTitleColor !== newValue && newValue.length === 7) {
				_renderWithNoAnimation();
				_previousTitleColor = newValue;
			}
		});
		$("#footerColorGroup").colorpicker().on("changeColor", _onFooterColorChangeViaColorpicker);

	};

	// TODO refactor these
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

	var _onFooterColorChangeViaColorpicker = function(e) {
		var newValue = e.color.toHex();
		if (_previousFooterColor !== newValue && newValue.length === 7 && !_footerColorManuallyChanged) {
			_renderWithNoAnimation();
			_previousFooterColor = newValue;
		}
		_footerColorManuallyChanged = false;
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
			footer:  _getFooterTabData(),
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

	var _getFooterTabData = function() {
		return {
			text:     $("#footerText").val(),
			color:    $("#footerColor").val(),
			fontSize: $("#footerFontSize").val(),
			font:     $("#footerFont").val(),
			location: $("#footerLocation").val()
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

	var _loadDemoPie = function(pieConfiguration) {

		var config = pieConfiguration.config;

		// render the generator tabs
		$("#titleTab").html(titleTab({ config: config }));
		$("#sizeTab").html(sizeTab({ config: config }));
		$("#dataTab").html(dataTab({ config: config }));
		$("#labelsTab").html(labelsTab({ config: config }));
		$("#footerTab").html(footerTab({ config: config }));
		$("#colorTab").html(colorTab({ config: config }));
		$("#effectsTab").html(effectsTab({ config: config }));
		$("#eventsTab").html(eventsTab({ config: config }));
		$("#miscTab").html(miscTab({ config: config }));

		// log the state of various fields
		_previousTitle = config.header.title.text;
		_previousSubtitle = config.header.subtitle.text;
		_previousTitleColor = config.header.title.color;
		_previousSubtitleColor = config.header.subtitle.text;

		_previousFooterText = config.footer.text;

		// render the pie!
		_renderWithAnimation();

		// always add the event handlers. This is because the tabs are recreated every time this function is
		// called
		_addTabEventHandlers();
	};

	return {
		init: _init
	}
});