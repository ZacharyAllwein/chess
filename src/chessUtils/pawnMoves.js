export default function pawnMoves(color, location, boardState) {
  let allowedMoves = new Array(64).fill(null);

  const homeSquares =
    color === "white"
      ? [48, 49, 50, 51, 52, 53, 54, 55]
      : [8, 9, 10, 11, 12, 13, 14, 15];
  const leftEdge = [0, 8, 16, 24, 32, 40, 48, 56];
  const rightEdge = [7, 15, 23, 31, 39, 47, 55, 63];

  const baseMove = color === "white" ? -8 : 8;
  const attackLocations = [
    (baseMove / 8) * 9 + location,
    (baseMove / 8) * 7 + location,
  ];

  const locationEmpty = (nextLocation) => boardState[nextLocation] === null;
  const getColor = (nextLocation) =>
    boardState[nextLocation] === null
      ? color
      : boardState[nextLocation].substring(0, 5);

  console.log(getColor(attackLocations[0]) !== color);

  if (
    homeSquares.includes(location) &&
    locationEmpty(location + 2 * baseMove)
  ) {
    allowedMoves[location + baseMove * 2] = 1;
  }

  //normal 1 move forward logic
  if (locationEmpty(location + baseMove)) {
    allowedMoves[location + baseMove] = 1;
  }

  //left attack
  if (
    !locationEmpty(attackLocations[0]) &&
    !leftEdge.includes(location) &&
    color !== getColor(attackLocations[0])
  ) {
    allowedMoves[attackLocations[0]] = 1;
  }

  //right attack
  if (
    !locationEmpty(attackLocations[1]) &&
    !rightEdge.includes(location) &&
    color !== getColor(attackLocations[1])
  ) {
    allowedMoves[attackLocations[1]] = 1;
  }

  return allowedMoves;
}
