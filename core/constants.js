define([], function() {

	var C = {
		VERSION: "0.1.0",
		MINIFIED: false // move entirely to grunt?
	};

	// example pie charts
	C.EXAMPLE_PIES = [
		{
			label: "Programming Languages",
			config: {
				title: {
					text:     "Programming languages",
					location: "top-left",
					color:    "#333333",
					fontSize: "16px",
					font:     "helvetica"
				},
				data: [
					{ label: "JavaScript", value: 264131, tooltip: "" },
					{ label: "Ruby", value: 218812, tooltip: "" },
					{ label: "Java", value: 157618, tooltip: "" },
					{ label: "PHP", value: 114384, tooltip: "" },
					{ label: "Python", value: 95002, tooltip: "" },
					{ label: "C+", value: 78327, tooltip: "" },
					{ label: "C", value: 67706, tooltip: "" },
					{ label: "Objective-C", value: 36344, tooltip: "" },
					{ label: "C#", value: 32170, tooltip: "" },
					{ label: "Shell", value: 28561, tooltip: "" }
				],
				labels: {
					location: "inside", // inside/outside
					format: "{L}", // {L} = label, {%} = percentage, {V} = value,
					labelColor: "#333333",
					labelPercentageColor: "#666666",
					labelSegmentValueColor: "#999999"
				},
				styles: {
					pieInnerRadius: "40%",
					backgroundColor: null,
					colors: ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00", "#635222"]
				},
				effects: {
					loadEffect: "none", // fadein / none
					loadEffectSpeed: 1000,
					highlightSegmentOnMouseover: false,
					pullOutSegmentOnClick: false,
					labelFadeInTime: 400
				},
				misc: {
					enableTooltips: false,
					orderData: "hightolow", // only one option right now
					hideLabels: false
				}
			}
		},

		{
			label: "Canadian Birds",
			config: {

			}
		},

		{
			label: "Third item",
			config: {

			}
		}

	];

	return C;
});