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
				header: {
					title: {
						text:     "Programming languages",
						color:    "#333333",
						fontSize: "16px",
						font:     "open sans"
					},
					subtitle: {
						text:     "A bunch of arbitrary programming languages",
						color:    "#999999",
						fontSize: "11px",
						font:     "open sans"
					},
					location: "top-left"
				},
				footer: {
					text: "",
					color:    "#999999",
					fontSize: "10px",
					font:     "open sans",
					location: "bottom-left"
				},
				size: {
					canvasWidth: 500,
					canvasHeight: 500,
					pieInnerRadius: "40%",
					pieOuterRadius: "66%"
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
					labelPercentageColor: "#999999",
					labelSegmentValueColor: "#cccccc"
				},
				styles: {
					backgroundColor: null,
					colors: ["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00", "#635222", "#00dd00"]
				},
				effects: {
					loadEffect: "default", //  none / default
					loadEffectSpeed: 1000,
					highlightSegmentOnMouseover: true,
					pullOutSegmentOnClick: true,
					labelFadeInTime: 400
				},
				misc: {
					enableTooltips: false,
					orderData: "hightolow", // only one option right now
					hideLabelsForSmallSegments: false,
					hideLabelsForSmallSegmentSize: "5%"
				}
			}
		},

		{
			label: "BC Birds I Have Yet To See",
			config: {

			}
		},

		{
			label: "Spousal Resentment",
			config: {
				header: {
					title: {
						text:     "Spousal Resentment",
						color:    "#333333",
						fontSize: "22px",
						font:     "open sans"
					},
					subtitle: {
						text:     "Comments my wife has made when I tell her I'm working on this script instead of doing something \"fun\".",
						color:    "#999999",
						fontSize: "11px",
						font:     "open sans"
					},
					location: "top-center"
				},
				footer: {
					text: "Source: me, my room, the last 2 months.",
					color:    "#999999",
					fontSize: "10px",
					font:     "open sans",
					location: "bottom-center"
				},
				size: {
					canvasWidth: 600,
					canvasHeight: 400,
					pieInnerRadius: "0%",
					pieOuterRadius: "56%"
				},
				data: [
					{ label: "When's it going to be done?", value: 8, tooltip: "" },
					{ label: "Bennnnn!", value: 5, tooltip: "" },
					{ label: "Oh, god.", value: 2, tooltip: "" },
					{ label: "But it's Friday night!", value: 3, tooltip: "" },
					{ label: "Again?", value: 2, tooltip: "" },
					{ label: "[baleful stare]", value: 3, tooltip: "" }
				],
				labels: {
					location: "inside", // inside/outside
					format: "{L}", // {L} = label, {%} = percentage, {V} = value,
					labelColor: "#333333",
					labelPercentageColor: "#999999",
					labelSegmentValueColor: "#cccccc"
				},
				styles: {
					backgroundColor: null,
					colors: ["#90C8DC", "#BE985E", "#16959E", "#76330B", "#04304A", "#d0743c", "#ff8c00", "#635222", "#00dd00"]
				},
				effects: {
					loadEffect: "default",
					loadEffectSpeed: 1000,
					highlightSegmentOnMouseover: true,
					pullOutSegmentOnClick: true,
					labelFadeInTime: 400
				},
				misc: {
					enableTooltips: false,
					orderData: "hightolow",
					hideLabelsForSmallSegments: false,
					hideLabelsForSmallSegmentSize: "5%"
				}
			}
		}
	];

	return C;
});