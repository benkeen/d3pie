// --------- validate.js -----------
var tt = {
  addTooltips: function(pie) {
    if (pie.options.tooltips.type === 'caption') {

      pie.svg.selectAll("." + pie.cssPrefix + "tooltip")
        .data(pie.options.data.content)
        .enter()
        .append("g")
        .attr("class", pie.cssPrefix + "tooltip")
        .text(function(d) {
          console.log(d);
        });
    }
  }
};
