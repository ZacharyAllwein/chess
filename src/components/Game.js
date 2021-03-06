import BoardSquare from "./BoardSquare.js";
import React, { useState, useRef, useEffect } from "react";
import ChessGame from "../chessUtils/chessGame.js";

const game = new ChessGame();
let chessBoardSquareSize = 0.064 * window.innerWidth;
let activePiecePosOldX = null;
let activePiecePosOldY = null;

function Game() {
  let chessBoardRef = useRef(null);

  const [activePiece, setActivePiece] = useState(null);
  const [boardState, setBoardState] = useState(game.boardState);
  const [allowedMoves, setAllowedMoves] = useState(new Array(64).fill(null));

  const resize = () => (chessBoardSquareSize = 0.064 * window.innerWidth);
  const isInBounds = (x, y, chessBoard) => {
    const maxX = chessBoard.offsetLeft + 8 * chessBoardSquareSize;
    const minX = chessBoard.offsetLeft;
    const maxY = chessBoard.offsetTop + 8 * chessBoardSquareSize;
    const minY = chessBoard.offsetTop;

    return x >= minX && x <= maxX && y >= minY && y <= maxY;
  };

  useEffect(() => {
    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  });
  useEffect(() => {
    if (activePiece) {
      game.moves = parseInt(activePiece.id);
      setAllowedMoves(game.allowedMoves);
    } else {
      setAllowedMoves(new Array(64).fill(null));
    }
  }, [activePiece]);

  function grabPiece(e) {
    let element = e.target;

    if (
      element.classList.contains("chess-piece") &&
      !activePiece &&
      //slice up the css to find the color of the piece and compare it to game.turn
      element.style.backgroundImage.slice(24, -6).substring(0, 5) === game.turn
    ) {
      element.style.position = "absolute";
      activePiecePosOldX = element.style.left;
      activePiecePosOldY = element.style.top;

      //elements should be grabbed at the center, this takes care of that offset
      element.style.left = `${e.clientX - chessBoardSquareSize / 2}px`;
      element.style.top = `${e.clientY - chessBoardSquareSize / 2}px`;
      setActivePiece(element);
    }
  }

  function movePiece(e) {
    let chessBoard = chessBoardRef.current;

    if (activePiece) {
      if (!isInBounds(e.clientX, e.clientY, chessBoard)) return;
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
      if (
        previousLocation === nextLocation ||
        allowedMoves[nextLocation] !== 1
      ) {
        activePiece.style.left = activePiecePosOldX;
        activePiece.style.top = activePiecePosOldY;
        setActivePiece(null);
        return;
      }

      game.movePiece(previousLocation, nextLocation);

      setBoardState(game.boardState.map((piece) => piece));

      game.turn = game.turn === "white" ? "black" : "white";

      setActivePiece(null);
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
            highlight={allowedMoves[index]}
          />
        );
      })}
    </div>
  );
}
export default Game;
