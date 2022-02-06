function BoardSquare({ color, chessPiece }) {
  return (
    // Main div that displays a square that changes color based on passed in color.
    <div
      className="chess-square"
      style={{ backgroundColor: color === 1 ? "#7B3F00" : "#FFFFED" }}
    >
      {chessPiece == null ? null : (
        <div
          className="chess-piece"
          style={{
            backgroundImage: `url(assets/chessPieces/${chessPiece}.png)`,
          }}
        ></div>
      )}
    </div>
  );
}

export default BoardSquare;
