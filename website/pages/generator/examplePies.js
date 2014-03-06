define([], function() {
	"use strict";

	var EXAMPLE_PIES = [

		// ----------------------------------------------------------------------------------------

		{
			label: "Programming Languages",
			config: {
				header: {
					title: {
						text:     "Lots of Programming Languages",
						color:    "#333333",
						fontSize: "24px",
						font:     "open sans"
					},
					subtitle: {
						text:     "A full pie chart to show off label collision detection and resolution.",
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
					pieInnerRadius: "0%",
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
					{ label: "Shell", value: 28561 },
					{ label: "Cobol", value: 24131 },
					{ label: "C#", value: 100 },
					{ label: "Coldfusion", value: 68 },
					{ label: "Fortran", value: 218812 },
					{ label: "Coffeescript", value: 157618  },
					{ label: "Node", value: 114384  },
					{ label: "Basic", value: 95002 },
					{ label: "Cola", value: 36344 },
					{ label: "Perl", value: 32170 },
					{ label: "Dart", value: 28561 },
					{ label: "Go", value: 264131 },
					{ label: "Groovy", value: 218812 },
					{ label: "Processing", value: 157618  },
					{ label: "Smalltalk", value: 114384  },
					{ label: "Scala", value: 95002 },
					{ label: "Visual Basic", value: 78327 },
					{ label: "Scheme", value: 67706 },
					{ label: "Rust", value: 36344 },
					{ label: "FoxPro", value: 32170 }
				],
				labels: {
					enableTooltips: true,
					inside: "percentage",
					outside: "label-percentage1",
					mainLabel: {
						color: "#333333",
						font: "Open sans",
						fontSize: "11px"
					},
					percentage: {
						color: "#999999",
						font: "Open sans",
						fontSize: "11px"
					},
					value: {
						color: "#adadad",
						font: "Open sans",
						fontSize: "11px"
					},
					lines: {
						enabled: true,
						length: 32,
						color: "segment"
					}
				},
				styles: {
					backgroundColor: null,
					colors: [
						"#2484c1", "#0c6197", "#4daa4b", "#90c469", "#daca61", "#e4a14b", "#e98125", "#cb2121",
						"#830909", "#923e99", "#ae83d5",

						"#5F10E6",
						"#BF273E",
						"#CE2AEB",
						"#BCA44A",
						"#A8C427",
						"#618D1B",
						"#1EE67B",
						"#B0EC44",
						"#A4A0C9",
						"#322849",
						"#86F71A",
						"#D1C87F",
						"#7D9058",
						"#44B9B0",
						"#7C37C0",
						"#CC9FB1",
						"#E65414",
						"#8B6834",
						"#248838",
						"#D9439C",
						"#F96E8B",
						"#D01593",
						"#E5AC0D",
						"#0E7EBD",
						"#573972",
						"#83EE1B",
						"#3FF8AD",
						"#C03D6D",
						"#B769AD",
						"#3BA310",
						"#33312C",
						"#30B9AE",
						"#852ECC",
						"#0E125C",
						"#24CB14",
						"#F2D2FF",
						"#E4C04C",
						"#9BAB4A"


					]
				},
				effects: {
					load: {
						effect: "default", // none / default
						speed: 1000
					},
					pullOutSegmentOnClick: {
						effect: "linear", // none / linear / bounce
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
					dataSortOrder: "label-desc",
					hideLabelsForSmallSegments: false,
					hideLabelsForSmallSegmentSize: "5%",
					canvasPadding: {
						top: 5,
						right: 5,
						bottom: 5,
						left: 5
					},
					titleSubtitlePadding: 9,
					preventTextSelection: true
				}
			}
		},


		// ----------------------------------------------------------------------------------------

		{
			label: "Top 15 Fears",
			config: {
				header: {
					title: {
						text:     "Top 15 Fears",
						color:    "#333333",
						fontSize: "30px",
						font:     "courier"
					},
					subtitle: {
						text:     "What strikes the most terror in people?",
						color:    "#999999",
						fontSize: "10px",
						font:     "courier"
					},
					location: "pie-center"
				},
				footer: {
					text:     "* This was curious. We're not sure why over 400 people regard Winnipeg as a Top 15 Fear.",
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
					{ label: "Off-by-one errors", value: 3 },
					{ label: "Chickadees", value: 4 },
					{ label: "A never-ending Harper Government", value: 1 }
				],
				labels: {
					enableTooltips: true,
					inside: "none",
					outside: "label",
					mainLabel: {
						color: "#333333",
						font: "Open sans",
						fontSize: "11"
					},
					percentage: {
						color: "#999999",
						font: "Open sans",
						fontSize: "11"
					},
					value: {
						color: "#cccc44",
						font: "Open sans",
						fontSize: "11"
					},
					lines: {
						enabled: true,
						length: 16,
						color: "#777777"
					}
				},
				styles: {
					backgroundColor: null,
					colors: [
						"#333333", "#444444", "#555555", "#666666", "#777777", "#888888", "#999999", "#cb2121",
						"#830909", "#923e99", "#ae83d5", "#111111", "#050505"
					]
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
					dataSortOrder: "label-asc",
					hideLabelsForSmallSegments: false,
					hideLabelsForSmallSegmentSize: "5%",
					canvasPadding: {
						top: 5,
						right: 5,
						bottom: 5,
						left: 5
					},
					titleSubtitlePadding: 6,
					preventTextSelection: true
				}
			}
		},

		// ----------------------------------------------------------------------------------------


		{
			label: "Spousal Resentment",
			config: {
				header: {
					title: {
						text:     "Spousal Resentment",
						color:    "#333333",
						fontSize: "22",
						font:     "verdana"
					},
					subtitle: {
						text:     "Comments my wife has made when I tell her I'm working on this script instead of doing something \"fun\".",
						color:    "#999999",
						fontSize: "10",
						font:     "verdana"
					},
					location: "top-center"
				},
				footer: {
					text: "Source: me, my room, the last 2 months.",
					color:    "#999999",
					fontSize: "11",
					font:     "open sans",
					location: "bottom-center"
				},
				size: {
					canvasWidth: 600,
					canvasHeight: 400,
					pieInnerRadius: "0%",
					pieOuterRadius: "67%"
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
					enableTooltips: true,
					inside: "value",
					outside: "label",
					mainLabel: {
						color: "#333333",
						font: "verdana",
						fontSize: "10"
					},
					percentage: {
						color: "#999999",
						font: "verdana",
						fontSize: "10"
					},
					value: {
						color: "#cccc44",
						font: "verdana",
						fontSize: "10"
					},
					lines: {
						enabled: true,
						length: 16,
						color: "#cccccc"
					}
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
					titleSubtitlePadding: 12
				}
			}
		},


		{
			label: "The Sun",
			config: {
				header: {
					title: {
						text:     "The Sun",
						color:    "#333333",
						fontSize: "24px",
						font:     "open sans"
					},
					subtitle: {
						text:     "Chemical composition",
						color:    "#999999",
						fontSize: "12px",
						font:     "open sans"
					},
					location: "pie-center"
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
					pieInnerRadius: "0%",
					pieOuterRadius: "66%"
				},
				data: [
					{ label: "Hydrogen", value: 74.9 },
					{ label: "Helium", value: 23.8 },
					{ label: "Oxygen", value: 1  },
					{ label: "Carbon", value: 0.3  },
					{ label: "Neon", value: 0.2 },
					{ label: "Iron", value: 0.2 }
				],
				labels: {
					enableTooltips: true,
					inside: "percentage",
					outside: "label-value1",
					mainLabel: {
						color: "#333333",
						font: "Open sans",
						fontSize: "11px"
					},
					percentage: {
						color: "#999999",
						font: "Open sans",
						fontSize: "11px"
					},
					value: {
						color: "#adadad",
						font: "Open sans",
						fontSize: "11px"
					},
					lines: {
						enabled: true,
						length: 32,
						color: "segment"
					}
				},
				styles: {
					backgroundColor: null,
					colors: [
						"#2484c1", "#0c6197", "#4daa4b", "#90c469", "#daca61", "#e4a14b", "#e98125", "#cb2121",
						"#830909", "#923e99", "#ae83d5"
					]
				},
				effects: {
					load: {
						effect: "default", // none / default
						speed: 1000
					},
					pullOutSegmentOnClick: {
						effect: "linear", // none / linear / bounce
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
					dataSortOrder: "label-desc",
					hideLabelsForSmallSegments: false,
					hideLabelsForSmallSegmentSize: "5%",
					canvasPadding: {
						top: 5,
						right: 5,
						bottom: 5,
						left: 5
					},
					titleSubtitlePadding: 9,
					preventTextSelection: true
				}
			}
		},

	];

	return EXAMPLE_PIES;
});