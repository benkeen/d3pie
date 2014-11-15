define([], function() {

	var _DEMO_PIES = [

		// 1
		{
			header: {
				title: {
					text:     "Programming Languages",
					color:    "#333333",
					fontSize: 22,
					font:     "open sans"
				},
				subtitle: {
					text:     "A full pie chart to show off a few features.",
					color:    "#999999",
					fontSize: 10,
					font:     "open sans"
				},
				location: "top-center",
				titleSubtitlePadding: 5
			},
			footer: {
				text: "",
				color:    "#999999",
				fontSize: 10,
				font:     "open sans",
				location: "bottom-left"
			},
			size: {
				canvasWidth: 350,
				canvasHeight: 350,
				pieInnerRadius: "0%",
				pieOuterRadius: "75%"
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
					hideWhenLessThanPercentage: 5
				},
				mainLabel: {
					color: "#333333",
					font: "Open sans",
					fontSize: 11
				},
				percentage: {
					color: "#ffffff",
					font: "Open sans",
					fontSize: 10,
					decimalPlaces: 0
				},
				value: {
					color: "#adadad",
					font: "Open sans",
					fontSize: 11
				},
				lines: {
					enabled: true,
					style: "curved",
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
					speed: 200,
					size: 8
				},
				highlightSegmentOnMouseover: true,
				highlightLuminosity: -0.4
			},
			misc: {
				colors: {
					background: null,
					segmentStroke: "#ffffff"
				},
				gradient: {
					enabled: true,
					percentage: 85,
					color: "#000000"
				},
				canvasPadding: {
					top: 0,
					right: 0,
					bottom: 0,
					left: 0
				}
			}
		},

		// 2
		{
			header: {
				title: {
					text:     "Top 15 Fears",
					color:    "#333333",
					fontSize: 24,
					font:     "courier"
				},
				subtitle: {
					text:     "What do people fear the most?",
					color:    "#777777",
					fontSize: 11,
					font:     "courier"
				},
				location: "pie-center",
				titleSubtitlePadding: 6
			},
			footer: {
				text:     "* We're not sure why several people regard Winnipeg as a Top 15 Fear.",
				color:    "#999999",
				fontSize: 10,
				font:     "open sans",
				location: "bottom-center"
			},
			size: {
				canvasWidth: 700,
				canvasHeight: 360,
				pieInnerRadius: "95%",
				pieOuterRadius: "100%"
			},
			data: {
				sortOrder: "none",
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
					{ label: "A never-ending Harper Government", value: 1, color: "#646464" },
					{ label: "Rewatching The Matrix Reloaded", value: 4, color: "#747474" }
				]
			},
			labels: {
				enableTooltips: true,
				outer: {
					format: "label-percentage1",
					hideWhenLessThanPercentage: null,
					pieDistance: 20
				},
				inner: {
					format: "none",
					hideWhenLessThanPercentage: null
				},
				mainLabel: {
					color: "#333333",
					font: "Open sans",
					fontSize: 11
				},
				percentage: {
					color: "#999999",
					font: "Open sans",
					fontSize: 11,
					decimalPlaces: 0
				},
				value: {
					color: "#cccc44",
					font: "Open sans",
					fontSize: 11
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
					top: 0,
					right: 0,
					bottom: 5,
					left: 0
				},
				pieCenterOffset: {
					x: 0,
					y: 0
				}
			}
		},

		// 3
		{
			header: {
				title: {
					text:     "Spousal Resentment",
					color:    "#333333",
					fontSize: 26,
					font:     "verdana"
				},
				subtitle: {
					text:     "Comments my wife has made when I tell her I'm working on this script instead of doing something \"fun\".",
					color:    "#888888",
					fontSize: 10,
					font:     "verdana"
				},
				location: "top-center",
				titleSubtitlePadding: 6
			},
			footer: {
				text: 	  "Source: me, my room, the last couple of months.",
				color:    "#999999",
				fontSize: 11,
				font:     "verdana",
				location: "bottom-center"
			},
			size: {
				canvasWidth: 700,
				canvasHeight: 350,
				pieOuterRadius: "78%"
			},
			data: {
				sortOrder: "none",
				content: [
					{ label: "When's it going to be done?", value: 8, color: "#7e3838" },
					{ label: "Bennnnn!", value: 5, color: "#7e6538" },
					{ label: "Oh, god.", value: 2, color: "#7c7e38" },
					{ label: "But it's Friday night!", value: 3, color: "#587e38" },
					{ label: "Again?", value: 2, color: "#387e45" },
					{ label: "I'm considering an affair.", value: 1, color: "#387e6a" },
					{ label: "[baleful stare]", value: 3, color: "#386a7e" }
				]
			},
      tooltips: {
        enabled: true,
        type: "placeholder",
        string: "{label}: {percentage}%",
        styles: {
          fadeInSpeed: 250,
          backgroundColor: "#000000",
          backgroundOpacity: 0.5,
          color: "#efefef",
          borderRadius: 2,
          font: "arial",
          fontSize: 12,
          padding: 8
        }
      },
			labels: {
				enableTooltips: true,
					outer: {
						format: "label",
						hideWhenLessThanPercentage: null,
						pieDistance: 32
					},
					inner: {
						format: "value",
						hideWhenLessThanPercentage: null
					},
					mainLabel: {
						color: "#333333",
						font: "verdana",
						fontSize: 10
					},
					percentage: {
						color: "#e1e1e1",
						font: "verdana",
						fontSize: 10,
						decimalPlaces: 0
					},
					value: {
						color: "#e1e1e1",
						font: "verdana",
						fontSize: 10
					},
					lines: {
						enabled: true,
						style: "curved",
						color: "#cccccc"
					},
					truncation: {
						enabled: true,
						length: 30
					}
				},
			effects: {
				load: {
					effect: "default", // none / default
					speed: 1000
				},
				pullOutSegmentOnClick: {
					effect: "bounce", // none / linear / bounce
					speed: 250,
					size: 12
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
				}
			}
		}
	];

	return _DEMO_PIES;
});
