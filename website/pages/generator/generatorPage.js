/**
 * Contains all the logic for the actual generator.
 */
define([
	"constants",
	"mediator",
	"startTab",
	"titleTab",
	"sizeTab",
	"dataTab",
	"labelsTab",
	"footerTab",
	"effectsTab",
	"eventsTab",
	"miscTab",
	"examplePies",
	"hbs!generatorPageTemplate"
], function(C, mediator, startTab, titleTab, sizeTab, dataTab, labelsTab, footerTab, effectsTab, eventsTab,
			miscTab, EXAMPLE_PIES, generatorPageTemplate) {
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

		$("#generator").html(generatorPageTemplate());

		// now fade in the three sections: nav, main content & footer row
		$("#generatorTabs,#mainContent,#footerRow").hide().removeClass("hidden").fadeIn(400);

		// always initialize the sidebar with whatever's in the selected example (always first item right now)
		_loadDemoPie(EXAMPLE_PIES[0]);

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
		$("#generatorPieChartPad, #generatorPieChart").css({
			width: config.size.canvasWidth,
			height: config.size.canvasHeight
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

		// render the pie!
		_renderWithAnimation();
	};

	var _selectPieSegment = function() {
		var openSegmentInfo = _demoD3Pie.getOpenPieSegment();
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

	var _onPageSelected = function(msg) {
		if (!_firstPageLoaded) {
			_firstPage = msg.data.page;
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

		// if the tab hasn't changed, do nothing
		if (tab === _currentTab) {
			return;
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

					//mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.RENDER.WITH_ANIMATION);
				}, C.OTHER.PAGE_LOAD_SPEED);
			})(_currentTab);
		}

		_currentTab = tab;
	};

	mediator.register(_MODULE_ID);

	return {
		init: _init
	}
});