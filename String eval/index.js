var calc = function (expression) {
	function normlizeWhitespace(exp) {
		let normalized = exp.replace(/[\s]{2,}/gi, " ");

		for (let i = 0; i < normalized.length; i++) {
			if (normalized[i] === " " || normalized[i + 1] === " ") {
				continue;
			}

			if (normalized[i] === "-" && parseFloat(normalized[i + 1])) {
				if (parseFloat(normalized[i - 1])) {
					const indexToInsertWhitespace = i + 1;

					normalized = [
						normalized.slice(0, indexToInsertWhitespace),
						" ",
						normalized.slice(indexToInsertWhitespace),
					].join("");
				}

				// if (
				// 	(normalized[i - 1] === " " && normalized[i - 2] === "/") ||
				// 	normalized[i - 2] === "*" ||
				// 	normalized[i - 2] === "+" //||
				// 	//normalized[i - 2] === "-"
				// ) {
				// 	const indexToInsertWhitespace = i + 1;

				// 	normalized = [
				// 		normalized.slice(0, indexToInsertWhitespace),
				// 		" ",
				// 		normalized.slice(indexToInsertWhitespace),
				// 	].join("");
				// }
			}

			if (
				(parseFloat(normalized[i + 1]) && normalized[i] === "/") ||
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

		return normalized;
	}

	function add(exp) {
		return exp[0] + exp[2];
	}

	function subtract(exp) {
		return exp[0] - exp[2];
	}

	function multiply(exp) {
		return exp[0] * exp[2];
	}

	function divide(exp) {
		return exp[0] / exp[2];
	}

	function hasParas(exp) {
		return exp.includes("(");
	}

	function extractNestedParas(exp, originalExp = exp) {
		const tokens = exp.split("");
		openParaIndex = tokens.indexOf("(");
		closeParaIndex = tokens.lastIndexOf(")");

		const pair = tokens.slice(openParaIndex, closeParaIndex + 1);

		if (pair.indexOf("(") === pair.lastIndexOf("("))
			return {
				mostNestedPara: pair
					.join("")
					.slice(1, pair.length - 1)
					.trim(),
				index: originalExp.indexOf(pair.join("")),
				expressionLength: pair.join("").length,
			};

		pair.pop();

		pair.shift();

		return extractNestedParas(pair.join(""), exp);
	}

	// function normalizeWhitespaceAfterDigitsPara(obj) {
	// 	let normalized = obj.mostNestedPara;

	// 	for (let i = 0; i < normalized.length; i++) {
	// 		if (!parseFloat(normalized[i])) {
	// 			continue;
	// 		}

	// 		if (normalized[i + 1] === " ") {
	// 			continue;
	// 		}

	// 		if (
	// 			normalized[i + 1] === "/" ||
	// 			normalized[i + 1] === "+" ||
	// 			normalized[i + 1] === "*" ||
	// 			normalized[i + 1] === "-"
	// 		) {
	// 			const indexToInsertWhitespace = i + 1;

	// 			normalized = [
	// 				normalized.slice(0, indexToInsertWhitespace),
	// 				" ",
	// 				normalized.slice(indexToInsertWhitespace),
	// 			].join("");
	// 		}
	// 	}

	// 	return {
	// 		mostNestedPara: normalized,
	// 		index: obj.index,
	// 		expressionLength: obj.expressionLength,
	// 	};
	// }

	// function normalizeWhitespaceAfterSignsPara(obj) {
	// 	let normalized = obj.mostNestedPara;

	// 	for (let i = 0; i < normalized.length; i++) {
	// 		if (parseFloat(normalized[i])) {
	// 			continue;
	// 		}

	// 		if (normalized[i] === " " || normalized[i + 1] === " ") {
	// 			continue;
	// 		}

	// 		if (
	// 			normalized[i + 1] === "/" ||
	// 			normalized[i + 1] === "+" ||
	// 			normalized[i + 1] === "*" ||
	// 			normalized[i + 1] === "-"
	// 		) {
	// 			const indexToInsertWhitespace = i + 1;

	// 			normalized = [
	// 				normalized.slice(0, indexToInsertWhitespace),
	// 				" ",
	// 				normalized.slice(indexToInsertWhitespace),
	// 			].join("");
	// 		}
	// 	}

	// 	return {
	// 		mostNestedPara: normalized,
	// 		index: obj.index,
	// 		expressionLength: obj.expressionLength,
	// 	};
	// }

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
	}

	function swapEvaluatedParaExpressionWithResult(
		originalInputExpresion,
		{ index, expressionLength },
		result
	) {
		const stringResult = result.toString();

		return [
			originalInputExpresion.slice(0, index),
			stringResult,
			originalInputExpresion.slice(index + expressionLength),
		].join("");
	}

	function getResult(tokenArray) {
		if (tokenArray.length === 1) return tokenArray[0];

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

			return getResult(newTokenArray);
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

			return getResult(newTokenArray); //?
		}
	}
	const normalizedExpression = normlizeWhitespace(expression);

	const example = extractNestedParas(normalizedExpression);

	// const normalizedAfterDigits = normalizeWhitespaceAfterDigitsPara(example);

	// const normalizedFinished = normalizeWhitespaceAfterSignsPara(
	// 	normalizedAfterDigits
	// );

	const tokensWithMetaInfo = tokenizeParaExp(example);

	const { tokens } = tokensWithMetaInfo;

	const result = getResult(tokens); //?

	const expressionWithoutFirstPara = swapEvaluatedParaExpressionWithResult(
		expression,
		tokensWithMetaInfo,
		result
	); //?

	const rough = normlizeWhitespace("1-1"); //?
};

calc("2 / (2 + (3 - -1/-2 * -5.25)) * 4.33 - -6"); //?

const tests = [
	["1+1", 2],
	["1 - 1", 0],
	["1* 1", 1],
	["1 /1", 1],
	["-123", -123],
	["123", 123],
	["2 /2+3 * 4.75- -6", 21.25],
	["12* 123", 1476],
	["2 / (2 + 3) * 4.33 - -6", 7.732],
];
