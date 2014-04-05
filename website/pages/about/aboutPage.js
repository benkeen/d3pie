define([
	"aboutPageDemoPies",
	"hbs!aboutPageTemplate"
], function(aboutPageDemoPies, aboutPageTemplate) {
	"use strict";

	var _demoPie1, _demoPie2, _demoPie3;

	var _init = function() {
		$("#about").html(aboutPageTemplate());

		_demoPie1 = new d3pie("aboutTabDemoPie1", aboutPageDemoPies[0]);

		setTimeout(function() {
			_demoPie2 = new d3pie("aboutTabDemoPie2", aboutPageDemoPies[1]);
		}, 1000);
		setTimeout(function() {
			_demoPie3 = new d3pie("aboutTabDemoPie3", aboutPageDemoPies[2]);
		}, 2000);
	};

	return {
		init: _init
	};
});