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
					text: "Programming languages",
					location: "top-left",
					color: "#333333",
					fontSize: "16px",
					font: "helvetica"
				},
				colors: {
					background: null,
					segments: ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00", "#635222"]
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
				effects: {
					load: "",
					loadSpeed: 1000,
					highlightSegmentOnMouseover: true,
					pullOutSegmentOnClick: true,
					labelFadeInTime: 400
				},
				innerRadius: 100
			}
		},

		{
			label: "Canadian Birds",
			config: {

			}
		}
	];

	return C;
});