d3pie.tooltips = {

	init: function() {
		// first append our hidden tooltip. This will be used for all tooltips - it
		var tooltip = d3.select("body")
			.append("div")
			.style("position", "absolute")
			.style("z-index", "10")
			.style("visibility", "hidden");
			//.text("a simple tooltip");
	},

	setContent: function() {

	},

	show: function() {

	}
};