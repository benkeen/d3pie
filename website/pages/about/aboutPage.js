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
	var _isRendered = false;

	var _init = function() {
		$("#about").html(aboutPageTemplate());

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
			if (_firstPage === "about") {
				setTimeout(_renderContent, 10);
			}
			return;
		}

		if (msg.data.page === "about") {
			if (!_isRendered) {
				_renderContent();
			}
			$("#aboutPageSlides").slidesjs("refresh");
		}
	};

	var _renderContent = function() {
		$("#aboutPageSlides").slidesjs({
			width: 940,
			height: 320,
			navigation: true
		});

		_demoPie1 = new d3pie("aboutTabDemoPie1", aboutPageDemoPies[0]);
		_demoPie2 = new d3pie("aboutTabDemoPie2", aboutPageDemoPies[1]);
		_demoPie3 = new d3pie("aboutTabDemoPie3", aboutPageDemoPies[2]);

		// fade in the "create similar" buttons
		setTimeout(function() {
			$("#demoPie1-createSimilarBtn,#demoPie2-createSimilarBtn,#demoPie3-createSimilarBtn").fadeIn(400);
		}, 2000);

		_isRendered = true;
	};


	mediator.register(_MODULE_ID);

	return {
		init: _init
	};
});