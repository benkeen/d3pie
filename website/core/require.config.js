require.config({
	baseUrl: "website/",
	paths: {

		// library stuff
		text: "libs/text",
		hbs: "libs/hbs",
		handlebars: "libs/handlebars.dev",

		// core stuff
		handlebarsHelpers: "core/handlebarsHelpers",
		constants: "core/constants",
		mediator: "core/mediator",
		utils: "core/utils",
		pageHelper: "core/pageHelper",

		// About page
		aboutPage: "pages/about/aboutPage",
		aboutPageTemplate: "pages/about/aboutPage.hbs",

		// Documentation page
		documentationPage: "pages/documentation/documentationPage",
		documentationPageTemplate: "pages/documentation/documentationPage.hbs",

		// Download page
		downloadPage: "pages/download/downloadPage",
		downloadPageTemplate: "pages/download/downloadPage.hbs",

		// Generator page
		generatorPage: "pages/generator/generatorPage",
		generatorTabs: "pages/generator/generatorTabs",
		examplePiesTemplate: "pages/generator/examplePies.hbs",
		generatorPageTemplate: "pages/generator/generatorPage.hbs",

		// --- tabs ---
		titleTab: "pages/generator/tabTitle",
		titleTabTemplate: "pages/generator/tabTitleTemplate.hbs",

		sizeTab: "pages/generator/tabSize",
		sizeTabTemplate: "pages/generator/tabSizeTemplate.hbs",

		miscTab: "pages/generator/tabMisc",
		miscTabTemplate: "pages/generator/tabMiscTemplate.hbs",

		dataTab: "pages/generator/tabData",
		dataTabTemplate: "pages/generator/tabDataTemplate.hbs",

		labelsTab: "pages/generator/tabLabels",
		labelsTabTemplate: "pages/generator/tabLabelsTemplate.hbs",

		footerTab: "pages/generator/tabFooter",
		footerTabTemplate: "pages/generator/tabFooterTemplate.hbs",

		colorsTab: "pages/generator/tabColors",
		colorsTabTemplate: "pages/generator/tabColorsTemplate.hbs",

		effectsTab: "pages/generator/tabEffects",
		effectsTabTemplate: "pages/generator/tabEffectsTemplate.hbs",

		eventsTab: "pages/generator/tabEvents",
		eventsTabTemplate: "pages/generator/tabEventsTemplate.hbs",

		// misc
		birds: "pages/generator/birds"
	}
});