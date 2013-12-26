define([], function() {
	'use strict';

	var _Model = Backbone.Model.extend({

		title: "",
		data: [],
		slideInSpeed: 900,
		canvasWidth: 500,
		canvasHeight: 500,
		colors: ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00", "#635222"],
		innerRadius: 80,
		outerRadius: 150,
		percentOrValue: "percent",

		initialize: function() {

		},

		render: function() {

		}
	});

	return _Model;
});