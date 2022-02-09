import BoardSquare from "./BoardSquare.js";
import React, { useState, useRef, useEffect } from "react";
import ChessGame from "../chessUtils/chessGame.js";

const game = new ChessGame();
function Game() {
  let chessBoardRef = useRef(null);
  let activePiece = null;
  let activePiecePosOldX = null;
  let activePiecePosOldY = null;
  let chessBoardSquareSize = 0.064 * window.innerWidth;

  // const [chessBoardSquareSize, setChessBoardSquareSize] = useState(
  //   0.064 * window.innerWidth
  // );
  const [boardState, setBoardState] = useState(game.boardState);
  const [allowedMoves, setAllowedMoves] = useState(new Array(64).fill(null));

  const resize = () => (chessBoardSquareSize = 0.064 * window.innerWidth);
  useEffect(() => {
    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  });

  function grabPiece(e) {
    let element = e.target;

    if (
      element.classList.contains("chess-piece") &&
      !activePiece &&
      //slice up the css to find the color of the piece and compare it to game.turn
      element.style.backgroundImage.slice(24, -6).substring(0, 5) === game.turn
    ) {
      activePiece = element;
      activePiece.style.position = "absolute";
      activePiecePosOldX = activePiece.style.left;
      activePiecePosOldY = activePiece.style.top;
      console.log(activePiecePosOldX);

      //elements should be grabbed at the center, this takes care of that offset
      activePiece.style.left = `${e.clientX - chessBoardSquareSize / 2}px`;
      activePiece.style.top = `${e.clientY - chessBoardSquareSize / 2}px`;
    }
  }

  function movePiece(e) {
    let chessBoard = chessBoardRef.current;

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
      if (!isInBounds(e.clientX, e.clientY)) return;
      activePiece.style.top = `${e.clientY - chessBoardSquareSize / 2}px`;
      activePiece.style.left = `${e.clientX - chessBoardSquareSize / 2}px`;
    }
  }

  function setDownPiece(e) {
    let chessBoard = chessBoardRef.current;

    if (activePiece) {
      let previousLocation = parseInt(activePiece.id);
      let nextLocation =
        Math.floor((e.clientX - chessBoard.offsetLeft) / chessBoardSquareSize) +
        Math.floor((e.clientY - chessBoard.offsetTop) / chessBoardSquareSize) *
          8;

      //conditions on which the piece should not move eg not allowed to move there
      if (previousLocation === nextLocation) {
        activePiece.style.left = activePiecePosOldX;
        activePiece.style.top = activePiecePosOldY;
        activePiece = null;
        return;
      }

      game.movePiece(previousLocation, nextLocation);

      setBoardState(game.boardState.map((piece) => piece));

      game.turn = game.turn === "white" ? "black" : "white";

      activePiece = null;
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
