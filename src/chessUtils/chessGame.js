import {
  pawnMoves,
  rookMoves,
  knightMoves,
  bishopMoves,
  queenMoves,
  kingMoves,
} from "./moves";

//64 square flat list represented chessGame for keeping track of gameStates
export default class ChessGame {
  constructor() {
    this.boardState = this.genInitialBoardState();
    //0 for white 1 for black
    this.turn = "white";
    this.allowedMoves = [];

    //castling states
    this.kingsHaveMoved = [false, false];
    this.rooksHaveMoved = [
      [false, false],
      [false, false],
    ];
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

  //handles movement logic and states
  movePiece(prevIndex, nextIndex) {
    //castling stuff
    //if one of the kings moved update state values to reflect
    if (this.boardState[prevIndex] === "whiteKing")
      this.kingsHaveMoved[0] = true;
    else if (this.boardState[prevIndex] === "blackKing")
      this.kingsHaveMoved[1] = true;

    //if one of the rooks has moved update state values to reflect
    if (this.boardState[prevIndex] === "whiteRook") {
      //side sensitive truth setting
      if (prevIndex === 56) this.rooksHaveMoved[0][0] = true;
      else if (prevIndex === 63) this.rooksHaveMoved[0][1] = true;
      //same thing as above except for black rooks
    } else if (this.boardState[prevIndex] === "blackRook") {
      if (prevIndex === 0) this.rooksHaveMoved[1][0] = true;
      else if (prevIndex === 7) this.rooksHaveMoved[1][1] = true;
    }

    //actual castling movement
    //if the piece has moved to a casteling position. eg +- 2 of initial position
    if (Math.abs(nextIndex - prevIndex) === 2) {
      // if next index - prevIndex is negative, it is a left castle and the rook is 4 units away else it is right and 3 units away
      let rookIndex =
        (nextIndex - prevIndex) / 2 > 0 ? prevIndex + 3 : prevIndex - 4;
      let nextRookIndex =
        (nextIndex - prevIndex) / 2 > 0 ? nextIndex - 1 : nextIndex + 1;

      this.boardState[nextRookIndex] = this.boardState[rookIndex];
      this.boardState[rookIndex] = null;
    }

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

        //castle time
        // if the white king has not moved before
        if (color === "white" && !this.kingsHaveMoved[0]) {
          //if the left rook has not moved and the spaces inbetween roock and king are empty
          if (
            !this.rooksHaveMoved[0][0] &&
            this.boardState[57] === null &&
            this.boardState[58] === null &&
            this.boardState[59] === null
          )
            this.allowedMoves[58] = 1;

          if (
            !this.rooksHaveMoved[0][1] &&
            this.boardState[61] === null &&
            this.boardState[62] === null
          )
            this.allowedMoves[62] = 1;
        }
        if (color === "black" && !this.kingsHaveMoved[1]) {
          //if the left rook has not moved and the spaces inbetween roock and king are empty
          if (
            !this.rooksHaveMoved[1][0] &&
            this.boardState[1] === null &&
            this.boardState[2] === null &&
            this.boardState[3] === null
          )
            this.allowedMoves[2] = 1;

          if (
            !this.rooksHaveMoved[1][1] &&
            this.boardState[5] === null &&
            this.boardState[6] === null
          )
            this.allowedMoves[6] = 1;
        }
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
