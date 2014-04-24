require.config({
	baseUrl: "<%=baseUrl%>",

	paths: {
		text: "website/libs/text",
		hbs: "website/libs/hbs",
		handlebars: "<%=handlebarsLib%>",

		<%=moduleStr%>
	}
});