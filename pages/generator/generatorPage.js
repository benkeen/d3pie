/**
 * Contains all the logic for the actual generator.
 */
define([
	"constants",
	"mediator",

	"titleTab",
	"sizeTab",
	"dataTab",
	"colorsTab",
	"labelsTab",
	"footerTab",
	"effectsTab",
	"eventsTab",
	"miscTab",

	"hbs!examplePiesTemplate",
	"hbs!generatorPageTemplate"
], function(C, mediator, titleTab, sizeTab, dataTab, colorsTab, labelsTab, footerTab, effectsTab, eventsTab, miscTab,
			examplePiesTemplate, generatorPageTemplate) {
	"use strict";

	var _MODULE_ID = "generatorPage";
	var _isCreated = false;
	var _demoD3Pie = null;


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


		var subscriptions = {};
		subscriptions[C.EVENT.DEMO_PIE.RENDER.NO_ANIMATION]   = _renderWithNoAnimation;
		subscriptions[C.EVENT.DEMO_PIE.RENDER.WITH_ANIMATION] = _renderWithAnimation;
		subscriptions[C.EVENT.DEMO_PIE.RENDER.UPDATE_PROP]    = _updateProperty;
		mediator.subscribe(_MODULE_ID, subscriptions);
	};

	/**
	 * Our main event handler assignment function. Bit klutzy - it would be nice to update this for some sort of
	 * binding, but it's simple & will do for now.
	 * @private
	 */
	var _addTabEventHandlers = function() {

		// general event handlers used in any old tab
		$(".changeUpdateNoAnimation").on("change", _renderWithNoAnimation);
		$(".updateNoAnimation").on("keyup change", _onKeyupNumberFieldUpdateNoAnimation);
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

	var _updateProperty = function(msg) {
		//_demoD3Pie.updateProp(msg.data.prop, msg.data.value);
		$("#generatorPieChart").data("d3pie").updateProp(msg.data.prop, msg.data.value);
	};

	var _renderPie = function(includeStartAnimation, config) {

		// if we don't want to include the start animation, just override the values in the UI. This is useful for
		// automatically showing the user's latest changes to the pie settings and not having to see the animation
		// each and every time
		if (!includeStartAnimation) {
			config.effects.load.effect = "none";
		}

		if (_isCreated) {
			$("#generatorPieChart").data("d3pie").destroy();
		}

		_demoD3Pie = $("#generatorPieChart").d3pie(config);
		_isCreated = true;
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
			styles:    colorsTab.getTabData(),
			effects:   effectsTab.getTabData(),
			callbacks: eventsTab.getTabData(),
			misc:      miscTab.getTabData()
		};
	};


	var _loadDemoPie = function(pieConfiguration) {
		var config = pieConfiguration.config;

		// render the generator tabs
		titleTab.render(config);
		sizeTab.render(config);
		dataTab.render(config);
		colorsTab.render(config);
		labelsTab.render(config);
		footerTab.render(config);
		effectsTab.render(config);
		eventsTab.render(config);
		miscTab.render(config);

		// render the pie!
		_renderWithAnimation();

		// always add the event handlers. This is because the tab content is recreated every time this function is called
		_addTabEventHandlers();
	};


	mediator.register(_MODULE_ID);

	return {
		init: _init
	}
});