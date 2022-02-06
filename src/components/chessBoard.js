import BoardSquare from "./boardSquare.js";

function ChessBoard() {
  //values to place things
  let chessBoard = [];
  for (let i = 0; i < 64; i++) {
    chessBoard.push(i);
  }

  //location map that stores places of pieces
  let locationMap = {};

  //placing pawns
  for (let i = 8; i < 16; i++) {
    locationMap[i] = "blackPawn";
  }

  for (let i = 48; i < 56; i++) {
    locationMap[i] = "whitePawn";
  }

  //placing other pieces
  const pieceMap = [
    "Rook",
    "Knight",
    "Bishop",
    "Queen",
    "King",
    "Bishop",
    "Knight",
    "Rook",
  ];
  //starting places for main pieces
  const startingPlaces = [0, 56];

  //placing more important chess pieces using above map
  startingPlaces.forEach((startingPlace) => {
    for (let i = startingPlace; i < startingPlace + 8; i++) {
      let pieceColor = i >= 56 ? "white" : "black";
      let pieceType = i >= 56 ? pieceMap[i - 56] : pieceMap[i];

      locationMap[i] = pieceColor + pieceType;
    }
  });

  //assign null to all empty spaces
  for (let i = 16; i < 48; i++) {
    locationMap[i] = null;
  }

  return (
    <div className="chess-board">
      {chessBoard.map((num) => {
        return (
          <BoardSquare
            color={(Math.floor(num / 8) + num) % 2}
            chessPiece={locationMap[num]}
          />
        );
      })}
    </div>
  );
}

export default ChessBoard;
