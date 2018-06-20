$(function() {
  let currentPlayer = 'blue';
  let board = [];

  const COLUMNS = 7;
  const ROWS = 6;

  function createJsBoard() {
    for (let i = 0; i < ROWS; i++) {
      board.push(Array.from({ length: COLUMNS }));
    }
  }

  $('.drop-button').on('click', handleClick);

  function handleClick(event) {
    const col = Number(event.target.id);

    // get the first available spot in the column. if none, ignore click
    const row = findEmptySpot(col);
    if (row === null) {
      return;
    }

    board[row][col] = currentPlayer;

    dropDisc(row, col);

    if (board.every(row => row.every(space => space))) {
      return endGame(
        `It's a tie! <button><a href="index.html">New game?</a></button>`
      );
    }

    if (checkWin()) {
      return endGame(
        `${currentPlayer} player won! <button><a href="index.html">New game?</a></button> `
      );
    }

    currentPlayer = currentPlayer === 'blue' ? 'red' : 'blue';
  }

  // given the column, return top empty row. if filled, return null
  function findEmptySpot(col) {
    for (let row = ROWS - 1; row >= 0; row--) {
      if (!board[row][col]) {
        return row;
      }
    }
    return null;
  }

  // update DOM to place disc into board
  function dropDisc(row, col) {
    const disc = $(`<div class="disc ${currentPlayer}">`);
    $(`#${row}-${col}`).append(disc);

    const startOffset = -48 * (row + 2);
    disc.css({ top: startOffset + 'px' });
    disc.animate(
      {
        top: '5px'
      },
      row * 100 + 300
    );
  }

  function endGame(msg) {
    $('.column-top').off('click');
    window.setTimeout(() => $('#board').fadeOut(), 1000);
    window.setTimeout(() => $('#boardgame').html(msg), 1000);
  }

  function checkWin() {
    function verifyWin(spaces) {
      // Check four spaces to see if they're the same color of currentPlayer

      // spaces: array of four (row,col spaces)
      // returns true if all are legal coordinates & all match currentPlayer
      return spaces.every(
        ([row, col]) =>
          row >= 0 &&
          row < ROWS &&
          col >= 0 &&
          col < COLUMNS &&
          board[row][col] === currentPlayer
      );
    }

    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLUMNS; col++) {
        // get list of of 4 spaces (starting here) for each of the different ways to win
        const horizontal = [
          [row, col],
          [row, col + 1],
          [row, col + 2],
          [row, col + 3]
        ];
        const vertical = [
          [row, col],
          [row + 1, col],
          [row + 2, col],
          [row + 3, col]
        ];
        const diagDR = [
          [row, col],
          [row + 1, col + 1],
          [row + 2, col + 2],
          [row + 3, col + 3]
        ];
        const diagDL = [
          [row, col],
          [row + 1, col - 1],
          [row + 2, col - 2],
          [row + 3, col - 3]
        ];

        if (
          verifyWin(horizontal) ||
          verifyWin(vertical) ||
          verifyWin(diagDR) ||
          verifyWin(diagDL)
        ) {
          return true;
        }
      }
    }
  }
  createJsBoard();
});
