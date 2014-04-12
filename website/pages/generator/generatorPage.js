/**
 * Contains all the logic for the actual generator.
 */
define([
	"constants",
	"mediator",
	"pageHelper",
	"startTab",
	"titleTab",
	"sizeTab",
	"dataTab",
	"labelsTab",
	"footerTab",
	"effectsTab",
	"eventsTab",
	"miscTab",
	"generateTab",
	"examplePies",
	"hbs!generatorPageTemplate"
], function(C, mediator, pageHelper, startTab, titleTab, sizeTab, dataTab, labelsTab, footerTab, effectsTab, eventsTab,
			miscTab, generateTab, EXAMPLE_PIES, generatorPageTemplate) {
	"use strict";

	var _MODULE_ID = "generatorPage";
	var _isCreated = false;
	var _demoD3Pie = null;
	var _tabs = [
		"generator-start", "generator-title", "generator-size", "generator-data", "generator-labels",
		"generator-footer", "generator-effects", "generator-events", "generator-misc", "generator-result"
	];
	var _currentTab = null;
	var _firstPageLoaded = false;
	var _firstPage;


	/**
	 * Our initialization function. Called on page load.
	 * @private
	 */
	var _init = function() {
		_addTabEventHandlers();

		var config = {
			hideMainContent: false
		};
		if (document.location.hash === "#generator-result") {
			config = {
				hideMainContent: true
			}
		}
		$("#generator").html(generatorPageTemplate(config));

		// now fade in the three sections: nav, main content & footer row
		$("#generatorTabs,#mainContent,#footerRow").hide().removeClass("hidden").fadeIn(400);

		// always initialize the sidebar with whatever's in the selected example (always first item right now)
		var index = pageHelper.getDemoPieChartIndex(EXAMPLE_PIES);
		_loadDemoPie(EXAMPLE_PIES[index]);

		// focus on the title field, just to be nice
		$("#pieTitle").focus();

		var subscriptions = {};
		subscriptions[C.EVENT.DEMO_PIE.LOAD]                  = _onRequestLoadDemoPie;
		subscriptions[C.EVENT.DEMO_PIE.RENDER.NO_ANIMATION]   = _renderWithNoAnimation;
		subscriptions[C.EVENT.DEMO_PIE.RENDER.WITH_ANIMATION] = _renderWithAnimation;
		subscriptions[C.EVENT.DEMO_PIE.RENDER.UPDATE_PROP]    = _updateProperty;
		subscriptions[C.EVENT.DEMO_PIE.SELECT_SEGMENT]        = _selectPieSegment;
		subscriptions[C.EVENT.PAGE.LOAD]                      = _onPageSelected;

		mediator.subscribe(_MODULE_ID, subscriptions);
	};

	/**
	 * Our main event handler assignment function. Bit klutzy - it would be nice to update this for some sort of
	 * binding, but it's simple & will do for now.
	 * @private
	 */
	var _addTabEventHandlers = function() {
		// general event handlers used in any old tab
		$(document).on("change", ".changeUpdateNoAnimation", _renderWithNoAnimation);
		$(document).on("keyup change", ".keyupUpdateNoAnimation", _onKeyupUpdateNoAnimation);
	};

	var _onKeyupUpdateNoAnimation = function(e) {
		var val = e.target.value;
		var isNumberField = $(e.target).hasClass("numbers");

		// check it's not empty and contains only numbers
		if (isNumberField) {
			if (/[^\d]/.test(val) || val === "") {
				$(e.target).addClass("hasError");
				return;
			}
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

	var _updateProperty = function(msg) {
		_demoD3Pie.updateProp(msg.data.prop, msg.data.value);
	};

	var _renderPie = function(includeStartAnimation, config) {

		// notify anyone that's interested that the data changed and we're going to do a re-render
		mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.DATA_CHANGE, {
			includeStartAnimation: includeStartAnimation,
			config: config
		});

		// if we don't want to include the start animation, just override the values in the UI. This is useful for
		// automatically showing the user's latest changes to the pie settings and not having to see the animation
		// each and every time
		if (!includeStartAnimation) {
			config.effects.load.effect = "none";
		}

		if (_isCreated) {
			_demoD3Pie.destroy();
		}

		_demoD3Pie = new d3pie("generatorPieChart", config);
		_isCreated = true;
		var height = parseInt(config.size.canvasHeight, 10) + 2;
		var width  = parseInt(config.size.canvasWidth, 10) + 2;
		$("#generatorPieChartPad, #generatorPieChart").css({
			width: width, // + 2 for padding
			height: height
		});
	};


	/**
	 * Parses the generator fields and get the latest values.
	 * @private
	 */
	var _getConfigObject = function() {
		return {
			header:    titleTab.getTabData(),
			footer:    footerTab.getTabData(),
			size:      sizeTab.getTabData(),
			data:      dataTab.getTabData(),
			labels:    labelsTab.getTabData(),
			effects:   effectsTab.getTabData(),
			callbacks: eventsTab.getTabData(),
			misc:      miscTab.getTabData()
		};
	};

	var _onRequestLoadDemoPie = function(msg) {
		_loadDemoPie(EXAMPLE_PIES[msg.data.index]);
	};

	var _loadDemoPie = function(pieConfiguration) {
		var config = pieConfiguration.config;

		mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.EXAMPLE_CHANGE, { config: config });

		// render the generator tabs
		startTab.render("#generator-start", config);
		titleTab.render("#generator-title", config);
		sizeTab.render("#generator-size", config, pieConfiguration.showCanvasOutline); // meh!
		dataTab.render("#generator-data", config);
		labelsTab.render("#generator-labels", config);
		footerTab.render("#generator-footer", config);
		effectsTab.render("#generator-effects", config);
		eventsTab.render("#generator-events", config);
		miscTab.render("#generator-misc", config);
		generateTab.render("#generator-result", config);

		// render the pie!
		_renderWithAnimation();

		// TODO tmp
		_generateFinalConfigObject();
	};

	var _selectPieSegment = function() {
		var openSegmentInfo = _demoD3Pie.getOpenSegment();
		if (openSegmentInfo === null) {
			_demoD3Pie.openSegment(0);
		} else {
			var nextIndex = openSegmentInfo.index + 1;

			// assumption here is that the dataset in the generator is an accurate reflection of what's in the
			// demo pie. It's reasonable. Or I screwed up somewhere.
			var data = dataTab.getTabData();
			if (nextIndex > data.length-1) {
				nextIndex -= data.length;
			}
			_demoD3Pie.openSegment(nextIndex);
		}
	};

	/**
	 * Bloody awful function! This is called whenever the page/tab is changed.
	 * @param msg
	 * @private
	 */
	var _onPageSelected = function(msg) {
		if (!_firstPageLoaded) {
			if (msg.data.pageHash !== "generator-result") {
				_firstPage = msg.data.page;
			}
			_firstPageLoaded = true;
		}
		if (msg.data.page !== "generator") {
			return;
		}

		var pageHash = msg.data.pageHash;
		var tab = (_currentTab) ? _currentTab : "generator-start";
		if ($.inArray(pageHash, _tabs) !== -1) {
			tab = pageHash;
		}

		if (pageHash === "generator-result") {
			$("#sidebar,#pieChartDiv").addClass("fadeOut");
			setTimeout(function() {
				$("#sidebar,#pieChartDiv").addClass("hidden").removeClass("fadeOut");
				$("#generator-result").removeClass("hidden fadeOut").addClass("fadeIn");
			}, C.OTHER.PAGE_LOAD_SPEED);
		} else {
			// if the previous tab was generator-result
			if (_currentTab === "generator-result") {
				$("#generator-result").addClass("fadeOut");
				setTimeout(function() {
					$("#generator-result").addClass("hidden").removeClass("fadeOut");
					$("#sidebar,#pieChartDiv").removeClass("hidden fadeOut").addClass("fadeIn");


				}, C.OTHER.PAGE_LOAD_SPEED);
			}
		}

		if (msg.data.pageHash.match(/pie\d$/)) {
			var index = pageHelper.getDemoPieChartIndex(EXAMPLE_PIES);
			_loadDemoPie(EXAMPLE_PIES[index]);
		}

		var $generatorTabs = $("#generatorTabs");

		// now show the appropriate tab
		if (_currentTab === null) {
			$generatorTabs.find("a[href=#" + tab + "]").closest("li").addClass("active");
			$("#" + tab).removeClass("fadeOut hidden").addClass("fadeIn");
			_renderWithAnimation();
		} else {
			$generatorTabs.find("a[href=#" + _currentTab + "]").closest("li").removeClass("active");
			$generatorTabs.find("a[href=#" + tab + "]").closest("li").addClass("active");
			$("#" + _currentTab).removeClass("hidden fadeIn").addClass("fadeOut");

			(function(ct) {
				setTimeout(function() {
					$("#" + ct).addClass("hidden").removeClass("fadeOut");
					$("#" + tab).removeClass("hidden fadeOut").addClass("fadeIn");
				}, C.OTHER.PAGE_LOAD_SPEED);
			})(_currentTab);
		}
		_currentTab = tab;
	};


	// yikes. The reason for all this hideousness is that we want to construct the smallest config object that we
	// can. So each field needs to be examined separately. I looked into object diffing scripts, but honestly there
	// was too much custom stuff needed to be done with many properties
	var _generateFinalConfigObject = function() {

		var allSettings = _getConfigObject();
		var finalObj = {};

		// header title
		var headerTitleTextDiff = allSettings.header.title.text != defaultSettings.header.title.text;
		var headerTitleColorDiff = allSettings.header.title.color != defaultSettings.header.title.color;
		var headerTitleFontSizeDiff = allSettings.header.title.fontSize != defaultSettings.header.title.fontSize;
		var headerTitleFontDiff = allSettings.header.title.font != defaultSettings.header.title.font;
		if (headerTitleTextDiff || headerTitleColorDiff || headerTitleFontSizeDiff || headerTitleFontDiff) {
			finalObj.header = {
				title: {}
			};
			if (headerTitleTextDiff) {
				finalObj.header.title.text = allSettings.header.title.text;
			}
			if (headerTitleColorDiff) {
				finalObj.header.title.color = allSettings.header.title.color;
			}
			if (headerTitleFontSizeDiff) {
				finalObj.header.title.fontSize = parseInt(allSettings.header.title.fontSize, 10);
			}
			if (headerTitleFontDiff) {
				finalObj.header.title.font = allSettings.header.title.font;
			}
		}

		// header subtitle
		var headerSubtitleTextDiff = allSettings.header.subtitle.text != defaultSettings.header.subtitle.text;
		var headerSubtitleColorDiff = allSettings.header.subtitle.color != defaultSettings.header.subtitle.color;
		var headerSubtitleFontSizeDiff = allSettings.header.subtitle.fontSize != defaultSettings.header.subtitle.fontSize;
		var headerSubtitleFontDiff = allSettings.header.subtitle.font != defaultSettings.header.subtitle.font;
		if (headerSubtitleTextDiff || headerSubtitleColorDiff || headerSubtitleFontSizeDiff || headerSubtitleFontDiff) {
			if (!finalObj.hasOwnProperty("header")) { finalObj.header = {}; }
			finalObj.header.subtitle = {};

			if (headerSubtitleTextDiff) {
				finalObj.header.subtitle.text = allSettings.header.subtitle.text;
			}
			if (headerSubtitleColorDiff) {
				finalObj.header.subtitle.color = allSettings.header.subtitle.color;
			}
			if (headerSubtitleFontSizeDiff) {
				finalObj.header.subtitle.fontSize = parseInt(allSettings.header.subtitle.fontSize, 10);
			}
			if (headerSubtitleFontDiff) {
				finalObj.header.subtitle.font = allSettings.header.subtitle.font;
			}
		}

		if (allSettings.header.location != defaultSettings.header.location) {
			if (!finalObj.hasOwnProperty("header")) { finalObj.header = {}; }
			finalObj.header.location = allSettings.header.location;
		}

		if (allSettings.header.titleSubtitlePadding != defaultSettings.header.titleSubtitlePadding) {
			if (!finalObj.hasOwnProperty("header")) { finalObj.header = {}; }
			finalObj.header.titleSubtitlePadding = parseInt(allSettings.header.titleSubtitlePadding, 10);
		}

		// footer
		var footerTextDiff = allSettings.footer.text != defaultSettings.footer.text;
		var footerColorDiff = allSettings.footer.color != defaultSettings.footer.color;
		var footerFontSizeDiff = allSettings.footer.fontSize != defaultSettings.footer.fontSize;
		var footerFontDiff = allSettings.footer.font != defaultSettings.footer.font;
		var footerLocationDiff = allSettings.footer.font != defaultSettings.footer.location;
		if (footerTextDiff || footerColorDiff || footerFontSizeDiff || footerFontDiff) {
			finalObj.footer = {};
			if (footerTextDiff) {
				finalObj.footer.text = allSettings.footer.text;
			}
			if (footerColorDiff) {
				finalObj.footer.color = allSettings.footer.color;
			}
			if (footerFontSizeDiff) {
				finalObj.footer.fontSize = parseInt(allSettings.footer.fontSize, 10);
			}
			if (footerFontDiff) {
				finalObj.footer.font = allSettings.footer.font;
			}
			if (footerLocationDiff) {
				finalObj.footer.location = allSettings.footer.location;
			}
		}

		// size
		var canvasHeightDiff = allSettings.size.canvasHeight != defaultSettings.size.canvasHeight;
		var canvasWidthDiff = allSettings.size.canvasWidth != defaultSettings.size.canvasWidth;
		var pieInnerRadiusDiff = allSettings.size.pieInnerRadius != defaultSettings.size.pieInnerRadius;
		var pieOuterRadiusDiff = allSettings.size.pieOuterRadius != defaultSettings.size.pieOuterRadius;
		if (canvasHeightDiff || canvasWidthDiff || pieInnerRadiusDiff || pieOuterRadiusDiff) {
			finalObj.size = {};
			if (canvasHeightDiff) {
				finalObj.size.canvasHeight = allSettings.size.canvasHeight;
			}
			if (canvasWidthDiff) {
				finalObj.size.canvasWidth = allSettings.size.canvasWidth;
			}
			if (pieInnerRadiusDiff) {
				finalObj.size.pieInnerRadius = allSettings.size.pieInnerRadius;
			}
			if (pieInnerRadiusDiff) {
				finalObj.size.pieOuterRadius = allSettings.size.pieOuterRadius;
			}
		}

		// data
		finalObj.data = {};
		if (allSettings.data.sortOrder != defaultSettings.data.sortOrder) {
			finalObj.data.sortOrder = allSettings.data.sortOrder;
		}
		finalObj.data.content = allSettings.data.content;

		// outer labels
		var outerLabelFormatDiff = allSettings.labels.outer.format != defaultSettings.labels.outer.format;
		var outerLabelHideDiff = allSettings.labels.outer.hideWhenLessThanPercentage != defaultSettings.labels.outer.hideWhenLessThanPercentage;
		var outerLabelPieDistDiff = allSettings.labels.outer.pieDistance != defaultSettings.labels.outer.pieDistance;
		if (outerLabelFormatDiff || outerLabelHideDiff || outerLabelPieDistDiff) {
			finalObj.labels = {
				outer: {}
			};
			if (outerLabelFormatDiff) {
				finalObj.labels.outer.format = allSettings.labels.outer.format;
			}
			if (outerLabelHideDiff) {
				finalObj.labels.outer.hideWhenLessThanPercentage = allSettings.labels.outer.hideWhenLessThanPercentage;
			}
			if (outerLabelPieDistDiff) {
				finalObj.labels.outer.pieDistance = allSettings.labels.outer.pieDistance;
			}
		}

		var innerLabelFormatDiff = allSettings.labels.inner.format != defaultSettings.labels.inner.format;
		var innerLabelHideDiff = allSettings.labels.inner.hideWhenLessThanPercentage != defaultSettings.labels.inner.hideWhenLessThanPercentage;
		if (innerLabelFormatDiff || innerLabelHideDiff) {
			if (finalObj.hasOwnProperty("labels")) { finalObj.labels = {}; }
			finalObj.labels.inner = {};
			if (innerLabelFormatDiff) {
				finalObj.labels.inner.format = allSettings.labels.inner.format;
			}
			if (innerLabelHideDiff) {
				finalObj.labels.inner.hideWhenLessThanPercentage = allSettings.labels.inner.hideWhenLessThanPercentage;
			}
		}

		/*
		labels: {
			mainLabel: {
				color: "#333333",
				font: "helvetica",
				fontSize: 10
			},
			percentage: {
				color: "#999999",
				font: "helvetica",
				fontSize: 10,
				decimalPlaces: 0
			},
			value: {
				color: "#cccc44",
				font: "helvetica",
				fontSize: 10
			},
			lines: {
				enabled: true,
				style: "curved",
				color: "segment"
			}
		},
		effects: {
			load: {
				effect: "default",
				speed: 1000
			},
			pullOutSegmentOnClick: {
				effect: "bounce",
				speed: 300,
				size: 10
			},
			highlightSegmentOnMouseover: true,
			highlightLuminosity: -0.2
		},
		misc: {
			cssPrefix: null,
				colors: {
				background: null,
					segments: [
					"#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00", "#635222", "#00dd00"
				],
					segmentStroke: "#ffffff"
			},
			canvasPadding: {
				top: 5,
					right: 5,
					bottom: 5,
					left: 5
			},
			pieCenterOffset: {
				x: 0,
					y: 0
			},
			footerPiePadding: 0
		},
		callbacks: {
			onload: null,
				onMouseoverSegment: null,
				onMouseoutSegment: null,
				onClickSegment: null
		}
		*/

	};

	mediator.register(_MODULE_ID);

	return {
		init: _init
	}
});