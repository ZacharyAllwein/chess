import BoardSquare from "./BoardSquare.js";
import React, { useState, useRef, useEffect } from "react";
import ChessGame from "../chessUtils/chessGame.js";

//everything has to be responsive. .064 is the basic vw size unit used for scaling chessboard squares
const game = new ChessGame();
// chess board component
function Game() {
  //game that handles board state data

  let chessBoardRef = useRef(null);

  //useStates
  const [chessBoardSquareSize, setChessBoardSquareSize] = useState(
    0.064 * window.innerWidth
  );
  const [boardState, setBoardState] = useState(game.boardState);
  //haven't used it yet, but bound to need it at some point
  const [activePiece, setActivePiece] = useState(null);
  const [turn, setTurn] = useState(game.turn);

  //when window changes sizes, so does the defined chessboardsquare size so movement still works
  const resize = () => setChessBoardSquareSize(0.064 * window.innerWidth);
  useEffect(() => {
    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  });

  //function to grab onto piece and assign active piece element
  function grabPiece(e) {
    let element = e.target;

    //figure out the color by slicing and dicing the css
    const color = element.style.backgroundImage.slice(24, -6).substring(0, 5);

    if (
      element.classList.contains("chess-piece") &&
      !activePiece &&
      color === turn
    ) {
      element.style.position = "absolute";

      //elements should be grabbed at the center, this takes care of that offset
      element.style.left = `${e.clientX - chessBoardSquareSize / 2}px`;
      element.style.top = `${e.clientY - chessBoardSquareSize / 2}px`;

      setActivePiece(element);
    }
  }

  //once active piece has been assigned, the piece can be moved
  function movePiece(e) {
    let chessBoard = chessBoardRef.current;

    // lots of math to determine pixel positions, ok wel it's not that much but it is enough
    const isInBounds = (x, y) => {
      let edgeAdjust = chessBoardSquareSize / 2;

      const maxX =
        chessBoard.offsetLeft + 8 * chessBoardSquareSize - edgeAdjust;
      const minX = chessBoard.offsetLeft + edgeAdjust;
      const maxY = chessBoard.offsetTop + 8 * chessBoardSquareSize - edgeAdjust;
      const minY = chessBoard.offsetTop + edgeAdjust;

      return x >= minX && x <= maxX && y >= minY && y <= maxY;
    };

    if (activePiece) {
      //checks if it is inbounds, else reutnrs
      if (!isInBounds(e.clientX, e.clientY)) return;
      activePiece.style.top = `${e.clientY - chessBoardSquareSize / 2}px`;
      activePiece.style.left = `${e.clientX - chessBoardSquareSize / 2}px`;
    }
  }

  //once the user is done moving the piece, it needs to be set down, and replace a piece that was there.
  function setDownPiece(e) {
    let chessBoard = chessBoardRef.current;

    if (activePiece) {

      //figure out where it currently is and what type of piece it is
      let previousLocation = parseInt(activePiece.id);
      //reset active piece so it can be used again and will stop moving
      setActivePiece(null);

      //uses pixel calculations to figure out index of where piece was dropped
      let nextLocation =
        Math.floor((e.clientX - chessBoard.offsetLeft) / chessBoardSquareSize) +
        Math.floor((e.clientY - chessBoard.offsetTop) / chessBoardSquareSize) *
          8;

      //moving pieces!!!

      //if there was no movement don't do anything
      if(previousLocation === nextLocation) return;

      game.movePiece(previousLocation, nextLocation);

      //umm yeah it works though
      setBoardState(game.boardState.map((piece) => piece));

      //now we need to change who's turn it is via inverting it with ternary operations
      setTurn(turn === "white" ? "black" : "white");
    }
  }

  return (
    <div
      className="chess-board"
      ref={chessBoardRef}
      onMouseDown={(e) => grabPiece(e)}
      onMouseMove={(e) => movePiece(e)}
      onMouseUp={(e) => setDownPiece(e)}
    >
      {boardState.map((piece, index) => {
        return (
          <BoardSquare
            color={(Math.floor(index / 8) + index) % 2}
            chessPiece={piece}
            pieceID={index}
            key={index}
          />
        );
      })}
    </div>
  );
}
export default Game;
