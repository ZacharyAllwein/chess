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
    if (
      Math.abs(nextIndex - prevIndex) === 2 &&
      (this.boardState[prevIndex] === "blackKing" ||
        this.boardState[prevIndex] === "whiteKing")
    ) {
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

        //spaces that neeed to be empty if we want to castle
        const neededSpaces =
          color === "white"
            ? [
                [57, 58, 59],
                [61, 62],
              ]
            : [
                [1, 2, 3],
                [5, 6],
              ];

        //whether or not the king has moved
        const kingMoved =
          color === "white" ? this.kingsHaveMoved[0] : this.kingsHaveMoved[1];

        //if the king hasn't moved
        if (!kingMoved) {
          //for each of the kings respective rooks
          this.rooksHaveMoved[color === "white" ? 0 : 1].forEach(
            (value, index) => {
              // return if the rook has moved
              if (value) return;

              //if all of the required spaces are empty
              if (neededSpaces[index].every((num) => !this.boardState[num]))
                //add the castling place to allowed moves
                this.allowedMoves[neededSpaces[index][1]] = 1;
            }
          );
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
