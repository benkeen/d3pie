require.config({
	baseUrl: "",
	paths: {

		// core stuff
		text: "core/libs/text",
		hbs: "core/libs/hbs",
		handlebars: "core/libs/handlebars.dev",
		handlebarsHelpers: "core/handlebarsHelpers",
		constants: "core/constants",
		mediator: "core/mediator",
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

		titleTab: "pages/generator/tabTitle.hbs",
		sizeTab: "pages/generator/tabSize.hbs",
		dataTab: "pages/generator/tabData.hbs",
		labelsTab: "pages/generator/tabLabels.hbs",
		footerTab: "pages/generator/tabFooter.hbs",
		colorTab: "pages/generator/tabColors.hbs",
		effectsTab: "pages/generator/tabEffects.hbs",
		eventsTab: "pages/generator/tabEvents.hbs",
		miscTab: "pages/generator/tabMisc.hbs"
	}
});