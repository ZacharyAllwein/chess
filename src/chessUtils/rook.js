export default function pawnMoves(color, location, boardState) {

    let allowedMoves = new Array(64).fill(null)

    //white relative directions
    const directions = {
        "forward": {
            "modifier": -8,
            "constraint": (curLocation) => curLocation > 7
        },
        "backwards": {
            "modifier": 8,
            "constraint": (curLocation) => curLocation < 56
        },
        
    }}