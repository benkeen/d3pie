require.config({
	baseUrl: "website/",
	paths: {

		// library stuff
		text: "libs/text",
		hbs: "libs/hbs",

		// core stuff
		handlebarsHelpers: "core/handlebarsHelpers",
		constants: "core/constants",
		mediator: "core/mediator",
		utils: "core/utils",
		pageHelper: "core/pageHelper",

		// About page
		aboutPage: "pages/about/aboutPage",
		aboutPageTemplate: "pages/about/aboutPage.hbs",
		aboutPageDemoPies: "pages/about/aboutPageDemoPies",

		// Generator page
		generatorPage: "pages/generator/generatorPage",
		generatorTabs: "pages/generator/generatorTabs",
		examplePies: "pages/generator/examplePies",
		examplePiesTemplate: "pages/generator/examplePies.hbs",
		generatorPageTemplate: "pages/generator/generatorPage.hbs",

		// Download page
		downloadPage: "pages/download/downloadPage",
		downloadPageTemplate: "pages/download/downloadPage.hbs",

		// Help pages
		helpPage: "pages/help/helpPage",
		helpPageTemplate: "pages/help/helpPage.hbs",
		documentationPage: "pages/help/documentationPage",
		documentationPageTemplate: "pages/help/documentationPage.hbs",
		quickStartPage: "pages/help/quickStartPage",
		quickStartPageTemplate: "pages/help/quickStartPage.hbs",
		examplesPage: "pages/help/examplesPage",
		examplesPageTemplate: "pages/help/examplesPage.hbs",

		// --- tabs ---
		startTab: "pages/generator/tabs/start/tabStart",
		startTabTemplate: "pages/generator/tabs/start/tabStartTemplate.hbs",

		titleTab: "pages/generator/tabs/title/tabTitle",
		titleTabTemplate: "pages/generator/tabs/title/tabTitleTemplate.hbs",

		sizeTab: "pages/generator/tabs/size/tabSize",
		sizeTabTemplate: "pages/generator/tabs/size/tabSizeTemplate.hbs",

		miscTab: "pages/generator/tabs/misc/tabMisc",
		miscTabTemplate: "pages/generator/tabs/misc/tabMiscTemplate.hbs",

		dataTab: "pages/generator/tabs/data/tabData",
		dataTabTemplate: "pages/generator/tabs/data/tabDataTemplate.hbs",
		dataRowPartial: "pages/generator/tabs/data/dataRowPartial.hbs",
		colorsets: "pages/generator/tabs/data/colorsets",

		labelsTab: "pages/generator/tabs/labels/tabLabels",
		labelsTabTemplate: "pages/generator/tabs/labels/tabLabelsTemplate.hbs",

		footerTab: "pages/generator/tabs/footer/tabFooter",
		footerTabTemplate: "pages/generator/tabs/footer/tabFooterTemplate.hbs",

		effectsTab: "pages/generator/tabs/effects/tabEffects",
		effectsTabTemplate: "pages/generator/tabs/effects/tabEffectsTemplate.hbs",

		eventsTab: "pages/generator/tabs/events/tabEvents",
		eventsTabTemplate: "pages/generator/tabs/events/tabEventsTemplate.hbs",

		generateTab: "pages/generator/tabs/generate/tabGenerate",
		generateTabTemplate: "pages/generator/tabs/generate/tabGenerateTemplate.hbs",
		generatedContentTemplate: "pages/generator/tabs/generate/generatedContent.hbs",

		// misc
		birds: "pages/generator/birds"
	}
});