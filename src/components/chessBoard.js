import BoardSquare from "./boardSquare.js";
import React, { useState, useRef } from "react";
//values to place things
let chessBoard = [];
for (let i = 0; i < 64; i++) {
  chessBoard.push(i);
}

//location map that stores places of pieces
let initialLocationMap = {};

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

//assign null to all empty spaces
for (let i = 16; i < 48; i++) {
  initialLocationMap[i] = null;
}

// chess board component
function ChessBoard() {
  let activePiece = null;
  let chessBoardRef = useRef(null);
  const [locationMap, setLocationMap] = useState(initialLocationMap);

  function grabPiece(e) {
    let element = e.target;
    if (element.classList.contains("chess-piece") && !activePiece) {
      element.style.position = "absolute";
      element.style.left = `${e.clientX - 60}px`;
      element.style.top = `${e.clientY - 60}px`;

      activePiece = element;
    }
  }

  function movePiece(e) {
    if (activePiece) {
      activePiece.style.left = `${e.clientX - 60}px`;
      activePiece.style.top = `${e.clientY - 60}px`;
    }
  }

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
      let newLocationMap = { ...locationMap };
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
      {chessBoard.map((num) => {
        return (
          <BoardSquare
            color={(Math.floor(num / 8) + num) % 2}
            chessPiece={locationMap[num]}
            pieceID={num}
            key={num}
          />
        );
      })}
    </div>
  );
}
export default ChessBoard;
