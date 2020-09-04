import useMineSweeping from '@/hooks/useMineSweeping';
import {
  MINE_SWEEPING_EMPTY as E,
  MINE_SWEEPING_MINE as M,
  MINE_SWEEPING_BLOCK as B,
  MINE_SWEEPING_DUG_MINE as X
} from '@/constant';

describe('扫雷核心逻辑测试', () => {
  it('第一次点击时，不应该点击到雷', () => {
    const size = 2;
    const { board, onMineSweeping } = useMineSweeping({
      rows: size,
      cols: size,
      mines: Math.pow(size, 2) - 1
    });

    onMineSweeping(0, 0);

    const nextBoard = new Array(size).fill(0).map(() => new Array(size).fill(M));
    nextBoard[0][0] = '3';
    expect(board.value).toEqual(nextBoard);
  });

  it('点击未挖出的空方块时，应该递归清理相邻的空方块', () => {
    const { board, onMineSweeping } = useMineSweeping({
      rows: 4,
      cols: 5,
      mines: 3
    });

    // 处理初始化
    onMineSweeping(0, 0);

    // 重新设置面板
    board.value = [
      [E, E, E, E, E],
      [E, E, M, E, E],
      [E, E, E, E, E],
      [E, E, E, E, E]
    ];

    onMineSweeping(3, 0);

    const N = '1';
    // eslint-disable-next-line
    expect(board.value).toEqual([
      [B, N, E, N, B],
      [B, N, M, N, B],
      [B, N, N, N, B],
      [B, B, B, B, B]
    ]);
  });

  it('当挖到地雷方块时，地雷应该爆炸', () => {
    const { board, onMineSweeping } = useMineSweeping({
      rows: 4,
      cols: 5,
      mines: 1
    });

    // 处理初始化
    onMineSweeping(0, 0);

    // 重新设置面板
    board.value = [
      [E, E, E, E, E],
      [E, E, M, E, E],
      [E, E, E, E, E],
      [E, E, E, E, E]
    ];

    onMineSweeping(1, 2);

    // eslint-disable-next-line
    expect(board.value).toEqual([
      [E, E, E, E, E],
      [E, E, X, E, E],
      [E, E, E, E, E],
      [E, E, E, E, E]
    ]);
  });
});
