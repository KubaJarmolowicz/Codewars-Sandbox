function validateBattlefield(field) {
	const existingShipCoords = [];

	const correctShips = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

	const recordedShips = [];

	for (let i = 0; i < field.length; i++) {
		const row = field[i];

		for (let j = 0; j < row.length; j++) {
			if (hasAdjustentCellAcross(i, j)) {
				return false;
			}
		}
	}

	let shipStartCoords = getShipStartCoords(field);

	while (shipStartCoords) {
		if (
			hasMoreThanOneBranch(
				shipStartCoords.shipStartY,
				shipStartCoords.shipStartX
			)
		) {
			return false;
		}

		if (isSubmarine(shipStartCoords)) {
			recordShipOfLength(1);
			shipStartCoords = getShipStartCoords(field);
			continue;
		}

		const shipDirection = getShipDirection(shipStartCoords);

		let shipLength = 1;

		let previousNodeCoords;

		let nextNodeCoords = getNextNodeCoords(
			{ shipY: shipStartCoords.shipStartY, shipX: shipStartCoords.shipStartX },
			shipDirection
		);

		while (field[nextNodeCoords.shipY][nextNodeCoords.shipX] !== 0) {
			if (hasMoreThanTwoBranches(nextNodeCoords.shipY, nextNodeCoords.shipX)) {
				// -> TWO
				return false;
			}

			markCoordsAsUsed(nextNodeCoords.shipY, nextNodeCoords.shipX);

			shipLength++;

			previousNodeCoords = { ...nextNodeCoords };

			nextNodeCoords = getNextNodeCoords(
				{ shipY: previousNodeCoords.shipY, shipX: previousNodeCoords.shipX },
				shipDirection
			);
		}

		if (
			hasMoreThanOneBranch(previousNodeCoords.shipY, previousNodeCoords.shipX)
		) {
			return false;
		}

		recordShipOfLength(shipLength);

		shipStartCoords = getShipStartCoords(field);

		//break;
	}

	return containsCorrectShips(correctShips, recordedShips);

	////////////////////////////////////////////////////////////////////////

	function getShipStartCoords(field) {
		for (let i = 0; i < field.length; i++) {
			const row = field[i];

			const shipStartY = i;

			//let shipStartX = -1;

			for (let j = 0; j < row.length; j++) {
				if (row[j] === 1 && areFoundCoordsUnused(existingShipCoords, i, j)) {
					const shipStartX = j;

					markCoordsAsUsed(shipStartY, shipStartX);

					return { shipStartY, shipStartX };
				}
			}
			// const shipStartX = row.indexOf(
			// 	row.find(
			// 		(elt, index) =>
			// 			elt === 1 && areFoundCoordsUnused(existingShipCoords, i, index)
			// 	)
			// );

			// if (
			// 	shipStartX !== -1
			// 	// &&
			// 	// areFoundCoordsUnused(existingShipCoords, shipStartY, shipStartX)
			// ) {
			// 	markCoordsAsUsed(shipStartY, shipStartX);

			// 	return { shipStartY, shipStartX };
			// }
		}

		return null;
	}

	function containsCorrectShips(patternArr, checkedArr) {
		const sortedPatternArr = patternArr.sort();
		const sortedCheckedArr = checkedArr.sort();

		return sortedPatternArr.every(
			(elt, index) => elt === sortedCheckedArr[index]
		);
	}

	function markCoordsAsUsed(shipCoordY, shipCoordX) {
		existingShipCoords.push({
			existingShipStartY: shipCoordY,
			existingShipStartX: shipCoordX,
		});
	}

	function isSubmarine({ shipStartY, shipStartX }) {
		// const left = field[shipStartY]?.[shipStartX - 1];
		// const right = field[shipStartY]?.[shipStartX + 1];
		// const up = field[shipStartY - 1]?.[shipStartX];
		// const down = field[shipStartY + 1]?.[shipStartX];

		const left = field[shipStartY] ? field[shipStartY][shipStartX - 1] : null;
		const right = field[shipStartY] ? field[shipStartY][shipStartX + 1] : null;
		const up = field[shipStartY - 1] ? field[shipStartY - 1][shipStartX] : null;
		const down = field[shipStartY + 1]
			? field[shipStartY + 1][shipStartX]
			: null;

		const sum = +!!left + +!!right + +!!up + +!!down;

		return sum === 0;
	}

	function recordShipOfLength(length) {
		recordedShips.push(length);
	}

	function getShipDirection({ shipStartY, shipStartX }) {
		//const left = !!field[shipStartY]?.[shipStartX - 1];
		//const right = !!field[shipStartY]?.[shipStartX + 1];
		const right = !!field[shipStartY]
			? field[shipStartY][shipStartX + 1]
			: null;
		//const up = !!field[shipStartY - 1]?.[shipStartX];
		//const down = !!field[shipStartY + 1]?.[shipStartX];

		return right ? "right" : "down";
	}

	function getNextNodeCoords({ shipY, shipX }, direction) {
		switch (direction) {
			case "right": {
				return { shipY: shipY, shipX: shipX + 1 };
			}

			case "down": {
				return { shipY: shipY + 1, shipX: shipX };
			}

			default: {
				throw new Error("ODJEBALES Z TYM DECIDING NODEM");
			}
		}
	}

	// function isShipEnd({ shipY, shipX }) {
	// 	return field[shipY]?.[shipX] === 0;
	// }

	//function getSubseqentShipNodesCoords({ shipY, shipX, direction }, field) {}

	function areFoundCoordsUnused(existingShipCoords, checkedY, checkedX) {
		return !existingShipCoords.some(
			({ existingShipStartY, existingShipStartX }) =>
				existingShipStartY === checkedY && existingShipStartX === checkedX
		);
	}

	function hasMoreThanOneBranch(cellY, cellX) {
		// const left = field[cellY]?.[cellX - 1];
		// const right = field[cellY]?.[cellX + 1];
		// const up = field[cellY - 1]?.[cellX];
		// const down = field[cellY + 1]?.[cellX];
		const left = field[cellY] ? field[cellY][cellX - 1] : null;
		const right = field[cellY] ? field[cellY][cellX + 1] : null;
		const up = field[cellY - 1] ? field[cellY - 1][cellX] : null;
		const down = field[cellY + 1] ? field[cellY + 1][cellX] : null;

		const sum = +!!left + +!!right + +!!up + +!!down;

		return sum > 1;
	}

	function hasMoreThanTwoBranches(cellY, cellX) {
		// const left = field[cellY]?.[cellX - 1];
		// const right = field[cellY]?.[cellX + 1];
		// const up = field[cellY - 1]?.[cellX];
		// const down = field[cellY + 1]?.[cellX];
		const left = field[cellY] ? field[cellY][cellX - 1] : null;
		const right = field[cellY] ? field[cellY][cellX + 1] : null;
		const up = field[cellY - 1] ? field[cellY - 1][cellX] : null;
		const down = field[cellY + 1] ? field[cellY + 1][cellX] : null;

		const sum = +!!left + +!!right + +!!up + +!!down;

		return sum > 2;
	}

	function hasAdjustentCellAcross(cellY, cellX) {
		if (!field[cellY][cellX]) return false;

		// const upperLeft = field[cellY - 1]?.[cellX - 1];
		// const upperRight = field[cellY - 1]?.[cellX + 1];
		// const lowerLeft = field[cellY + 1]?.[cellX - 1];
		// const lowerRight = field[cellY + 1]?.[cellX + 1];

		const upperLeft = field[cellY - 1] ? field[cellY - 1][cellX - 1] : null;
		const upperRight = field[cellY - 1] ? field[cellY - 1][cellX + 1] : null;
		const lowerLeft = field[cellY + 1] ? field[cellY + 1][cellX - 1] : null;
		const lowerRight = field[cellY + 1] ? field[cellY + 1][cellX + 1] : null;

		return !!upperLeft || !!upperRight || !!lowerLeft || !!lowerRight;
	}
}

validateBattlefield([
	[1, 0, 0, 0, 0, 1, 1, 0, 0, 0],
	[1, 0, 1, 0, 0, 0, 0, 0, 1, 0],
	[1, 0, 1, 0, 1, 1, 1, 0, 1, 0],
	[1, 0, 0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
	[0, 0, 0, 0, 1, 1, 1, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 1, 0],
	[0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 1, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
]); //?
