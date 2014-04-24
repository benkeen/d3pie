require.config({
	baseUrl: "website/",

	paths: {
		text: "website/libs/text",
		hbs: "website/libs/hbs",
		handlebars: "website/libs/handlebars.prod",

		<%=moduleStr%>
	}
});