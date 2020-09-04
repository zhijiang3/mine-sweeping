import { ref } from 'vue';
import {
  MINE_SWEEPING_BLOCK as B,
  MINE_SWEEPING_EMPTY as E,
  MINE_SWEEPING_MINE as M,
  MINE_SWEEPING_DUG_MINE as X
} from '@/constant';

interface MineSweepingOptions {
  cols: number;
  rows: number;
  mines: number;
}

function isOutBounds(board: string[][], row: number, col: number) {
  return (
    row < 0 || row >= board.length
    || col < 0 || col >= board[0].length
  );
}

function swap<T>(arr: T[][], i: number, j: number, si: number, sj: number) {
  const temp = arr[i][j];
  arr[i][j] = arr[si][sj];
  arr[si][sj] = temp;
}

const distanceRow = [-1 /** 上 */, 0 /** 左 */, 1 /** 下 */, 0 /** 右 */, 1 /** 右下 */, -1 /** 左上 */, -1 /** 右上 */, 1 /** 左下 */];
const distanceCol = [0 /** 上 */, -1 /** 左 */, 0 /** 下 */, 1 /** 右 */, 1 /** 右下 */, -1 /** 左上 */, 1 /** 右上 */, -1 /** 左下 */];
function updateBoard(board: string[][], row: number, col: number) {
  const block = board[row][col];

  switch (block) {
    case M: // 挖到地雷，原地爆炸 XP
      board[row][col] = X;
      break;
    case E: // 挖到空方块
      // 检查周围是否有地雷
      let count = 0;
      for (let i = 0; i < distanceRow.length; ++i) {
        const dr = row + distanceRow[i];
        const dc = col + distanceCol[i];

        if (!isOutBounds(board, dr, dc) && board[dr][dc] === M) count++;
      }

      // 周围有雷，不递归排查了
      if (count > 0) {
        board[row][col] = `${count}`;
      } else {
        // 周围没有地雷，继续挖附近的空方块
        board[row][col] = B;
        for (let i = 0; i < distanceRow.length; ++i) {
          const dr = row + distanceRow[i];
          const dc = col + distanceCol[i];

          if (!isOutBounds(board, dr, dc) && board[dr][dc] === E) {
            updateBoard(board, dr, dc);
          }
        }
      }
      break;
  }
}

function shuffle(arr: string[][]) {
  const rows = arr.length, cols = arr[0].length;

  for (let row = rows - 1; row > 1; --row) {
    for (let col = cols - 1; col > 1; --col) {
      const random = Math.floor(Math.random() * (row * cols + col));
      const rRow = Math.floor(random / cols);
      const rCol = random % cols;

      swap(arr, row, col, rRow, rCol);
    }
  }
}

export default function useMineSweeping(options: MineSweepingOptions) {
  const initialized = ref(false);
  const board = ref<string[][]>([]);

  let mines = options.mines;
  for (let row = 0; row < options.rows; ++row) {
    board.value[row] = [];
    for (let col = 0; col < options.cols; ++col) {
      board.value[row][col] = mines-- > 0 ? M : E;
    }
  }

  function onMineSweeping(row: number, col: number) {
    if (isOutBounds(board.value, row, col)) return;

    if (!initialized.value) {
      initialized.value = true;
      shuffle(board.value);

      // 确保点击的位置是空的
      if (board.value[row][col] === M) {
        board.value.some((cols, rowIndex) => {
          return cols.some((_, colIndex) => {
            if (board.value[rowIndex][colIndex] === E) {
              swap(board.value, row, col, rowIndex, colIndex);
              return true;
            }

            return false;
          });
        });
      }
    }

    updateBoard(board.value, row, col);
  }

  return {
    board,
    onMineSweeping
  };
}
