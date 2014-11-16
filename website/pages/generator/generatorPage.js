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
  "tooltipsTab",
	"footerTab",
	"effectsTab",
	"eventsTab",
	"miscTab",
	"generateTab",
	"examplePies",
	"hbs!generatorPageTemplate"
], function(C, mediator, pageHelper, startTab, titleTab, sizeTab, dataTab, labelsTab, tooltipsTab, footerTab,
    effectsTab, eventsTab, miscTab, generateTab, EXAMPLE_PIES, generatorPageTemplate) {
	"use strict";

	var _MODULE_ID = "generatorPage";
	var _isCreated = false;
	var _demoD3Pie = null;
	var _tabs = [
		"generator-start", "generator-title", "generator-size", "generator-data", "generator-labels", "generator-tooltips",
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
		subscriptions[C.EVENT.PAGE.RESIZE]                    = _onPageResize;
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
		var isFloat = $(e.target).hasClass("floatingNum");

		// check it's not empty and contains only numbers
		if (isNumberField) {
			if (/[^\d]/.test(val) || val === "") {
				$(e.target).addClass("hasError");
				return;
			}
		}
		if (isFloat) {
			if (/[^\d\.]/.test(val) || val === "") {
				$(e.target).addClass("hasError");
				return;
			}
		}

		$(e.target).removeClass("hasError");
		_renderWithNoAnimation();
	};

	var _renderWithNoAnimation = function() {
		console.log( _getConfigObject());
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
			tooltips:  tooltipsTab.getTabData(),
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
    tooltipsTab.render("#generator-tooltips", config);
		footerTab.render("#generator-footer", config);
		effectsTab.render("#generator-effects", config);
		eventsTab.render("#generator-events", config);
		miscTab.render("#generator-misc", config);
		generateTab.render("#generator-result", config);

		// render the pie!
		_renderWithAnimation();
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
	 * This is a little wonky, but acceptable. It anticipates that the generate-result tab will need the actual
	 * generated data set and posts it whenever the user selects that tab. Yeah, it's backward - the tab should
	 * retrieve it itself, but since it's loosely coupled, we'd need some sort of way for it to interact with the
	 * data found in this file, which would cause circular references with Require. So that's that.
	 * @private
	 */
	var _sendDemoPieData = function() {
		mediator.publish(_MODULE_ID, C.EVENT.DEMO_PIE.SEND_DATA, _getConfigObject());
	};

	/**
	 * Bloody awful function! This is called whenever the page/tab is changed. It got way out of control. Nav should
	 * be moved to a single, top-level area.
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
			_sendDemoPieData();
			$("#sidebar,#pieChartDiv").addClass("fadeOut");
			setTimeout(function() {
				$("#sidebar,#pieChartDiv").addClass("hidden").removeClass("fadeOut");
				$("#generator-result").removeClass("hidden fadeOut").addClass("fadeIn");
			}, C.OTHER.PAGE_LOAD_SPEED);
		} else if (pageHash === "generator" && tab === "generator-result") {
			// do nothing. This happens when a user's on the generator-result tab, goes to
			// another page (not tab), then clicks back to the generator tab
		} else {
			// if the previous tab was generator-result
			if (_currentTab === "generator-result") {
				$("#generator-result").addClass("fadeOut");
				setTimeout(function() {
					$("#generator-result").addClass("hidden").removeClass("fadeOut");
					_renderWithNoAnimation();
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

			// another klutzy workaround
			if (pageHash === "generator" && tab === "generator-result") {
				$("#" + tab).removeClass("hidden fadeOut");
			} else {
				(function(ct) {
					setTimeout(function() {
						$("#" + ct).addClass("hidden").removeClass("fadeOut");
						$("#" + tab).removeClass("hidden fadeOut").addClass("fadeIn");
					}, C.OTHER.PAGE_LOAD_SPEED);
				})(_currentTab);
			}
		}
		_currentTab = tab;
	};

	var _onPageResize = function() {
		_demoD3Pie.redraw();
	};

	mediator.register(_MODULE_ID);

	return {
		init: _init
	}
});
