import { computed, Ref } from 'vue';
import { MineSweepingFlag, MineSweepingStatus, MineSweepingBlock } from '@/hooks/useMineSweepingGame';

export default function useMineSweepingView(status: Ref<MineSweepingStatus>, flags: Ref<Map<number, number>>) {
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
