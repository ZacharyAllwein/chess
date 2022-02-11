//edges of boards for movement control
const leftEdge = [0, 8, 16, 24, 32, 40, 48, 56];
const rightEdge = [7, 15, 23, 31, 39, 47, 55, 63];

//helper functions for figuring out what is in the next squares
const locationEmpty = (boardState, nextLocation) =>
  boardState[nextLocation] === null;
const getColor = (boardState, nextLocation, color) =>
  boardState[nextLocation] === null
    ? color
    : boardState[nextLocation].substring(0, 5);

//function that controls pawn movement
function pawnMoves(color, location, boardState) {
  let allowedMoves = new Array(64).fill(null);

  const homeSquares =
    color === "white"
      ? [48, 49, 50, 51, 52, 53, 54, 55]
      : [8, 9, 10, 11, 12, 13, 14, 15];

  const baseMove = color === "white" ? -8 : 8;
  const attackLocations = [
    (baseMove / 8) * 9 + location,
    (baseMove / 8) * 7 + location,
  ];

  if (
    homeSquares.includes(location) &&
    locationEmpty(boardState, location + 2 * baseMove)
  ) {
    allowedMoves[location + baseMove * 2] = 1;
  }

  //normal 1 move forward logic
  if (locationEmpty(boardState, location + baseMove)) {
    allowedMoves[location + baseMove] = 1;
  }

  //left attack
  if (
    !locationEmpty(boardState, attackLocations[0]) &&
    !leftEdge.includes(location) &&
    color !== getColor(boardState, attackLocations[0], color)
  ) {
    allowedMoves[attackLocations[0]] = 1;
  }

  //right attack
  if (
    !locationEmpty(boardState, attackLocations[1]) &&
    !rightEdge.includes(location) &&
    color !== getColor(boardState, attackLocations[1], color)
  ) {
    allowedMoves[attackLocations[1]] = 1;
  }

  return allowedMoves;
}

//function that controls rook movement
function rookMoves(color, location, boardState) {
  let allowedMoves = new Array(64).fill(null);

  //white relative directions, the moves they make and constraints they impose
  const directions = {
    forward: {
      modifier: -8,
      constraint: (curLocation) => curLocation > 7,
    },
    backwards: {
      modifier: 8,
      constraint: (curLocation) => curLocation < 56,
    },
    left: {
      modifier: -1,
      constraint: (curLocation) => !leftEdge.includes(curLocation),
    },
    right: {
      modifier: 1,
      constraint: (curLocation) => !rightEdge.includes(curLocation),
    },
  };

  //get a list containing all of the directions
  const directionsKeys = Object.keys(directions);

  //iterate through that list
  directionsKeys.forEach((direction) => {
    let curLocation = location;

    while (
      //basically if it is within the logical movement of the piece and the place it is moving is unoccupied or has a piece of a different color on it
      // I don't think even a million comments could explain this one

      //if it is within the constraints
      directions[direction].constraint(curLocation) &&
      // and the next location is empty or it has a piece of a different color on it
      (locationEmpty(
        boardState,
        curLocation + directions[direction].modifier
      ) ||
        getColor(
          boardState,
          curLocation + directions[direction].modifier,
          color
        ) !== color)
    ) {
      //increment the current location
      curLocation += directions[direction].modifier;

      //add the new location to the allowed list
      allowedMoves[curLocation] = 1;

      //catches if it has taken a piece and breaks the loop
      if (getColor(boardState, curLocation, color) !== color) break;
    }
  });

  return allowedMoves;
}

export { pawnMoves, rookMoves };
