define([], function() {

	var _DEMO_PIES = [

		// 1
		{
			header: {
				title: {
					text:     "Top 15 Fears",
					color:    "#333333",
					fontSize: "16px",
					font:     "courier"
				},
				subtitle: {
					text:     "",
					color:    "#999999",
					fontSize: "10px",
					font:     "courier"
				},
				location: "pie-center",
				titleSubtitlePadding: 6
			},
			footer: {
				text:     "* This was curious. We're not sure why over 400 people regard Winnipeg as a Top 15 Fear.",
				color:    "#999999",
				fontSize: "10px",
				font:     "open sans",
				location: "bottom-left"
			},
			size: {
				canvasWidth: 350,
				canvasHeight: 300,
				pieInnerRadius: "95%",
				pieOuterRadius: "60%"
			},
			data: {
				sortOrder: "label-asc",
				content: [
					{ label: "Spiders", value: 2, color: "#333333" },
					{ label: "Mother-in-laws", value: 10, color: "#444444" },
					{ label: "Sharks", value: 8, color: "#555555" },
					{ label: "Alien invasion", value: 8, color: "#666666" },
					{ label: "Learning Objective-C", value: 5, color: "#777777" },
					{ label: "Public speaking", value: 3, color: "#888888" },
					{ label: "Donald Rumsfeld", value: 4, color: "#999999" },
					{ label: "The Zombie Apocalypse", value: 4, color: "#cb2121" },
					{ label: "The City of Winnipeg *", value: 3, color: "#830909" },
					{ label: "IE 6", value: 2, color: "#923e99" },
					{ label: "Planes, with/without snakes", value: 5, color: "#ae83d5" },
					{ label: "Off-by-one errors", value: 3, color: "#111111"},
					{ label: "Chickadees", value: 4, color: "#050505" },
					{ label: "A never-ending Harper Government", value: 1, color: "#646464" }
				]
			},
			labels: {
				enableTooltips: true,
				outer: {
					format: "label-percentage1",
					hideWhenLessThanPercentage: null,
					pieDistance: 15
				},
				inner: {
					format: "none",
					hideWhenLessThanPercentage: null
				},
				mainLabel: {
					color: "#333333",
					font: "Open sans",
					fontSize: "11"
				},
				percentage: {
					color: "#999999",
					font: "Open sans",
					fontSize: "11",
					decimalPlaces: 0
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
			effects: {
				load: {
					effect: "default", // none / default
					speed: 1000
				},
				pullOutSegmentOnClick: {
					effect: "linear", // none / linear / bounce /
					speed: 400,
					size: 8
				},
				highlightSegmentOnMouseover: true,
				highlightLuminosity: -0.2
			},
			misc: {
				colors: {
					background: null,
					segmentStroke: "#ffffff"
				},
				canvasPadding: {
					top: 5,
					right: 5,
					bottom: 5,
					left: 5
				},
				pieCenterOffset: {
					x: 0,
					y: 0
				}
			}
		},

		// 2
		{
			header: {
				title: {
					text:     "Lots of Programming Languages",
					color:    "#333333",
					fontSize: "20px",
					font:     "open sans"
				},
				subtitle: {
					text:     "A full pie chart to show off label collision detection and resolution.",
					color:    "#999999",
					fontSize: "10px",
					font:     "open sans"
				},
				location: "top-center",
				titleSubtitlePadding: 9
			},
			footer: {
				text: "",
				color:    "#999999",
				fontSize: "10px",
				font:     "open sans",
				location: "bottom-left"
			},
			size: {
				canvasWidth: 350,
				canvasHeight: 300,
				pieInnerRadius: "0%",
				pieOuterRadius: "58%"
			},
			data: {
				sortOrder: "value-desc",
				content: [
					{ label: "JavaScript", value: 264131, color: "#2484c1" },
					{ label: "Ruby", value: 218812, color: "#0c6197" },
					{ label: "Java", value: 157618, color: "#4daa4b" },
					{ label: "PHP", value: 114384, color: "#90c469" },
					{ label: "Python", value: 95002, color: "#daca61" },
					{ label: "C+", value: 78327, color: "#e4a14b" },
					{ label: "C", value: 67706, color: "#e98125" },
					{ label: "Objective-C", value: 36344, color: "#cb2121" },
					{ label: "Shell", value: 28561, color: "#830909" },
					{ label: "Cobol", value: 24131, color: "#923e99" },
					{ label: "C#", value: 100, color: "#ae83d5" },
					{ label: "Coldfusion", value: 68, color: "#BF273E" },
					{ label: "Fortran", value: 218812, color: "#CE2AEB" },
					{ label: "Coffeescript", value: 157618, color: "#BCA44A" },
					{ label: "Node", value: 114384, color: "#618D1B" },
					{ label: "Basic", value: 95002, color: "#1EE67B" },
					{ label: "Cola", value: 36344, color: "#B0EC44" }
				]
			},
			labels: {
				enableTooltips: true,
				outer: {
					format: "label",
					hideWhenLessThanPercentage: null,
					pieDistance: 20
				},
				inner: {
					format: "percentage",
					hideWhenLessThanPercentage: 3
				},
				mainLabel: {
					color: "#333333",
					font: "Open sans",
					fontSize: "11px"
				},
				percentage: {
					color: "#ffffff",
					font: "Open sans",
					fontSize: "10px",
					decimalPlaces: 0
				},
				value: {
					color: "#adadad",
					font: "Open sans",
					fontSize: "11px"
				},
				lines: {
					enabled: true,
					style: "curved",
					length: 32,
					color: "segment"
				}
			},
			effects: {
				load: {
					effect: "default", // none / default
					speed: 1000
				},
				pullOutSegmentOnClick: {
					effect: "linear", // none / linear / bounce
					speed: 400,
					size: 8
				},
				highlightSegmentOnMouseover: true,
				highlightLuminosity: -0.2
			},
			misc: {
				colors: {
					background: null,
					segmentStroke: "#ffffff"
				},
				canvasPadding: {
					top: 5,
					right: 5,
					bottom: 5,
					left: 5
				},
				pieCenterOffset: {
					x: 0,
					y: 25
				}
			}
		},

		// 3
		{
			header: {
				title: {
					text:     "Distribution of love among my pets",
					color:    "#333333",
					fontSize: "14px"
				},
				subtitle: {
					text:     "Proof for my wife that I really don't like her dog",
					color:    "#999999",
					fontSize: "9px"
				},
				location: "top-center"
			},
			size: {
				canvasHeight: 350,
				canvasWidth: 350,
				pieOuterRadius: "47%"
			},
			labels: {
				outer: {
					pieDistance: 18
				},
				inner: {
					hideWhenLessThanPercentage: 7
				},
				percentage: {
					color: "#ffffff",
					fontSize: "8px"
				}
			},
			data: {
				sortOrder: "value-asc",
				content: [
					{ label: "Fish (cat)", value: 35 },
					{ label: "Rehan (cat)", value: 35 },
					{ label: "Mr Pleco (fish)", value: 28 },
					{ label: "Pearl (cat)", value: 15 },
					{ label: "Chairman (cat)", value: 15 },
					{ label: "Shroeder (cat)", value: 12 },
					{ label: "Pig (cat)", value: 10 },
					{ label: "Marvin (frog)", value: 8 },
					{ label: "Burrito (dog) - 1%", value: 2 }
				]
			},
			misc: {
				colors: {
					segments: ["#333333", "#444444", "#555555", "#666666", "#777777", "#888888", "#999999", "#afafaf", "#bcbcbc", "#d8d8d8"]
				}
			}
		}
	];

	return _DEMO_PIES;
});