define([], function() {

	var C = {
		VERSION: "0.1.0",
		MINIFIED: false,
		DEBUG: false
	};

	// example pie charts
	C.EXAMPLE_PIES = [
		{
			label: "Top 15 Fears",
			config: {
				header: {
					title: {
						text:     "Top 15 Fears",
						color:    "#333333",
						fontSize: "24px",
						font:     "open sans"
					},
					subtitle: {
						text:     "What strikes the most terror in people?",
						color:    "#999999",
						fontSize: "12px",
						font:     "open sans"
					},
					location: "pie-center"
				},
				footer: {
					text: "* This was curious. We're not sure why over 400 people regard Winnipeg as a Top 15 Fear.",
					color:    "#999999",
					fontSize: "10px",
					font:     "open sans",
					location: "bottom-left"
				},
				size: {
					canvasWidth: 650,
					canvasHeight: 500,
					pieInnerRadius: "95%",
					pieOuterRadius: "60%"
				},
				data: [
					{ label: "Spiders", value: 2 },
					{ label: "Mother-in-laws", value: 10 },
					{ label: "Sharks", value: 8 },
					{ label: "Alien invasion", value: 8 },
					{ label: "Learning Objective-C", value: 5 },
					{ label: "Public speaking", value: 3 },
					{ label: "Donald Rumsfeld", value: 4 },
					{ label: "The Zombie Apocalypse", value: 4 },
					{ label: "The City of Winnipeg *", value: 3 },
					{ label: "IE 6", value: 2 },
					{ label: "Planes, with/without snakes", value: 5 },
					{ label: "Heights", value: 3 },
					{ label: "Chickadees", value: 4 }
				],
				labels: {
					enableTooltips: true,
					inside: "none",
					outside: "label",
					mainLabel: {
						color: "#333333",
						font: "Open sans",
						fontSize: "8"
					},
					percentage: {
						color: "#999999",
						font: "Open sans",
						fontSize: "8"
					},
					value: {
						color: "#cccc44",
						font: "Open sans",
						fontSize: "8"
					},
					lines: {
						enabled: true,
						color: "segment" // "segment" or a hex color
					}
				},
				styles: {
					backgroundColor: null,
					colors: ["#333333", "#444444", "#555555", "#666666", "#777777", "#888888", "#999999", "#cb2121", "#830909", "#923e99", "#ae83d5"]
				},
				effects: {
					load: {
						effect: "default", // none / default
						speed: 1000
					},
					pullOutSegmentOnClick: {
						effect: "linear", // none / linear / bounce /
						speed: 400
					},
					highlightSegmentOnMouseover: true,
					labelFadeInTime: 400
				},
				misc: {
					enableTooltips: false,
					dataSortOrder: "none",
					hideLabelsForSmallSegments: false,
					hideLabelsForSmallSegmentSize: "5%",
					canvasPadding: {
						top: 5,
						right: 5,
						bottom: 5,
						left: 5
					},
					labelPieDistance: 40,
					titleSubtitlePadding: 6,
					preventTextSelection: true
				}
			}
		},

		{
			label: "Programming Languages",
			config: {
				header: {
					title: {
						text:     "Programming languages",
						color:    "#333333",
						fontSize: "24px",
						font:     "open sans"
					},
					subtitle: {
						text:     "A bunch of arbitrary programming languages",
						color:    "#999999",
						fontSize: "12px",
						font:     "open sans"
					},
					location: "top-center"
				},
				footer: {
					text: "",
					color:    "#999999",
					fontSize: "10px",
					font:     "open sans",
					location: "bottom-left"
				},
				size: {
					canvasWidth: 650,
					canvasHeight: 500,
					pieInnerRadius: "40%",
					pieOuterRadius: "66%"
				},
				data: [
					{ label: "JavaScript", value: 264131 },
					{ label: "Ruby", value: 218812 },
					{ label: "Java", value: 157618  },
					{ label: "PHP", value: 114384  },
					{ label: "Python", value: 95002 },
					{ label: "C+", value: 78327 },
					{ label: "C", value: 67706 },
					{ label: "Objective-C", value: 36344 },
					{ label: "C#", value: 32170 },
					{ label: "Shell", value: 28561 }
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
					colors: ["#2484c1", "#0c6197", "#4daa4b", "#90c469", "#daca61", "#e4a14b", "#e98125", "#cb2121", "#830909", "#923e99", "#ae83d5"]
				},
				effects: {
					load: {
						effect: "default", // none / default
						speed: 1000
					},
					pullOutSegmentOnClick: {
						effect: "linear", // none / linear / bounce /
						speed: 400
					},
					highlightSegmentOnMouseover: true,
					labelFadeInTime: 400
				},
				callbacks: {
					onload: "function() { console.log(\"pie chart loaded.\"); }",
					onMouseoverSegment: "function(segmentInfo) { console.log(\"onMouseoverSegment\", segmentInfo); }",
					onMouseoutSegment: "function(segmentInfo) { console.log(\"onMouseoutSegment\", segmentInfo); }",
					onClickSegment: "function(segmentInfo) { console.log(\"onClickSegment\", segmentInfo); }"
				},
				misc: {
					enableTooltips: false,
					dataSortOrder: "none",
					hideLabelsForSmallSegments: false,
					hideLabelsForSmallSegmentSize: "5%",
					canvasPadding: {
						top: 5,
						right: 5,
						bottom: 5,
						left: 5
					},
					labelPieDistance: 40,
					titleSubtitlePadding: 6,
					preventTextSelection: true
				}
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
					colors: ["#2484c1", "#0c6197", "#4daa4b", "#90c469", "#daca61", "#e4a14b", "#a61111", "#923e99", "#ae83d5"]
				},
				effects: {
					load: {
						effect: "default", // none / default
						speed: 1000
					},
					pullOutSegmentOnClick: {
						effect: "linear", // none / linear / bounce /
						speed: 400
					},

					labelFadeInTime: 400,
					highlightSegmentOnMouseover: true
				},
				misc: {
					enableTooltips: false,
					dataSortOrder: "none",
					hideLabelsForSmallSegments: false,
					hideLabelsForSmallSegmentSize: "5%",
					preventTextSelection: true,
					canvasPadding: {
						top: 5,
						right: 5,
						bottom: 5,
						left: 5
					},
					labelPieDistance: 16,
					titleSubtitlePadding: 6
				}
			}
		}
	];

	// people's favourite pie flavours


	C.PALETTES = [
		{
			name: "Greens",
			colors: ["#92dd98", "#68ca6f", "#58b65e", "#4ca551", "#3f8450", "#296137", "#16481a", "#0a370e", "#062708", "#000000"]
		}
	];

	C.EVENT = {
		DEMO_PIE: {
			RENDER: {
				NO_ANIMATION: 'demo-pie-render-no-animation',
				WITH_ANIMATION: 'demo-pie-render-with-animation',
				UPDATE_PROP: 'demo-pie-render-update-prop'
			}
		}
	};

	return C;
});