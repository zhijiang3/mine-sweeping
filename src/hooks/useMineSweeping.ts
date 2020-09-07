import { ref, reactive, watchEffect, computed } from 'vue';
import {
  MINE_SWEEPING_BLOCK as B,
  MINE_SWEEPING_EMPTY as E,
  MINE_SWEEPING_MINE as M,
  MINE_SWEEPING_DUG_MINE as X
} from '@/constant';

interface MineSweepingSettings {
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

function shuffle(board: string[][], clickRow: number, clickCol: number, mines: number) {
  const rows = board.length, cols = board[0].length;

  while (mines) {
    const random = Math.floor(Math.random() * rows * cols);
    const randomRow = Math.floor(random / cols), randomCol = Math.max(0, random - 1) % cols;

    if (randomRow !== clickRow && randomCol !== clickCol && board[randomRow][randomCol] !== M) {
      board[randomRow][randomCol] = M;
      mines--;
    }
  }
}

function useMineSweepingSetting() {
  const settings = reactive<MineSweepingSettings>({
    cols: 6,
    rows: 6,
    mines: 4
  });

  function setSettings(options: Partial<MineSweepingSettings>) {
    if (options.mines) settings.mines = options.mines;
    if (options.cols) settings.cols = Math.max(6, Math.min(40, options.cols));
    if (options.rows) settings.rows = Math.max(6, Math.min(40, options.rows));
  }

  watchEffect(() => {
    const maxMines = (settings.rows * settings.cols) - (settings.rows + settings.cols - 1);

    if (settings.mines > maxMines) settings.mines = maxMines;
  });

  return {
    settings,
    setSettings
  };
}

function useMineSweepingGame(settings: Readonly<MineSweepingSettings>) {
  const status = ref<'init' | 'playing' | 'win' | 'lose'>('init');
  const board = ref<string[][]>([]);

  function onRestart() {
    status.value = 'init';
    board.value = new Array(settings.rows);
    for (let row = settings.rows; row > -1; --row) {
      board.value[row] = new Array(settings.cols).fill(E);
    }
  }

  function isGameOver() {
    return status.value === 'lose' || status.value === 'win';
  }

  function checkGameStatus() {
    const rows = board.value.length, cols = board.value[0].length;
    const countMap: { [prop: string]: number } = {};

    for (let row = 0; row < rows; ++row) {
      for (let col = 0; col < cols; ++col) {
        const block = board.value[row][col];

        countMap[block] || (countMap[block] = 0);
        countMap[block]++;
      }
    }

    if (countMap[X] > 0) {
      status.value = 'lose';
    } else if (countMap[E] === 0) {
      status.value = 'win';
    }
  }

  function onMineSweeping(row: number, col: number) {
    if (isOutBounds(board.value, row, col) || isGameOver()) return;

    if (status.value === 'init') {
      shuffle(board.value, row, col, settings.mines);
    }

    status.value = 'playing';

    updateBoard(board.value, row, col);
    checkGameStatus();
  }

  return {
    status,
    board,
    onRestart,
    onMineSweeping
  };
}

export default function useMineSweeping() {
  const { settings, setSettings } = useMineSweepingSetting();
  const { board, status, onRestart, onMineSweeping } = useMineSweepingGame(settings);

  return {
    board,
    status,
    setSettings,
    onRestart,
    onMineSweeping
  };
}
