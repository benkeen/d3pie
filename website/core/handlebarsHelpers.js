define(["handlebars"], function(Handlebars) {

	Handlebars.registerHelper("compare", function(lvalue, rvalue, options) {
		if (arguments.length < 3) {
			throw new Error("Handlerbars Helper 'compare' needs 2 parameters");
		}

		var currOperator = options.hash.operator || "==";
		var operators = {
			'==': function (l, r) { return l == r; },
			'===': function (l, r) { return l === r; },
			'!=': function (l, r) { return l != r; },
			'!==': function (l, r) { return l !== r; },
			'<': function (l, r) { return l < r; },
			'>': function (l, r) { return l > r; },
			'<=': function (l, r) { return l <= r; },
			'>=': function (l, r) { return l >= r; },
			'typeof': function (l, r) { return typeof l == r; }
		};

		if (!operators[currOperator]) {
			throw new Error("Handlerbars Helper 'compare' doesn't know the operator " + currOperator);
		}

		var result = operators[currOperator](lvalue, rvalue);
		if (result) {
			return options.fn(this);
		} else {
			return options.inverse(this);
		}
	});

	Handlebars.registerHelper("numbersOnly", function(str) {
		var s = str.toString();
		try {
			s = s.replace(/[^0-9]/g, "");
		} catch (e) {
			console.error("problem in {{numbersOnly}}", arguments);
		}
		return s;
	});

	Handlebars.registerHelper("contains", function(source, target, options) {
		try {
			var targetRegExp = new RegExp(target);
			var matches = targetRegExp.test(source);
			if (matches) {
				return options.fn(this);
			} else {
				return options.inverse(this);
			}
		} catch (e) {
			console.error("problem in {{contains}}", arguments);
			return false;
		}
	});

	Handlebars.registerHelper("count", function(index) {
		return index + 1;
	});
});