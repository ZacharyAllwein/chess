//64 square flat list represented chessGame for keeping track of boardStates
export default class ChessGame {
  constructor() {
    this.boardState = this.genInitialBoardState();
    //0 for white 1 for black
    this.turn = "white";
  }

  genInitialBoardState() {
    //location map that stores places of pieces
    let boardState = new Array(64).fill(null);

    //placing pawns
    for (let i = 8; i < 16; i++) {
      boardState[i] = "blackPawn";
    }

    for (let i = 48; i < 56; i++) {
      boardState[i] = "whitePawn";
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

        boardState[i] = pieceColor + pieceType;
      }
    });

    return boardState;
  }

  //handles movement logic
  movePiece(prevIndex, nextIndex) {
    this.boardState[nextIndex] = this.boardState[prevIndex];
    this.boardState[prevIndex] = null;
  }
}
