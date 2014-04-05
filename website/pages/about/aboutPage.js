define([
	"constants",
	"mediator",
	"aboutPageDemoPies",
	"hbs!aboutPageTemplate"
], function(C, mediator, aboutPageDemoPies, aboutPageTemplate) {
	"use strict";

	var _MODULE_ID = "aboutPage";
	var _demoPie1, _demoPie2, _demoPie3;
	var _firstPageLoaded = false;
	var _firstPage;

	var _init = function() {
		$("#about").html(aboutPageTemplate());

		// very fussy stuff, jeez.
		_demoPie1 = new d3pie("aboutTabDemoPie1", aboutPageDemoPies[0]);
		_demoPie2 = new d3pie("aboutTabDemoPie2", aboutPageDemoPies[1]);
		_demoPie3 = new d3pie("aboutTabDemoPie3", aboutPageDemoPies[2]);

		// fade in the "create similar" buttons
		setTimeout(function() {
			$(".createSimilarBtn").fadeIn(300);
		}, 3000);

		var subscriptions = {};
		subscriptions[C.EVENT.PAGE.LOAD] = _onPageSelected;
		mediator.subscribe(_MODULE_ID, subscriptions);
	};

	// a bit fussy, but unavoidable. Whenever a page changes, we need to re-draw the pies IFF (if and only if)
	// the initial page load wasn't the about page
	var _onPageSelected = function(msg) {
		if (!_firstPageLoaded) {
			_firstPage = msg.data.page;
			_firstPageLoaded = true;
			return;
		}

		if (msg.data.page === "about" || _firstPage !== "about") {
			_demoPie1.recreate();
			_demoPie2.recreate();
			_demoPie3.recreate();
		}
	};

	mediator.register(_MODULE_ID);

	return {
		init: _init
	};
});