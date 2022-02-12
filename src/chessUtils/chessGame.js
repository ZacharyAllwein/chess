import {
  pawnMoves,
  rookMoves,
  knightMoves,
  bishopMoves,
  queenMoves,
  kingMoves,
} from "./moves";

//64 square flat list represented chessGame for keeping track of boardStates
export default class ChessGame {
  constructor() {
    this.boardState = this.genInitialBoardState();
    //0 for white 1 for black
    this.turn = "white";
    this.allowedMoves = [];
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

  set moves(pieceLocation) {
    const piece = this.boardState[pieceLocation];
    const color = piece.substring(0, 5);
    const type = piece.slice(5, piece.length);

    switch (type) {
      case "Pawn":
        this.allowedMoves = pawnMoves(color, pieceLocation, this.boardState);
        break;
      case "Rook":
        this.allowedMoves = rookMoves(color, pieceLocation, this.boardState);
        break;
      case "Knight":
        this.allowedMoves = knightMoves(color, pieceLocation, this.boardState);
        break;
      case "Bishop":
        this.allowedMoves = bishopMoves(color, pieceLocation, this.boardState);
        break;
      case "Queen":
        this.allowedMoves = queenMoves(color, pieceLocation, this.boardState);
        break;
      case "King":
        this.allowedMoves = kingMoves(color, pieceLocation, this.boardState);
        break;
      default:
        this.allowedMoves = new Array(64).fill(1);
    }

    //because this is the easiest place to do this, also prevent pieces from moving on king
    const blackKingIndex = this.boardState.indexOf("blackKing");
    const whiteKingIndex = this.boardState.indexOf("whiteKing");
    this.allowedMoves[blackKingIndex] = null;
    this.allowedMoves[whiteKingIndex] = null;
  }
}
