import Avatar, {
  Cannon,
  Chariot,
  General,
  Guard,
  Knight,
  Minister,
  Pawn
} from './Avatar';

import tools from 'surgeonkit';
import Matrix from './Matrix';
import _ from 'lodash'


//    0 1 2 3 4 5 6 7 8
//  -------------------
// 0| R K M G B G M K R
// 1| . . . .>.<. . . .
// 2| . C . . . . . C .
// 3| P . P . P . P . P
// 4| -----------------
// 5| -----------------
// 6| p . p . p . p . p
// 7| . c . . . . . c .
// 8| . . . .>.<. . . .
// 9| r k m g b g m k r
//         \
//       (2, 9) (x, y)
export default class Board {
  // static constants
  static get BOARD_WIDTH() { return 9 }
  static get BOARD_HEIGHT() { return 10 }

  constructor({pieces} = {}) {
    this.matrix = new Matrix({ width: 9, height: 10 });

    // TODO: for each piece get value
    this.pieces = [
      new Chariot({ faction: 'red', position: [0, 9] }),
      new Chariot({ faction: 'red', position: [8, 9] }),
      new Knight({ faction: 'red', position: [1, 9] }),
      new Knight({ faction: 'red', position: [7, 9] }),
      new Minister({ faction: 'red', position: [2, 9] }),
      new Minister({ faction: 'red', position: [6, 9] }),
      new Guard({ faction: 'red', position: [3, 9] }),
      new Guard({ faction: 'red', position: [5, 9] }),
      new General({ faction: 'red', position: [4, 9] }),
      new Cannon({ faction: 'red', position: [1, 7] }),
      new Cannon({ faction: 'red', position: [7, 7] }),
      new Pawn({ faction: 'red', position: [0, 6] }),
      new Pawn({ faction: 'red', position: [2, 6] }),
      new Pawn({ faction: 'red', position: [4, 6] }),
      new Pawn({ faction: 'red', position: [6, 6] }),
      new Pawn({ faction: 'red', position: [8, 6] }),

      new Chariot({ faction: 'black', position: [0, 0] }),
      new Chariot({ faction: 'black', position: [8, 0] }),
      new Knight({ faction: 'black', position: [1, 0] }),
      new Knight({ faction: 'black', position: [7, 0] }),
      new Minister({ faction: 'black', position: [2, 0] }),
      new Minister({ faction: 'black', position: [6, 0] }),
      new Guard({ faction: 'black', position: [3, 0] }),
      new Guard({ faction: 'black', position: [5, 0] }),
      new General({ faction: 'black', position: [4, 0] }),
      new Cannon({ faction: 'black', position: [1, 2] }),
      new Cannon({ faction: 'black', position: [7, 2] }),
      new Pawn({ faction: 'black', position: [0, 3] }),
      new Pawn({ faction: 'black', position: [2, 3] }),
      new Pawn({ faction: 'black', position: [4, 3] }),
      new Pawn({ faction: 'black', position: [6, 3] }),
      new Pawn({ faction: 'black', position: [8, 3] }),
    ]

    this.pieces.map(p => this.update(p))
  }

  pieceAt(position = []) { // [x, y]

  }

  // R . . P . . p . . r
  // K . C . . . . c . k
  // M . . P . . p . . m
  // G . . . . . . . . g
  // B . . P . . p . . b
  // G . . . . . . . . g
  // M . . P . . p . . m
  // K . C . . . . c . k
  // R . . P . . p . . r
  toString() {
    // x or whichCol is exterior
    var grid = tools.expand(9).map(
      x=>tools.expand(10).map(() => '.')
    )

    this.pieces.forEach(
      ({ toSingleChar, position: [colX, rowY] }) => {
        grid[colX][rowY] = toSingleChar
      }
    )

    return ['', ...grid.map(x => x.join(' ')), ''].join('\n') // y joins \n
  }

  static isInside(position) {
    const { x, y } = position
    return x < Board.BOARD_WIDTH && y < Board.BOARD_HEIGHT &&
      x >= 0 && y >= 0
  }

  isEmpty(position) {
    const { x, y } = position
    return Board.isInside(position) && this.matrix[x][y] == undefined
  }

  // update the matrix to reflect the position of the piece's new position
  update(piece) {
    var pos = piece.position;
    this.matrix[pos[0]][pos[1]] = piece
    return true;
  }

  updatePiece(originalPiece, newPosition) {
    var newPositionPiece = this.getPiece(newPosition) // Return the killed piece or null.

    if(newPositionPiece !== null) // the newPositionPiece is killed
      _.remove(this.pieces, p => p === newPositionPiece)

    this.movePiece(originalPiece, newPosition)

    this.switchTurn()
    return newPositionPiece // return the piece that was killed or null
  }

  // return the piece to its original position inthe matrix
  backPiece(piece) {
    const { position: [origX, origY] } = piece
    this.matrix[origX][origY] = piece
    return true
  }

  movePiece(originalPiece, newPosition) {
    const [origX, origY] = originalPiece.position
    const [newX, newY] = newPosition

    this.matrix[origX][origY] = null
    this.matrix[newX][newY] = originalPiece
    originalPiece.position = newPosition
  }

  switchTurn() {  // @returns null
    this.player = this.player === 'red' ? 'black' : 'red'
  }

  getPiece(newPosition) {
    const [x, y] = newPosition
    return this.matrix[x][y]
  }
}
