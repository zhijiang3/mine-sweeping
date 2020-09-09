import { ref, reactive, watchEffect, Ref, computed } from 'vue';

export enum MineSweepingBlock {
  Empty = 'E', // 未挖出的空方块
  Mine = 'M', // 未挖出的地雷
  Block = 'B', // 已挖出的空方块
  DugMine = 'X' // 挖出的地雷
}
export enum MineSweepingStatus { init, playing, win, lose };
type MineSweepingStatusRef = Ref<MineSweepingStatus>;
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
    case MineSweepingBlock.Mine: // 挖到地雷，原地爆炸 XP
      board[row][col] = MineSweepingBlock.DugMine;
      break;
    case MineSweepingBlock.Empty: // 挖到空方块
      // 检查周围是否有地雷
      let count = 0;
      for (let i = 0; i < distanceRow.length; ++i) {
        const dr = row + distanceRow[i];
        const dc = col + distanceCol[i];

        if (!isOutBounds(board, dr, dc) && board[dr][dc] === MineSweepingBlock.Mine) count++;
      }

      // 周围有雷，不递归排查了
      if (count > 0) {
        board[row][col] = `${count}`;
      } else {
        // 周围没有地雷，继续挖附近的空方块
        board[row][col] = MineSweepingBlock.Block;
        for (let i = 0; i < distanceRow.length; ++i) {
          const dr = row + distanceRow[i];
          const dc = col + distanceCol[i];

          if (!isOutBounds(board, dr, dc) && board[dr][dc] === MineSweepingBlock.Empty) {
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

    if (randomRow !== clickRow && randomCol !== clickCol && board[randomRow][randomCol] !== MineSweepingBlock.Mine) {
      board[randomRow][randomCol] = MineSweepingBlock.Mine;
      mines--;
    }
  }
}

export function useMineSweepingSetting() {
  const settings = reactive<MineSweepingSettings>({
    cols: 6,
    rows: 7,
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

export function useMineSweepingGame(settings: Readonly<MineSweepingSettings>) {
  const status = ref<MineSweepingStatus>(MineSweepingStatus.init);
  const board = ref<string[][]>([]);
  const flags = ref(new Set<number>());

  function onRestart() {
    status.value = MineSweepingStatus.init;
    flags.value = new Set();
    board.value = new Array(settings.rows);
    for (let row = settings.rows - 1; row > -1; --row) {
      board.value[row] = new Array(settings.cols).fill(MineSweepingBlock.Empty);
    }
  }

  function getFlagKey(row: number, col: number) {
    return settings.cols * row + col;
  }

  function isGameOver() {
    return status.value === MineSweepingStatus.lose || status.value === MineSweepingStatus.win;
  }

  function checkGameStatus() {
    const rows = board.value.length, cols = board.value[0].length;
    const countMap: { [prop: string]: number } = {
      [MineSweepingBlock.DugMine]: 0,
      [MineSweepingBlock.Empty]: 0,
      [MineSweepingBlock.Block]: 0,
      [MineSweepingBlock.Mine]: 0
    };

    for (let row = 0; row < rows; ++row) {
      for (let col = 0; col < cols; ++col) {
        const block = board.value[row][col];

        // 清理被标记了的已挖出的空方块
        if (block === MineSweepingBlock.Block || /[0-9]/.test(block)) {
          const key = getFlagKey(row, col);

          if (flags.value.has(key)) flags.value.delete(key);
        }

        countMap[block] || (countMap[block] = 0);
        countMap[block]++;
      }
    }

    if (countMap[MineSweepingBlock.DugMine] > 0) {
      status.value = MineSweepingStatus.lose;
    } else if (countMap[MineSweepingBlock.Empty] === 0) {
      status.value = MineSweepingStatus.win;
    }
  }

  function onMineSweeping(row: number, col: number) {
    if (isOutBounds(board.value, row, col) || isGameOver()) return;

    if (status.value === MineSweepingStatus.init) {
      shuffle(board.value, row, col, settings.mines);
    }

    status.value = MineSweepingStatus.playing;

    updateBoard(board.value, row, col);
    checkGameStatus();
  }

  function onMarkFlag(event: MouseEvent, row: number, col: number) {
    if (isOutBounds(board.value, row, col) || isGameOver()) return;

    const block = board.value[row][col];

    if (block === MineSweepingBlock.Empty || block === MineSweepingBlock.Mine) {
      event.preventDefault();

      const key = getFlagKey(row, col);

      if (flags.value.has(key)) {
        flags.value.delete(key);
      } else {
        flags.value.add(key);
      }
    }
  }

  const startTime = ref(0);
  const stopwatchTiming = ref(0);
  let stopwatchTimer: number;
  function runStopwatchTiming() {
    stopwatchTiming.value = Date.now() - startTime.value;

    stopwatchTimer = setTimeout(runStopwatchTiming, 1000);
  }
  function clearStopwatchTiming() {
    clearTimeout(stopwatchTimer);
  }
  watchEffect(() => {
    switch (status.value) {
      case MineSweepingStatus.init:
        stopwatchTiming.value = 0;
        clearStopwatchTiming();
        break;
      case MineSweepingStatus.playing:
        startTime.value = Date.now();
        runStopwatchTiming();
        break;
      case MineSweepingStatus.lose:
      case MineSweepingStatus.win:
        clearStopwatchTiming();
        break;
    }
  });

  return {
    status,
    board,
    flags,
    stopwatchTiming,
    getFlagKey,
    onRestart,
    onMarkFlag,
    onMineSweeping
  };
}

export function useMineSweepingView(status: MineSweepingStatusRef) {
  const isLoser = computed(() => status.value === MineSweepingStatus.lose);
  const isWinner = computed(() => status.value === MineSweepingStatus.win);
  const isGameOver = computed(() => isLoser.value || isWinner.value);

  function isBlock(block: string) {
    if (isGameOver.value && block === MineSweepingBlock.Mine) return false;

    return block === MineSweepingBlock.Empty || block === MineSweepingBlock.Mine;
  }

  function isMine(block: string) {
    return block === MineSweepingBlock.Mine || block === MineSweepingBlock.DugMine;
  }

  function getBlockText(block: string) {
    if (isGameOver.value && block === MineSweepingBlock.Mine) return MineSweepingBlock.Mine;

    if (block === MineSweepingBlock.Mine || block === MineSweepingBlock.Empty || block === MineSweepingBlock.Block) return '';

    return block;
  }

  return {
    getBlockText,
    isGameOver,
    isLoser,
    isWinner,
    isBlock,
    isMine
  };
}
