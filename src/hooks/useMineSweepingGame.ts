import { ref, computed } from 'vue';
import { isMacOS, isWindows } from '@/lib/utils';
import { MineSweepingSettings } from '@/hooks/useMineSweepingSetting';

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
enum MouseEventButton {
  Left = 1,
  Right,
  LeftRight
}

const distanceRow = [-1 /** 上 */, 0 /** 左 */, 1 /** 下 */, 0 /** 右 */, 1 /** 右下 */, -1 /** 左上 */, -1 /** 右上 */, 1 /** 左下 */];
const distanceCol = [0 /** 上 */, -1 /** 左 */, 0 /** 下 */, 1 /** 右 */, 1 /** 右下 */, -1 /** 左上 */, 1 /** 右上 */, -1 /** 左下 */];

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

function isNumberBlock(block: string) {
  return /[0-9]/.test(block);
}

function isEmptyOrMine(block: string) {
  return block === MineSweepingBlock.Empty || block === MineSweepingBlock.Mine;
}

const tapBlock = ref(new Set<number>());
document.addEventListener('mouseup', () => {
  tapBlock.value.clear();
});
export default function useMineSweepingGame(settings: Readonly<MineSweepingSettings>) {
  const status = ref<MineSweepingStatus>(MineSweepingStatus.init);
  const board = ref<string[][]>([]);
  const flags = ref(new Map<number, number>());

  const isGameOver = computed(() => {
    return status.value === MineSweepingStatus.lose || status.value === MineSweepingStatus.win;
  });

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

  function isNullFlag(flatKey: number): boolean;
  function isNullFlag(row: number, col: number): boolean;
  function isNullFlag(row: number, col?: number) {
    const flagKey = typeof col === 'undefined' ? row : getFlagKey(row, col as number);
    return !flags.value.has(flagKey) || flags.value.get(flagKey) === MineSweepingFlag.Null;
  }

  function updateGameStatus() {
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
        if (block === MineSweepingBlock.Block || isNumberBlock(block)) {
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
    if (!isNullFlag(row, col)) return;

    if (status.value === MineSweepingStatus.init) {
      shuffle(board.value, row, col, settings.mines);
    }

    status.value = MineSweepingStatus.playing;

    updateBoard(row, col);
    updateGameStatus();
  }

  function onMarkFlag(row: number, col: number) {
    const block = board.value[row][col];

    if (isEmptyOrMine(block)) {
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
    if (isGameOver.value) return;

    buttons = event.buttons;
    clickKey = getFlagKey(row, col)

    if (buttons === MouseEventButton.Left) {
      if (isMacOS && event.metaKey) buttons = MouseEventButton.LeftRight;
      if (isWindows && event.ctrlKey) buttons = MouseEventButton.LeftRight;
    }

    switch (buttons) {
      case MouseEventButton.Left:
        if (isNullFlag(row, col)) tapBlock.value.add(getFlagKey(row, col));
        break;
      case MouseEventButton.LeftRight:
        // highlight around block
        if (isNumberBlock(board.value[row][col])) {
          for (let i = 0; i < distanceRow.length; ++i) {
            const dr = row + distanceRow[i];
            const dc = col + distanceCol[i];
            const flagKey = getFlagKey(dr, dc);

            if (!isOutBounds(board.value, dr, dc) && isEmptyOrMine(board.value[dr][dc]) && isNullFlag(flagKey)) {
              tapBlock.value.add(flagKey);
            }
          }
        }
        break;
    }
  }
  function onMouseup(row: number, col: number) {
    if (isOutBounds(board.value, row, col) || isGameOver.value || getFlagKey(row, col) !== clickKey) return;

    switch (buttons) {
      case MouseEventButton.Left:
        onMineSweeping(row, col);
        break;
      case MouseEventButton.Right:
        onMarkFlag(row, col);
        break;
      case MouseEventButton.LeftRight:
        if (isNumberBlock(board.value[row][col])) {
          const unFlags = [];
          let flagMines = 0;
          for (let i = 0; i < distanceRow.length; ++i) {
            const dr = row + distanceRow[i];
            const dc = col + distanceCol[i];
            const flagKey = getFlagKey(dr, dc);

            if (!isOutBounds(board.value, dr, dc) && isEmptyOrMine(board.value[dr][dc])) {
              if (isNullFlag(flagKey)) unFlags.push([dr, dc]);

              if (flags.value.get(flagKey) === MineSweepingFlag.Mine) flagMines++;
            }
          }

          // 如果已标示旗帜的数目与数字相同，未开的方块就会自动打开
          if (parseInt(board.value[row][col]) === flagMines) {
            unFlags.forEach(([dr, dc]) => updateBoard(dr, dc));
            updateGameStatus();
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
    onMineSweeping,
    onRestart,
    onContextmenu,
    onMousedown,
    onMouseup
  };
}
