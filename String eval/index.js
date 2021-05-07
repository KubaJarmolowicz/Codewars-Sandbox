const calc = function (expression) {
	let normalizedExpression = normlizeWhitespace(expression);

	if (hasParas(normalizedExpression)) {
		let mostNestedExpression = extractNestedParas(normalizedExpression);

		const mostNestedPara = identifyMostNestedPara(normalizedExpression);

		if (
			isNegatedPara(normalizedExpression, mostNestedPara) &&
			hasASignBeforeMinus(normalizedExpression, mostNestedPara)
		) {
			mostNestedExpression.mostNestedPara = mostNestedExpression.mostNestedPara
				.split(" ")
				.map(elt =>
					!Number.isNaN(parseFloat(elt))
						? (parseFloat(elt) * -1).toString()
						: elt
				)
				.join(" ");

			mostNestedExpression.index -= 2;

			mostNestedExpression.expressionLength += 3;

			normalizedExpression = [
				normalizedExpression.slice(0, mostNestedPara.index - 2),
				...[` (${mostNestedExpression.mostNestedPara})`],
				normalizedExpression.slice(
					mostNestedPara.index + mostNestedPara.expressionLength
				),
			].join(" ");
		}

		const tokenizedNestedExpression = tokenizeParaExp(mostNestedExpression);

		const { tokens } = tokenizedNestedExpression;

		const evaluatedNestedExpression = getSimpleExpressionResult(tokens);

		const orginalExpWithoutMostNestedParas = swapEvaluatedParaExpressionWithResult(
			normalizedExpression,
			tokenizedNestedExpression,
			evaluatedNestedExpression
		);

		return calc(orginalExpWithoutMostNestedParas);
	}

	const tokenizedExpWithoutParas = tokenizeSimpleExp(normalizedExpression);

	const result = getSimpleExpressionResult(tokenizedExpWithoutParas);

	return parseFloat(result);

	function normlizeWhitespace(exp) {
		let normalized = exp.replace(/[\s]{2,}/gi, " ");

		for (let i = 0; i < normalized.length; i++) {
			if (
				normalized[i] === "(" ||
				normalized[i] === " " ||
				normalized[i + 1] === " "
			) {
				continue;
			}

			if (
				normalized[i] === "-" &&
				!Number.isNaN(parseFloat(normalized[i + 1]))
			) {
				if (!Number.isNaN(parseFloat(normalized[i - 1]))) {
					const indexToInsertWhitespace = i + 1;

					normalized = [
						normalized.slice(0, indexToInsertWhitespace),
						" ",
						normalized.slice(indexToInsertWhitespace),
					].join("");
				}

				if (
					normalized[i - 1] === " " &&
					!Number.isNaN(parseFloat(normalized[i - 2]))
				) {
					const indexToInsertWhitespace = i + 1;

					normalized = [
						normalized.slice(0, indexToInsertWhitespace),
						" ",
						normalized.slice(indexToInsertWhitespace),
					].join("");
				}
			}

			if (
				(!Number.isNaN(parseFloat(normalized[i + 1])) &&
					normalized[i] === "/") ||
				normalized[i] === "+" ||
				normalized[i] === "*"
			) {
				const indexToInsertWhitespace = i + 1;

				normalized = [
					normalized.slice(0, indexToInsertWhitespace),
					" ",
					normalized.slice(indexToInsertWhitespace),
				].join("");
			}

			if (
				normalized[i + 1] === "(" ||
				normalized[i + 1] === "/" ||
				normalized[i + 1] === "+" ||
				normalized[i + 1] === "*" ||
				normalized[i + 1] === "-"
			) {
				const indexToInsertWhitespace = i + 1;

				normalized = [
					normalized.slice(0, indexToInsertWhitespace),
					" ",
					normalized.slice(indexToInsertWhitespace),
				].join("");
			}
		}

		return normalized.trim();
	}

	function hasParas(exp) {
		return exp.includes("(");
	}

	function extractNestedParas(exp) {
		const tokens = exp.split("");
		openParaIndex = tokens.lastIndexOf("(");
		closeParaIndex =
			[...tokens.slice(openParaIndex)].indexOf(")") + openParaIndex;

		const pair = tokens.slice(openParaIndex, closeParaIndex + 1);

		return {
			mostNestedPara: pair
				.slice(1, pair.length - 1)
				.join("")
				.trim(),
			index: exp.indexOf(pair.join("")),
			expressionLength: pair.join("").length,
		};
	}

	function identifyMostNestedPara(exp) {
		const tokens = exp.split("");
		openParaIndex = tokens.lastIndexOf("(");
		closeParaIndex =
			[...tokens.slice(openParaIndex)].indexOf(")") + openParaIndex;

		const pair = tokens.slice(openParaIndex, closeParaIndex + 1);

		return {
			mostNestedPara: pair.join("").trim(),
			index: exp.indexOf(pair.join("")),
			expressionLength: pair.join("").length,
		};
	}

	function isNegatedPara(originalInputExpresion, { index }) {
		return originalInputExpresion[index - 2] === "-";
	}

	function hasASignBeforeMinus(originalInputExpresion, { index }) {
		return (
			originalInputExpresion[index - 4] === "-" ||
			originalInputExpresion[index - 4] === "+" ||
			originalInputExpresion[index - 4] === "/" ||
			originalInputExpresion[index - 4] === "*"
		);
	}

	function tokenizeParaExp(obj) {
		return {
			tokens: obj.mostNestedPara.split(" "),
			index: obj.index,
			expressionLength: obj.expressionLength,
		};
	}

	function tokenizeSimpleExp(exp) {
		return exp.split(" ");
	}

	function swapEvaluatedParaExpressionWithResult(
		originalInputExpresion,
		{ index, expressionLength },
		result
	) {
		const stringResult = result.toString();

		const expWithSwappedResult = [
			originalInputExpresion.slice(0, index),
			stringResult,
			originalInputExpresion.slice(index + expressionLength),
		].join("");

		return expWithSwappedResult;
	}

	function isSingleNegatedDigit(tokenArray) {
		return tokenArray.length === 2 && tokenArray[0] === "-";
	}

	function getSimpleExpressionResult(tokenArray) {
		if (tokenArray.length === 1) return tokenArray[0];

		if (isSingleNegatedDigit(tokenArray)) {
			return (parseFloat(tokenArray[1]) * -1).toString();
		}

		if (tokenArray.includes("/") || tokenArray.includes("*")) {
			let indexOfPrioritySign;

			if (tokenArray.indexOf("/") === -1) {
				indexOfPrioritySign = tokenArray.indexOf("*");
			}

			if (tokenArray.indexOf("*") === -1) {
				indexOfPrioritySign = tokenArray.indexOf("/");
			}

			if (tokenArray.indexOf("/") !== -1 && tokenArray.indexOf("*") !== -1) {
				indexOfPrioritySign =
					tokenArray.indexOf("/") < tokenArray.indexOf("*")
						? tokenArray.indexOf("/")
						: tokenArray.indexOf("*");
			}

			const subArr = [
				tokenArray[indexOfPrioritySign - 1],
				tokenArray[indexOfPrioritySign],
				tokenArray[indexOfPrioritySign + 1],
			];

			const newResult = executeMathOperation(subArr).toString();

			const newTokenArray = [...tokenArray];

			newTokenArray.splice(indexOfPrioritySign - 1, 3, newResult);

			return getSimpleExpressionResult(newTokenArray);
		}

		if (tokenArray.includes("+") || tokenArray.includes("-")) {
			let indexOfNonPrioritySign;

			if (tokenArray.indexOf("+") === -1) {
				indexOfNonPrioritySign = tokenArray.indexOf("-");
			}

			if (tokenArray.indexOf("-") === -1) {
				indexOfNonPrioritySign = tokenArray.indexOf("+");
			}

			if (tokenArray.indexOf("+") !== -1 && tokenArray.indexOf("-") !== -1) {
				indexOfNonPrioritySign =
					tokenArray.indexOf("+") < tokenArray.indexOf("-")
						? tokenArray.indexOf("+")
						: tokenArray.indexOf("-");
			}

			const subArr = [
				tokenArray[indexOfNonPrioritySign - 1],
				tokenArray[indexOfNonPrioritySign],
				tokenArray[indexOfNonPrioritySign + 1],
			];

			const newResult = executeMathOperation(subArr).toString();

			const newTokenArray = [...tokenArray];

			newTokenArray.splice(indexOfNonPrioritySign - 1, 3, newResult);

			return getSimpleExpressionResult(newTokenArray); //?
		}

		function executeMathOperation(tokensArr) {
			const sign = tokensArr[1];
			switch (sign) {
				case "+": {
					return add(tokensArr);
				}
				case "-": {
					return subtract(tokensArr);
				}
				case "*": {
					return multiply(tokensArr);
				}
				case "/": {
					return divide(tokensArr);
				}
			}

			function add(exp) {
				return parseFloat(exp[0]) + parseFloat(exp[2]);
			}

			function subtract(exp) {
				return parseFloat(exp[0]) - parseFloat(exp[2]);
			}

			function multiply(exp) {
				return parseFloat(exp[0]) * parseFloat(exp[2]);
			}

			function divide(exp) {
				return parseFloat(exp[0]) / parseFloat(exp[2]);
			}
		}
	}
};

calc("(1 - 2) + - (- (- (-4)))"); //?
calc("(2+1)*2 / (2 + (3 --(8+3))*7) * 4.33 - -6"); //?
calc("(1 - 2) + - (- 4)"); //?
