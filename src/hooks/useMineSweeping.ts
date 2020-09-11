import { ref, reactive, watchEffect, Ref, computed } from 'vue';
import { isMacOS, isWindows } from '@/lib/utils';

export enum MineSweepingFlag {
  Null, // 未标记
  Mine, // 标记地雷
  Unknown // 标记不确定
}
export enum MineSweepingBlock {
  Empty = 'E', // 未挖出的空方块
  Mine = 'M', // 未挖出的地雷
  Block = 'B', // 已挖出的空方块
  DugMine = 'X' // 挖出的地雷
}
export enum MineSweepingStatus { init, playing, win, lose };
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
    cols: 8,
    rows: 8,
    mines: 10
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

const distanceRow = [-1 /** 上 */, 0 /** 左 */, 1 /** 下 */, 0 /** 右 */, 1 /** 右下 */, -1 /** 左上 */, -1 /** 右上 */, 1 /** 左下 */];
const distanceCol = [0 /** 上 */, -1 /** 左 */, 0 /** 下 */, 1 /** 右 */, 1 /** 右下 */, -1 /** 左上 */, 1 /** 右上 */, -1 /** 左下 */];
const tapBlock = ref(new Set<number>());
document.addEventListener('mouseup', () => {
  tapBlock.value.clear();
});
export function useMineSweepingGame(settings: Readonly<MineSweepingSettings>) {
  const status = ref<MineSweepingStatus>(MineSweepingStatus.init);
  const board = ref<string[][]>([]);
  const flags = ref(new Map<number, number>());

  function onRestart() {
    status.value = MineSweepingStatus.init;
    flags.value = new Map();
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

  function isNumber(block: string) {
    return /[0-9]/.test(block);
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
        if (block === MineSweepingBlock.Block || isNumber(block)) {
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

  function updateBoard(row: number, col: number) {
    const block = board.value[row][col];

    switch (block) {
      case MineSweepingBlock.Mine: // 挖到地雷，原地爆炸 XP
        board.value[row][col] = MineSweepingBlock.DugMine;
        break;
      case MineSweepingBlock.Empty: // 挖到空方块
        // 检查周围是否有地雷
        let count = 0;
        for (let i = 0; i < distanceRow.length; ++i) {
          const dr = row + distanceRow[i];
          const dc = col + distanceCol[i];

          if (!isOutBounds(board.value, dr, dc) && board.value[dr][dc] === MineSweepingBlock.Mine) count++;
        }

        // 周围有雷，不递归排查了
        if (count > 0) {
          board.value[row][col] = `${count}`;
        } else {
          // 周围没有地雷，继续挖附近的空方块
          board.value[row][col] = MineSweepingBlock.Block;
          for (let i = 0; i < distanceRow.length; ++i) {
            const dr = row + distanceRow[i];
            const dc = col + distanceCol[i];

            if (!isOutBounds(board.value, dr, dc) && board.value[dr][dc] === MineSweepingBlock.Empty) {
              updateBoard(dr, dc);
            }
          }
        }
        break;
    }
  }

  function onMineSweeping(row: number, col: number) {
    // 被标记的无法点击
    const flagKey = getFlagKey(row, col);
    if (flags.value.has(flagKey) && flags.value.get(flagKey) !== MineSweepingFlag.Null) return;

    if (status.value === MineSweepingStatus.init) {
      shuffle(board.value, row, col, settings.mines);
    }

    status.value = MineSweepingStatus.playing;

    updateBoard(row, col);
    checkGameStatus();
  }

  function onMarkFlag(row: number, col: number) {
    const block = board.value[row][col];

    if (block === MineSweepingBlock.Empty || block === MineSweepingBlock.Mine) {
      const key = getFlagKey(row, col);

      if (flags.value.has(key)) {
        const nextFlag = (flags.value.get(key) as number + 1) % 3;

        flags.value.set(key, nextFlag);
      } else {
        flags.value.set(key, MineSweepingFlag.Mine);
      }
    }
  }

  function onContextmenu(event: MouseEvent) {
    event.preventDefault();
  }

  let buttons = 0;
  let clickKey = -1;
  function onMousedown(event: MouseEvent, row: number, col: number) {
    if (isGameOver()) return;

    buttons = event.buttons;
    clickKey = getFlagKey(row, col)

    if (buttons === 1) {
      if (isMacOS && event.metaKey) buttons = 3;
      if (isWindows && event.ctrlKey) buttons = 3;
    }

    switch (buttons) {
      case 1:
        if (!flags.value.has(clickKey) || flags.value.get(clickKey) === MineSweepingFlag.Null)
          tapBlock.value.add(getFlagKey(row, col));
        break;
      case 3:
        // highlight around block
        if (isNumber(board.value[row][col])) {
          for (let i = 0; i < distanceRow.length; ++i) {
            const dr = row + distanceRow[i];
            const dc = col + distanceCol[i];
            const flagKey = getFlagKey(dr, dc);

            if (!isOutBounds(board.value, dr, dc)
              && (board.value[dr][dc] === MineSweepingBlock.Empty
                || board.value[dr][dc] === MineSweepingBlock.Mine)
              && (!flags.value.has(flagKey)
                || flags.value.get(flagKey) === MineSweepingFlag.Null)) {

              tapBlock.value.add(flagKey);
            }
          }
        }
        break;
    }
  }
  function onMouseup(event: MouseEvent, row: number, col: number) {
    if (isOutBounds(board.value, row, col) || isGameOver() || getFlagKey(row, col) !== clickKey) return;

    switch (buttons) {
      case 1: // 左键
        onMineSweeping(row, col);
        break;
      case 2: // 右键
        onMarkFlag(row, col);
        break;
      case 3: // 左右键一起按下
        if (isNumber(board.value[row][col])) {
          const unFlags = [];
          let flagMines = 0;
          for (let i = 0; i < distanceRow.length; ++i) {
            const dr = row + distanceRow[i];
            const dc = col + distanceCol[i];
            const flagKey = getFlagKey(dr, dc);

            if (!isOutBounds(board.value, dr, dc)
              && (board.value[dr][dc] === MineSweepingBlock.Empty
                || board.value[dr][dc] === MineSweepingBlock.Mine)) {
              if (!flags.value.has(flagKey) || flags.value.get(flagKey) === MineSweepingFlag.Null)
                unFlags.push([dr, dc]);

              if (flags.value.get(flagKey) === MineSweepingFlag.Mine) flagMines++;
            }
          }

          // 如果已标示旗帜的数目与数字相同，未开的方块就会自动打开
          if (parseInt(board.value[row][col]) === flagMines) {
            unFlags.forEach(([dr, dc]) => updateBoard(dr, dc));
            checkGameStatus();
          }
        }
        break;
    }
  }

  onRestart();

  return {
    status,
    board,
    flags,
    tapBlock,
    getFlagKey,
    onRestart,
    onContextmenu,
    onMousedown,
    onMouseup
  };
}

export function useMineSweepingTime(status: Ref<MineSweepingStatus>) {
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
    startTime,
    stopwatchTiming
  };
}

export function useMineSweepingView(status: Ref<MineSweepingStatus>, flags: Ref<Map<number, number>>) {
  const isLoser = computed(() => status.value === MineSweepingStatus.lose);
  const isWinner = computed(() => status.value === MineSweepingStatus.win);
  const isGameOver = computed(() => isLoser.value || isWinner.value);

  function isDugMine(block: string) {
    return block === MineSweepingBlock.DugMine;
  }

  function isMine(block: string) {
    return block === MineSweepingBlock.Mine || isDugMine(block);
  }

  function isBlock(block: string) {
    return block === MineSweepingBlock.Empty || isMine(block);
  }

  function isMineFlag(key: number) {
    return flags.value.get(key) === MineSweepingFlag.Mine;
  }

  function isNullFlag(key: number) {
    if (!flags.value.has(key)) return true;

    return flags.value.get(key) === MineSweepingFlag.Null;
  }

  function isUnknownFlag(key: number) {
    return flags.value.get(key) === MineSweepingFlag.Unknown;
  }

  function getBlockText(block: string) {
    switch (block) {
      case MineSweepingBlock.Mine:
      case MineSweepingBlock.DugMine:
      case MineSweepingBlock.Empty:
      case MineSweepingBlock.Block:
        return '';
      default:
        return block;
    }
  }

  const mineFlagSize = computed(() => {
    let size = 0;
    for (const key of flags.value.keys()) {
      if (flags.value.get(key) === MineSweepingFlag.Mine) size++;
    }
    return size;
  });

  return {
    getBlockText,
    isGameOver,
    isLoser,
    isWinner,
    isBlock,
    isMine,
    isDugMine,
    isMineFlag,
    isNullFlag,
    isUnknownFlag,
    mineFlagSize
  };
}
