// --------- validate.js -----------
var tt = {
	addTooltips: function(pie) {

		// group the label groups (label, percentage, value) into a single element for simpler positioning
		var tooltips = pie.svg.insert("g", "." + pie.cssPrefix + "tooltips")
			.attr("class", pie.cssPrefix + "tooltips");

		if (pie.options.tooltips.type === 'caption') {
			tooltips.selectAll("." + pie.cssPrefix + "tooltip")
				.data(pie.options.data.content)
				.enter()
				.append("g")
				.attr("class", function(d, i) {
					return pie.cssPrefix + "tooltip" + i;
				})
				.text(function(d) {
					console.log(d);
				});
		}
	}
};
