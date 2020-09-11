import useMineSweepingGame, { MineSweepingBlock, MineSweepingStatus } from '@/hooks/useMineSweepingGame';
const E = MineSweepingBlock.Empty;
const M = MineSweepingBlock.Mine;
const B = MineSweepingBlock.Block;
const X = MineSweepingBlock.DugMine;

describe('扫雷核心逻辑测试', () => {
  it('点击未挖出的空方块时，应该递归清理相邻的空方块', () => {
    const { board, status, onMineSweeping } = useMineSweepingGame({
      cols: 4,
      rows: 5,
      mines: 3
    });

    status.value = MineSweepingStatus.playing;

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
    const { board, status, onMineSweeping } = useMineSweepingGame({
      cols: 5,
      rows: 4,
      mines: 1
    });

    status.value = MineSweepingStatus.playing;

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
