define([
	"aboutPageDemoPies",
	"hbs!aboutPageTemplate"
], function(aboutPageDemoPies, aboutPageTemplate) {
	"use strict";

	var _demoPie1, _demoPie2, _demoPie3;

	var _init = function() {
		$("#about").html(aboutPageTemplate());

		_demoPie1 = d3pie("aboutTabDemoPie1", aboutPageDemoPies[0]);
		_demoPie3 = d3pie("aboutTabDemoPie3", aboutPageDemoPies[1]);
		//_demoPie2 = d3pie("aboutTabDemoPie1", aboutPageDemoPies[0]);
	};

	return {
		init: _init
	};
});