import BoardSquare from "./boardSquare.js";
import React, { useState, useRef } from "react";

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

// chess board component
function ChessBoard() {
  let activePiece = null;
  let chessBoardRef = useRef(null);
  const [locationMap, setLocationMap] = useState(initialLocationMap);

  //function to grab onto piece and assign active piece element
  function grabPiece(e) {
    let element = e.target;
    if (element.classList.contains("chess-piece") && !activePiece) {
      element.style.position = "absolute";
      element.style.left = `${e.clientX - 60}px`;
      element.style.top = `${e.clientY - 60}px`;

      activePiece = element;
    }
  }

  //once active piece has been assigned, the piece can be moved
  function movePiece(e) {
    if (activePiece) {
      activePiece.style.left = `${e.clientX - 60}px`;
      activePiece.style.top = `${e.clientY - 60}px`;
    }
  }

  //once the user is done moving the piece, it needs to be set down, and replace a piece that was there.
  function setDownPiece(e) {
    let chessBoard = chessBoardRef.current;

    if (activePiece) {
      activePiece.style.left = `${e.clientX - 60}px`;
      activePiece.style.top = `${e.clientY - 60}px`;

      //figure out where it currently is and what type of piece it is
      let pieceType = activePiece.style.backgroundImage.slice(24, -6);
      let currentLocation = activePiece.id;

      //uses pixel calculations to figure out index of where piece was dropped
      let nextLocation =
        Math.floor((e.clientX - chessBoard.offsetLeft) / 120) +
        Math.floor((e.clientY - chessBoard.offsetTop) / 120) * 8;

      //creates a new location map that modifies rendered values
      let newLocationMap = [...locationMap];
      newLocationMap[nextLocation] = pieceType;
      newLocationMap[currentLocation] = null;
      setLocationMap(newLocationMap);

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
