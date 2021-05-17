function validateBattlefield(field) {
	const existingShipCoords = [];

	const correctShips = [4, 3, 3, 2, 2, 2, 1, 1, 1, 1];

	const recordedShips = [];

	for (let i = 0; i < field.length; i++) {
		const row = field[i];

		for (let j = 0; j < row.length; j++) {
			if (hasAdjustentNodeZAxis(i, j)) {
				return false;
			}
		}
	}

	let unusedStartCoords = getShipStartCoords(field);

	while (unusedStartCoords) {
		if (
			hasMoreThanOneAdjustentNode(
				unusedStartCoords.shipStartY,
				unusedStartCoords.shipStartX
			)
		) {
			return false;
		}

		if (isSubmarine(unusedStartCoords)) {
			recordShipOfLength(1);
			unusedStartCoords = getShipStartCoords(field);
			continue;
		}

		const shipDirection = getShipDirection(unusedStartCoords);

		let shipLength = 1;

		let currentNodeCoords;

		let nextNodeCoords = getNextNodeCoords(
			{
				shipY: unusedStartCoords.shipStartY,
				shipX: unusedStartCoords.shipStartX,
			},
			shipDirection
		);

		while (field[nextNodeCoords.shipY][nextNodeCoords.shipX] !== 0) {
			if (
				hasMoreThanTwoAdjustentNodes(nextNodeCoords.shipY, nextNodeCoords.shipX)
			) {
				return false;
			}

			markCoordsAsUsed(nextNodeCoords.shipY, nextNodeCoords.shipX);

			shipLength++;

			currentNodeCoords = { ...nextNodeCoords };

			nextNodeCoords = getNextNodeCoords(
				{ shipY: currentNodeCoords.shipY, shipX: currentNodeCoords.shipX },
				shipDirection
			);
		}

		if (
			hasMoreThanOneAdjustentNode(
				currentNodeCoords.shipY,
				currentNodeCoords.shipX
			)
		) {
			return false;
		}

		recordShipOfLength(shipLength);

		unusedStartCoords = getShipStartCoords(field);
	}

	return containsCorrectShips(correctShips, recordedShips);

	////////////////////////////////////////////////////////////////////////

	function getShipStartCoords(field) {
		for (let i = 0; i < field.length; i++) {
			const row = field[i];

			const shipStartY = i;

			for (let j = 0; j < row.length; j++) {
				if (row[j] === 1 && areFoundCoordsUnused(existingShipCoords, i, j)) {
					const shipStartX = j;

					markCoordsAsUsed(shipStartY, shipStartX);

					return { shipStartY, shipStartX };
				}
			}
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
		const { left, right, up, down } = getAdjustentNodesXandYAxes(
			shipStartY,
			shipStartX
		);

		const sum = +!!left + +!!right + +!!up + +!!down;

		return sum === 0;
	}

	function recordShipOfLength(length) {
		recordedShips.push(length);
	}

	function getShipDirection({ shipStartY, shipStartX }) {
		const right = !!field[shipStartY]
			? field[shipStartY][shipStartX + 1]
			: null;

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

	function areFoundCoordsUnused(existingShipCoords, checkedY, checkedX) {
		return !existingShipCoords.some(
			({ existingShipStartY, existingShipStartX }) =>
				existingShipStartY === checkedY && existingShipStartX === checkedX
		);
	}

	function hasMoreThanOneAdjustentNode(cellY, cellX) {
		const { left, right, up, down } = getAdjustentNodesXandYAxes(cellY, cellX);

		const sum = +!!left + +!!right + +!!up + +!!down;

		return sum > 1;
	}

	function hasMoreThanTwoAdjustentNodes(cellY, cellX) {
		const { left, right, up, down } = getAdjustentNodesXandYAxes(cellY, cellX);

		const sum = +!!left + +!!right + +!!up + +!!down;

		return sum > 2;
	}

	function hasAdjustentNodeZAxis(cellY, cellX) {
		if (!field[cellY][cellX]) return false;

		const upperLeft = field[cellY - 1] ? field[cellY - 1][cellX - 1] : null;
		const upperRight = field[cellY - 1] ? field[cellY - 1][cellX + 1] : null;
		const lowerLeft = field[cellY + 1] ? field[cellY + 1][cellX - 1] : null;
		const lowerRight = field[cellY + 1] ? field[cellY + 1][cellX + 1] : null;

		return !!upperLeft || !!upperRight || !!lowerLeft || !!lowerRight;
	}

	function getAdjustentNodesXandYAxes(cellY, cellX) {
		const left = field[cellY] ? field[cellY][cellX - 1] : null;
		const right = field[cellY] ? field[cellY][cellX + 1] : null;
		const up = field[cellY - 1] ? field[cellY - 1][cellX] : null;
		const down = field[cellY + 1] ? field[cellY + 1][cellX] : null;

		return { left, right, up, down };
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
