function BoardSquare({ color, chessPiece, pieceID, highlight }) {
  return (
    // Main div that displays a square that changes color based on passed in color.
    <div
      className="chess-square"
      style={{
        backgroundColor:
          highlight === 1
            ? color === 1
              ? "#013220"
              : "#90EE90"
            : color === 1
            ? "#7B3F00"
            : "#FFFFED",
      }}
    >
      {chessPiece && (
        <div
          className="chess-piece"
          style={{
            backgroundImage: `url(assets/chessPieces/${chessPiece}.png)`,
          }}
          id={pieceID}
        ></div>
      )}
    </div>
  );
}

export default BoardSquare;
