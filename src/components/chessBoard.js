import BoardSquare from "./boardSquare.js";
import React, { useState, useRef, useEffect } from "react";

//location map that stores places of pieces
let initialLocationMap = new Array(64).fill(null);

//placing pawns
for (let i = 8; i < 16; i++) {
  initialLocationMap[i] = "blackPawn";
}

for (let i = 48; i < 56; i++) {
  initialLocationMap[i] = "whitePawn";
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

    initialLocationMap[i] = pieceColor + pieceType;
  }
});

//everything has to be responsive. .064 is the basic vw size unit used for scaling chessboard squares

// chess board component
function ChessBoard() {
  let activePiece = null;
  let chessBoardRef = useRef(null);

  //useStates
  const [chessBoardSquareSize, setChessBoardSquareSize] = useState(
    0.064 * window.innerWidth
  );
  const [locationMap, setLocationMap] = useState(initialLocationMap);

  //when window changes sizes, so does the defined chessboardsquare size so movement still works
  const resize = () => setChessBoardSquareSize(0.064 * window.innerWidth);
  useEffect(() => {
    window.addEventListener("resize", resize);

    return () => window.removeEventListener("resize", resize);
  });

  //function to grab onto piece and assign active piece element
  function grabPiece(e) {
    let element = e.target;
    if (element.classList.contains("chess-piece") && !activePiece) {
      element.style.position = "absolute";

      //elements should be grabbed at the center, this takes care of that offset
      element.style.left = `${e.clientX - chessBoardSquareSize / 2}px`;
      element.style.top = `${e.clientY - chessBoardSquareSize / 2}px`;

      activePiece = element;
    }
  }

  //once active piece has been assigned, the piece can be moved
  function movePiece(e) {
    if (activePiece) {
      activePiece.style.left = `${e.clientX - chessBoardSquareSize / 2}px`;
      activePiece.style.top = `${e.clientY - chessBoardSquareSize / 2}px`;
    }
  }

  //once the user is done moving the piece, it needs to be set down, and replace a piece that was there.
  function setDownPiece(e) {
    let chessBoard = chessBoardRef.current;

    if (activePiece) {
      activePiece.style.left = `${e.clientX - chessBoardSquareSize / 2}px`;
      activePiece.style.top = `${e.clientY - chessBoardSquareSize / 2}px`;

      //figure out where it currently is and what type of piece it is
      let pieceType = activePiece.style.backgroundImage.slice(24, -6);
      let currentLocation = parseInt(activePiece.id);

      //reset active piece so it can be used again and will stop moving
      activePiece = null;

      //uses pixel calculations to figure out index of where piece was dropped
      let nextLocation =
        Math.floor((e.clientX - chessBoard.offsetLeft) / chessBoardSquareSize) +
        Math.floor((e.clientY - chessBoard.offsetTop) / chessBoardSquareSize) *
          8;

      //catches if piece is moved back to its own location. still want snapping functionality, but not piece reset

      //creates a new location map that modifies rendered values
      let newLocationMap = [...locationMap];
      newLocationMap[nextLocation] = pieceType;
      if (nextLocation === currentLocation) {
        return;
      }
      newLocationMap[currentLocation] = null;
      setLocationMap(newLocationMap);
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
      {locationMap.map((piece, index) => {
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
export default ChessBoard;
