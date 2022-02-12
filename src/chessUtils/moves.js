//edges of boards for movement control
const leftEdge = [0, 8, 16, 24, 32, 40, 48, 56];
const rightEdge = [7, 15, 23, 31, 39, 47, 55, 63];

//helper functions for figuring out what is in the next squares
const locationEmpty = (boardState, nextLocation) =>
  boardState[nextLocation] == null;
const getColor = (boardState, nextLocation, color) =>
  boardState[nextLocation] === undefined || boardState[nextLocation] == null
    ? color
    : boardState[nextLocation].substring(0, 5);

//tells whether or not a move is logical from a starting position for linear moving pieces eg: rook, bishop, queen, king
const canMove = (curLocation, move) => {
  //if it is on the edge and it will move off the board
  if ((move === -9 || move === 7) && leftEdge.includes(curLocation))
    return false;
  else if ((move === 9 || move === -7) && rightEdge.includes(curLocation))
    return false;

  //if the move will be out of bounds
  if (curLocation + move < 0 || curLocation + move > 63) return false;

  if (move === -1 && leftEdge.includes(curLocation)) return false;
  else if (move === 1 && rightEdge.includes(curLocation)) return false;

  //catches moves that would keep piece in same row
  if (move === 7 && leftEdge.includes(curLocation)) return false;
  else if (move === -7 && rightEdge.includes(curLocation)) return false;

  return true;
};

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

function linearMovesBase(color, location, boardState, baseMoves) {
  let allowedMoves = new Array(64).fill(null);

  baseMoves.forEach((move) => {
    let curLocation = location;

    while (
      //if a move will be valid
      canMove(curLocation, move) &&
      //and the next place it moves is either empty or an enemy square
      (locationEmpty(boardState, curLocation + move) ||
        getColor(boardState, curLocation + move, color) !== color)
    ) {
      curLocation += move;
      allowedMoves[curLocation] = 1;

      //if it moved on an enemy square, it is done moving
      if (getColor(boardState, curLocation, color) !== color) break;
    }
  });

  return allowedMoves;
}

function rookMoves(color, location, boardState) {
  const baseMoves = [-8, -1, 8, 1];
  return linearMovesBase(color, location, boardState, baseMoves);
}

function bishopMoves(color, location, boardState) {
  const baseMoves = [-9, -7, 7, 9];
  return linearMovesBase(color, location, boardState, baseMoves);
}

function knightMoves(color, location, boardState) {
  let allowedMoves = new Array(64).fill(null);

  //I hate 2d math but here we are
  let twoDPos = [Math.floor(location / 8), location % 8];
  let moves = [
    [2, -1],
    [2, 1],
    [1, -2],
    [1, 2],
    [-1, -2],
    [-1, 2],
    [-2, -1],
    [-2, 1],
  ];

  //basically make sure the move won't take you off the board
  moves = moves.filter(
    (move) =>
      -1 < move[0] + twoDPos[0] &&
      move[0] + twoDPos[0] < 8 &&
      -1 < move[1] + twoDPos[1] &&
      move[1] + twoDPos[1] < 8
  );

  //translate the 2d moves back into normal flat move Yay!!
  const nextLocations = moves.map((move) => location + move[0] * 8 + move[1]);

  //loop that adds the nextLocation to the allowedMoves if it is empty or has an enemy piece on it
  nextLocations.forEach((nextLocation) => {
    if (
      locationEmpty(boardState, nextLocation) ||
      color !== getColor(boardState, nextLocation, color)
    ) {
      allowedMoves[nextLocation] = 1;
    }
  });

  return allowedMoves;
}

function queenMoves(color, location, boardState) {
  const flatMoves = rookMoves(color, location, boardState);
  const diagMoves = bishopMoves(color, location, boardState);

  //wait I can't just caluclate the queens moves by seeing what the moves would be if it was a bishop and a rook and combining them can I?
  //huh...
  return flatMoves.map((value, index) =>
    value === 1 ? value : diagMoves[index] === 1 ? diagMoves[index] : null
  );
}

function kingMoves(color, location, boardState) {
  let allowedMoves = new Array(64).fill(null);

  //moves the king can make
  const baseMoves = [-9, -8, -7, -1, 1, 7, 8, 9];

  baseMoves.forEach((move) => {
    if (
      //if the nextlocation is logical and empty or occupied by an enemy piece.
      canMove(location, move) &&
      (locationEmpty(boardState, location + move) ||
        getColor(boardState, location + move, color) !== color)
    )
      allowedMoves[location + move] = 1;
  });

  return allowedMoves;
}
export {
  pawnMoves,
  rookMoves,
  knightMoves,
  bishopMoves,
  queenMoves,
  kingMoves,
};
